import { ChangeDetectorRef, Component, Input, NgZone, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SinglePaymentSendComponent } from '../single-payment-send/single-payment-send.component';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import DateFormat from '../../../../shared/constants/DateFormat';
import FileType from '../../../../shared/constants/FileType';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SignaturePad, SignaturePadModule } from 'angular2-signaturepad';
import { MatStepperModule } from '@angular/material/stepper';
@Component({
  selector: 'app-single-payment-send-step2',
  templateUrl: './single-payment-send-step2.component.html',
  styleUrls: ['./single-payment-send-step2.component.scss'],
  imports: [CommonModule, SignaturePadModule, MatMenuModule, MatProgressBarModule, ReactiveFormsModule, NgxDropzoneModule, MatStepperModule],
})
export class SinglePaymentSendStep2Component {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('timerSubscription') timerSubscription?: any;
  @Input('createdPaymentData') createdPaymentData?: any;
  @Input('walletList') walletList: any;

  stampFiles: File[] = [];
  invoiceFiles: File[] = [];
  signaturePadOptions: Object = {
    penColor: 'black',
    dotSize: 0.1,
    'canvasHeight': 130,
    'canvasWidth': 800
  };
  signatureImg!: string;
  showStampUploadLoader = false;
  showLoader = false;
  uploadStampError!: boolean;
  uploadSignatureError: any;
  signatureCheck: boolean = true;
  signatureDate!: string;
  uploadAPIError!: string;
  uploadFileError!: boolean;
  errorFiled: any;
  showFileUploadLoader!: boolean;
  form: FormGroup;
  updatepaymentRequestAPIError!: string;
  needSign!: boolean;
  needStamp!: boolean;
  needFile!: boolean;
  lockErrorID: any;
  lockExtensionInvoice: any;
  uniqueUnsupportedExtension: any = [];
  lockErrorIDForStamp: any;
  stampExtension: any = "";
  userData: any;
  isEur: boolean = false;
  isInvoiceNumberHasSpecialChar!: boolean;
  errMsg!: string;
  affiliateCountry: any;
  isNonIsraeliUser : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SinglePaymentSendStep2Component>,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private ngZone: NgZone

  ) {
    this.form = this.fb.group({
      free_text: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.signatureDate = moment(new Date()).format(DateFormat?.dateInput)
    if (this.createdPaymentData?.signAndFiles?.needStamp) {
      this.needStamp = true
    }
    if (this.createdPaymentData?.signAndFiles?.needFile) {
      this.needFile = true
    }
    if (this.createdPaymentData?.signAndFiles?.needSign) {
      this.needSign = true

    }

    this._walletService.currentCreatedPayment?.subscribe((data:any)=> {
      if (data?.signAndFiles?.needStamp) {
        this.needStamp = true
      }
      if (data?.signAndFiles?.needFile) {
        this.needFile = true
      }
      if (data?.signAndFiles?.needSign) {
        this.needSign = true

      }

    })

    this._walletService.currentCreatedPaymentSummery?.subscribe((data: any) => {
      this.invoiceFiles = []
      this.cd.detectChanges()
    })

  }

  closeButton() {
    this.dialogRef.close(this.timerSubscription);
    this.dialog.closeAll()

  }
  onStampFileSelect(event: any) {

    this.stampFiles = []
    this.stampFiles.push(...event.addedFiles);
    this.uploadStampError = false;
    const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    if (!allowedTypes.has(this.stampFiles[0]?.type)) {
      const extension = this.stampFiles[0]?.name?.split('.').pop();
      this.uploadStampError = true
      this.stampExtension = extension
    }
    if (this.stampFiles.length > 0) {
      this.needStamp = false
    }

  }
  removeStamp() {
    this.stampFiles = []
    this.uploadStampError = false
    if (this.createdPaymentData?.signAndFiles?.needStamp && this.stampFiles.length == 0) {
      this.needStamp = true
      this.cd.detectChanges()
    }

  }
  onStampFileChange(event: any) {
    this.stampFiles.splice(this.stampFiles?.indexOf(event), 1);
  }
  getCommonExtension(invoice: any, stamp: any) {
    if(stamp){
      const commonExtension = [...invoice, "." + stamp]
      return commonExtension?.filter((value: any, index: any, array: any) => array.indexOf(value) === index);
    }
    else{
      const commonExtension = [...invoice]
      return commonExtension?.filter((value: any, index: any, array: any) => array.indexOf(value) === index);
    }

  }
  onInvoiceFileSelect(event: any) {
    this.errMsg = '';
    if(this.validateFile(event)) return;
    this.lockErrorID = []
    this.invoiceFiles.push(...event.addedFiles);
    this.filteredInvoice()
    if (this.invoiceFiles.length > 0) {
      this.needFile = false
    }
  }

  reuploadFile(event: any, index: any) {
    this.invoiceFiles.splice(index, 1);
    this.invoiceFiles.splice(index, 0, ...event.addedFiles);
    this.filteredInvoice()
  }

  filteredInvoice() {
    this.lockErrorID = []
    this.lockExtensionInvoice = []
    const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    for (var i = 0; i < this.invoiceFiles?.length; i++) {
      if (!allowedTypes.has(this.invoiceFiles[i]?.type)) {
        const extension = this.invoiceFiles[i]?.name?.split('.').pop();
        this.lockExtensionInvoice?.push("." + extension)
        this.lockErrorID?.push(i)
      }
    }
    this.uniqueUnsupportedExtension = this.lockExtensionInvoice?.filter((value: any, index: any, array: any) => array.indexOf(value) === index);

  }

  validateFile(files: any): boolean{
    if(files.rejectedFiles.length > 0) {
      this.errMsg = "The uploaded file type is not supported. pdf,gif,jpg,png,jpeg";
      return true;
    }
    let value = this.handleUploadFileSizing(files.addedFiles);
    if (value) {
      this.errMsg = "The uploaded file exceeds the maximum size limit of 5 MB. Please choose a smaller file."
      return true;
    }
    return false;
  }

  handleUploadFileSizing(files: any): boolean {
    let fileSizeMB = 0;
    for (let i = 0; i < files.length; i++) {
      fileSizeMB += files[i].size / (1024 * 1024);
    }
    if (fileSizeMB > 5) {
      return true;
    }
    return false;
}
  addngClassForInvoice(index: any) {
    const fileIndex = this.lockErrorID.filter((data: any) => data == index)[0];
    return fileIndex;
  }
  onInvoiceFileChange(event: any) {
    this.invoiceFiles.splice(this.invoiceFiles?.indexOf(event), 1);
  }


  getFileSize(fileSize: any) {
    if (fileSize) {
      return (fileSize / 1000) / 1000 < 1 ? `${Number(fileSize / 1000).toFixed(1)}KB` : `${(Number(fileSize / 1000) / 1000).toFixed(1)}MB`;
    } else {
      return '';
    }
  }

  drawComplete() {
    this.signatureCheck = this.signaturePad.isEmpty() ? true : false;
    this.needSign = false
  }

  drawStart() {
  }

  clearImg() {
    this.needSign = true
    this.signaturePad.clear();
  }

  drawClear() {
    this.needSign = true
    this.resetSignature();
  }

  resetSignature() {
  }

  async nextStep(stepper: any, progress: any) {
    if (this.formStepper) {

      if (this.createdPaymentData?.signAndFiles?.needSign && !this.isNonIsraeliUser) {
        this.needSign = true
        this.signatureCheck = this.signaturePad.isEmpty() ? true : false;
        // stepper.next()
        const base64Data = this.signaturePad.toDataURL();
        this.signatureImg = base64Data;
        const imageName = 'sign.png';
        const imageBlob = this.dataURItoBlob(this.signatureImg);
        const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
        this.showLoader = true;
        if (imageFile) {
          let formData = new FormData();
          formData.append('file', imageFile);
          let body = {
            file: formData.append('file', imageFile),
            paymentRequestId: this.createdPaymentData?.requestId,
            fileType: FileType.needSign,
          };
          // this._walletService
          //   .uploadPaymentFile(this.createdPaymentData?.requestId, body?.fileType, formData)
          //   .subscribe((response: any) => {
          //     this.showLoader = false;
          //     this.needSign = false
          //   }, (err: any) => {
          //     this.showLoader = false;
          //     this.uploadSignatureError = err?.error?.apiErrorMessage[0] ?? err?.error?.message;
          //   });
        }
      }
      if (this.createdPaymentData?.signAndFiles?.needStamp) {
        this.uploadAccountStamp();
      }
      if (this.createdPaymentData?.signAndFiles?.needFile) {
        await this.uploadInvoiceFile();
      }
      this.cd.detectChanges()
      if (this.form.get('free_text')?.value) {
        this.updatePaymentRequest();
      }
      let totalSteps = stepper.steps.length;
      let currentStep = stepper.selectedIndex + 1;
      progress.value = (currentStep * 100) / totalSteps;
      const scrollToTopNext = document.querySelector<HTMLElement>('mat-dialog-content');
      if (scrollToTopNext) {
        scrollToTopNext.scrollTop = 0;
      }
      if (this.needFile || this.needStamp || this.needSign || this.form?.get('free_text')?.hasError('maxlength') || this.form?.get('free_text')?.hasError('pattern')) {
        stepper.next()
        // this.timerSubscription.unsubscribe()
      }
      if ((this.needFile == undefined || this.needFile == false) && (this.needStamp == undefined || this.needStamp == false) && (this.needSign == undefined || this.needSign == false) && !this.form?.get('free_text')?.hasError('maxlength') && !this.form?.get('free_text')?.hasError('pattern')) {
        stepper.next()
        // this.timerSubscription.unsubscribe()

      }
    }
    // document.getElementsByClassName('mat-dialog-content')[0].scrollTop = 0;
  }

  removeReference() {
    this.form.get('free_text')?.patchValue('');
  }
  dataURItoBlob(dataURI: any) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpg',
    });
  }
  updatePaymentRequest() {
    const freeTextValue = this.form?.get('free_text')?.value;

    const updateData = {
      freeText: freeTextValue, // Include the free_text value
      // Include other properties if needed
    };

    // this._walletService.updatePaymentRequest(this.createdPaymentData?.requestId, updateData).subscribe(
    //   (data: any) => {
    //     this.showLoader = false;
    //     this.updatepaymentRequestAPIError = '';

    //   },
    //   (err) => {
    //     this.showLoader = false;
    //     this.updatepaymentRequestAPIError = err?.error?.apiErrorMessage[0] ?? '';
    //   }
    // );
  }

  uploadAccountStamp() {
    this.showStampUploadLoader = true;
    this.showLoader = true;
    let formData = new FormData();
    this.needStamp = true
    formData.append('StampFile', this.stampFiles[0]);
    // this._workflowService.SetAccountStamp(formData).subscribe({
    //   next: (data) => {
    //     this.showStampUploadLoader = false;
    //     this.showLoader = false;
    //     this.needStamp = false
    //   },
    //   error: (err) => {
    //     this.showStampUploadLoader = false;
    //     this.showLoader = false;
    //     // this.uploadStampError = err?.error?.apiErrorMessage;
    //   }
    // });
  }
  removeFile(fileIndex: any) {
    this.invoiceFiles.splice(fileIndex, 1);
    this.filteredInvoice()
    if (this.createdPaymentData?.signAndFiles?.needFile && this.invoiceFiles.length == 0) {
      this.needFile = true
    }
    this.cd.detectChanges()
  }
  async uploadInvoiceFile(): Promise<void> {
    let filedList = '';
    let len = 0;
    this.errorFiled = []
    this.needFile = true
    
    const uploadPromises = this.invoiceFiles.map((file) => {
      this.showFileUploadLoader = true;
      let formData = new FormData();
      formData.append('file', file);
      let body = {
        file: formData,
        paymentRequestId: this.createdPaymentData?.requestId,
        fileType: FileType.needInvoice,
      };
      // return lastValueFrom(
      //   this._walletService.uploadPaymentFile(body.paymentRequestId, body.fileType, formData)
      // ).then(() => {
      //   // Update state upon successful upload
      //   this.needFile = false;
      //   this.showFileUploadLoader = false;
      //   this.uploadAPIError = '';
      //   this.uploadFileError = false;
      //   this.showLoader = false;
      // }).catch((err) => {
      //   // Handle error if upload fails
      //   this.uploadAPIError = err?.error?.message ?? '';
      // });
    });

    await Promise.all(uploadPromises);
  }
  sendAnotherPayment() {
    let activeWallet: any = localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(SinglePaymentSendComponent, {
      width: '100vw',
      maxWidth: '100vw',
      data: {
        selectedwalletInfo: currency,
        payment: true
      },
      disableClose: true,
    }).afterClosed()
      .subscribe((shouldReload: any) => {
        // console.log("shouldReload", shouldReload);
        if (shouldReload) {
          this.timerSubscription = shouldReload
          // this.timerSubscription.unsubscribe()
        }
      });
  }

  createMassPayment() {
    // const dialogRef = this.dialog.open(MassPaymentComponent, {
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   height: '100vh',
    //   data: {
    //     walletList: this.walletList,
    //   },
    // });
  }

  checkForSpecialCharacters(event: any) {
    var specialChars = /[<>();+=]/g;
    if (specialChars.test(event.target.value)) {
      this.isInvoiceNumberHasSpecialChar = true;
    } else {
      this.isInvoiceNumberHasSpecialChar = false;
    }
  }
  onPasteTypeValue(event: ClipboardEvent) {
    let res = false;
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      res =  this.containsSpecialCharacter(pastedText);
      if(res)
        return false;
    }
    return true;
  }
  restrictSpecialCharacters(event: any) {
    const invalidChars = ['<', '>', ';', '=', '+' , '(', ')'];
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    } else {
      const dotOccurrences = (event?.target?.value.match(/\./g) || []).length;
      if (event?.key === "." && dotOccurrences >= 3) {
        event?.preventDefault();
      }
      if (invalidChars.includes(event.key)) {
        event.preventDefault();
      }
    }
  }
  containsSpecialCharacter(text: string): boolean {
    var specialChars = /[<>();+=]/g;
    return text.split('').some(character => specialChars.test(character));
  }

  restrictNameOnPasteWithFormGroup(event: ClipboardEvent, type: string, formGroup: FormGroup, formControlName?: any) {
    this.ngZone.run(() => {
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      const pastedText = clipboardData.getData('text');
      // Declare sanitizedText outside the blocks
      let sanitizedText = '';

      if (type === 'letters') {
        sanitizedText = pastedText
          .replace(/^\s+/, '') // Remove leading spaces
          .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
          .replace(/[^a-zA-Z\s]/g, '') // Allow only letters and spaces
          .trim(); // Remove trailing spaces
      } else {
        sanitizedText = pastedText
          .replace(/^\s+/, '') // Remove leading spaces
          .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
          .replace(/[^a-zA-Z0-9\s]/g, '') // Allow only letters, numbers, and spaces
          .trim(); // Remove trailing spaces
      }

      // Prevent the default paste behavior
      event.preventDefault();

      // Insert the sanitized text into the input
      const inputElement = event.target as HTMLInputElement;
      const currentValue = inputElement.value;

      // Combine current value and sanitized pasted text
      let combinedValue =
        currentValue.substring(0, inputElement.selectionStart || 0) +
        sanitizedText +
        currentValue.substring(inputElement.selectionEnd || 0);

      // Apply sanitization again on the combined value to handle multiple pastes
      combinedValue = combinedValue
        .replace(/^\s+/, '') // Remove leading spaces
        .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
        .replace(/[^a-zA-Z0-9\s]/g, '') // Ensure only valid characters remain
        .trim(); // Remove trailing spaces

      // Update the input's value
      inputElement.value = combinedValue;

      // Move the cursor to the correct position
      const newCursorPosition =
        (inputElement.selectionStart || 0) + sanitizedText.length;
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
      // Further restrictions can be applied here
      // Update the form control with the new value
      const formControl = formGroup.get(formControlName); // Use your form's name here
      if (formControl) {
        formControl.setValue(combinedValue); // Set the sanitized value to the form control
      }
    });
  }

  restrictWhiteSpaceWithAlphnumeric(event: any) {
    const inputValue = event.target.value;

    if (event.keyCode === 32 && inputValue.length === 0) {
      event.preventDefault();
      return;
    }

    // Prevent consecutive spaces
    if (event.keyCode === 32 && inputValue.endsWith(' ')) {
      event.preventDefault();
      return;
    }

    // Prevent two spaces after a word
    if (event.keyCode === 32 && /\s$/.test(inputValue)) {
      event.preventDefault();
      return;
    }

    // Allow only letters (both upper and lower case), numbers, and spaces inside the text
    if (event.keyCode !== 32 && !/[a-zA-Z0-9]/.test(event.key) && event.keyCode !== 8) {
      event.preventDefault(); // Prevent non-alphanumeric characters (except backspace)
    }
  }
}
