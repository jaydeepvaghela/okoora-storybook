import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, interval, Observable, Subject, Subscription, takeUntil, takeWhile, of } from 'rxjs';
import { __values } from 'tslib';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogUploadFileComponent } from '../confirm-dialog-upload-file/confirm-dialog-upload-file.component';
import { TranslateService } from '@ngx-translate/core';
import { BenificiaryModel } from '../../models/BenificiaryModel';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { BeneficiaryDocTypeName, BeneficiaryDocType } from '../../enums/paymentReason.enum';
import { paymentReason } from '../contacts-data/payments-reason.data';
import { countryData } from '../../../sign-up/fields/country-data';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-new-benificiary-step5',
  templateUrl: './new-benificiary-step5.component.html',
  styleUrls: ['./new-benificiary-step5.component.scss'],
  imports: [NgxDropzoneModule, CommonModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, NgbTooltipModule]
})
export class NewBenificiaryStep5Component implements OnInit, OnDestroy, OnChanges {
  @Input('stepIndex') stepIndex!: number;
  @Input('iseditBenificiary') iseditBenificiary?: any;
  @Input('editBenificiaryObj') editBenificiaryObj?: any;
  @Input('paymentReasons') paymentReasons?: any;
  @Input('countryList') parentCountryList: any;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('benificiaryForm') benificiaryForm?: any;
  @Input('newBenificiaryBankDetails') newBenificiaryBankDetails?: any;
  @Input('newBenificiaryStep2') newBenificiaryStep2?: any;
  @Input('transactions') transactions?: any;
  @Input('uploadFile') uploadFile!: FormGroup;
  @Input('uploadFileFormStep5Values') uploadFileFormStep5Values: any;
  @Input('transcationFormStep3Values') transcationFormStep3Values: any;

  @Output() stepChanged = new EventEmitter<void>();
  @Output() movePreviousStep = new EventEmitter<void>();
  @Output() uploadFileFormValues = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('beneficiaryStateResidenceInput') beneficiaryStateResidenceInput!: ElementRef<HTMLInputElement>;

  unSubScribe$ = new Subject<void>();
  benCountrySearchControl: FormControl = new FormControl();
  benificiaryObjectFromInvoice$!: Observable<BenificiaryModel[]>;
  benificiaryBlankObject$!: Observable<BenificiaryModel[]>;
  BeneficiaryDocTypeName: any;
  BeneficiaryDocType: any;
  loading!: boolean;
  errMsg: any;
  fileUploadErrors: string[] = [];
  countryList: any;
  globalCountryData: any;
  beneficiaryObjectForFile: any;
  beneficiaryObjectForFilelength: any;
  maxSize!: boolean;
  fileArray: File[] = [];
  uploadfileWithType: any[] = [];
  uploadedfile: any[] = [];
  cancelUpload: boolean[] = [];
  isDisplayPaymentReasonIsOther!: boolean;
  isDisplayTaxCountryAndDeductionFileId!: boolean
  uploadProgressArray: number[] = [];
  showLoader = false;
  fileIsRequired: any;
  formPaymentReason: any;
  editPaymentReason: any;
  isUploadBtnDisplay = false;
  gradualProgressTimer!: Subscription;

  constructor(private contactsService: ContactsService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder, public dialog: MatDialog,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.allSubscriptions();
    this.getPaymentReason();
    this.getCountries();
    this.benTaxCountryFilter();
    this.displayPaymentReasonFields();
    this.BeneficiaryDocTypeName = BeneficiaryDocTypeName;
    this.BeneficiaryDocType = BeneficiaryDocType;
  }

  allSubscriptions() {
    this.contactsService.currentObjectForFile.subscribe((data) => {
      this.beneficiaryObjectForFile = data;
      this.beneficiaryObjectForFilelength = this.beneficiaryObjectForFile?.type;
      this.formPaymentReason = this.transcationFormStep3Values?.paymentReason;
      if (this.iseditBenificiary) {
        this.beneficiaryObjectForFilelength = [];
      }
    });
    this.contactsService.getBeneficiaryDataForEdit.subscribe((data) => {
      if (Object.keys(data).length != 0) {
        localStorage.removeItem('newBeneficiaryId');
      }
    });
  }

