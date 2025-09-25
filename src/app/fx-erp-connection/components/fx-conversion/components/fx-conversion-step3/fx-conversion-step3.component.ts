import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { RateConditionLabel, RateConditionValue } from '../../enums/enums';
import { FxDashboardService } from '../../../../../fx-dashboard/services/fx-dashboard.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fx-conversion-step3',
  templateUrl: './fx-conversion-step3.component.html',
  styleUrls: ['./fx-conversion-step3.component.scss'],
  imports: [MatSelectModule, CommonModule, ReactiveFormsModule]
})
export class FxConversionStep3Component {
  @Input() stepper!: MatStepper; // pass the MatStepper instance
  @Input() fxConversionForm!: FormGroup; // pass the FormGroup instance
  @Output() currencyPairValue = new EventEmitter<string>();
  @Output() currentSpotRateValue = new EventEmitter<string>();

  hasCondition = new FormControl([]); // rate condition control
  targetRate = new FormControl([]); // target rate control
  currencyPair: string = ''; // currency pair string

  // list of rate conditions with labels and values
  rateConstionList = [
    { value: RateConditionValue.AboveTargetRate, label: RateConditionLabel.AboveTargetRate },
    { value: RateConditionValue.BelowTargetRate, label: RateConditionLabel.BelowTargetRate }
  ];
  currentSpotRate: any;

  constructor(private fxDashboardService: FxDashboardService) {
  }

  ngOnInit(): void {
    this.currencyPair = this.fxConversionForm.value.sellCurrency + '/' + this.fxConversionForm.value.buyCurrency;
    this.currencyPairValue.emit(this.currencyPair);
    this.subscribeToSpotRate();
    this.resetFormValidationState();
  }

  private resetFormValidationState() {
    Object.keys(this.fxConversionForm.controls).forEach(key => {
      const control = this.fxConversionForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  subscribeToSpotRate() {
    this.fxDashboardService.spotRate$.subscribe(res => {
      const buyCurrency = this.fxConversionForm.value.buyCurrency;
      this.currentSpotRate = res?.[buyCurrency];
      this.currentSpotRateValue.emit(res?.[buyCurrency]);

      const targetRateCtrl = this.fxConversionForm.get('targetRate');
      if (targetRateCtrl) {
        targetRateCtrl.valueChanges.subscribe(val => {
          this.farFromSpotError = false;
          const value = parseFloat(val);
          const minRate = this.currentSpotRate * 0.5;
          const maxRate = this.currentSpotRate * 1.5;
          const maxAllowed = this.currentSpotRate * 10;
          if (value <= 0 || isNaN(value)) {
            targetRateCtrl.setErrors({ min: true });
            return;
          }
          if (value > maxAllowed) {
            targetRateCtrl.setErrors({ max: true });
            return;
          }
          if (!this.rateOverrideConfirmed && (value < minRate || value > maxRate)) {
            targetRateCtrl.setErrors({ farFromSpot: true });
            this.farFromSpotError = true;
            return;
          }
          targetRateCtrl.setErrors(null);
        });
      }
    });
  }
  // check if the form control has an error with invalid and touched state
  hasError(controlName: string): boolean {
    const control = this.fxConversionForm.get(controlName);
    return !!(control && control.invalid && control.touched && this.fxConversionForm);
  }
  // if controls is valid, proceed to next step
  rateOverrideConfirmed = false;
  farFromSpotError = false;
  next() {
    const hasConditionCtrl = this.fxConversionForm.get('hasCondition');
    const targetRateCtrl = this.fxConversionForm.get('targetRate');
    hasConditionCtrl?.markAsTouched();
    targetRateCtrl?.markAsTouched();

    // Validation logic for rate
    this.farFromSpotError = false;
    if (targetRateCtrl && this.currentSpotRate) {
      const valueStr = targetRateCtrl.value;
      const value = parseFloat(valueStr);
      const minRate = this.currentSpotRate * 0.5;
      const maxRate = this.currentSpotRate * 1.5;
      const maxAllowed = this.currentSpotRate * 10;
      // Check for decimal places and invalid trailing dot
      if (valueStr && valueStr.includes('.')) {
        const decimals = valueStr.split('.')[1];
        if (decimals === undefined || decimals.length === 0) {
          targetRateCtrl.setErrors({ decimal: true });
          return;
        }
        if (decimals.length > 2) {
          targetRateCtrl.setErrors({ decimal: true });
          return;
        }
      }
      if (value <= 0 || isNaN(value)) {
        targetRateCtrl.setErrors({ min: true });
        return;
      }
      if (value > maxAllowed) {
        targetRateCtrl.setErrors({ max: true });
        return;
      }
      if (!this.rateOverrideConfirmed && (value < minRate || value > maxRate)) {
        targetRateCtrl.setErrors({ farFromSpot: true });
        this.farFromSpotError = true;
        return;
      }
      targetRateCtrl.setErrors(null);
    }

    // Prevent next step if there are any errors, including decimal error
    if (
      hasConditionCtrl?.valid &&
      targetRateCtrl?.valid &&
      !targetRateCtrl?.errors &&
      !targetRateCtrl?.hasError('decimal')
    ) {
      this.stepper.next();
    }
  }

  confirmRateOverride() {
    this.rateOverrideConfirmed = true;
    const targetRateCtrl = this.fxConversionForm.get('targetRate');
    targetRateCtrl?.setErrors(null);
    this.farFromSpotError = false;
  }
  // previous step in the stepper form
  previous() {
    this.stepper.previous();
  }
  // remove the target rate validation message
  onConditionChange(value: RateConditionValue) {
    const targetRateCtrl = this.fxConversionForm.get('targetRate');
    targetRateCtrl?.markAsUntouched();
    targetRateCtrl?.markAsPristine();
  }
}
