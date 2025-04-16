import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { walletData } from '../cashflow-exposure-data';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatStepper } from '@angular/material/stepper';
import { HedgingDataService } from '../../../hedging-proposal/hedging-data.service';

export enum BuySell {
  Buy = 1,
  Sell = 2
}
@Component({
  selector: 'app-cashflow-exposure-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, NgbTooltipModule, FormsModule],
  templateUrl: './cashflow-exposure-step2.component.html',
  styleUrls: ['./cashflow-exposure-step2.component.scss']
})

export class CashflowExposureStep2Component implements OnInit {
  @Input() stepper!: MatStepper;
  isCreateMonthlyTable = false;
  cashFlowExposureForm: any;
  isFormSubmit = false;
  isDisplayAmountExplosure = false;
  isDefaultCuurncyILS = true;
  defaultCurrencydata: any;
  currencyNotMatch = false;
  submitFirstStep = false;
  walletData = [...walletData];
  globalWalletData = [...walletData];
  searchControl = new FormControl('');
  isSelectedCurrency: any;
  isDisplayAmountValidationMsg = false;
  apiErrorMessage = '';
  maxLengthError = false;
  amountValue:any = 0;
  defaultCurrencyCode = '';
  BuySellEnum: any = BuySell;
  selectedFromCurrency: any = null;
  exposureRequired!: boolean;
  @Input() monthlyPeriod: number = 12
  buySellCurrRes: any;
  toCurrencyObject: any;
  

