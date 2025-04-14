import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { walletData } from '../cashflow-exposure-data';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

export enum BuySell {
  Buy = 1,
  Sell = 2
}
@Component({
  selector: 'app-cashflow-exposure-step2',
  templateUrl: './cashflow-exposure-step2.component.html',
  styleUrls: ['./cashflow-exposure-step2.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule],
})

export class CashflowExposureStep2Component implements OnInit {
  @ViewChild('isLoadExplosureFocus') isLoadExplosureFocus!: ElementRef;
  cashFlowExposureForm!: FormGroup;
  searchControl: FormControl = new FormControl();
  selectedToCurrencyObj: any;
  defaultCurrencydata: any;
  buySellCurrRes: any;
  globalWalletData: any;
  walletData = walletData;
  BuySellEnum: any = BuySell;
  amountValue!: string;
  isSelectedCurrency!: string | number;
  isCurrencychangeAfterFormSubmit: boolean = false;
  showLoader: boolean = false;
  isFormSubmit: boolean = false;
  currencyNotMatch: boolean = false;
  exposureRequired: boolean = false;
  isCreateMonthlyTable: boolean = false;
  isFinalFormSubmit!: boolean;
  isDisplayAmountValidationMsg!: boolean;
  isDefaultCuurncyILS!: boolean;
  isDisplayAmountExplosure: boolean = false;
  pageCount: number = 1;
  monthlyPeriod: string = '12';
  submitFirstStep: boolean = false;
  apiErrorMessage!: string;
  maxLengthError!: boolean;
  dicimalValidationMsg!: string;
  defaultCurrency!: any;

  constructor(private fb: FormBuilder, private stepper: MatStepper, 
  ) { }

  ngOnInit(): void {
    this.cashFlowExploureForm();
    this.GetSupportedCashflowCurrencies();
    this.searchToCurruncies();
  }

  cashFlowExploureForm() {
    this.cashFlowExposureForm = this.fb.group({
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required],
      monthlyAmount: ['']
    });
    this.cashFlowExposureForm.get('monthlyAmount')?.valueChanges.subscribe((res) => {
      if (this.getMonthlyAmountvalue()) {
        this.isDisplayAmountValidationMsg = false;
        this.apiErrorMessage = '';
        this.maxLengthError = false;
      }
    });
    this.cashFlowExposureForm.get('toCurrency')?.valueChanges.subscribe((res) => {
      this.isSelectedCurrency = '';
      this.amountValue = '';
      if (this.isFormSubmit) {
        this.updateToCurrencyData(false);
      }
    });
  }

  GetSupportedCashflowCurrencies() {
    if (this.walletData && this.walletData.length) {
      this.defaultCurrency = this.walletData.find(data => data.defaultCurrency === true);
      
      if (this.defaultCurrency) {
        // Set default selected currency
        this.cashFlowExposureForm.controls['fromCurrency'].setValue(this.defaultCurrency.code);
      }
    }
  }
  

  searchToCurruncies() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.walletData = searchTerm ? this.filterCurrencies(searchTerm) : this.globalWalletData;
    });
  }

  filterCurrencies(searchTerm: string) {
    return this.walletData.filter((currency: any) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getFromCurrencyValue() {
    console.log(this.cashFlowExposureForm.controls['fromCurrency'].value,'this.cashFlowExposureForm.controls[fromCurrency].value');
    
    return this.cashFlowExposureForm.controls['fromCurrency'].value;
  }

  gettoCurrencyvalue() {
    return this.cashFlowExposureForm.controls['toCurrency'].value;
  }

  getMonthlyAmountvalue() {
    return this.cashFlowExposureForm.controls['monthlyAmount'].value;
  }

  getselectedCurrency(tocurrencyCode: string) {
    this.selectedToCurrencyObj = this.walletData.filter((data: any) => data.code == tocurrencyCode)[0];
    return this.selectedToCurrencyObj;
  }

  selectBuySellCurrency(selectedCurrency: string) {
    this.isSelectedCurrency = selectedCurrency;
    this.exposureRequired = false;
  }

  goToPrevious() {
    this.cashFlowExposureForm.controls['toCurrency'].setValue('');
    this.cashFlowExposureForm.controls['monthlyAmount'].setValue('');
    // this.isDefaultCuurncyILS = this.walletData.filter((data: any) => data.code == this.defaultCurrencydata["code"])[0];
    this.isDefaultCuurncyILS ? this.cashFlowExposureForm.controls['fromCurrency'].setValue(this.defaultCurrencydata["code"]) : this.cashFlowExposureForm.controls['fromCurrency'].setValue("");
    this.checkCurrencyValue();
    this.stepper.previous();
    this.isFinalFormSubmit = false;
    this.currencyNotMatch = false;
    this.isSelectedCurrency = '';
    this.amountValue = '';
  }

  onDropdownOpen(event: any) {
    if (event) {
      this.walletData = this.globalWalletData;
      this.searchControl.setValue('');
    } else {
      if (this.walletData && this.walletData.length === 0) {
        this.walletData = this.globalWalletData
      }
    }
  }

  goToPreviousSamePage() {
    if (!this.isDisplayAmountExplosure && this.isFormSubmit) {
      this.isFormSubmit = false;
    }
    if (this.isDisplayAmountExplosure && this.isFormSubmit) {
      this.isDisplayAmountExplosure = false;
    }
  }

  checkCurrencyValue() {
    this.isDefaultCuurncyILS = this.getFromCurrencyValue() !== this.defaultCurrency.code ? false : true;
    this.currencyNotMatch = this.getFromCurrencyValue() === this.gettoCurrencyvalue() ? true : false;
    this.isDisplayAmountExplosure = false;
    this.isFormSubmit = false;
  }

  setAmountWithTwoFraction(): void {
    this.cashFlowExposureForm.controls['monthlyAmount'].setValue(this.amountValue);
  }

  submitFormWithoutBuyORSell() { // Create explosure table next btn click (step 2)
    if (this.isSelectedCurrency && !this.exposureRequired) {
      this.isDisplayAmountExplosure = true;
    }
    this.exposureRequired = !this.isSelectedCurrency ? true : false;
  }

  sendAmountValue() {
    if (this.isSelectedCurrency && this.getMonthlyAmountvalue()) {
      this.exposureRequired = false;
      if (this.amountValue == "0") {
        // this.cashFlowExposureForm.controls['monthlyAmount'].setValue('');
        this.isDisplayAmountValidationMsg = true;
        return;
      }

      const exposureObj = {
        buySell: this.isSelectedCurrency,
        monthlyAmount: this.getMonthlyAmountvalue()
      };

      // Make the API call
      // this.riskManagerService?.UpdateCashFlowExposureData(exposureObj).subscribe(
      //   (cashFlowExposureRes: any) => {
      //     this.isCreateMonthlyTable = true;
      //     this.apiErrorMessage = "";
      //     cashFlowExposureRes['sign'] = this.buySellCurrRes.sign;
      //     cashFlowExposureRes['toCurrency'] = this.buySellCurrRes.code;
      //     cashFlowExposureRes['selectedExposure'] = this.isSelectedCurrency == 1 ? "Buying" : "Selling";
      //     cashFlowExposureRes['monthlyAmount'] = cashFlowExposureRes['monthlyExposure'];
      //     cashFlowExposureRes['monthlyPeriod'] = this.monthlyPeriod;
      //     cashFlowExposureRes['flag'] = this.buySellCurrRes['flag'];
      //     cashFlowExposureRes['code'] = this.buySellCurrRes['code'];
      //     cashFlowExposureRes['baseCurrencyFlag'] = this.defaultCurrencydata[0]['flag'];
      //     cashFlowExposureRes['baseCurrency'] = this.defaultCurrencydata[0]['code'];
      //     cashFlowExposureRes['baseCurrencySign'] = this.defaultCurrencydata[0]['sign'];
      //     delete cashFlowExposureRes['monthlyExposure'];

      //     this.riskManagerService.setExposureFormValue.next(cashFlowExposureRes);
      //     this.riskManagerService.openCashflowDateTooltip.next(true);

      //     // for scroll step 3 to top
      //     setTimeout(() => {
      //       this.stepper.next();
      //       document.documentElement.scrollTop = 0;
      //       document.body.scrollTop = 0;
      //       const offset = 20;
      //       const element = document.getElementById('content-wrapper');
      //       if (element) {
      //         const topPosition = Math.max(0, element.getBoundingClientRect().top + window.pageYOffset - offset);
      //         window.scrollTo({
      //           top: topPosition,
      //           behavior: 'auto'
      //         });
      //       }
      //       this.isCreateMonthlyTable = false;
      //     }, 100);
      //   },
      //   (error:any) => {
      //     this.apiErrorMessage = error?.error?.apiErrorMessage[0];
      //     this.maxLengthError = this.apiErrorMessage.includes('Maximum');
      //     this.isCreateMonthlyTable = false;
      //     return this.stepper.selectedIndex;
      //   }
      // );
    } else {
      // Handle validation when no monthly amount is provided
      if (!this.getMonthlyAmountvalue()) {
        this.isDisplayAmountValidationMsg = true;
      }
      this.exposureRequired = !this.isSelectedCurrency ? true : false;
    }
  }

  submitCashFlowExposureForm() { // Select to Currency next btn click (step 1)
    this.submitFirstStep = true;
    if (this.cashFlowExposureForm.invalid) {
      return
    } else {
      this.updateToCurrencyData(true);
    }
  }

  formatNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/,/g, '');

    if (value === '') {
      this.amountValue = '0';
      return;
    }

    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');

      if (decimalPart.length > 2) {
        value = integerPart + '.' + decimalPart?.slice(0, 2);
      }
    }

    const actualNumber = parseFloat(value);
    if (!isNaN(actualNumber)) {
      this.amountValue = actualNumber.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  }

  restrictLength(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const valueWithoutCommas = input.value.replace(/,/g, '');
    const cursorPosition = input.selectionStart; // Track cursor position
    const parts = valueWithoutCommas.split('.');
    const integerPart = parts[0];
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


  updateToCurrencyData(isClickFirstStepNextBtn: boolean) {
    const currencyValue = {
      firstCurrency: this.getFromCurrencyValue(),
      secondCurrency: this.gettoCurrencyvalue()
    }
    this.showLoader = true;
    // this.riskManagerService?.UpdateCashFlowCurrencyData(currencyValue).subscribe((buySellCurrRes: any) => {
    //   this.buySellCurrRes = buySellCurrRes;
    //   this.showLoader = false;
    //   if (this.getFromCurrencyValue() && this.gettoCurrencyvalue()) {
    //     if (this.isFormSubmit) {
    //       this.pageCount++;
    //       this.isFormSubmit = true;
    //     } else {
    //       this.isFormSubmit = isClickFirstStepNextBtn === true ? true : false;
    //       if (!this.isFormSubmit) {
    //         this.pageCount--;
    //       }
    //     }
    //     this.focusInput();
    //     this.exposureRequired = false;
    //   }
    //   if (!this.isFinalFormSubmit) {
    //     if (!this.getMonthlyAmountvalue()) {
    //       this.isDisplayAmountValidationMsg = false;
    //     }
    //   }
    // });
  }

  focusInput(): void {
    if (this.isFormSubmit) {
      setTimeout(() => {
        if (this.isLoadExplosureFocus) {
          this.isLoadExplosureFocus.nativeElement.focus();
        }
      }, 300);
    }
  }

  closeFormSubmit() {
    this.isFormSubmit = false;
  }

  closeAmountExplosure() {
    this.isDisplayAmountExplosure = false;
    this.apiErrorMessage = '';
  }

  getMonthValue(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.monthlyPeriod = selectElement.value;
  }
}
