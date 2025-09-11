import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, catchError, of } from 'rxjs';
import moment from 'moment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountdownComponent } from 'ngx-countdown';
import { ActiveCurrencyModel } from '../../../../../main-dashboard/models/ActiveCurrencyModel';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { getAllActiveCurrencies } from '../../../../../main-dashboard/dashboard-data/balanceList-data';
import { SignatureComponent } from '../signature/signature.component';
import DateFormat from '../../../../../shared/constants/DateFormat';
import { CommonModule } from '@angular/common';
import { ApprovalProtectiveDialogComponent } from '../approval-protective-dialog/approval-protective-dialog.component';

@Component({
  selector: 'app-send-step5',
  templateUrl: './send-step5.component.html',
  styleUrls: ['./send-step5.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, CountdownComponent]
})
export class SendStep5Component implements OnDestroy {
  @ViewChild('cd') counter!: CountdownComponent;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('createPayment') createPayment: any;
  @Input('currency') currency!: string;
  @Input('benificiaryId') benificiaryId!: string;
  @Input('paymentType') paymentType!: string;
  @Input('futurePayment') futurePayment?: any;
  @Input('activeWalletCurrency') activeWalletCurrency?: any;

  activeCurrency$!: Observable<ActiveCurrencyModel[]>;
  files: File[] = [];
  benificiaryCurrency!: string;
  minDate = new Date();
  readApprove = false;
  ownRateForm!: FormGroup;
  fromCurrencyList: any;
  allCurrencyConvert: any;
  showLoader = false;
  confirmCondition: any;
  config = { leftTime: 0, format: 'mm:ss' };
  futurePaymentStrategyId!: number | null;
  refreshFuturePaymentErr = '';
  dialogOpen = false;
  fPRefreshSubscription!: Subscription;
  userAffiliate: any;

  constructor(
    public dialog: MatDialog,
    private walletService: WalletsService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cd:ChangeDetectorRef,
    public dialogRef: MatDialogRef<SendStep5Component>
  ) { }

  ngOnInit() {
    this.benificiaryCurrency = this.currency;
    this.activeCurrency$ = of(getAllActiveCurrencies)
    this.ownRateForm = this.fb.group({
      'fromCurrency': ['', [Validators.required]],
      'toCurrency': ['', [Validators.required]],
      'sellAmount': ['', [Validators.required]],
      'buyAmount': [''],
      'selectPayment': ['', [Validators.required]]
    })
    this.walletService.getAllBalanceList().subscribe((result: any) => {
      this.fromCurrencyList = result
    });
    this.activeCurrency$.subscribe(res => {
      this.allCurrencyConvert = res;
    })

    this.futurePayment.valueChanges.subscribe((res: any) => {
      this.fPRefreshSubscription?.unsubscribe();
      this.futurePaymentStrategyId = null;
      let optFreeCost = document.querySelector?.('#freeCost') as HTMLInputElement;
      let optWithCost = document.querySelector?.('#wihtCost') as HTMLInputElement;
      if (optFreeCost && optWithCost) {
        optFreeCost.checked = false;
        optWithCost.checked = false;
      }
    })
  }

  nextStep(stepper: any, progress: any) {
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
  }
  previousStep(stepper: any, progress: any) {
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
  }

  stampUpload() {
   
  }

  createPaymentRequest() {
    let body = {
      amount: this.createPayment?.controls?.amount?.value,
      beneficiaryId: this.benificiaryId,
      currency: this.createPayment?.controls?.chargeCurrency?.value
    }

    
  }

  signaturePopup() {
    this.dialog.open(SignatureComponent, {
      width: '882px',
      height: '465px',
      panelClass: 'signature-modal',
      disableClose: true,
    });
  }

  onFileSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onFileChange(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  dateChanged(ev: any) {
    let date = moment(ev.value).format(DateFormat.dateInput);
  }

  lockRatePrevious(stepper: any, progress: any) {
    stepper.selectedIndex = 2;
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
  }

  lockRateComplete(stepper: any, progress: any) {
    this.dialogOpen = true;
    this.dialog.open(ApprovalProtectiveDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'approval-protective-dialog',
      data: {
        strategyId: this.futurePaymentStrategyId,
        beneficiaryName: this.futurePayment.get('beneficiaryId').value.bankAccountHolderName,
        futurePaymentCreateResponse: this.futurePayment.value.createPaymentResponse,
        transaction: this.activeWalletCurrency?.transaction,
        time: (this.counter.left) / 1000
      }
    }).afterClosed().subscribe(result => {
        if (result == 'done') {
          stepper.selectedIndex = 6;
        } else if (result?.leftTime) {
          this.dialogOpen = false;
          this.config = { leftTime: result?.leftTime, format: 'mm:ss' };
        }
    })
  }

  handleEvent(e: any) {
    this.showLoader = false;
    if (e.action == 'done') {
      if (!this.dialogOpen) {
        this.showLoader = true;
        this.futurePaymentRefresh();
      }
    }
  }

  setStrategyId(strategyId: any) {
    this.futurePaymentStrategyId = strategyId;
    this.counter?.restart();
    this.futurePaymentRefresh();
  }

  futurePaymentRefresh() {
    this.ngZone.run(() => {
      this.showLoader = true;
      let params = {
        strategyId: this.futurePaymentStrategyId,
        requestId: this.futurePayment.value.createPaymentResponse.requestId
      };

     
        this.config = { leftTime: 60, format: 'mm:ss' };
      
    });
  }


  getLockRateAmount() {
    let strategy = this.futurePayment.value.createPaymentResponse?.futurePayment.filter((item: any) => this.futurePaymentStrategyId == item.strategyId);
    let amount = strategy[0]?.product?.amount;
    let buyCurrency = strategy[0]?.product?.currency?.wallet_Currency?.code;
    let sellCurrency = strategy[0]?.feeCost;
    console.log('strategy[0]', strategy[0])
    return [amount, buyCurrency, sellCurrency];
  }

  ngOnDestroy(): void {
    this.fPRefreshSubscription?.unsubscribe();
  }
}