  getPaymentReason() {
    const oldPaymentReason = localStorage.getItem('editPaymentReason');
    const changedPaymentReason = localStorage.getItem('changedPaymentReason');

    of(paymentReason)
      .pipe(takeUntil(this.unSubScribe$))
      .subscribe(paymentReasonsRes => {
        this.paymentReasons = paymentReasonsRes;

        const paymentReasonsArray = Object.values(this.paymentReasons).flat();
        const selectedPaymentObj = paymentReasonsArray.find(
          (paymentObj: any) => paymentObj.paymentReason === this.transcationFormStep3Values?.paymentReason
        );

        localStorage.setItem('selectedPayment', JSON.stringify(selectedPaymentObj));
        this.displayPaymentReasonFields();

        if (oldPaymentReason === changedPaymentReason) {
          this.handleEditBeneficiary(selectedPaymentObj);
        } else {
          this.handleNewBeneficiary(selectedPaymentObj);
        }
      });
  }

  private handleEditBeneficiary(selectedPaymentObj: any) {
    this.fileArray = [];
    this.beneficiaryObjectForFilelength = [];

    if (this.uploadFile.get('file')?.value?.length) {
      this.handleNewBeneficiary(selectedPaymentObj);
    } else {
      if (this.editBenificiaryObj?.beneficiaryFiles?.length) {
        const originalDocumentTypes = selectedPaymentObj.documentTypes;
        const editDocTypeSet = new Set(
          this.editBenificiaryObj.beneficiaryFiles.map((file: any) => file.docType)
        );
        const { docTypeInEditRes, docTypeNotInEditRes } = this.partitionDocumentTypes(
          originalDocumentTypes,
          editDocTypeSet
        );
        this.processEditedFiles(docTypeInEditRes);
      }
      else {
        this.handleNewBeneficiary(selectedPaymentObj);
      }
    }
  }

  private handleNewBeneficiary(selectedPaymentObj: any) {
    const originalDocumentTypes = selectedPaymentObj.documentTypes;
    this.beneficiaryObjectForFilelength = [];

    if (this.uploadFile.get('file')?.value?.length) {
      this.processAdditionalFiles(originalDocumentTypes);
    } else {
      this.beneficiaryObjectForFilelength = originalDocumentTypes;
    }
  }

  private partitionDocumentTypes(documentTypes: any[], editDocTypeSet: Set<any>) {
    const docTypeInEditRes: any[] = [];
    const docTypeNotInEditRes: any[] = [];

    documentTypes.forEach(docTypeId => {
      if (editDocTypeSet.has(docTypeId)) {
        docTypeInEditRes.push(docTypeId);
      } else {
        docTypeNotInEditRes.push(docTypeId);
      }
    });

    return { docTypeInEditRes, docTypeNotInEditRes };
  }

  private processEditedFiles(docTypeInEditRes: any[]) {
    const editDocTypeSet = Array.from(new Map(this.editBenificiaryObj.beneficiaryFiles.map((doc:any) => [doc.docType, doc])).values())
    editDocTypeSet.forEach((file: any) => {
      docTypeInEditRes.forEach((docId: any, index: number) => {
        if (file.docType === docId) {
          this.uploadProgressArray[index] = 100;
          const fileObj = this.createFileObject(file.fileId, file.docType);
          this.fileArray.push(fileObj);
          this.uploadedfile.push({ type: file.docType });
        }
      });
    });
  }

