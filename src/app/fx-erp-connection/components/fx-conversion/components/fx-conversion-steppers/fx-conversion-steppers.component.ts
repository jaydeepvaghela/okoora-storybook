import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Subject } from 'rxjs';
import { ConversionSteps } from '../../../../../connector/enums/status';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FxConversionStep1Component } from '../fx-conversion-step1/fx-conversion-step1.component';
import { FxConversionStep2Component } from '../fx-conversion-step2/fx-conversion-step2.component';
import { FxConversionStep3Component } from '../fx-conversion-step3/fx-conversion-step3.component';
import { FxConversionStep4Component } from '../fx-conversion-step4/fx-conversion-step4.component';
import { FxConversionStep5Component } from '../fx-conversion-step5/fx-conversion-step5.component';
import { FxConversionStep6Component } from '../fx-conversion-step6/fx-conversion-step6.component';


@Component({
  selector: 'app-fx-conversion-steppers',
  templateUrl: './fx-conversion-steppers.component.html',
  styleUrls: ['./fx-conversion-steppers.component.scss'],
  imports: [CommonModule, MatStepperModule, MatProgressBarModule, FxConversionStep1Component, FxConversionStep2Component, FxConversionStep3Component, FxConversionStep4Component, FxConversionStep5Component, FxConversionStep6Component]
})
export class FxConversionSteppersComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') formStepper!: MatStepper;
  @Output() backToErp = new EventEmitter<void>();

  conversionSteps = ConversionSteps; // conversion flow steps enum
  _onDestroy = new Subject<void>();
  selectedStepIndex: any = 0;
  fxConversionForm!: FormGroup;
  fxMode: 'buy' | 'sell' = 'buy';
  currencyPair = ''; // currency pair string
  currentRate = ''; // current rate for the currency pair
  constructor(
    private readonly fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.createFxConversionForm();
  }
 
  // define the form structure for the FX conversion form
  createFxConversionForm() {
    this.fxConversionForm = this.fb.group({
      ruleName: ['', Validators.required],
      buyCurrency: [''],
      sellCurrency: [''],
      BuyAmount: [null, [Validators.required, this.integerMax7WithCommaValidator]],
      SellAmount: [null, [Validators.required, this.integerMax7WithCommaValidator]],
      executionFrequency: [null, Validators.required],
      hasCondition: [null, Validators.required],
      Operator: [''],
      targetRate: [null, [Validators.required, this.rateRulesValidator]],
      Expiry: [''],
      StartDate: ['', [Validators.required, this.futureDateValidator()]], // required and must be future
      SetEndDate: [false] // toggle for end date visibility
    });
  }
  // rate validator - does not allow characters, enforces up to 2 decimals and > 0
  rateRulesValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // If value is null, undefined, or empty, skip validation
    if (value === null || value === '') {
      return null;
    }

    // Block any non-numeric except decimal point and minus
    const validPattern = /^-?\d*(\.\d*)?$/;
    if (!validPattern.test(value)) {
      return { invalidChars: true }; // only numbers, optional decimal, and minus sign allowed
    }

    // If just "-" entered → treat as negative
    if (value === '-') {
      return { positive: true };
    }

    const floatVal = parseFloat(value);

    // Must be positive
    if (floatVal < 0) {
      return { positive: true };
    }
    if (floatVal === 0) {
      return { min: true };
    }

    // Must have at most 2 decimal places
    const decimalCheck = /^\d+(\.\d{1,2})?$/;
    if (!decimalCheck.test(value)) {
      return { decimal: true };
    }

    return null;
  }


  // this validator checks if the selected date is today or in the future
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();

      // reset time to compare only date
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return { pastDate: true };
      }

      return null;
    };
  }

  // this validator checks if expiry is after start date
  expiryAfterStartValidator(
    startControlName: string,
    expiryControlName: string,
    showEndDateControlName: string
  ): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const group = form as FormGroup;
      const startCtrl = group.get(startControlName);
      const expiryCtrl = group.get(expiryControlName);
      const showEndDateCtrl = group.get(showEndDateControlName);

      if (!startCtrl || !expiryCtrl || !showEndDateCtrl) {
        return null;
      }

      const start = startCtrl.value;
      const expiry = expiryCtrl.value;
      const showEndDate = showEndDateCtrl.value;

      // if toggle is OFF → clear Expiry errors & skip checks
      if (!showEndDate) {
        expiryCtrl.setErrors(null); // removes any leftover errors
        return null;
      }

      const errors: ValidationErrors = {};

      // required check when toggle is ON
      if (!expiry) {
        errors['required'] = true;
      } else {
        // must be after StartDate
        const startDate = new Date(start);
        const expiryDate = new Date(expiry);
        startDate.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);

        if (expiryDate <= startDate) {
          errors['endBeforeStart'] = true;
        }
      }

      // apply errors only if any exist
      expiryCtrl.setErrors(Object.keys(errors).length ? errors : null);

      return null; // group-level validator doesn't return errors, applies to child
    };
  }

  // allow only integers up to 7 digits
  integerMax7WithCommaValidator: ValidatorFn = (control: AbstractControl) => {
    let value = control.value;

    if (value === null || value === '') return { required: true };

    // Remove commas for processing
    const numericValue = value.toString().replace(/,/g, '');

    // Check for decimal
    if (numericValue.includes('.')) {
      return { decimalNotAllowed: true };
    }

    // Ensure only digits after removing commas
    if (!/^\d+$/.test(numericValue)) {
      return { invalidCharacters: true };
    }

    // Max 7 digits check (ignore commas)
    if (numericValue.length > 7) {
      return { maxDigits: true };
    }

    return null;
  };
  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // get currency pair value and send it to the step 6
  currencyPairValue(value: string) {
    this.currencyPair = value;
  }

  // get currency rate value and send it to the step 6
  currentSpotRateValue(value: string) {
    this.currentRate = value;
  }

  onBackClick() {
    this.backToErp.emit();
  }
}
