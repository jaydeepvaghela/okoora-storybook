import { Component ,Input , Output,EventEmitter, ChangeDetectorRef, ViewChild} from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';

import { map, Observable, Subscription, timer, tap, of } from 'rxjs';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import ConvertDateFormat from '../../../../shared/constants/ConvertDateFormat';
import { WalletBalanceListModal } from '../../../../main-dashboard/models/WalletBalanceListModal';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { getAllActiveCurrencies } from '../../../../main-dashboard/dashboard-data/balanceList-data';
import DateFormat from '../../../../shared/constants/DateFormat';
import { Direction } from '../../../../main-dashboard/enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-convert-step3',
  templateUrl: './convert-step3.component.html',
  styleUrls: ['./convert-step3.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: ConvertDateFormat },
  ],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatTooltipModule, MatDatepickerModule, MatCheckboxModule]
})
export class ConvertStep3Component {
  @ViewChild('termsCheckbox', { static: false }) termsCheckbox!: MatCheckbox;

  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('yourOwnRate') yourOwnRate?: any;
  @Input('convertMoneyOption') convertMoneyOption?: any;
  @Input('exchange') exchange?: any;
  minDate = new Date().toJSON();
  allCurrencyConvert: any = []
  createFlag!: boolean;
  showLoader = false;
  isSellAmount = true;
  @Input('data') data: any;
  roles: any;
  activeCurrency: any;
  buyAmount = 0;
  sellAmount = 0;
  requestIdValue: any;
  errMsg: any;
  timerSubscription: any;
  currentFXRate!: string;
  currentFromCurrency!: string;
  currentToCurrency!: string;
  buyCurrencyBalance$!: Observable<WalletBalanceListModal>;
  activeCurrencydata: any;
  spotRate: any;
  currencyPair: any;
  direction: any;
  errorMsg:any;
  FinalDirection:any;
  errorMsgShow = false
  highestTargetRate!: number;
  lowestTargetRate!: number;
  targateRateRange!: string;
  validForm = false;
  strongCurrency!: string;
  weakCurrency!: string;
  chargeAmount:any;
  sign:any;
  spot:any
  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
  ) {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toJSON();
   }

  ngOnInit() {
    // this.roles = this.auth.getRoleOfUser();
    this.showLoader = true;
    this._walletService.getAllBalanceList().subscribe((result) => {
      if(result){
        this.showLoader = false;
        this.activeCurrency = result;
      }
    },err => {
      this.showLoader = false;
    });
    this.showLoader = true
    of(getAllActiveCurrencies).subscribe(res => {
      if(res){
        this.showLoader = false;
        this.allCurrencyConvert = res;
      }
    },err => {
      this.showLoader = false;
    })
    this.yourOwnRate?.patchValue({ 'dueDate': this.convertMoneyOption?.value?.dueDate });
    if (this.data?.selectedwalletInfo?.wallet_Currency?.code) {
      this.activeCurrencydata = this.data?.selectedwalletInfo?.wallet_Currency?.code
      this.yourOwnRate.patchValue({ 'fromCurrency': this.data?.selectedwalletInfo?.wallet_Currency?.code });
      this.createConvertRequest(this.data?.selectedwalletInfo?.wallet_Currency?.code);
    }
  }
  checkTermsCheckbox() {
    if (!this.termsCheckbox.checked) {
      this.termsCheckbox.toggle();
    }
  }
  openPrivacyPolicyDialog() {
    this.checkTermsCheckbox();
    // this.dialog.open(PrivacyPolicyComponent, {
    //   width: '90vw',
    //   height: '90vh',
    //   panelClass: 'signature-modal',
    //   maxWidth: '90vw',
    //   disableClose: true,
    // });
  }
  dateChanged(ev: any) {
    let date = moment(ev.value).format(DateFormat.dateInput);
    this.convertMoneyOption.patchValue({ 'dueDate': this.yourOwnRate?.value?.dueDate });
    // this.createTransfer.value['orderDetailes.FlightDate'] = date;
  }

  nextStep(stepper: any, progress: any) {
    if (!this.createFlag || !this.yourOwnRate.value.dueDate || !this.yourOwnRate.value.spotRate || !this.yourOwnRate.value.termsCondition || !this.yourOwnRate.value.transferOnly) {
      return;
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if(this.yourOwnRate?.value?.spotRate && this.spotRate){
      if(this.yourOwnRate?.value?.spotRate > this.spotRate){
        this.FinalDirection = Direction.Up;
      }else if(this.yourOwnRate?.value?.spotRate < this.spotRate){
        this.FinalDirection = Direction.Down;
      }else if(this.yourOwnRate?.value?.spotRate == this.spotRate){
        this.errorMsgShow = true;
      }
    }
    if(this.FinalDirection){
      let data = {
        'buy': this.yourOwnRate.value.toCurrency,
        'sell': this.yourOwnRate.value.fromCurrency,
        'targetRate': this.yourOwnRate.value.spotRate,
        'expiry': moment(this.yourOwnRate.value.dueDate).format(DateFormat.orderFormate),
        'action': 2,
        'pair': this.currencyPair,
        'amount':  this.yourOwnRate.value.buyAmount,
        "boardID": '',
        "exposureID": '',
        "amountCCy": this.yourOwnRate.value.toCurrency,
        "remarks": "",
        "direction": this.FinalDirection,
        "creationSpot": this.spotRate
        // "dueDate": this.convertMoneyOption.value.dueDate
      }
      if (this.requestIdValue && data) {
        this.showLoader = true
        // this._walletService.CreateExposure(data)
        // .subscribe(data=>{
        //   if (data) {
        //     this.showLoader = false;
                this.formStepper.next();
                if(this.formStepperProgress){
                  this.formStepperProgress.value = (this.formStepper?.selectedIndex + 1) * 100 / this.formStepper?.steps?.length;
                }
        //       }
        // },err => {this.errorMsg = err.error.apiErrorMessage
        //   this.showLoader = false;
        // });
        }
    }
  }
  previousStep(stepper: any, progress: any) {
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
  }

  AlertSpotAndRate() {
    // this._walletService.GetPair(this.yourOwnRate.value.toCurrency.toLowerCase(), this.yourOwnRate.value.fromCurrency.toLowerCase()).subscribe((res: any) => {
    //   this.currencyPair = res.pair;
    //   if (this.currencyPair) {
    //     this.strongCurrency = this.currencyPair?.slice(0, 3);
    //     this.weakCurrency = this.currencyPair?.slice(3);
    //     if (this.strongCurrency == this.yourOwnRate.value.fromCurrency) {
    //       this.direction = Direction.Down;
    //     } else if (this.weakCurrency == this.yourOwnRate.value.fromCurrency) {
    //       this.direction = Direction.Up;
    //     }
    //     var pair = {
    //       pair: this.currencyPair,
    //       direction: this.direction
    //     }
    //     this._walletService.AlertSpotAndRate(pair).subscribe((res) => {
    //       if (res) {
            this.spotRate = 7.7808127230000;
            this.highestTargetRate = this.spotRate * 1.05;
            this.lowestTargetRate = this.spotRate * 0.95;
            this.targateRateRange = this.lowestTargetRate.toFixed(4) + '-' + this.highestTargetRate.toFixed(4);
            // this.yourOwnRate.patchValue({ 'spotRate': this.spotRate });
    //       }
    //     })
    //   }
    // })
  }

  changeRate(arg:any){
    // if (arg?.target?.value > this.highestTargetRate || arg?.target?.value < this.lowestTargetRate) {
    //   this.dialog.open(GeneratMsgForBusinessComponent, {
    //     disableClose: false,
    //     panelClass: ['mat-dialog-sm', 'invite-company-modal'],
    //     data: {
    //       title: 'Target rate',
    //       message: `You can enter a value at range of 5% up / down from your platform rate   ${this.lowestTargetRate.toFixed(4)} - ${this.highestTargetRate.toFixed(4)}`,
    //       buttonText: 'ok',
    //     }
    //   });
    //   this.validForm = true
    // } else {
    //   this.validForm = false;
    //   this.changeChargeAmount()
    // }
  }

  changeChargeAmount(){
    if (this.yourOwnRate?.value.spotRate && this.strongCurrency && this.weakCurrency && this.yourOwnRate.value.buyAmount){
      if (this.yourOwnRate?.value.toCurrency == this.strongCurrency) {
        this.chargeAmount = this.yourOwnRate.value.buyAmount * this.yourOwnRate?.value.spotRate;
      } else if (this.yourOwnRate?.value.toCurrency == this.weakCurrency) {
        this.chargeAmount = this.yourOwnRate.value.buyAmount / this.yourOwnRate?.value.spotRate;
      }
      this.yourOwnRate.patchValue({ 'sellAmount': this.chargeAmount.toFixed(2) });
    }
  }

  changeAmount(arg:any){
    this.chargeAmount = arg.target.value;
    this.yourOwnRate.patchValue({ 'sellAmount': this.chargeAmount });
    if (this.yourOwnRate?.value.spotRate && this.strongCurrency && this.weakCurrency && this.yourOwnRate.value.buyAmount){
      if (this.yourOwnRate?.value.toCurrency == this.strongCurrency && this.chargeAmount) {
          this.yourOwnRate.value.buyAmount = this.chargeAmount / this.yourOwnRate?.value.spotRate
      } else if (this.yourOwnRate?.value.toCurrency == this.weakCurrency && this.chargeAmount) {
          this.yourOwnRate.value.buyAmount = this.chargeAmount * this.yourOwnRate?.value.spotRate
      }
      this.yourOwnRate.patchValue({ 'buyAmount': this.yourOwnRate.value.buyAmount.toFixed(2) });
    }
  }

  createConvertRequest(arg: any) {
    this.createFlag = false;
    let sellAmount = null;
    let buyAmount = null;
    var amountIsValid = false;
    if (this.isSellAmount)
    {
       sellAmount = this.yourOwnRate.value.sellAmount;
      //  amountIsValid = sellAmount != null &&  sellAmount.trim() != '' && !isNaN(sellAmount);
    }
    else {
        buyAmount = this.yourOwnRate.value.buyAmount;
        // amountIsValid = buyAmount != null && buyAmount.trim() != '' && !isNaN(buyAmount);
    }

    if (this.yourOwnRate.value.toCurrency && this.yourOwnRate.value.fromCurrency && buyAmount) {
      const params = {
        'Charge.Currency': this.yourOwnRate.value.fromCurrency,
        'Buy.Currency': this.yourOwnRate.value.toCurrency,
        'Buy.Amount': buyAmount,
        'Charge.Amount': sellAmount
      };

      this.showLoader = true;

      // Mock finalQuote (you can tweak logic here to get it from a list or service)
      const finalQuote = '0.5931'; // Example static value

      // Calculate Charge.Amount dynamically
      const chargeAmount = Number((buyAmount / Number(finalQuote)).toFixed(2));

      // Build mock response
      const mockResponse = {
        status: 'Create Request Successfully',
        convertRequest: {
          pair: `${params['Charge.Currency']}${params['Buy.Currency']}`,
          requestId: '15fb8727-48cf-4c6d-b266-22f47832b496',
          buy: {
            currency: params['Buy.Currency'],
            amount: Number(params['Buy.Amount'])
          },
          charge: {
            currency: params['Charge.Currency'],
            amount: chargeAmount
          },
          finalQuote: finalQuote,
          exchangeRate: {
            major: {
              rate: 1.0,
              currency: {
                code: params['Charge.Currency'],
                sign: '$',
                flag: null,
                currencyName: null
              }
            },
            minor: {
              rate: finalQuote,
              currency: {
                code: params['Buy.Currency'],
                sign: '$',
                flag: null,
                currencyName: null
              }
            }
          },
          dealNumber: null
        }
      };

      // Use mock response like original API response
      this.showLoader = false;
      this.errorMsg = '';
      this.requestIdValue = mockResponse.convertRequest.requestId;
      this.createFlag = true;
      delete this.errMsg;

      // Mock subscription logic (if needed)
      if (this.requestIdValue) {
        this.timerSubscription = timer(30000, 30000).pipe(
          map(() => {
            // Mock refresh logic
            console.log('Mock refresh call for', this.requestIdValue);
          })
        ).subscribe();
      }

      this._walletService.setRequestId(this.requestIdValue);
      this.getFXRate(mockResponse.convertRequest.finalQuote);
      this.getWalletBalanceByCurrency(mockResponse.convertRequest.buy.currency);

      // Optionally update form values
      this.yourOwnRate.patchValue({
        buyAmount: mockResponse.convertRequest.buy.amount,
        sellAmount: mockResponse.convertRequest.charge.amount
      });

      // Set sign
      if (this.yourOwnRate.value.toCurrency && this.yourOwnRate.value.fromCurrency && this.yourOwnRate.value.buyAmount) {
        this.sign = this.activeCurrency.find((x: any) =>
          x.wallet_Currency.code === this.yourOwnRate.value.toCurrency)?.wallet_Currency.sign;
        if (this.exchange) {
          this.yourOwnRate.patchValue({ 'toSign': this.sign });
        }
      }
    }

  }

  getFXRate(fxRate: string) {
    this.activeCurrency.filter((value: any) => {
      if (value.wallet_Currency.code == this.yourOwnRate.value.fromCurrency && value.wallet_Currency.code == this.yourOwnRate.value.toCurrency) {
        this.currentFromCurrency = value.wallet_Currency.sign;
        this.currentToCurrency = value.wallet_Currency.sign;
      } else if (value.wallet_Currency.code == this.yourOwnRate.value.fromCurrency) {
        this.currentFromCurrency = value.wallet_Currency.sign;
      } else if (value.wallet_Currency.code == this.yourOwnRate.value.toCurrency) {
        this.currentToCurrency = value.wallet_Currency.sign;
      }
    })
    this.currentFXRate = this.currentFromCurrency + '1 = ' + this.currentToCurrency + parseFloat(fxRate).toFixed(2);
  }

  getWalletBalanceByCurrency(currency: string) {
    // this.buyCurrencyBalance$ = this._walletService.geBalanceByCurrency(currency);
  }

  checkSellAmount() {
    this.isSellAmount = true;
    this.buyAmount = 0;
  }

  checkBuyAmount() {
    this.isSellAmount = false;
    this.sellAmount = 0;
  }

  restrictSpecialCharacters(event: any) {
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    }
    else {
      if (event?.key == "." && this.yourOwnRate.controls.buyAmount.value.includes(".")) {
        event?.preventDefault();
      }
      if (event.ctrlKey && event.key === 'a' || event.ctrlKey && event.key === 'c') {
        return;
      }
      const allowedKeys = /^[0-9.]$/;
      if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
    }
  }
}
