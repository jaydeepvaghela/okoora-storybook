import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, debounceTime, filter, Subject } from 'rxjs';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { WalletBalanceListModal } from '../../../../../main-dashboard/models/WalletBalanceListModal';
import { CostListModel } from '../../../../models/CostListModel';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { Direction } from '../../../../../main-dashboard/enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { InvoiceFuturePayment } from '../invoice-future-payment/invoice-future-payment.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-send-step3',
  templateUrl: './send-step3.component.html',
  styleUrls: ['./send-step3.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatListModule, MatTooltipModule]
})
export class SendStep3Component implements AfterViewInit {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('createPayment') createPayment: any;
  @Input('senderName')
  senderName!: string;
  @Input('type') type?: any;
  @Output() newItemEvent: EventEmitter<string> = new EventEmitter();
  @Input('currency')
  currency!: string;
  @Input('benificiaryId') benificiaryId!: string;
  @Input('activeWalletCurrency') activeWalletCurrency: any;
  @Input('paymentType') paymentTypeValue: any;
  @ViewChild('focusInput', { static: false }) focusInput!: ElementRef;
  @Input('beneficiaryName') beneficiaryName: any;
  @Input('getBeneficiary') getBeneficiary: any;
  @Input('futurePayment') futurePayment?: any;
  @ViewChild('cd') counter!: CountdownComponent;
  typeSelect = 'drp-down';
  isApproved: any;
  private stop$ = new Subject();
  isDestroyed: boolean;
  disableNextButton: boolean = false;
  activeCurrency!: WalletBalanceListModal[];
  files: File[] = [];
  benificiaryCurrency!: string;
  isForSomeOneElse = false;
  chargeAmount: any = 0;
  spinner!: boolean;
  costList!: CostListModel[];
  needFile!: boolean;
  needSign!: boolean;
  needStamp!: boolean;
  requestID!: string;
  fileType!: string;
  accountHolderName!: string;
  subscription!: Subscription;
  fxRate: any = null;
  availableBlance = 0;
  currencySign!: string;
  paymentType!: number;
  refreshQuoteAPI!: Subscription;
  updateCost = 0;
  ourCost = 0;
  costTypeMessage: boolean = true;
  uploadFileDone: boolean = false;
  uploadSignaureError: boolean = true;
  uploadFileError: boolean = true;
  uploadAPIError = '';
  paymentRequestAPIError = '';
  createPaymentAPIError = '';
  costTypeAPIError = '';
  refreshAPIError = '';
  AlertSpotAndRateError = '';
  currentFXRate!: string;
  currentFromCurrency!: string;
  currentToCurrency!: string;
  buyCurrencyBalance$!: Observable<WalletBalanceListModal>;
  refreshInterval: any;
  validatedCompletePayment!: boolean;
  duplicateCurrency: boolean = false;
  signaturePad!: string;
  timerSubscription: any;
  refreshTokenFlag: boolean = true;
  minDate = new Date();
  spotRate: any;
  highestTargetRate!: number;
  lowestTargetRate!: number;
  targateRateRange!: string;
  currencyPairs: any;
  updateCostDisabledNext: boolean = true;
  strongCurrency!: string;
  weakCurrency!: string;
  showLoader = false;
  validForm = false;
  spot!: string;
  futurePaymentCurrency: any
  costListUpdate: any = []
  focus = true
  apiCallSubscription!: Subscription;
  createFuturePaymentResponse: any;
  createFuturePaymentErr = '';
  buyfuturePaymentCurrency: any;
  showBalanceListLoader = false;
  activeCurrencyData = ''
  config = { leftTime: 0, format: 'mm:ss' };
  transferTypeSelected: boolean = false;
  dialogOpen = false;
  fPRefreshSubscription!: Subscription;
  costType!: any;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private walletService: WalletsService,
    private _walletService: WalletsService,
    private router: Router,
    public dialogRef: MatDialogRef<SendStep3Component>,
  ) {
    this.isDestroyed = false;
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
  }

  ngOnChanges() {
    this.benificiaryCurrency = this.beneficiaryName.bankDetails.currency;
    console.log('this.benificiaryCurrency', this.benificiaryCurrency)
    this.createFuturePaymentErr = '';
  }

  ngOnInit() {
    console.log('beneficiaryName.', this.beneficiaryName)

    this.benificiaryCurrency = this.beneficiaryName.bankDetails.currency;
    // this.benificiaryCurrency = this.currency;
    if (!this.currency) {
      this.currency = this.benificiaryCurrency;
    }
    this.accountHolderName = this.senderName;
    if (this.benificiaryCurrency) {
      this.showLoader = true;
    }

    this.showBalanceListLoader = true;
    this._walletService.getAllBalanceList().subscribe((result) => {
      this.showBalanceListLoader = false;
      this.activeCurrency = result;
      console.log('activeCurrencyactiveCurrency', this.activeCurrency)
    }, (err) => {
      this.showBalanceListLoader = false
    });
    if (!this.activeWalletCurrency?.payment) {
      if (this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code == this.benificiaryCurrency) {
        this.duplicateCurrency = true;
      }
      let selectedCurrency = this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code
      if (this.paymentTypeValue?.paymentType == 'planPayment') {
        this.createPayment.get('spotRate').setValidators(Validators.required)
        this.getPairWithRate(this.benificiaryCurrency, selectedCurrency);
        this.currentFromCurrency = '';
        this.getBalanceByCurrency(this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code)
      } else {
        this.createPaymentRequest();
      }
      this.walletService.getApiObs().subscribe(profile => {
        if (profile == 'amount') {
          this.createPaymentRequest();
          this.getPairWithRate(this.benificiaryCurrency, selectedCurrency);
          // setTimeout(() => {
          //   // this.vc?.format(this.createPayment?.controls?.amount?.value)
          // }, 1000);
        } else if (profile == 'amountdata') {
          this.targetRateRange();
          // setTimeout(() => {
          //   // this.vc?.format(this.createPayment?.controls?.amount?.value)
          // }, 1000);
        }
      });
    }

    if (this.activeWalletCurrency?.payment) {
      this.currentFromCurrency = '';
      this.getCurrency()
    }


    const combinedChanges$ = combineLatest([
      this.futurePayment?.get('amount').valueChanges,
      this.futurePayment?.get('currency').valueChanges,

    ]);


    this.apiCallSubscription = combinedChanges$
      .pipe(
        debounceTime(300),
        filter(([amount, currency]: any) => !!amount && !!currency)
      )
      .subscribe(([amount, currency]) => {
        this.createFuturePayment();
      });
  }

  getCurrency() {
    this.activeCurrency?.filter((value) => {
      if (
        value.wallet_Currency.code == this.currency &&
        value.wallet_Currency.code == (!this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData)
      ) {
        this.currentToCurrency = value.wallet_Currency.sign;
        this.currentFromCurrency = value.wallet_Currency.sign;
      } else if (value.wallet_Currency.code == this.currency) {
        this.currentFromCurrency = value.wallet_Currency.sign;
      } else if (
        value.wallet_Currency.code == (!this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData)
      ) {
        this.currentToCurrency = value.wallet_Currency.sign;
      }
    });
  }

  handleEvent(e: any) {
    this.showLoader = false;
    // console.log('eventtime',e);
    if (e.action == 'done') {
      if (!this.dialogOpen) {
        this.futurePaymentRefresh();
      }
    }
  }

  futurePaymentRefresh() {
    this.showLoader = true;
  }

  createFuturePayment() {
    this.showLoader = true;
    this.createFuturePaymentErr = '';
    this.updateCostDisabledNext = true;
    const payload = this.futurePayment.value;
    const simulatedResponse = {
      message: "Create Future Payment Request Successfully",
      requestId: crypto.randomUUID(),
      costList: [
        { key: "1 - regular", value: 7.68 },
        { key: "2 - our", value: 15.36 }
      ],
      futurePayment: [
        {
          strategyId: 134070,
          product: {
            amount: payload.amount,
            currency: payload.currency,
            expiryDate: this.formatDate(payload.expiryDate),
            beneficiaryId: payload.beneficiaryId
          },
          catalogDetails: {
            catalogNumber: 101,
            catalogName: "LOCK & DOWN",
            catalogDetails: "קיבוע שער למועד עתידי, הגנה מלאה בכיוון החשיפה",
            catalogDetailsProfit: "רווח בלתי מוגבל אם שע\"ח במועד סיום העסקה נמוך משער ההגנה",
            catalogDetailsLoss: "הפסד בלתי מוגבל אם שע\"ח ביום סיום העסקה גבוה משער ההגנה"
          },
          cost: "0.00 ILS",
          feeCost: " ILS",
          sellAmount: "73.31 ILS",
          strike: 2.2909
        },
        {
          strategyId: 134071,
          product: {
            amount: payload.amount,
            currency: payload.currency,
            expiryDate: this.formatDate(payload.expiryDate),
            beneficiaryId: payload.beneficiaryId
          },
          catalogDetails: {
            catalogNumber: 103,
            catalogName: "SAFE DOWN",
            catalogDetails: "ביטוח שער מלא, הגנה מלאה בכיוון החשיפה",
            catalogDetailsProfit: "רווח בלתי מוגבל אם שע\"ח במועד סיום העסקה נמוך משער ההגנה",
            catalogDetailsLoss: "ללא סיכון. לא ניתן להפסיד מהמוצר. במידה ושע\"ח עולה, אין כל התחייבות וניתן למכור בשער השוק."
          },
          cost: "0.30 ILS",
          feeCost: " ILS",
          sellAmount: "73.31 ILS",
          strike: 2.2909
        }
      ]
    };

    // Assign response and update UI
    this.createFuturePaymentResponse = simulatedResponse;
    this.costList = simulatedResponse.costList;
    this.requestID = simulatedResponse.requestId;
    this.futurePayment.patchValue({ createPaymentResponse: simulatedResponse });
    this.updateCost = 0;
    this.showLoader = false;
  }

  formatDate(dateInput: string | Date): string {
    let date: Date;

    if (typeof dateInput === 'string') {
      // Assume it's in a parseable format (e.g. ISO, or DD/MM/YYYY if using custom logic)
      const parts = dateInput.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${day}-${month}-${year}`;
      }

      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      throw new Error('Invalid date input');
    }

    // Format to DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }


  onCurrencySelectionFuturePaymentChange() {
    this.futurePaymentCurrency = this.futurePayment.get('currency').value;
  }

  onCurrencySelectionWithoutBenificiary() {
    this.buyfuturePaymentCurrency = this.futurePayment.get('buyCurrency').value;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.focusInput?.nativeElement.focus();
    }, 100);
  }

  onFocus() {
    this.focus = true
  }

  getPairWithRate(benificiaryCurrency: any, selectedCurrency: any) {
    this.showLoader = true;

    // Generate the currency pair locally
    const currencyPair = (`${selectedCurrency || ''}${benificiaryCurrency || ''}`).toUpperCase();

    this.currencyPairs = currencyPair;

    if (currencyPair) {
      let direction;
      this.strongCurrency = currencyPair.slice(0, 3);
      this.weakCurrency = currencyPair.slice(3);

      // Determine direction based on which currency is the beneficiary
      if (this.strongCurrency === benificiaryCurrency.toUpperCase()) {
        direction = Direction.Up;
      } else if (this.weakCurrency === benificiaryCurrency.toUpperCase()) {
        direction = Direction.Down;
      }

      this.showLoader = false;
      this.AlertSpotAndRateError = '';
      this.spotRate = 2.29677600000?.toFixed(4);

      if (this.activeWalletCurrency?.payment) {
        this.createPayment.patchValue({
          currentRate: this.spotRate
        });
      }
      this.targetRateRange();

    } else {
      this.showLoader = false;
    }
  }

  targetRateRange() {
    this.highestTargetRate = this.createPayment?.value?.currentRate * 1.05;
    this.lowestTargetRate = this.createPayment?.value?.currentRate * 0.95;
    this.targateRateRange = this.lowestTargetRate?.toFixed(4) + '-' + this.highestTargetRate?.toFixed(4)
  }

  nextStep(stepper: any, progress: any) {
    this.disableNextButton = true
    this.showLoader = false;
    this.isDestroyed = true;
    this.dialogOpen = true;
    if (this.type.get('paymentType').value === 'future_payment') {
      const dialogRef = this.dialog.open(InvoiceFuturePayment, {
        width: '600px',
        maxWidth: '1095px',
        disableClose: true,
        panelClass: 'user-preference'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          stepper.next()
        } else if (result === 'no') {
          stepper.selectedIndex = 4;
        }
      });
      return;
    }

    if (this.requestID) {
      this.stop$.complete();
    }
    this.showLoader = false;
  }

  previousStep(stepper: any, progress: any) {
    this.clearInputs();
    this.futurePayment.reset();
    if (stepper.selectedIndex > 0) {
      stepper.selectedIndex -= 1;
    }
    const totalSteps = stepper.steps.length;
    const currentStep = stepper.selectedIndex;
    progress.value = (currentStep * 100) / totalSteps;
  }

  clearInputs() {
    this.futurePayment.get('beneficiaryId').value = '';
    this.futurePayment.get('expiryDate').value = '';
    this.currentFromCurrency = '';
    this.chargeAmount = 0;
    this.costListUpdate = [];
    this.availableBlance = 0;
    this.refreshTokenFlag = true
    this.timerSubscription?.unsubscribe();
    this.createPayment?.get('isApproved').setValue(false);
    this.createPayment?.get('amount').setValue(0);
    this.createPayment.get('expiryDate').setValue('')
    this.onFocus();
    this.files = [];
    this.signaturePad = '';
    this.needFile = false;
    this.needSign = false;
    this.uploadSignaureError = true;
    this.uploadFileError = true;
    this.uploadFileDone = false;
    this.createFuturePaymentResponse = null;
    this.updateCostDisabledNext = true;
  }

  stampUpload() {
  }

  createPaymentRequest() {
    this.focus = false;
    this.showLoader = true;
    const body = {
      amount: this.createPayment?.controls?.amount?.value,
      beneficiaryId: this.benificiaryId,
      currency: !this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData,

    };
    this.paymentRequestAPIError = '';
  }

  changeCostType(ev: any, requestID: any, typeSelect?: any) {
    this.showLoader = true;
    this.updateCostDisabledNext = true;
    this.transferTypeSelected = false;
    this.fPRefreshSubscription?.unsubscribe();

    if (typeSelect === 'DRP-DOWN') {
      const selectedItem = this.costList.find(item => item.key === ev);
      if (selectedItem) {
        this.costType = parseInt(selectedItem.key.split('-')[0].trim(), 10);
      } else {
        console.warn('Selected dropdown value not found in costList');
        this.costType = null;
      }
    } else {
      if (ev?.checked === true) {
        const selectedItem = this.costList[1]; // assuming second item = checked
        this.costType = parseInt(selectedItem.key.split('-')[0].trim(), 10);
      } else {
        const selectedItem = this.costList[0]; // default
        this.costType = parseInt(selectedItem.key.split('-')[0].trim(), 10);
      }
    }

    const body = {
      requestId: requestID,
      costType: this.costType,
    };

    // Simulate API response
    const selectedCostItem = this.costList.find(item => parseInt(item.key.split('-')[0].trim(), 10) === this.costType);

    const data = {
      requestId: requestID,
      status: true,
      message: 'Update Cost Type Successfully',
      costType: {
        key: this.costType,
        value: selectedCostItem?.value || ''
      }
    };

    this.showLoader = false;
    this.costTypeAPIError = '';

    if (ev?.checked === true) {
      this.ourCost = Number(data.costType.value);
    }

    this.updateCost = Number(data.costType.value);
    this.costTypeMessage = false;
    this.updateCostDisabledNext = false;
    this.transferTypeSelected = true;
    this.config.leftTime = 0;
  }

  getFXRate(fxRate: string) {
    this.activeCurrency?.filter((value) => {
      if (
        value.wallet_Currency.code == this.currency &&
        value.wallet_Currency.code == (!this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData)
      ) {
        this.currentToCurrency = value.wallet_Currency.sign;
        this.currentFromCurrency = value.wallet_Currency.sign;
      } else if (value.wallet_Currency.code == this.currency) {
        this.currentFromCurrency = value.wallet_Currency.sign;
      } else if (
        value.wallet_Currency.code == (!this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData)
      ) {
        this.currentToCurrency = value.wallet_Currency.sign;
      }
    });
    if (fxRate) {
      // console.log(fxRate)
      this.currentFXRate =
        this.currentFromCurrency +
        '1 = ' +
        this.currentToCurrency +
        parseFloat(fxRate).toFixed(4);
      this.spot = parseFloat(fxRate).toFixed(4);

    }
    else {
      this.currentFXRate = this.currentFromCurrency + '1 = ' + this.currentToCurrency + '1';
      this.spot =
        '1'
    }
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

  onEnterInputValue(event: any): void {
    const invalidChars = ['<', '>', ';', '=', '+'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
    if ((event.metaKey || event.ctrlKey) && (event.key === 'x' || event.key === 'c' || event.key === 'v')) {
      event.preventDefault()
    }
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    }
  }

  getBalanceByCurrency(currency: string) {
    this.showLoader = true
  }

  ngOnDestroy(): void {
    if (this.apiCallSubscription) {
      this.apiCallSubscription.unsubscribe();
    }
    // this.stop$.next();
    this.stop$.complete();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