  private processAdditionalFiles(docTypeNotInEditRes: any[]) {
    const files = this.uploadFile.get('file')?.value || [];

    // Helper function to handle file upload progress and errors
    const handleFileUpload = (fileObj: any, index: number) => {
      const progressIndex = this.uploadProgressArray.length;
      const isFileSizeExceeds = this.handleUploadFileSizing(fileObj);

      // Set upload progress and handle errors if file size exceeds
      this.uploadProgressArray[progressIndex] = isFileSizeExceeds ? 80 : 100;
      if (isFileSizeExceeds) {
        this.fileUploadErrors[progressIndex] = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
      }

      const fileObj2 = this.createFileObjectWithSize(fileObj.fileName, fileObj.docType, fileObj.fileSize, fileObj.type);
      this.fileArray.push(fileObj2);
      this.uploadedfile.push({ type: fileObj.docType });
    };

    if (docTypeNotInEditRes?.length === files.length) {
      // If docTypeNotInEditRes and files have the same length
      files.forEach((addFileObj: any, index: number) => handleFileUpload(addFileObj, index));
    } else if (docTypeNotInEditRes?.length > 0) {
      // If there are document types in docTypeNotInEditRes
      let filteredArrry: any = [];
      filteredArrry = this.editBenificiaryObj?.beneficiaryFiles?.filter((benef: any) => {
        return docTypeNotInEditRes.some(docType => docType === benef.docType);
      });
      docTypeNotInEditRes.forEach((originalDocType: number, index: number) => {
        files.forEach((addFile: any) => {
          if (addFile.docType === originalDocType) {
            handleFileUpload(addFile, index);
            this.cd.detectChanges(); // Trigger change detection
          } else {
            if (filteredArrry && filteredArrry?.length > 0) {
              const oldPaymentReason = localStorage.getItem('editPaymentReason');
              const changedPaymentReason = localStorage.getItem('changedPaymentReason');
              filteredArrry.forEach((Editfile: any) => {
                if (Editfile.docType == originalDocType) {
                  if (addFile.docType !== Editfile.docType) {
                    if (oldPaymentReason !== changedPaymentReason) {
                      if (!this.beneficiaryObjectForFilelength.includes(originalDocType)) {
                        this.beneficiaryObjectForFilelength.push(originalDocType);
                      }
                    } else {
                      this.uploadProgressArray.push(100);
                      this.fileArray.push(this.createFileObject(Editfile.fileId, Editfile.docType));
                      this.uploadedfile.push({ type: Editfile.docType });
                    }
                  }
                }
              });
            } else {
              this.beneficiaryObjectForFilelength.push(originalDocType);
            }
          }
        });
      });
    } else {
      console.warn("docTypeNotInEditRes is empty or invalid.");
    }
  }

  private createFileObject(fileName: string, docType: string): File {
    return new File(
      [new Blob([])],
      fileName,
      {
        type: docType,
        lastModified: Date.now()
      }
    );
  }

  private createFileObjectWithSize(fileName: string, docType: string, size: number, type: any): File {
    const blob = new Blob([new ArrayBuffer(size)]);
    return new File(
      [blob],
      fileName,
      {
        type: type,
        lastModified: Date.now(),
      }
    );
  }

  prevStep() {
    this.movePreviousStep.emit();
  }

