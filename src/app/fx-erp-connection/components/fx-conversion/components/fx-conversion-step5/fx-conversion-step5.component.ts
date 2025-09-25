import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ConnectorService } from '../../../../../connector/connector.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fx-conversion-step5',
  templateUrl: './fx-conversion-step5.component.html',
  styleUrls: ['./fx-conversion-step5.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class FxConversionStep5Component {
  @Input() stepper!: MatStepper;
  @Input() fxConversionForm!: FormGroup;

  constructor(private readonly _connectorService: ConnectorService) { }

  ngOnInit() {
    if (!this.fxConversionForm.get('ruleName')) {
      this.fxConversionForm.addControl('ruleName', new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        (control) => control.value && control.value.trim().length > 0 ? null : { required: true }
      ]));
    } else {
      const ruleNameControl = this.fxConversionForm.get('ruleName');
      ruleNameControl?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        (control) => control.value && control.value.trim().length > 0 ? null : { required: true }
      ]);
      ruleNameControl?.updateValueAndValidity();
    }
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

  next() {
    const ruleNameControl = this.fxConversionForm.get('ruleName');
    ruleNameControl?.markAsTouched();
    
    // Force validation check
    ruleNameControl?.updateValueAndValidity();
    
    if (ruleNameControl?.valid) {
      // set the role summary data in the observable
      this._connectorService.setRoleSummaryData(this.fxConversionForm.value);
      this.stepper.next(); // Move to the next step in the stepper
    }
  } 

  // previous step in the stepper form
  onBack() {
    this.stepper.previous();// Move to the previous step in the stepper
  }

  // check if the form control has an error with invalid and touched state
  hasError(controlName: string): boolean {
    const control = this.fxConversionForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // Helper method to check specific error types
  hasSpecificError(controlName: string, errorType: string): boolean {
    const control = this.fxConversionForm.get(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }
}