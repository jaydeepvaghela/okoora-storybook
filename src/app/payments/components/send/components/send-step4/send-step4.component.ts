import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import moment from 'moment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActiveCurrencyModel } from '../../../../../main-dashboard/models/ActiveCurrencyModel';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { getAllActiveCurrencies } from '../../../../../main-dashboard/dashboard-data/balanceList-data';
import DateFormat from '../../../../../main-dashboard/enums/riskProfitLoss.enum';
import FileType from '../../../../../shared/constants/FileType';
import { SignatureComponent } from '../signature/signature.component';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-send-step4',
  templateUrl: './send-step4.component.html',
  styleUrls: ['./send-step4.component.scss'], 
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatSelectModule, MatListModule, NgxDropzoneModule]
})
export class SendStep4Component {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('createPayment') createPayment: any;
  @Input('currency')
  currency!: string;
  @Input('benificiaryId')
  benificiaryId!: string;
  @Input('paymentType')
  paymentType!: string;
  @Input('futurePayment') futurePayment?: any;
  @ViewChild('invoiceNoInput')
  invoiceNoInput!: ElementRef;

  activeCurrency$!: Observable<ActiveCurrencyModel[]>;

  files: File[] = [];
  benificiaryCurrency!: string;
  minDate = new Date();
  paymentRateForm!: FormGroup;
  fromCurrencyList: any;
  allCurrencyConvert: any;
  isSigned = false;
  invoiceUploaded = false;
  signImage = '';
  showLoader = false;
  futurePaymentError = '';
  invoiceNumber = '';
  invoiceUploadComment = '';
  maxFileSizeLimit: boolean = false;
  errMsg!: string;
  
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _walletService: WalletsService,
    // private commonDialog: CommonDialogService,
    public dialogRef: MatDialogRef<SendStep4Component>,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.benificiaryCurrency = this.currency;

