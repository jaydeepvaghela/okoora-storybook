import { Component, inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormControl, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap, timer } from 'rxjs';
import { HedgingDataService } from '../../../hedging-proposal/hedging-data.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { advancePolicyStep1Obj } from '../advance-policy-data';

@Component({
  selector: 'app-advanced-policy-step1',
  templateUrl: './advanced-policy-step1.component.html',
  styleUrls: ['./advanced-policy-step1.component.scss'],
  imports: [
    CommonModule, 
    MatProgressBarModule, 
    ReactiveFormsModule
  ]
})
export class AdvancedPolicyStep1Component {
  hedgingDataService = inject(HedgingDataService);
  matStepper = inject(MatStepper);

  form: FormGroup;
  errorMessage: string | null = null;
  fromCurrency: any;
  toCurrency: any;
  exposerData: any;
  apiErrorMessage: any;
  midSpotRate = 5.555;
  midSpotSubscription: Subscription | null = null;
  minBudgetRate!: number;
  maxBudgetRate!: number;
  firstCurrency: any;
  baseCurrency: any;
  currencyPair!: string;
  generateBudgetRateFlag: boolean = false;
  showLoader: boolean = false;
  toCurrencyfromLocal!: string;
  baseCurrencyfromLocal!: string;
  cashflowExposureInfo = advancePolicyStep1Obj;

  constructor(public router: Router) {
    this.form = new FormGroup({
      rate: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,4})?$/),
        Validators.min(0),
        Validators.max(99.9999),
      ]),
    });

    this.exposerData = this.cashflowExposureInfo;
    this.fromCurrency = this.cashflowExposureInfo?.baseCurrencyFlag || this.getFromLocalStorage('baseCurrencyFlag');
    this.toCurrency = this.cashflowExposureInfo?.flag || this.getFromLocalStorage('flag');
    this.firstCurrency = this.cashflowExposureInfo.toCurrency;
    this.baseCurrency = this.cashflowExposureInfo.baseCurrency;
    this.currencyPair = this.cashflowExposureInfo.pair;
  }

  getFromLocalStorage(key: string): string {
    const exposureInfo = JSON.parse(localStorage.getItem('cashFlowExposureData') || '{}');
    return exposureInfo[key] || '';
  }

  ngOnInit(): void {
    this.getSpotRate();
  }

  // getAlreadySetRate() {
  //   this.hedgingDataService.getAdvancePolicyBudgetRate.subscribe({
  //     next: (budgetRate) => {
  //       const numericRate = Number(budgetRate);
  //       if (!isNaN(numericRate)) {
  //         this.rate?.setValue(
  //           new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(numericRate)
  //         );
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching budget rate:', err);
  //     },
  //   });
  // }


  generateBudgetRate() {
    this.showLoader = true;
  
    setTimeout(() => {
      const min = 3.8885;
      const max = 7.2215;
      const randomRate = (Math.random() * (max - min) + min);
      const formattedRate = randomRate.toFixed(4);
  
      this.errorMessage = "";
      this.rate?.setValue(formattedRate);
      this.generateBudgetRateFlag = true;
      this.showLoader = false;
    }, 500);
  }
  
  

  getMidSpot() {
    const midSpot = 5.555;
    return midSpot;
  }
  

  getSpotRate() {
    if (this.midSpotSubscription && !this.midSpotSubscription.closed) {
      return;
    }
    this.minBudgetRate = this.midSpotRate * (1 - 0.30);
    this.maxBudgetRate = this.midSpotRate * (1 + 0.30);
  }

  checkBudgetRateRange(event: any): void {
    this.showLoader = true;
    const enteredValue = parseFloat(event.target.value);
    console.log('MIN', this.minBudgetRate);
    console.log('ENTER', enteredValue);
    console.log('MAX', this.maxBudgetRate);

    if (enteredValue < this.minBudgetRate || enteredValue > this.maxBudgetRate) {
      setTimeout(() => {
        this.showLoader = false;
        this.errorMessage = `Budget rate must be between ${this.minBudgetRate.toFixed(4)} and ${this.maxBudgetRate.toFixed(4)}.`;
      }, 500);
    } else {
      this.errorMessage = null;
      this.showLoader = false;
    }
  }

  nextStep() {
    if (this.form.invalid) {
      if (this.rate?.value === '') {
        this.errorMessage = 'Rate is required. Please enter a value';
        return;
      }
      return;
    }
    const enteredRate = this.rate?.value ? parseFloat(this.rate?.value) : null;
    if (enteredRate === null || enteredRate < this.minBudgetRate || enteredRate > this.maxBudgetRate) {
      return;
    }

    // Notify the service that the user is ready to proceed
    this.hedgingDataService.step2LastIndex.next(true);
    this.errorMessage = null;
    // Move to the next step in the stepper
    this.hedgingDataService.setAdvancePolicyFlag(this.generateBudgetRateFlag);
    this.matStepper.next();
  }

  get rate() {
    return this.form.get('rate');
  }
  preventInvalidInput(event: KeyboardEvent): void {
    const inputChar = event.key;
    const currentValue = (event.target as HTMLInputElement).value;

    if (this.isControlKey(event) || (event.ctrlKey || event.metaKey)) {
      return;
    }

    if (!/^\d$/.test(inputChar) && inputChar !== '.' || (inputChar === '.' && currentValue.includes('.'))) {
      event.preventDefault();
    } else {
      this.errorMessage = null;
    }
  }

  validateInput(inputValue: any): void {
    this.generateBudgetRateFlag = false;
    let value = inputValue?.target?.value;

    // Allow user to enter leading zeros but format the value by removing unnecessary leading zeros
    if (/^0+/.test(value) && value !== '0' && !value.startsWith('0.')) {
      // Trim leading zeros but retain the decimal and significant digits
      value = parseFloat(value).toString();
      inputValue.target.value = value;  // Update the input field with formatted value
      this.rate?.setValue(value);       // Update the form control value
    }

    // Check if the value starts with a decimal point (e.g., ".5342")
    if (value.startsWith('.')) {
      // Automatically add "0" before the decimal point
      value = '0' + value;
      inputValue.target.value = value;  // Update the input field
      this.rate?.setValue(value);       // Update the form control value
    }

    // Check for NaN values
    if (!value || isNaN(Number(value))) {
      this.errorMessage = 'Invalid input. Please enter a valid number.';
      return;
    }

    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = value.split('.');

    // Check if the decimal part exceeds 4 digits
    if (decimalPart && decimalPart.length > 4) {
      this.errorMessage = 'Too many decimal places. Maximum allowed is 4.';
    }
    else {
      this.errorMessage = null; // No error if the input is valid
    }
  }

  isControlKey(event: KeyboardEvent): boolean {
    // Allow control keys like backspace, delete, tab, arrow keys, etc.
    return ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(event.key);
  }

  backTodashboard() {
    this.router.navigate(['/dashboard'])
  }

  submitForm() {
    this.hedgingDataService.setAdvancePolicyFormvalue(this.form.value);
  }

  clearValue() {
    this.rate?.setValue('');
    this.errorMessage = null;
  }

  ngOnDestroy(): void {
    if (this.midSpotSubscription) {
      this.midSpotSubscription.unsubscribe();
    }
  }
}