  nextStep() {
    this.loading = true;
    const saveBeneficiaryRes = this.beneficiaryObjectForFile?.['saveBeneficiaryRes'];
    saveBeneficiaryRes['beneficiaryStateResidenceRecipient'] = this.uploadFile?.value?.beneficiaryStateResidenceRecipient ? this.uploadFile?.value?.beneficiaryStateResidenceRecipient : '';
    saveBeneficiaryRes['deductionNum'] = this.uploadFile?.value?.deductionNum ? this.uploadFile?.value?.deductionNum : '';
   // saveBeneficiaryRes['reasonDesc'] = this.uploadFile?.value?.reasonDesc ? this.uploadFile?.value?.reasonDesc : '';

    const selectedPayment = localStorage.getItem('selectedPayment');
    const originalDocType = selectedPayment ? JSON.parse(selectedPayment).documentTypes : null;
    if (this.fileArray.length !== originalDocType?.length || this.cancelUpload.some(value => value === true) || this.fileUploadErrors.some(error => error !== '')) {
      this.fileIsRequired = 'Please upload a valid document.';
      this.uploadFile.markAllAsTouched();
      return
    }
    if (this.isDisplayTaxCountryAndDeductionFileId) {
      // this.uploadFile.get('reasonDesc')?.clearValidators();
      // this.uploadFile.get('reasonDesc')?.updateValueAndValidity();
      if (!this.uploadFile?.value?.beneficiaryStateResidenceRecipient || !this.uploadFile?.value?.deductionNum) {
        this.uploadFile.markAllAsTouched();
        return
      }
    }
    if (this.isDisplayPaymentReasonIsOther) {
      this.uploadFile.get('beneficiaryStateResidenceRecipient')?.clearValidators();
      this.uploadFile.get('beneficiaryStateResidenceRecipient')?.updateValueAndValidity();
      this.uploadFile.get('deductionNum')?.clearValidators();
      this.uploadFile.get('deductionNum')?.updateValueAndValidity();
      // if (!this.uploadFile.controls['reasonDesc']?.value) {
      //   this.uploadFile.markAllAsTouched();
      //   return
      // }
    }
    this.fileIsRequired = '';
    // update beneficiary
    saveBeneficiaryRes['beneficiaryCity'] = this.newBenificiaryBankDetails.value.beneficiaryCity;
    saveBeneficiaryRes['beneficiaryState'] = this.newBenificiaryBankDetails.value.beneficiaryState;
    this.uploadFile.patchValue(this.uploadFile.value);
    this.uploadFileFormValues.emit(this.uploadFile.value);
    let newPaymentReasonArray: any = [];
    newPaymentReasonArray = Object.values(this.paymentReasons).reduce((acc: any, curr: any) => acc.concat(curr), []);
    const selectedPaymentObj = newPaymentReasonArray.filter((paymentObj: any) => paymentObj.paymentReason === this.transactions.value.paymentReason)[0];
    const originalDocumentTypes = selectedPaymentObj.documentTypes;
    delete saveBeneficiaryRes['id'];
    if (!this.isDisplayTaxCountryAndDeductionFileId && !this.isDisplayPaymentReasonIsOther) {
      this.uploadFile.get('beneficiaryStateResidenceRecipient')?.clearValidators();
      this.uploadFile.get('beneficiaryStateResidenceRecipient')?.updateValueAndValidity();
      this.uploadFile.get('deductionNum')?.clearValidators();
      this.uploadFile.get('deductionNum')?.updateValueAndValidity();
      // this.uploadFile.get('reasonDesc')?.clearValidators();
      // this.uploadFile.get('reasonDesc')?.updateValueAndValidity();
    }
    if (this.uploadFile.invalid) {
      this.uploadFile.markAllAsTouched()
    } else {
      this.contactsService.setBeneficiaryFileObject({
        "id": "",
        "saveBeneficiaryRes": saveBeneficiaryRes,
        "type": originalDocumentTypes,
        "fileArray": this.fileArray
      });
      this.stepChanged.emit();
    }
  }

  upload() {
    this.isUploadBtnDisplay = false;
  }