    this.activeCurrency$ = of(getAllActiveCurrencies);
    this.paymentRateForm = this.fb.group({
      'fromCurrency': ['', [Validators.required]],
      'toCurrency': ['', [Validators.required]],
      'sellAmount': ['', [Validators.required]],
      'buyAmount': [''],
      'uploadInvoice': ['', [Validators.required]],
      'invoiceNumber': [''],
      'invoiceUploadComment': ['']
    })
    this._walletService.getAllBalanceList().subscribe((result: any) => {
      this.fromCurrencyList = result
    });
    this.activeCurrency$.subscribe(res => {
      this.allCurrencyConvert = res;
    })
  }

  isFileExtensionAllowed(filename:any) {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpeg', '.jpg', '.png'];
    const fileExtension = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    if(allowedExtensions.includes(fileExtension)){
      this.maxFileSizeLimit = false;
    }else{
      this.maxFileSizeLimit = true
    }
}
  nextStep(stepper: any, progress: any) {
    let requestId = this.futurePayment.value.createPaymentResponse.requestId
    let reqBody = {
      invoiceNumber: this.paymentRateForm.value.invoiceNumber,
      freeText: this.paymentRateForm.value.invoiceUploadComment
    }
    if (reqBody?.invoiceNumber || reqBody?.freeText) {
      this.showLoader = true;
      // this._walletService.updateFuturePaymentRequest(requestId, reqBody).subscribe(response => {
      //   if (response) {
      //     this.showLoader = false;
          let totalSteps = stepper.steps.length;
          let currentStep = stepper.selectedIndex + 1;
          progress.value = (currentStep * 100) / totalSteps;
          stepper.next();
      //   }
      // }, err => {
      //   this.showLoader = false;
      //   this.futurePaymentError = err.error.apiErrorMessage[0];
      // })
    } else {
      let totalSteps = stepper.steps.length;
      let currentStep = stepper.selectedIndex + 1;
      progress.value = (currentStep * 100) / totalSteps;
      stepper.next();
    }
  }
  previousStep(stepper: any, progress: any) {
    stepper.previous();
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex - 1;
    progress.value = (currentStep * 100) / totalSteps;
  }

  validateInput(event: KeyboardEvent) {
    const allowedChars = /[A-Za-z0-9\s]/;
    const key = event.key;

    if (!allowedChars.test(key)) {
      event.preventDefault();
    }
  }

  onPasteInvoiceNo(event: any) {
    const clipboardData = (event.clipboardData || (window as any).clipboardData).getData('text');
    const sanitizedData = this.sanitizeInput(clipboardData);
    const invoiceNoInput = document.getElementById('ss4-fp-invoice-no') as HTMLInputElement;
    invoiceNoInput.value = sanitizedData;
    this.paymentRateForm.patchValue({ invoiceNumber: sanitizedData });
    event.preventDefault();
  }

  sanitizeInput(input: string): string {
    const regex = /[^\w\s]/gi;
    return input.replace(regex, '');
  }

  onCutInputValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onCopyInputValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onPasteInputValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  stampUpload() {
    // this.commonDialog
    //   .confirmDialog({
    //     title: 'Please confirm action',
    //     message: 'You have to upload the stamp in order to perform this operation.',
    //     confirmText: 'Confirm',
    //     cancelText: 'Cancel',
    //   })
    //   .subscribe((isConfirmed) => {
    //     if (isConfirmed) {
    //       this.dialog
    //         .open(UserPreferenceComponent, {
    //           width: '1095px',
    //           maxWidth: '1095px',
    //           disableClose: true,
    //           panelClass: 'user-preference'
    //         }).afterClosed().subscribe((shouldReload: any) => {
    //           this.dialogRef.close();
    //         })
    //     }
    //   });
  }

  createPaymentRequest() {
    let body = {
      amount: this.createPayment?.controls?.amount?.value,
      beneficiaryId: this.benificiaryId,
      currency: this.createPayment?.controls?.chargeCurrency?.value
    }

    // this._walletService.createPaymentRequest(body).subscribe((data: any) => {
    //   let needStamp = data?.signAndFiles?.needStamp;
    //   if (needStamp) {
    //     this.stampUpload();
    //   }
    // })
  }

  signaturePopup() {
    const signatureDialogRef = this.dialog.open(SignatureComponent, {
      width: '882px',
      height: '465px',
      panelClass: 'signature-modal',
      id: 'ss4-fp-signature-modal',
      disableClose: true,
      data: {
        drawCompleteFn: this.drawComplete,
        paymentRequestID: this.futurePayment.value.createPaymentResponse.requestId,
      },
    });
    signatureDialogRef.afterClosed().subscribe(result => {
      if (result !== 'close' && result?.signature) {
        this.isSigned = true;
        this.signImage = result?.signature;
      }
    });
  }

  drawComplete = (signaturePad: string) => {
    setTimeout(() => {
      this.cd.detectChanges();
    }, 3000);
  }

  onFileSelect(event: any) {
    if(this.validateFile(event)) return;
    this.files.push(...event.addedFiles);
    for (var i = 0; i < this.files.length; i++) {
      let formData = new FormData();
      formData.append('file', this.files[i]);
      let body = {
        file: formData,
        requestId: this.futurePayment.value.createPaymentResponse.requestId,
        fileType: FileType.needInvoice,
      }; 
      this.invoiceUploaded = true;
    }
    this.showLoader = true;
  }
  validateFile(files: any): boolean{    
    this.errMsg = '';
    this.files = [];
    if(files.rejectedFiles.length > 0) {    
      this.errMsg = this.translateService.instant('FORMS_ERRORS.fileNotSupported');           
      return true;
    }        
    let value = this.handleUploadFileSizing(files.addedFiles);
    if (value) {      
      this.errMsg = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
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
  onFileChange(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  dateChanged(ev: any) {
    let date = moment(ev.value).format(DateFormat.dateInput);
    // this.createTransfer.value['orderDetailes.FlightDate'] = date;
  }

  removeSignature() {
    this.isSigned = false;
    this.signImage = '';
  }
}
