import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { interval, Observable, Subject, Subscription, takeUntil, takeWhile } from 'rxjs';
import { __values } from 'tslib';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogUploadFileComponent } from '../confirm-dialog-upload-file/confirm-dialog-upload-file.component';
import { TranslateService } from '@ngx-translate/core';
import { BenificiaryModel } from '../../models/BenificiaryModel';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { BeneficiaryDocType } from '../../enums/paymentReason.enum';
import { PayerService } from '../../services/payer.service';
import { NewPayerPaymentDocTypeName } from '../../enums/PayerPaymentReason';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-new-payer-step-three',
  templateUrl: './new-payer-step-three.component.html',
  styleUrls: ['./new-payer-step-three.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule, NgbTooltipModule, MatProgressBarModule]
})
export class NewPayerStepThreeComponent implements OnInit {
  @Input() payerForm!: FormGroup;
  @Input('newPayerReasonForm') newPayerReasonForm?: any;
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
  @Input('uploadFileForm') uploadFileForm: any;
  @Input('uploadFileFormStep5Values') uploadFileFormStep5Values: any;
  @Input('transcationFormStep3Values') transcationFormStep3Values: any;
  @Input() editPayer!: boolean;
  @Input() editPayerObj: any;
  @Input('payerAccountDetail') payerAccountDetail: FormGroup | any;

  @Output() stepChanged = new EventEmitter<void>();
  @Output() movePreviousStep = new EventEmitter<void>();
  @Output() uploadFileFormValues = new EventEmitter<void>();
  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() backStep: EventEmitter<void> = new EventEmitter();

  @ViewChild('fileInput') fileInput!: ElementRef;

  unSubScribe$ = new Subject<void>();
  benificiaryObjectFromInvoice$!: Observable<BenificiaryModel[]>;
  benificiaryBlankObject$!: Observable<BenificiaryModel[]>;
  NewPayerDocTypeName: any;
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
  isDisplayTaxCountryAndDeductionFileId!: boolean;
  uploadProgressArray: number[] = [];
  showLoader = false;
  fileIsRequired: any;
  formPaymentReason: any;
  editPaymentReason: any;
  isUploadBtnDisplay = false;
  gradualProgressTimers: Subscription[] = []; // Array to track multiple timers
  payerId: any;
  selectedPaymentReason: any;
  payerObjectForFinalSave: any;
  uploadSubscriptions: Subscription[] = []; // Track upload subscriptions

  constructor(
    private contactsService: ContactsService,
    private payerService: PayerService,
    private fb: FormBuilder, 
    private translateService: TranslateService, 
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('skipPayerDocumentPage');
    this.NewPayerDocTypeName = NewPayerPaymentDocTypeName;
    this.BeneficiaryDocType = BeneficiaryDocType;
    this.getPaymentReason();
  }

  ngAfterViewInit(): void {
    if (this.payerAccountDetail.get('foundsSourceDetails')?.value) {
      this.payerAccountDetail.patchValue({
        foundsSourceDetails: this.payerAccountDetail.get('foundsSourceDetails')?.value
      });
    }
  }

