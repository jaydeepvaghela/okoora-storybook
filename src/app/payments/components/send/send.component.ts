import { AfterContentChecked, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WalletBalanceListModal } from '../../../main-dashboard/models/WalletBalanceListModal';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { SendStep2Component } from './components/send-step2/send-step2.component';
import { SendStep3Component } from './components/send-step3/send-step3.component';
import { SendStep4Component } from './components/send-step4/send-step4.component';
import { SendStep5Component } from './components/send-step5/send-step5.component';

interface DialogProps {
  data: {
    selectedwalletInfo: WalletBalanceListModal,
    fromPayment: boolean,
    payment: boolean
  }
}
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  imports: [CommonModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatProgressBarModule, MatStepperModule, SendStep2Component, SendStep3Component, SendStep4Component, SendStep5Component]
})
export class SendComponent implements AfterContentChecked {
  @ViewChild('formStepper') formStepper!: MatStepper;
  isLastStep = false;
  ispaymentmanually = false;
  files: File[] = [];
  filterControl = new FormControl('');
  filteredBeneficiary$!: Observable<string[]>;
  paymentRequestForm!: FormGroup;
  lock_rate = false;
  your_own_rate = false;
  roles: any;
  currentDate = new Date();
  requestId: any;
  fromWallet: boolean = false;
  calendarDate: any;
  paymentFromDashboard = false;
  hasSetSelectedIndex = false;


  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ){ }

  ngOnInit() {
    this.calendarDate = this.data.calendarDateValue;
    // console.log('this.calendarDate',this.calendarDate)
    // this.roles = this.auth.getRoleOfUser();
    this.paymentRequestForm = this.fb.group({
      type: this.fb.group({
        paymentType: ['', Validators.required],
        dueDate: [this.calendarDate]
      }),
      beneficiaryName: this.fb.group({
        benificiaryId: ['', Validators.required],
        currency: [''],
        senderName: [''],
        benificiaryDate: [''],
        bankDetails: [''],
        firstAmount: [''],
        secondAmount: [''],
        currencySign: ['']
      }),
      futurePayment: this.fb.group({
        amount: ['', Validators.required],
        currency: [''],
        senderName: [''],
        expiryDate: [this.calendarDate, Validators.required],
        beneficiaryId: ['', Validators.required],
        createPaymentResponse: [''],
        strategyId: [''],
        buyCurrency: [''],
        invoiceFileList: [''],
        costType:['']
      }),
      createPayment: this.fb.group({
        amount: ['', Validators.required],
        chargeCurrency: [''],
        costType: ['', this.roles == 2 && this.paymentRequestForm?.value?.type.paymentType != 'planPayment' ? Validators.required : []],
        spotRate: [''],
        currentRate: ['', []],
        expiryDate: ['', this.paymentRequestForm?.value?.type.paymentType == 'planPayment' ? Validators.required : []],
        transferOnly: [''],
        termsCondition: [''],
        requestId: [''],
        subscription: [''],
        userName: [''],
        CurrencyImage: [''],
        isApproved: [false, Validators.required],

      }),
      uploadFile: this.fb.group({
        file: this.fb.array([])
      }),
      OCR_uploadFile: this.fb.group({
        file: this.fb.array([]),
        OCRUploadData: [],
        OCRPdfPreview: []
      }),
      OCR_PreviewData: this.fb.group({
        beneficiaryName: ['', Validators.required],
        CurrencyToBeCharge: ['', Validators.required],
        updateCostType: ['', Validators.required]
        //file: this.fb.array([]),
        //OCRUploadData: [],

      })
    })
    this.paymentRequestForm.valueChanges.subscribe(value => {
      // console.log(value)
    })
    if (this.data.fromWallet == true) {
      this.fromWallet = true;
    }
    if (this.data?.type) {
      this.paymentRequestForm.get('type')?.patchValue({ 'paymentType': 'future_payment' });
    }
    if (this.data?.type == 'upload_file') {
      this.paymentRequestForm.get('type')?.patchValue({ 'paymentType': 'upload_file' });
    }
    this.checkActiveRoute();
  }

  
  ngAfterContentChecked(): void {
    if (this.data?.type && !this.hasSetSelectedIndex) {
      if (this.formStepper) {
        this.formStepper.selectedIndex = 1;
        this.cd.detectChanges();
        this.hasSetSelectedIndex = true;  // Prevent further changes
      }
    }
  }

  onSubmit() {
  }

  paymentMethod(ev: any) {
    // this.ispaymentmanually =  ev.value == 'payment_manually';
  }

  stepChange(stepper: any) {
    this.isLastStep = stepper.selectedIndex == stepper.steps.length - 1;
  }

  addItem(arg: any) {
    if (arg == 'your_own_rate') {
      this.your_own_rate = true;
      this.lock_rate = false
    } else if (arg == 'lock_rate') {
      this.lock_rate = true
      this.your_own_rate = false;
    }
  }

  checkActiveRoute() {
    const currentRoute = this.router.url;
    this.paymentFromDashboard = currentRoute === '/main-dashboard';
  }
}
