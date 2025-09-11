import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExchangeMainComponent } from '../exchange-main/exchange-main.component';
import { forkJoin, interval, of, Subscription, tap } from 'rxjs';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { balanceList, getAllActiveCurrencies } from '../../../../main-dashboard/dashboard-data/balanceList-data';
import { PlanConversionComponent } from '../../exchange-later-components/plan-conversion/plan-conversion.component';

@Component({
  selector: 'app-exchange-new-step1',
  templateUrl: './exchange-new-step1.component.html',
  styleUrls: ['./exchange-new-step1.component.scss'],
  imports: [CommonModule, MatMenuModule, MatSelectModule, ReactiveFormsModule, FormsModule]
})
export class ExchangeNewStep1Component {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('dashboardData') dashboardData?: any;
  @Output() exchangeFormDetails = new EventEmitter<any>();
  @Output() createdConvertDataDetails = new EventEmitter<any>();
  @Output() timerSubscriptionForComplete = new EventEmitter<any>();
  @Output() timerSubscriptionWithTimerdata = new EventEmitter<any>();
  activeCurrencyList: any;
  params!: { 'Charge.Currency': any; 'Buy.Currency': any; 'Buy.Amount': any; 'Charge.Amount': any; };
  getFirstSelectedCurrencyDetails: any;
  getSecondSelectedCurrencyDetails: any;
  firstActiveFilteredCurrency: any;
  secondActiveFilteredCurrency: any;
  exchangeForm!: FormGroup;
  walletList: any;
  balanceListData: any;
  filteredBalanceForFirstCurrency: any;
  selectedCurrencyAmount: any;
  filteredBalanceForSecondCurrency: any;
  totalFirstCurrency: any;
  totalSecondCurrency: any;
  isSwapped: boolean = false;
  createdConvertData: any;
  chargedAmount: any;
  createdSpotRate: any;
  afterExchangeRate!: number;
  refreshedPaymentAPIError: any;
  checkWalletBalanceError: any;
  createdMajorRate: any;
  timerSubscription: any;
  createPaymentAPIError: any;
  defaultCurrencyCode: string = 'USD';
  firstSign: any;
  firstDefaultSign: any;
  secondDefaultSign: any;
  secondSign: any;
  minorSpotCurrencySign: any;
  majorSpotCurrencySign: any;
  showLoader = false;
  isFirstInputFocused: boolean = false;
  isSecondInputFocused: boolean = false;
  isCurrencySignFocused: boolean = false;
  currentCurrencyValue: any

  isExchangeBtnDisabled = true;
  isFormChanged = false;
  isExchangeInProgress = false;
  affiliateCountry!: string;
  callConvertRequestApi = false;