  getPaymentReason() {
    this.payerService.getPayerObjectForFile.pipe(takeUntil(this.unSubScribe$)).subscribe((data) => {
      this.selectedPaymentReason = data?.savePayerRes?.paymentReason;
    });
    
    this.fileArray = [];
    const files = this.uploadFileForm.get('file')?.value || [];
    
    if (this.uploadFileForm.get('file')?.value && this.uploadFileForm.get('file')?.value.length !== 0) {
      const payerOriginalDocType = JSON.parse(localStorage.getItem('payerDocType')!);
      this.beneficiaryObjectForFilelength = [];
      
      payerOriginalDocType?.forEach((docTypeId: any) => {
        files.forEach((addFile: any) => {
          if (addFile?.docType === docTypeId) {
            const fileObj = this.createFileObject(addFile.fileName, addFile.docType);
            this.fileArray.push(fileObj);
            this.uploadedfile.push({ type: addFile.docType });
            const progressIndex = this.uploadProgressArray.length;
            this.uploadProgressArray[progressIndex] = 100;
            
            if (this.handleUploadFileSizing(addFile)) {
              this.fileUploadErrors[progressIndex] = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
              this.uploadProgressArray[progressIndex] = 0;
              return;
            }
          }
        });

        if (!files.some((file: any) => file?.docType === docTypeId)) {
          this.beneficiaryObjectForFilelength.push(docTypeId);
        }
      });
    } else {
      this.payerService.getPayerObjectForFile.pipe(takeUntil(this.unSubScribe$)).subscribe((data) => {
        this.selectedPaymentReason = data?.savePayerRes?.paymentReason;
        this.beneficiaryObjectForFile = data;
        this.beneficiaryObjectForFilelength = this.beneficiaryObjectForFile?.type;
      });
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

  prevStep() {
    this.movePreviousStep.emit();
  }

  finishAndReview() {
    this.loading = true;
    const payerOriginalDocType = JSON.parse(localStorage.getItem('payerDocType')!);
    
    if (this.fileArray.length !== payerOriginalDocType?.length || 
        this.cancelUpload.some(value => value === true) || 
        this.fileUploadErrors.some(error => error !== '') ||
        this.uploadProgressArray.some(progress => progress < 100)) {
      this.fileIsRequired = 'Please upload a valid document.';
      this.uploadFileForm.markAllAsTouched();
      this.loading = false;
      return;
    } else {
      this.fileIsRequired = '';
    }
    
    this.savePayerInformation();
    this.contactsService.isNewPayerSummaryPage.next(true);
    this.showLoader = true;
    this.stepChanged.emit();
  }

  savePayerInformation() {
    this.saveManuallyAddedNote();
    const savePayerRes = this.beneficiaryObjectForFile?.['savePayerRes'];
    if (savePayerRes) {
      savePayerRes['id'] = this.beneficiaryObjectForFile?.['id'];
      savePayerRes['foundsSourceDetails'] = this.payerAccountDetail?.value?.foundsSourceDetails;
      this.payerService.setpayerObjectFinalSave(savePayerRes);
    }
  }

  saveManuallyAddedNote() {
    this.payerService.getPayerObjectFinalSave.pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
      this.payerObjectForFinalSave = data;
      this.payerObjectForFinalSave['foundsSourceDetails'] = this.payerAccountDetail?.value?.foundsSourceDetails || "";
      this.payerService.setpayerObjectFinalSave(this.payerObjectForFinalSave);
    });
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

  get uploadedFile(): FormArray {
    return this.uploadFileForm.get('file') as FormArray;
  }

  startGradualProgress(index: number): void {
    // Clear any existing timer for this index
    if (this.gradualProgressTimers[index]) {
      this.gradualProgressTimers[index].unsubscribe();
    }

    this.uploadProgressArray[index] = 0;
    
    // Simulate complete file upload progress from 0 to 100%
    this.gradualProgressTimers[index] = interval(50)
      .pipe(
        takeWhile(() => this.uploadProgressArray[index] < 100 && !this.cancelUpload[index])
      )
      .subscribe(() => {
        // Gradually increase progress
        const increment = this.uploadProgressArray[index] < 90 ? 2 : 1;
        this.uploadProgressArray[index] = Math.min(this.uploadProgressArray[index] + increment, 100);
        
        // When upload completes
        if (this.uploadProgressArray[index] === 100) {
          this.stopGradualProgress(index);
          this.fileUploadErrors[index] = '';
          this.loading = false;
        }
      });
  }

  stopGradualProgress(index?: number): void {
    if (index !== undefined) {
      if (this.gradualProgressTimers[index]) {
        this.gradualProgressTimers[index].unsubscribe();
        this.gradualProgressTimers[index] = null as any;
      }
    } else {
      // Stop all timers
      this.gradualProgressTimers.forEach(timer => {
        if (timer) {
          timer.unsubscribe();
        }
      });
      this.gradualProgressTimers = [];
    }
  }

  onFileSelect(event: any, type: any, index: any) {
    const fileArrayControl = this.uploadFileForm.get('file') as FormArray;
    const fileFormGroup = this.fb.group({
      fileName: event.addedFiles[0].name,
      docType: type,
      size: event.addedFiles[0].size
    });

    // Check if a file with the same type already exists
    const existingIndex = fileArrayControl.value.findIndex((file: any) => file.docType === type);
    if (existingIndex !== -1) {
      // Update existing entry
      fileArrayControl.at(existingIndex).patchValue(fileFormGroup.value);
    } else {
      // Add new entry
      fileArrayControl.push(fileFormGroup);
    }

    this.isUploadBtnDisplay = true;
    this.maxSize = false;
    
    if (event.rejectedFiles.length > 0) {
      this.fileUploadErrors[index] = this.translateService.instant('FORMS_ERRORS.fileNotSupported');
      this.uploadProgressArray[index] = 0;
      return;
    }

    this.fileIsRequired = '';
    this.loading = true;
    
    this.beneficiaryObjectForFilelength.forEach((docType: any, docIndex: any) => {
      if (docType === type) {
        this.beneficiaryObjectForFilelength.splice(docIndex, 1);
        this.fileArray.push(...event.addedFiles);
        
        let formData = new FormData();
        formData.append("files", event.addedFiles[0]);
        
        let uploadFile = {
          "formData": formData,
          "type": type
        };

        const progressIndex = this.uploadProgressArray.length;
        this.uploadfileWithType.push(uploadFile);
        this.uploadedfile.push(uploadFile);
        
        if (this.handleUploadFileSizing(event.addedFiles[0])) {
          this.fileUploadErrors[progressIndex] = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
          this.uploadProgressArray[progressIndex] = 0;
          this.loading = false;
          return;
        }

        this.fileUploadErrors[progressIndex] = '';
        this.cancelUpload[progressIndex] = false;
        this.uploadProgressArray[progressIndex] = 0;
        
        // Start initial progress simulation
        this.startGradualProgress(progressIndex);
        
        this.payerService.currentpayerIDForFile.subscribe((data) => {
          this.payerId = data?.id;
        });

        // Simulate file upload progress
        this.startGradualProgress(progressIndex);
      }
    });

    if (this.isDisplayTaxCountryAndDeductionFileId) {
      this.isDisplayTaxCountryAndDeductionFileId = true;
    }
    if (this.isDisplayPaymentReasonIsOther) {
      this.isDisplayPaymentReasonIsOther = true;
    }
  }

  restrickWhiteSpace(event: any) {
    if (event?.keyCode === 32) {
      event?.preventDefault();
    }
  }

  async onBeneficiaryFileChange(event: any, docType: any, index: any) {
    delete this.errMsg;
    this.maxSize = false;
    this.isUploadBtnDisplay = true;
    this.uploadProgressArray[index] = 0;
    this.fileUploadErrors[index] = '';
    this.fileIsRequired = '';
    this.cancelUpload[index] = false;
    
    if (event.rejectedFiles.length > 0) {
      this.fileUploadErrors[index] = this.translateService.instant('FORMS_ERRORS.fileNotSupported');
      this.uploadProgressArray[index] = 0;
      return;
    }

    this.loading = true;
    this.uploadfileWithType = [];
    this.fileArray.splice(index, 1);
    this.fileArray.splice(index, 0, ...event.addedFiles);

    let formData = new FormData();
    formData.append("files", this.fileArray[index]);
    
    let uploadFile = {
      "formData": formData,
      "type": docType
    };

    const fileArrayControl = this.uploadFileForm.get('file') as FormArray;
    fileArrayControl.controls.forEach((control) => {
      const formGroup = control as FormGroup;
      if (formGroup.value.docType === docType) {
        formGroup.patchValue({
          fileName: event.addedFiles[0].name,
          size: event.addedFiles[0].size,
        });
      }
    });

    if (this.handleUploadFileSizing(this.fileArray[index])) {
      this.fileUploadErrors[index] = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
      this.uploadProgressArray[index] = 0;
      this.loading = false;
      return;
    }

    // Start progress simulation
    this.startGradualProgress(index);

    this.payerService.currentpayerIDForFile.subscribe((data) => {
      this.payerId = data?.id;
    });

    // Simulate file upload progress
    this.startGradualProgress(index);
  }

  handleUploadFileSizing(files: any): boolean {
    const maxSize = 5;
    return files.size / (1024 * 1024) > maxSize;
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
        
        // Cancel upload subscription if exists
        if (this.uploadSubscriptions[fileIndex]) {
          this.uploadSubscriptions[fileIndex].unsubscribe();
        }
        
        // Stop progress timer
        this.stopGradualProgress(fileIndex);
        
        // Reset progress
        this.uploadProgressArray[fileIndex] = 0;
        this.fileUploadErrors[fileIndex] = 'Upload cancelled';
        
        return;
      }
    });
  }

  resetUploadState(fileIndex: number) {
    this.loading = false;
    this.uploadProgressArray[fileIndex] = 0;
    this.fileUploadErrors[fileIndex] = '';
    this.stopGradualProgress(fileIndex);
    
    if (this.uploadSubscriptions[fileIndex]) {
      this.uploadSubscriptions[fileIndex].unsubscribe();
    }
    
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  hasUploadErrors(): boolean {
    return this.fileUploadErrors.some(error => error !== '' && error !== 'Upload cancelled');
  }

  isUploadComplete(): boolean {
    return this.uploadProgressArray.every(progress => progress === 100);
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    
    // Clean up all subscriptions and timers
    this.stopGradualProgress();
    this.uploadSubscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getCountryCode() {
    return this.uploadFileForm.controls['beneficiaryStateResidenceRecipient'].value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.transcationFormStep3Values = this.transcationFormStep3Values;
    setTimeout(() => {
      this.countryList = this.globalCountryData = this.parentCountryList;
    }, 1000);
  }

  hasError(controlName: string): boolean {
    const control = this.uploadFileForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}