  skipUpoadFile() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: "skip-Upload-File",
      data: {
        uploadFileSaveAndExist: true
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result == 'skipUpload') {
          this.stepChanged.emit();
          dialogRef.close();
        } else {
          this.dialog.closeAll();
        }
      } else {
        console.log('Cancelled!');
      }
    });
  }

  displayPaymentReasonFields() {
    const selectedPaymentReasonStep4 = JSON.parse(localStorage.getItem('selectedPayment')!)
    // if (selectedPaymentReasonStep4?.['paymentReason'] == 999) {
    //   this.isDisplayPaymentReasonIsOther = true
    // } else {
    //   this.isDisplayPaymentReasonIsOther = false;
    //   // this.uploadFile.get('reasonDesc')?.clearValidators();
    //   // this.uploadFile.get('reasonDesc')?.updateValueAndValidity();
    // }
    if (
      selectedPaymentReasonStep4?.['paymentReason'] == 1 || selectedPaymentReasonStep4?.['paymentReason'] == 2 || selectedPaymentReasonStep4?.['paymentReason'] == 3 || selectedPaymentReasonStep4?.['paymentReason'] == 4 || selectedPaymentReasonStep4?.['paymentReason'] == 5 || selectedPaymentReasonStep4?.['paymentReason'] == 6 || selectedPaymentReasonStep4?.['paymentReason'] == 7 || selectedPaymentReasonStep4?.['paymentReason'] == 8 || selectedPaymentReasonStep4?.['paymentReason'] == 26
    ) {
      this.isDisplayTaxCountryAndDeductionFileId = true;
    } else {
      this.isDisplayTaxCountryAndDeductionFileId = false;
    }
  }

  get uploadedFile(): FormArray {
    return this.uploadFile.get('file') as FormArray;
  }

  getCountries() {
    of(countryData).pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
      this.countryList = data;
    })
  }

  startGradualProgress(index: number) {
    this.gradualProgressTimer = interval(100) // Adjust the interval as needed for speed
      .pipe(takeWhile(() => this.uploadProgressArray[index] < 90)) // Stop at 90% to leave room for actual progress
      .subscribe(() => {
        this.uploadProgressArray[index] += 1;
      });
  }

  stopGradualProgress() {
    if (this.gradualProgressTimer) {
      this.gradualProgressTimer.unsubscribe();
    }
  }

  onFileSelect(event: any, type: any, index: any) {
    const fileArrayControl = this.uploadFile.get('file') as FormArray;
    const fileFormGroup = this.fb.group({
      fileName: event.addedFiles[0].name,  // File name
      docType: type,  // File type (MIME type)
      type: event.addedFiles[0].type,
      fileSize: event.addedFiles[0].size   // File size (in bytes)
    });
    const isTypeAlreadySelected = fileArrayControl.value.some((file: any) => file.docType === type);
    if (!isTypeAlreadySelected) {
      fileArrayControl.push(fileFormGroup);
    }
    this.isUploadBtnDisplay = true;
    this.maxSize = false;
    if (event.rejectedFiles.length > 0) {
      this.fileUploadErrors[index] = this.translateService.instant('FORMS_ERRORS.fileNotSupported');
      this.uploadProgressArray[index] = 80;
      this.stopGradualProgress();
      return;
    }
    this.fileIsRequired = '';
    this.loading = true
    this.beneficiaryObjectForFilelength.forEach((docType: any, docIndex: any) => {
      if (docType == type) {
        this.beneficiaryObjectForFilelength.splice(docIndex, 1);
        this.fileArray.push(...event.addedFiles);
        let formData = new FormData();
        formData.append("files", event.addedFiles[0]);
        let uploadFile = {
          "formData": formData,
          "type": type
        }
        const progressIndex = this.uploadProgressArray.length;
        this.uploadfileWithType.push(uploadFile);
        this.uploadedfile.push(uploadFile);
        if (this.handleUploadFileSizing(event.addedFiles[0])) {
          this.fileUploadErrors[progressIndex] = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
          this.uploadProgressArray[progressIndex] = 80;
          return;
        }
        this.fileUploadErrors[progressIndex] = '';
        this.cancelUpload[progressIndex] = false;
        this.uploadProgressArray[progressIndex] = 0; // Initialize progress
        // Simulate progress instead of making an API call
        const simulatedProgressInterval = setInterval(() => {
          if (this.cancelUpload[progressIndex]) {
            clearInterval(simulatedProgressInterval);
            this.stopGradualProgress();
            return;
          }

          // Simulate upload progress
          const simulatedProgress = Math.min(this.uploadProgressArray[progressIndex] + 10, 100);
          this.uploadProgressArray[progressIndex] = simulatedProgress;

          // Stop the progress when it reaches 100
          if (simulatedProgress === 100) {
            clearInterval(simulatedProgressInterval);
            this.uploadProgressArray[progressIndex] = 100;
            this.stopGradualProgress();
          }
        }, 100);  // Simulate progress every 500ms

        // Optionally handle completion or errors manually
        setTimeout(() => {
          this.loading = false;  // Finish the loading process after the simulated progress
        }, 3000);
      }
    });
    if (this.isDisplayTaxCountryAndDeductionFileId) {
      this.isDisplayTaxCountryAndDeductionFileId = true
    }
    if (this.isDisplayPaymentReasonIsOther) {
      this.isDisplayPaymentReasonIsOther = true;
    }
  }

   restrickWhiteSpace(event: any) {
    if (event?.keyCode == 32) {
      event?.preventDefault();
    }
  }


  async onBeneficiaryFileChange(event: any, docType: any, index: any) {
    delete this.errMsg
    this.maxSize = false;
    this.isUploadBtnDisplay = true;
    this.uploadProgressArray[index] = 0;
    this.startGradualProgress(index);
    this.fileUploadErrors[index] = '';
    this.fileIsRequired = '';
    this.cancelUpload[index] = false;
    if (event.rejectedFiles.length > 0) {
      this.fileUploadErrors[index] = this.translateService.instant('FORMS_ERRORS.fileNotSupported');
      this.uploadProgressArray[index] = 80;
      return;
    }
    this.loading = true
    this.uploadfileWithType = []
    this.fileArray.splice(index, 1);
    this.fileArray.splice(index, 0, ...event.addedFiles);
    const fileArrayControl = this.uploadFile.get('file') as FormArray;
    const fileFormGroup = this.fb.group({
      fileName: event.addedFiles[0].name,  // File name
      docType: docType,  // File type (MIME type)
      type: event.addedFiles[0].type,
      fileSize: event.addedFiles[0].size   // File size (in bytes)
    });
    const isTypeAlreadySelected = fileArrayControl.value.some((file: any) => file.docType === docType);
    // Only push if the type doesn't already exist
    if (!isTypeAlreadySelected) {
      fileArrayControl.push(fileFormGroup);
    } else {
      fileArrayControl.controls.forEach((control: any) => {
        if (control.value.docType === docType) {
          control.patchValue({
            fileName: event.addedFiles[0].name,
            fileSize: event.addedFiles[0].size
          });
        }
      });
    }
    if (this.handleUploadFileSizing(this.fileArray[index])) {
      this.fileUploadErrors[index] = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
      this.uploadProgressArray[index] = 80;
      this.stopGradualProgress();
      return;
    }

    const simulatedProgressInterval = setInterval(() => {
      if (this.cancelUpload[index]) {
        clearInterval(simulatedProgressInterval);
        this.stopGradualProgress();
        return;
      }

      // Simulate upload progress
      const simulatedProgress = Math.min(this.uploadProgressArray[index] + 10, 100);
      this.uploadProgressArray[index] = simulatedProgress;

      // Stop the progress when it reaches 100
      if (simulatedProgress === 100) {
        clearInterval(simulatedProgressInterval);
        this.uploadProgressArray[index] = 100;
        this.stopGradualProgress();
      }
    }, 500);  // Simulate progress every 500ms

    // Optionally handle completion or errors manually
    setTimeout(() => {
      this.loading = false;  // Finish the loading process after the simulated progress
    }, 3000);

    this.cd.detectChanges();
    this.uploadFileFormValues.emit(this.uploadFile.value);
  }

  handleUploadFileSizing(files: any): boolean {
    const maxSize = 5;
    if (files?.fileSize) {
      return files.fileSize / (1024 * 1024) > maxSize;
    } else {
      return files.size / (1024 * 1024) > maxSize;
    }
  }

  stopUploadFile(event: any, fileIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogUploadFileComponent, {
      height: "auto",
      panelClass: "confirm-dialog-upload-file",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.cancelUpload[fileIndex] = true;
        this.uploadProgressArray[fileIndex] = 40; // Reset progress
        this.stopGradualProgress();
        return;
      }
    });
  }

  resetUploadState(fileIndex: number) {
    this.loading = false; // Hide the loader
    this.uploadProgressArray[fileIndex] = 0;
    this.fileUploadErrors[fileIndex] = '';
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  hasUploadErrors(): boolean {
    return this.fileUploadErrors.some(error => error !== '');
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
  }

  onCountryDropdownOpen(event: any) {
    if (this.beneficiaryStateResidenceInput) {
      this.beneficiaryStateResidenceInput.nativeElement.focus();
    }
    if (event) {
      this.countryList = this.globalCountryData;
      this.benCountrySearchControl.setValue('');
    } else {
      if (this.countryList && this.countryList.length === 0) {
        this.countryList = this.globalCountryData
      }
    }
  }

  benTaxCountryFilter() {
    this.benCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.countryList = countrySearchVal ? this.filterCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  filterCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  getCountryCode() {
    return this.uploadFile.controls['beneficiaryStateResidenceRecipient'].value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.editBenificiaryObj = this.editBenificiaryObj;
    this.transcationFormStep3Values = this.transcationFormStep3Values;
    setTimeout(() => {
      this.countryList = this.globalCountryData = this.parentCountryList;
    }, 1000);
  }

  hasError(controlName: string): boolean {
    const control = this.uploadFile.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  clearSearch() {
    if (this.benCountrySearchControl != null) {
      this.benCountrySearchControl.setValue('');
    }
  }
}