  radius = 10; // Small circle to match your icon size
  circumference = 2 * Math.PI * this.radius;
  currentNumber = 15;
  progress = 0;
  sub!: Subscription;
  activeWalletCurr: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ExchangeNewStep1Component>,
    private fb: FormBuilder,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
  ) {
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  @HostListener('document:copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }
  @HostListener('document:cut', ['$event'])
  onCut(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.setActiveWalletData();
    this.exchangeForm = this.fb.group({
      firstExchangeCurrency: new FormControl('USD', [Validators.required]),
      firstExchangeAmount: new FormControl('', [Validators.required]),
      firstSelectedCurrency: new FormControl('', [Validators.required]),
      firstChargeCurrencyAmount: new FormControl(''),
      secondExchangeCurrency: new FormControl('', [Validators.required]),
      secondExchangeAmount: new FormControl('', [Validators.required]),
      secondSelectedCurrency: new FormControl('', [Validators.required]),
      secondChargeCurrencyAmount: new FormControl(''),
      firstExchangeSign: new FormControl(''),
      secondExchangeSign: new FormControl(''),
      buy: new FormControl(false)
    });
    this.exchangeForm.valueChanges.subscribe(() => {
      this.isFormChanged = true;
      this.createPaymentAPIError = false;
    });
    this.getAllData();
  }

  setActiveWalletData() {
    this._walletService.getAllBalanceList().pipe(
      tap(result => {
        this.activeWalletCurr = result[0];
      })
    ).subscribe();
    this._walletService.setCurrentCurrencyData(this.activeWalletCurr)
  }

  startRepeatingTimer() {
    this.currentNumber = 15;
    this.progress = 0;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.currentNumber = this.currentNumber > 0 ? this.currentNumber - 1 : 15;
      this.progress = this.circumference * (1 - this.currentNumber / 15);
      const timerObject = {
        'circumference': this.circumference,
        'currentNumber': this.currentNumber,
        'progress': this.progress
      }
      this.timerSubscriptionWithTimerdata.emit(timerObject);
      if (this.currentNumber === 0) {
        this.callRefreshConvertRequestAPI();
      }
    });
  }

  callRefreshConvertRequestAPI() {
    this.showLoader = true;
  }

  get shouldShowCircleTimer(): boolean {
    const exchangeFormValues = this.exchangeForm?.value;
    return (
      (exchangeFormValues?.firstExchangeCurrency == '' ||
        exchangeFormValues?.secondExchangeCurrency == '' ||
        exchangeFormValues?.firstExchangeAmount == '' ||
        exchangeFormValues?.secondExchangeAmount == '' ||
        this.checkWalletBalanceError || this.createPaymentAPIError ||
        this.refreshedPaymentAPIError)
    )
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('firstExchangeAmountInput')?.focus();
    }, 1000);
  }

  handleEvent(e: any) {
    this.showLoader = false;
    if (e.action == 'done') {
      this.CurrentRateValue(!this.isSwapped ? this.exchangeForm?.value?.secondExchangeCurrency : this.exchangeForm?.value?.firstExchangeCurrency, !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency)
    }
  }

  getAllData() {
    forkJoin({
      activeCurrencies: of(getAllActiveCurrencies),
      balanceList: of(balanceList),
    }).subscribe({
      next: ({ activeCurrencies, balanceList }) => {
        this.activeCurrencyList = activeCurrencies;
        this.firstActiveFilteredCurrency = balanceList;
        this.secondActiveFilteredCurrency = balanceList;

        this.balanceListData = balanceList;
        if (this.dashboardData?.fromDashboadConvert) {
          this.getDefaultCurrencyTotal(this.dashboardData?.selectedwalletInfo?.wallet_Currency?.code);
        } else {
          this.getDefaultCurrencyTotal(this.defaultCurrencyCode);
        }

        const defaultFirstCurrency = this.balanceListData?.find((item: any) =>
          item.wallet_Currency?.code === 'USD'
        );
        if (defaultFirstCurrency) {
          this.getFirstSelectedCurrencyDetails = defaultFirstCurrency;
        }

        this._walletService.getCurrentWallet.subscribe({
          next: (wallet) => {
            if (this.dashboardData?.fromDashboadConvert) {
              if (this.dashboardData?.selectedType == 'sell') {
                this.exchangeForm.patchValue({
                  firstExchangeCurrency: this.dashboardData?.selectedwalletInfo?.wallet_Currency?.code || '',
                });
                this.exchangeForm.patchValue({
                  secondExchangeCurrency: this.dashboardData?.selectedwalletInfo?.wallet_Hedging?.exposureBaseCurrency || '',
                });
              }
              if (this.dashboardData?.selectedType == 'buy') {
                this.isSwapped = true;
                this.exchangeForm.patchValue({ buy: this.isSwapped })
                this.exchangeForm.patchValue({
                  firstExchangeCurrency: this.dashboardData?.selectedwalletInfo?.wallet_Currency?.code || '',
                });
                this.exchangeForm.patchValue({
                  secondExchangeCurrency: this.dashboardData?.selectedwalletInfo?.wallet_Hedging?.exposureBaseCurrency || '',
                });
              }
              this.getSecondDefaultCurrency(this.dashboardData?.selectedwalletInfo?.wallet_Hedging?.exposureBaseCurrency);
            } else {
              if (this.defaultCurrencyCode === wallet?.wallet_Currency?.code) {
                let filterData = this.balanceListData.find((x: any) => x.wallet_Currency?.code != 'USD' && x.wallet_Currency?.code == 'EUR')
                filterData ? filterData : filterData = this.balanceListData.find((x: any) => x.wallet_Currency?.code != 'USD')
                if (filterData) {
                  this.exchangeForm.patchValue({
                    firstExchangeCurrency: filterData?.wallet_Currency?.code || '',
                  });
                  this.getDefaultCurrencyTotal(filterData?.wallet_Currency?.code);
                }
              }
              this.exchangeForm.patchValue({
                secondExchangeCurrency: wallet?.wallet_Currency?.code || '',
              });
              this.getSecondDefaultCurrency(wallet?.wallet_Currency?.code);
            }
            this.showLoader = false;
            this.cd?.detectChanges();
          },
          error: (walletError) => {
            this.showLoader = false;
            console.error('Error fetching current wallet:', walletError);
          }
        });
        this.CurrentRateValue(!this.isSwapped ? this.exchangeForm?.value?.secondExchangeCurrency : this.exchangeForm?.value?.firstExchangeCurrency, !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency);
      },
      error: (error) => {
        this.showLoader = false;
        console.error('Error fetching data:', error);
      }
    });
  }

  CurrentRateValue(buyValue: any, sellValue: any) {
    if (buyValue && sellValue) {
    }
  }

  validateAmount(event: any): void {
    const input = event.target.value
    const decimalPart = input.split('.')[1];
    if (decimalPart && decimalPart.length >= 2) {
      event.preventDefault();
    }
  }

  nextStep(stepper: any, progress: any) {
    stepper.next();
    if (this.formStepper) {
      let totalSteps = stepper.steps.length;
      let currentStep = stepper.selectedIndex + 1;
      progress.value = (currentStep * 100) / totalSteps;
      const scrollToTopNext = document.querySelector<HTMLElement>('mat-dialog-content');
      if (scrollToTopNext) {
        scrollToTopNext.scrollTop = 0;
      }
    }
  }

  restrictZero(event: any, controlName: any) {
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    }
    else {
      if (event?.key == "." && this.exchangeForm.value?.[controlName].includes(".")) {
        event?.preventDefault();
      }
    }
  }

  exchangeInput() {
    this.showLoader = true;
    setTimeout(() => {
      this.isSwapped = !this.isSwapped;
      this.exchangeForm.patchValue({ buy: this.isSwapped })
      this.generatePatamasFirstExchange(this.exchangeForm.value.firstExchangeAmount)
      this.CurrentRateValue(!this.isSwapped ? this.exchangeForm?.value?.secondExchangeCurrency : this.exchangeForm?.value?.firstExchangeCurrency, !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency);
      if (this.exchangeForm?.value?.firstExchangeCurrency && this.exchangeForm?.value?.secondExchangeCurrency && this.exchangeForm?.value?.firstExchangeAmount) {
       
      }
      this.showLoader = false;
    }, 1000);
  }


  closeButton() {
    this.timerSubscription?.unsubscribe();
    this.dialogRef.close(this.timerSubscription);
    this.dialog.closeAll()

  }
  openConvertNow() {
    let activeWallet: any = localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(ExchangeMainComponent, {
      width: '100vw',
      maxWidth: '100vw',
      data: {
        selectedwalletInfo: currency,
        payment: true
      },
      disableClose: true,
    }).afterClosed()
      .subscribe((shouldReload: any) => {
        if (shouldReload) {
          this.timerSubscription = shouldReload
          this.timerSubscription.unsubscribe()
        }
      });
  }

  getDefaultCurrencyTotal(value: any) {
    this.filteredBalanceForFirstCurrency = this.balanceListData?.filter((item: any) => {
      if (value === item?.wallet_Currency?.code) {
        this.totalFirstCurrency = item?.wallet_Amount;
        this.firstDefaultSign = item?.wallet_Currency?.sign;
        return this.totalFirstCurrency;
      }
      return null;
    });
  }

  getSecondDefaultCurrency(value: any) {
    this.filteredBalanceForSecondCurrency = this.balanceListData?.filter((item: any) => {
      if (value === item?.wallet_Currency?.code) {
        this.totalSecondCurrency = item?.wallet_Amount;
        this.secondDefaultSign = item?.wallet_Currency?.sign;
        return this.totalSecondCurrency;
      }
      return null;
    });
  }

  firstSelectExchangeCurrency(event: any) {
    const firstSelectedCurrency = this.balanceListData?.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(event?.value?.toLowerCase()));
    this.getFirstSelectedCurrencyDetails = firstSelectedCurrency[0];
    this.filteredBalanceForFirstCurrency = this.balanceListData?.find((item: any) => {
      if (this.getFirstSelectedCurrencyDetails?.wallet_Currency?.code === item?.wallet_Currency?.code) {
        this.totalFirstCurrency = item?.wallet_Amount;
        this.firstSign = item?.wallet_Currency?.sign;
        return this.totalFirstCurrency;
      }
      else {
        this.totalFirstCurrency = 0;
        this.firstSign = this.getFirstSelectedCurrencyDetails?.wallet_Currency?.sign;
      }
      return null;
    });
    this.generatePatamasFirstExchange(this.exchangeForm?.value?.firstExchangeAmount)
    this.CurrentRateValue(!this.isSwapped ? this.exchangeForm?.value?.secondExchangeCurrency : this.exchangeForm?.value?.firstExchangeCurrency, !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency);
    this.createConvertRequest()
    this.cd?.detectChanges();
  }

  secondSelectExchangeCurrency(event: any) {
    const secondSelectedCurrency = this.balanceListData?.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(event?.value?.toLowerCase()));
    this.getSecondSelectedCurrencyDetails = secondSelectedCurrency[0];

    this.filteredBalanceForSecondCurrency = this.balanceListData?.find((item: any) => {
      if (this.getSecondSelectedCurrencyDetails?.wallet_Currency?.code === item?.wallet_Currency?.code) {
        this.totalSecondCurrency = item?.wallet_Amount;
        this.secondSign = item?.wallet_Currency?.sign;
        return this.totalSecondCurrency;
      }
      else {
        this.totalSecondCurrency = 0;
        this.secondSign = this.getSecondSelectedCurrencyDetails?.wallet_Currency?.sign;
      }
      return null;
    });
    this.generatePatamasFirstExchange(this.exchangeForm?.value?.firstExchangeAmount)
    this.CurrentRateValue(!this.isSwapped ? this.exchangeForm?.value?.secondExchangeCurrency : this.exchangeForm?.value?.firstExchangeCurrency, !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency);
    this.createConvertRequest()
    this.cd?.detectChanges();
  }

  onSubmit(data: any) {
  }

  searchFromFirstInput(data: any) {
    this.firstActiveFilteredCurrency = this.balanceListData.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(data?.target?.value?.toLowerCase()));
  }

  searchFromSecondInput(data: any) {
    this.secondActiveFilteredCurrency = this.balanceListData.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(data?.target?.value?.toLowerCase()));
  }

  exchangePlanConvert() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(PlanConversionComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data: any) => {
      });
  }

  generatePatamasFirstExchange(event: any) {
    // Get the input value, handling both direct values and event objects
    let inputValue = event;
    if (event && event.target && event.target.value !== undefined) {
      inputValue = event.target.value;
    }

    // Remove commas and convert to number
    const cleanValue = typeof inputValue === 'string' ? inputValue.replace(/,/g, '') : inputValue;
    const numericValue = parseFloat(cleanValue);

    // Only proceed if we have valid form values and a valid numeric input
    if (this.exchangeForm?.value?.firstExchangeCurrency &&
      this.exchangeForm?.value?.secondExchangeCurrency &&
      !isNaN(numericValue) && numericValue > 0) {

      if (this.exchangeForm?.value?.firstExchangeCurrency != this.getSecondSelectedCurrencyDetails?.wallet_Currency?.code) {
        this.params = {
          'Charge.Currency': !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency,
          'Buy.Currency': !this.isSwapped ? this.exchangeForm?.value?.secondExchangeCurrency : this.exchangeForm?.value?.firstExchangeCurrency,
          'Buy.Amount': this.isSwapped ? numericValue : null,
          'Charge.Amount': !this.isSwapped ? numericValue : null,
        }
      }
      console.log('First exchange params:', this.params);
    }
  }

  generatePatamasSecondExchange(event: any) {
    // Get the input value, handling both direct values and event objects
    let inputValue = event;
    if (event && event.target && event.target.value !== undefined) {
      inputValue = event.target.value;
    }

    // Remove commas and convert to number
    const cleanValue = typeof inputValue === 'string' ? inputValue.replace(/,/g, '') : inputValue;
    const numericValue = parseFloat(cleanValue);

    // Only proceed if we have valid form values and a valid numeric input
    if (this.exchangeForm?.value?.firstExchangeCurrency &&
      this.exchangeForm?.value?.secondExchangeCurrency &&
      !isNaN(numericValue) && numericValue > 0) {

      if (this.exchangeForm?.value?.firstExchangeCurrency != this.getSecondSelectedCurrencyDetails?.wallet_Currency?.code) {
        this.params = {
          'Charge.Currency': !this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency,
          'Buy.Currency': this.isSwapped ? this.exchangeForm?.value?.firstExchangeCurrency : this.exchangeForm?.value?.secondExchangeCurrency,
          'Buy.Amount': !this.isSwapped ? numericValue : null,
          'Charge.Amount': this.isSwapped ? numericValue : null,
        }
      }
      console.log('Second exchange params:', this.params);
    }
  }

  createConvertRequest() {
    this.isSecondInputFocused = false;
    this.isFirstInputFocused = false;
    if (this.exchangeForm?.value?.firstExchangeCurrency && this.exchangeForm?.value?.secondExchangeCurrency && (this.exchangeForm?.value?.firstExchangeAmount || this.exchangeForm?.value?.secondExchangeAmount)) {
      if (this.exchangeForm?.value?.firstExchangeCurrency != this.getSecondSelectedCurrencyDetails?.wallet_Currency?.code) {
        this.createConvertFinal();
      }
    }
  }

  createConvertFinal() {
    if (!this.isFormChanged) {
      this.isExchangeBtnDisabled = false;
      return;
    }

    this.currentNumber = 15;
    this.progress = 0;
    this.showLoader = true;
    this.isExchangeInProgress = true;
    this.isExchangeBtnDisabled = true;

    // Fix: Check if params exists and has valid values
    if (!this.params) {
      console.error('Params not defined');
      this.showLoader = false;
      this.isExchangeInProgress = false;
      return;
    }

    const buyCurrency = this.params['Buy.Currency'];
    const chargeCurrency = this.params['Charge.Currency'];

    // Fix: Parse and validate amounts, handle null/undefined values
    let chargeAmount = this.params['Charge.Amount'];
    let buyAmount = this.params['Buy.Amount'];

    // Convert string amounts (with commas) to numbers
    if (typeof chargeAmount === 'string') {
      chargeAmount = parseFloat(chargeAmount.replace(/,/g, ''));
    }
    if (typeof buyAmount === 'string') {
      buyAmount = parseFloat(buyAmount.replace(/,/g, ''));
    }

    // Validate that we have at least one valid amount
    if ((!chargeAmount || isNaN(chargeAmount)) && (!buyAmount || isNaN(buyAmount))) {
      console.error('No valid amount provided');
      this.showLoader = false;
      this.isExchangeInProgress = false;
      return;
    }

    const simulatedRate = 0.7018;

    // Calculate the missing amount based on which one is provided
    let calculatedBuyAmount: number;
    let calculatedChargeAmount: number;

    if (chargeAmount && !isNaN(chargeAmount)) {
      calculatedChargeAmount = chargeAmount;
      calculatedBuyAmount = chargeAmount * simulatedRate;
    } else if (buyAmount && !isNaN(buyAmount)) {
      calculatedBuyAmount = buyAmount;
      calculatedChargeAmount = buyAmount / simulatedRate;
    } else {
      console.error('Invalid amounts');
      this.showLoader = false;
      this.isExchangeInProgress = false;
      return;
    }

    const mockResponse = {
      status: "Create Request Successfully",
      convertRequest: {
        pair: `${buyCurrency}${chargeCurrency}`,
        requestId: "808f45de-5065-4be0-9296-d37c067bca20",
        buy: {
          currency: buyCurrency,
          amount: calculatedBuyAmount.toFixed(2)
        },
        charge: {
          currency: chargeCurrency,
          amount: calculatedChargeAmount.toFixed(2)
        },
        finalQuote: simulatedRate,
        exchangeRate: {
          major: {
            rate: 1,
            currency: {
              code: buyCurrency,
              sign: "$",
              flag: null,
              currencyName: null
            }
          },
          minor: {
            rate: simulatedRate,
            currency: {
              code: chargeCurrency,
              sign: "$",
              flag: null,
              currencyName: null
            }
          }
        },
        dealNumber: null
      }
    };

    // Use the mock response
    setTimeout(() => {
      this.callConvertRequestApi = true;
      this.createdConvertData = mockResponse;

      // Fix: Properly format the charged amount
      this.chargedAmount = Number(parseFloat(mockResponse.convertRequest.charge.amount))
        .toLocaleString('en', { minimumFractionDigits: 2 });

      // Fix: Format amounts properly before setting form values
      const formattedBuyAmount = Number(parseFloat(mockResponse.convertRequest.buy.amount))
        .toLocaleString('en', { minimumFractionDigits: 2 });

      const formattedChargeAmount = Number(parseFloat(mockResponse.convertRequest.charge.amount))
        .toLocaleString('en', { minimumFractionDigits: 2 });

      if (!this.exchangeForm?.value?.buy) {
        this.exchangeForm.patchValue({
          secondExchangeAmount: formattedBuyAmount,
          firstExchangeAmount: formattedChargeAmount
        });
      } else {
        this.exchangeForm.patchValue({
          firstExchangeAmount: formattedBuyAmount,
          secondExchangeAmount: formattedChargeAmount
        });
      }

      this.exchangeForm.patchValue({
        firstExchangeSign: this.firstSign || this.firstDefaultSign,
        secondExchangeSign: this.secondSign || this.secondDefaultSign
      });

      this.createdSpotRate = mockResponse.convertRequest.exchangeRate.minor.rate;
      this.createdMajorRate = mockResponse.convertRequest.exchangeRate.major.rate;
      this.minorSpotCurrencySign = mockResponse.convertRequest.exchangeRate.minor.currency.sign;
      this.majorSpotCurrencySign = mockResponse.convertRequest.exchangeRate.major.currency.sign;

      // Fix: Ensure proper calculation
      const refreshedSendValue = parseFloat(mockResponse.convertRequest.buy.amount);
      this.afterExchangeRate = refreshedSendValue * this.createdSpotRate;

      this.showLoader = false;
      this.createPaymentAPIError = '';
      this.isFormChanged = false;
      this.isExchangeBtnDisabled = false;
      this.isExchangeInProgress = false;

      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }

      this.cd?.detectChanges();
      this.exchangeFormDetails.emit(this.exchangeForm);
      this.createdConvertDataDetails.emit(this.createdConvertData);

      // Simulate checkWalletBalanceForConvert
      setTimeout(() => {
        this.showLoader = false;
        this.checkWalletBalanceError = '';
        this.progress = 0;
        this.startRepeatingTimer();
        this.timerSubscriptionForComplete.emit(this.timerSubscription);
      }, 1000);
    }, 1000);
  }

  commaseprate(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e?.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      return false;
    }
  }
}