  constructor(private formBuilder: FormBuilder, private hedgeDataService: HedgingDataService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cashFlowExposureForm.controls['fromCurrency'].setValue(this.defaultCurrencyCode);
      this.cashFlowExposureForm.patchValue({ fromCurrency: this.defaultCurrencyCode });
    }, 0);
  }

  ngOnInit() {
    const defaultCurrency = this.walletData.find(c => c.defaultCurrency === true);
    if (defaultCurrency) {
      this.defaultCurrencyCode = defaultCurrency.code;
      this.selectedFromCurrency = defaultCurrency;
      this.defaultCurrencydata = defaultCurrency;
    }
    this.initializeCashflowExposureForm();
    this.setupSearchFilter();
    this.isSelectedCurrency = false;

    this.cashFlowExposureForm.get('monthlyAmount')?.valueChanges.subscribe((res:any) => {
      if (this.getMonthlyAmountvalue()) {
        this.isDisplayAmountValidationMsg = false;
        this.apiErrorMessage = '';
        this.maxLengthError = false;
      }
    });
  }

  setupDefaultCurrency() {
    const defaultCurrency = this.walletData.find(c => c.defaultCurrency === true);
    if (defaultCurrency) {
      this.defaultCurrencyCode = defaultCurrency.code;
      this.selectedFromCurrency = defaultCurrency;
      this.defaultCurrencydata = defaultCurrency;
    }
  }

  setAmountWithTwoFraction(): void {
    const numeric = parseFloat(this.amountValue.replace(/,/g, ''));
    if (!isNaN(numeric)) {
      const formatted = numeric.toFixed(2);
      this.amountValue = formatted;
      this.cashFlowExposureForm.controls['monthlyAmount'].setValue(formatted);
    } else {
      this.cashFlowExposureForm.controls['monthlyAmount'].setValue('');
    }
  }
  
  

  setupSearchFilter() {
    this.searchControl.valueChanges.subscribe((searchValue: string | null) => {
      if (searchValue) {
        const searchTerm = searchValue.toLowerCase();
        this.walletData = this.globalWalletData.filter(
          (currency: any) => 
            currency.code.toLowerCase().includes(searchTerm) || 
            currency.currencyName.toLowerCase().includes(searchTerm)
        );
      } else {
        this.walletData = [...this.globalWalletData];
      }
    });
  }

  restrictLength(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const valueWithoutCommas = input.value.replace(/,/g, '');
    const cursorPosition = input.selectionStart; // Track cursor position
    const parts = valueWithoutCommas.split('.');
    const decimalPart = parts[1] || '';

    // Handle the case where user tries to add a second dot
    if (event.key === '.' && valueWithoutCommas.includes('.')) {
      event.preventDefault(); // Prevent multiple dots
    }

    // Restrict decimal part to two digits, but allow editing integer part
    if (valueWithoutCommas.includes('.') && cursorPosition! > valueWithoutCommas.indexOf('.') && decimalPart.length >= 2 && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }

    // Restrict invalid characters (letters, symbols except dot or digits)
    if (!/^[0-9.]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && !event.key.includes('Arrow')) {
      event.preventDefault();
    }
  }

  formatNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/,/g, '');
  
    if (!/^\d*$/.test(rawValue)) {
      rawValue = rawValue.replace(/\D/g, '');
    }
  
    const numericValue = parseInt(rawValue, 10);
  
    if (!isNaN(numericValue)) {
      this.amountValue = numericValue.toLocaleString('en-US');
      this.cashFlowExposureForm.controls['monthlyAmount'].setValue(this.amountValue);
    } else {
      this.amountValue = '';
      this.cashFlowExposureForm.controls['monthlyAmount'].setValue('');
    }
  }
  

  getMonthValue(event: MatSelectChange): void {
    this.monthlyPeriod = event.value;
    console.log('this.monthlyPeriod',this.monthlyPeriod);
  }

  preventDecimalValue(event: KeyboardEvent) {
    if (event.key === '.') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  initializeCashflowExposureForm() {
    this.cashFlowExposureForm = this.formBuilder.group({
      fromCurrency: [{value: this.defaultCurrencyCode}, Validators.required],
      toCurrency: ['', Validators.required],
      monthlyAmount: [0]
    });

    console.log('Form initialized with value:', this.cashFlowExposureForm.value);
    console.log('From currency control:', this.cashFlowExposureForm.controls['fromCurrency']);

  }

  onToCurrencyChange(value: string) {
    this.cashFlowExposureForm.patchValue({ toCurrency: value });
    this.checkCurrencyValue();
  }

  gettoCurrencyvalue() {
    return this.cashFlowExposureForm.controls['toCurrency'].value;
  }

  getMonthlyAmountvalue() {
    return this.cashFlowExposureForm.controls['monthlyAmount'].value;
  }

  checkCurrencyValue() {
    this.currencyNotMatch = this.defaultCurrencyCode === this.gettoCurrencyvalue();
    this.isDisplayAmountExplosure = false;
    this.isFormSubmit = false;
  }

  onDropdownOpen(event: boolean) {
    if (event) {
      this.walletData = [...this.globalWalletData];
      this.searchControl.setValue('');
    } else {
      if (this.walletData && this.walletData.length === 0) {
        this.walletData = [...this.globalWalletData];
      }
    }
  }

  selectBuySellCurrency(selectedCurrency: string) {
    this.isSelectedCurrency = selectedCurrency;
    this.exposureRequired = false;
  }

  submitCashFlowExposureForm() {
    this.submitFirstStep = true;
    if (this.cashFlowExposureForm.valid && !this.currencyNotMatch) {
      this.isFormSubmit = true;
      // this.isSelectedCurrency = true;
      this.walletData.find((currency: any) => {
        if (currency.code === this.gettoCurrencyvalue()) {
          this.buySellCurrRes = currency;
          console.log(this.buySellCurrRes,'toCurrencyObject')
        }
      })
    }
  }

  closeFormSubmit() {
    this.isFormSubmit = false;
    this.submitFirstStep = false;
  }

  submitFormWithoutBuyORSell() { // Create explosure table next btn click (step 2)
    
    if (this.isSelectedCurrency && !this.exposureRequired) {
      this.isDisplayAmountExplosure = true;
    }
    this.exposureRequired = !this.isSelectedCurrency ? true : false;
  }

  closeAmountExplosure() {
    this.isDisplayAmountExplosure = false;
  }

  sendAmountValue() {
    if (this.isSelectedCurrency) {
      this.exposureRequired = false;
      if (this.amountValue == 0) {
        this.cashFlowExposureForm.controls['monthlyAmount'].setValue('');
        this.isDisplayAmountValidationMsg = true;
        return;
      }

      const currencyPair = this.gettoCurrencyvalue() +'/'+ this.selectedFromCurrency.code;
      console.log('currencyPair', currencyPair);
      const staticRes = {
        pair: currencyPair,
        monthlyExposure: this.getMonthlyAmountvalue(),
      } 

      const cashFlowExposureRes: {
        pair: string;
        monthlyExposure?: any;
        sign?: string;
        toCurrency?: string;
        selectedExposure?: string;
        monthlyAmount?: string;
        monthlyPeriod?: number;
        flag?: string;
        code?: string;
        baseCurrencyFlag?: string;
        baseCurrency?: string;
        baseCurrencySign?: string;
      } = { ...staticRes };

      cashFlowExposureRes['sign'] = this.buySellCurrRes.sign;
      cashFlowExposureRes['toCurrency'] = this.buySellCurrRes.code;
      cashFlowExposureRes['selectedExposure'] = this.isSelectedCurrency == 1 ? "Buying" : "Selling";
      cashFlowExposureRes['monthlyAmount'] = cashFlowExposureRes['monthlyExposure'];
      cashFlowExposureRes['monthlyPeriod'] = this.monthlyPeriod;
      cashFlowExposureRes['flag'] = this.buySellCurrRes.flag;
      cashFlowExposureRes['code'] = this.buySellCurrRes.code;
      cashFlowExposureRes['baseCurrencyFlag'] = this.selectedFromCurrency.flag;
      cashFlowExposureRes['baseCurrency'] = this.selectedFromCurrency.code;
      cashFlowExposureRes['baseCurrencySign'] = this.selectedFromCurrency.sign;

      delete cashFlowExposureRes['monthlyExposure'];

      console.log('cashFlowExposureRes 231', cashFlowExposureRes);

      // Do the same actions as if API call succeeded
      this.hedgeDataService.setExposureFormValue.next(cashFlowExposureRes);

      setTimeout(() => {
        this.stepper.next();
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const offset = 20;
        const element = document.getElementById('content-wrapper');
        if (element) {
          const topPosition = Math.max(0, element.getBoundingClientRect().top + window.pageYOffset - offset);
          window.scrollTo({
            top: topPosition,
            behavior: 'auto'
          });
        }
        this.isCreateMonthlyTable = false;
      }, 100);
      this.stepper.next();
    }
  }

  goToPrevious() {
    this.stepper.previous();
  }
}