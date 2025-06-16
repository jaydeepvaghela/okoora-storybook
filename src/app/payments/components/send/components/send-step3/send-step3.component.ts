import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, DoCheck } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, combineLatest, debounceTime, filter, of, Subject } from 'rxjs';
import { map, Observable, Subscription, timer } from 'rxjs';
import moment from 'moment';
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

@Component({
  selector: 'app-send-step3',
  templateUrl: './send-step3.component.html',
  styleUrls: ['./send-step3.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatListModule]
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
  @Input('benificiaryId')
  benificiaryId!: string;
  @Input('activeWalletCurrency') activeWalletCurrency: any;
  @Input('paymentType') paymentTypeValue: any;
  @ViewChild('focusInput', { static: false })
  focusInput!: ElementRef;
  @Input('beneficiaryName') beneficiaryName: any;
  @Input('getBeneficiary') getBeneficiary: any;
  @Input('futurePayment') futurePayment?: any;
  @ViewChild('cd')
  counter!: CountdownComponent;
  typeSelect = 'drp-down';
  loading: boolean = false
  isApproved: any;
  private stop$ = new Subject();
  isDestroyed: boolean;
  disableNextButton: boolean = false;
  activeCurrency!: WalletBalanceListModal[];
  files: File[] = [];
  benificiaryCurrency!: string;
  firstDropDown!: string;
  roles: any;
  isForMyself = false;
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
  fileSave: any
  minDate = new Date();
  spotRate: any;
  highestTargetRate!: number;
  lowestTargetRate!: number;
  targateRateRange!: string;
  currencyPairs: any;
  FinalDirection: any;
  paymentRequestId: any;
  updateCostDisabledNext: boolean = true;
  strongCurrency!: string;
  weakCurrency!: string;
  showLoader = false;
  errorMsgShow = false;
  validForm = false;
  spot!: string;
  futurePaymentCurrency: any
  costListUpdate: any = []
  firstAmount: any;
  secondAmount: any;
  focus = true
  apiCallSubscription!: Subscription;
  createFuturePaymentResponse: any;
  createFuturePaymentErr = '';
  buyfuturePaymentCurrency: any;
  showBalanceListLoader = false;
  activeCurrencyData = ''
  futurePaymentStrategyId!: number | null;
  userAffiliate: any;
  config = { leftTime: 0, format: 'mm:ss' };
  transferTypeSelected: boolean = false;
  dialogOpen = false;
  fPRefreshSubscription!: Subscription;
  fpRefreshData: any;

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
    this.benificiaryCurrency = this.currency;
    this.createFuturePaymentErr = '';
  }

  ngOnInit() {
    this.benificiaryCurrency = this.currency;
    this.accountHolderName = this.senderName;
    if (this.benificiaryCurrency) {
      this.showLoader = true;
      // this._walletService
      //   .geBalanceByCurrency(this.benificiaryCurrency)
      //   .subscribe((data) => {
      //     this.showLoader = false
      //     this.createPayment?.get('chargeCurrency')?.setValue(data?.wallet_Currency?.sign); // set currency sign
      //   }, (err) => {
      //     this.showLoader = false
      //   });
    }

    this.showBalanceListLoader = true;
    this._walletService.getAllBalanceList().subscribe((result) => {
      this.showBalanceListLoader = false;
      this.activeCurrency = result;
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
    // this.fPRefreshSubscription = this.walletService.refreshQuote(this.requestID).subscribe((result)=> {
    //     this.config = { leftTime: 60, format: 'mm:ss' };
    //     this.showLoader = false;
    //     this.updateCost = result?.cost ? result?.cost : this.updateCost
    //     this.cd.detectChanges();
    //     this.fpRefreshData = result;
    //   }, err => {
    //     this.showLoader = false;
    //     // this.refreshFuturePaymentErr = err?.error?.apiErrorMessage[0];
    //   })
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
    const currencyPair = (selectedCurrency + benificiaryCurrency).toUpperCase();
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

  // complete(stepper: any, progress: any) {
  //   const options = {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   };
  //   let totalSteps = stepper.steps.length;
  //   let currentStep = stepper.selectedIndex + 1;
  //   progress.value = (currentStep * 100) / totalSteps;
  //   if (this.paymentTypeValue?.paymentType != 'planPayment') {
  //     this.createPayment.value.requestId = this.requestID;
  //     this.createPayment.value.subscription = this.timerSubscription
  //     var user = JSON.parse(localStorage.getItem('user') || '{}');
  //     this.createPayment.value.userName = user.fullName;
  //     this.isDestroyed = false;
  //     this.createPayment.value.CurrencyImage = this.activeCurrency.find(x => x.wallet_Currency.code == this.benificiaryCurrency)?.wallet_Flag
  //     stepper.next();
  //     this.disableNextButton = false
  //   } else {
  //     if (this.createPayment?.value?.spotRate && this.spotRate) {
  //       if (parseFloat(this.createPayment?.value?.spotRate) > parseFloat(this.spotRate)) {
  //         this.FinalDirection = Direction.Up;
  //       } else if (parseFloat(this.createPayment?.value?.spotRate) < parseFloat(this.spotRate)) {
  //         this.FinalDirection = Direction.Down;
  //       } else if (parseFloat(this.createPayment?.value?.spotRate) == parseFloat(this.spotRate)) {
  //         this.errorMsgShow = true;
  //       }
  //     }
  //     if (this.FinalDirection) {
  //       this.showLoader = true
  //       let data = {
  //         'buy': this.benificiaryCurrency,
  //         'sell': !this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData,
  //         'targetRate': this.createPayment?.value?.spotRate,
  //         'expiry': moment(this.createPayment?.value?.expiryDate).format(DateFormat.orderFormate),
  //         'action': 3,
  //         'pair': this.currencyPairs,
  //         'amount': this.createPayment?.controls?.amount?.value,
  //         "boardID": '',
  //         "exposureID": '',
  //         "amountCCy": this.benificiaryCurrency,
  //         "remarks": "",
  //         "direction": this.FinalDirection,
  //         "PaymentRequestId": this.paymentRequestId,
  //         "creationSpot": this.spotRate
  //       }
  //       this.walletService.CreateExposure(data).subscribe(
  //         (data: any) => {
  //           let needStamp = data[0]?.code == 831;
  //           if (needStamp) {
  //             this.stampUpload();
  //           }
  //           this.showLoader = false
  //           this.refreshTokenFlag = false
  //           this.paymentRequestAPIError = '';
  //           if (data?.status) {
  //             stepper.next();
  //             this.validatedCompletePayment = true;
  //           } else {
  //             this.validatedCompletePayment = false;
  //           }
  //           // this.refreshQuoteAPI.unsubscribe();
  //           // this.refreshInterval.unsubscribe();
  //           this.timerSubscription.unsubscribe()
  //         },
  //         (err) => {
  //           this.showLoader = false
  //           this.paymentRequestAPIError = err?.error?.apiErrorMessage[0] ?? '';
  //           if (this.availableBlance == 0 || this.paymentRequestAPIError == 'Missing Funds') {
  //             this.paymentRequestAPIError = "You don't have enough money in your account";
  //           }
  //         }
  //       );
  //     } else {
  //       this.showLoader = false;
  //     }
  //   }
  // }

  nextStep(stepper: any, progress: any) {
    this.disableNextButton = true
    this.showLoader = false;
    this.isDestroyed = true;
    this.dialogOpen = true;
    if (this.type.get('paymentType').value === 'future_payment' && this.userAffiliate?.afiiliate.currency === 'EUR') {
      // const dialogRef = this.dialog.open(ApprovalProtectiveDialogComponent, {
      //   width: '600px',
      //   disableClose: true,
      //   panelClass: 'approval-protective-dialog',
      //   data: {
      //     // strategyId: this.futurePaymentStrategyId,
      //     beneficiaryName: this.futurePayment.get('beneficiaryId').value.bankAccountHolderName,
      //     futurePaymentCreateResponse: this.futurePayment.value.createPaymentResponse,
      //     updatedCost: this.updateCost,
      //     transaction: this.activeWalletCurrency?.transaction,
      //     time: (this.counter.left) / 1000,
      //     fpRefreshData: this.fpRefreshData
      //   }
      // }).afterClosed().subscribe(result => {
      //   if (this.userAffiliate.afiiliate.currency === 'EUR') {
      //     if (result == 'done') {
      //       stepper.selectedIndex = 6;
      //     } else if (result?.leftTime) {
      //       this.dialogOpen = false;
      //       this.config = { leftTime: result?.leftTime, format: 'mm:ss' };
      //     }
      //   }
      // })
    }
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

      // if (this.needSign || (this.needFile && this.uploadFileDone)) {
      //   // this.walletService
      //   //   .uploadPaymentFile(this.requestID, this.fileSave.body?.fileType, this.fileSave.formData)
      //   //   .subscribe((response) => {
      //   //     this.showLoader = false
      //   //     this.complete(stepper, progress)
      //   //     this.uploadSignaureError = false;
      //   //   },
      //   //     (err) => {
      //   //       // console.error({ err })
      //   //       this.showLoader = false
      //   //     });
      // }
      // else {
      //   this.complete(stepper, progress)
      // }
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
    this.focus = false;
    this.showLoader = true;
    const body = {
      amount: this.createPayment?.controls?.amount?.value,
      beneficiaryId: this.benificiaryId,
      currency: !this.activeWalletCurrency?.payment ? this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code : this.activeCurrencyData,

    };
    this.paymentRequestAPIError = '';
    // if (body && body?.amount && body?.currency) {
    //   this.spinner = true;
    //   this.walletService.createPaymentRequest(body).subscribe(
    //     (data: any) => {
    //       this.showLoader = false;
    //       this.disableNextButton = false;
    //       this.createPaymentAPIError = '';
    //       this.requestID = data?.requestId;
    //       this.needFile = data?.signAndFiles?.needFile;
    //       this.needSign = data?.signAndFiles?.needSign;
    //       this.needStamp = data?.signAndFiles?.needStamp;
    //       this.ourCost = data?.costList[1]?.value;
    //       this.beneficiaryName.secondAmount = data?.paymentRequst?.spot;
    //       if (this.needStamp) {
    //         this.stampUpload();
    //       }
    //       if (this.paymentTypeValue?.paymentType != 'planPayment') {
    //         this.chargeAmount = data?.paymentRequst?.charge;
    //       }

    //       this.costList = data?.costList;
    //       if (this.costList) {
    //         this.createPayment.patchValue({ 'costType': false });
    //         if (this.costList.length == 1) {
    //           this.createPayment.get('costType').disable();
    //         }
    //         this.changeCostType(this.createPayment?.value?.costType, this.requestID)
    //         this.costList.forEach(element => {
    //           this.costListUpdate.push(element.key.slice(4))
    //         });
    //       }
    //       this.fileType = data?.signAndFiles?.fileType;
    //       this.fxRate = data?.paymentRequst?.spot;
    //       this.paymentRequestId = data?.requestId
    //       this.getFXRate(this.fxRate);

    //       this.paymentType = data?.paymentRequst?.paymentType;
    //       if (body && body?.amount && body?.currency) {
    //         this.spinner = false;
    //       }
    //       if (data) {
    //         this.getBalanceByCurrency(body?.currency);
    //       }
    //       if (this?.paymentType == 1 && this.paymentTypeValue?.paymentType != 'planPayment') {
    //         if (this.requestID && this.refreshTokenFlag) {
    //           // Set a flag to prevent the second call to refresh()
    //           this.refreshTokenFlag = false;
    //           this.timerSubscription = timer(15000, 15000)
    //             .pipe(
    //               map(() => {
    //                 if (!this.isDestroyed) {
    //                   this.disableNextButton = true;
    //                 }
    //               })
    //             )
    //             .subscribe();

    //         }

    //       }
    //       if (this.createPayment?.value?.costType) {
    //         this.changeCostType(this.createPayment?.value?.costType, this.requestID)
    //       }

    //     },
    //     (err) => {
    //       this.disableNextButton = false;
    //       this.showLoader = false;
    //       this.createPaymentAPIError = err?.error?.apiErrorMessage[0] ?? '';
    //       this.spinner = false;
    //     }
    //   );


    // } 
    // else {
    //   this.showLoader = false
    // }
  }

  changeCostType(ev: any, requestID: any, typeSelect?: any) {
    // console.log("typeSelect", typeSelect);
    this.showLoader = true;
    // this.refreshTokenFlag = false;
    this.updateCostDisabledNext = true;
    this.transferTypeSelected = false;
    this.fPRefreshSubscription?.unsubscribe();
    if (typeSelect == 'DRP-DOWN') {

      if (ev == '1 - regular' && ev.indexOf('1') !== -1) {
        ev = this.costList[0]?.key.substring(0, 1);
      } else {
        ev = this.costList[1]?.key.substring(0, 1);
      }

      // console.log("ev", ev);
    } else {
      if (ev?.checked == true) {
        ev = this.costList[1]?.key.substring(0, 1);
      } else {
        ev = this.costList[0]?.key.substring(0, 1);
      }
    }

    let body = {
      requestId: '781a2f8f-d33c-434d-9140-5d0b1ec7e535',
      costType: 1,
    };

    this.showLoader = true;

    // Simulated response object
    const data = {
      requestId: '781a2f8f-d33c-434d-9140-5d0b1ec7e535',
      status: true,
      message: 'Update Cost Type Successfully',
      costType: {
        key: '1',
        value: 5.0000
      }
    };

    // Simulate the success handler
    this.showLoader = false;
    this.costTypeAPIError = '';

    if (ev?.checked === true) {
      this.ourCost = data.costType.value;
    }

    this.updateCost = data.costType.value;
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
    // this._walletService
    //   .geBalanceByCurrency(currency)
    //   .subscribe((data) => {
    //     this.showLoader = false
    //     this.availableBlance = data?.wallet_Amount;
    //     this.currencySign = data?.wallet_Currency?.sign;
    //   }, (err) => {
    //     this.showLoader = false
    //   });
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
