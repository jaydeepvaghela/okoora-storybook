import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepper } from '@angular/material/stepper';
import { CustomDateAdapter, MATERIAL_DATEPICKER_FORMATS } from '../../../../../risk-dashboard/components/cashflow-exposure/components/cashflow-exposure-details/cashflow-exposure-details.component';

@Component({
  selector: 'app-fx-conversion-step4',
  templateUrl: './fx-conversion-step4.component.html',
  styleUrls: ['./fx-conversion-step4.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatCheckboxModule, MatDatepickerModule],
   providers: [
      { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
    ],
})
export class FxConversionStep4Component implements OnInit {
  @Input() stepper!: MatStepper;
  @Input() fxConversionForm!: FormGroup;

  executionFrequency = new FormControl([]);
  StartDate = new FormControl([]);
  Expiry = new FormControl([]);
  today = new Date();
  minEndDate: Date = this.today;

  ngOnInit(): void {
    const startDateControl = this.fxConversionForm.get('StartDate');
    const expiryControl = this.fxConversionForm.get('Expiry');

    expiryControl?.setValidators(this.endDateAfterStartValidator());

    startDateControl?.valueChanges.subscribe((value) => {
      if (value) {
        const selected = this.normalizeDate(value);
        this.minEndDate = new Date(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate() + 1
        );
      } else {
        this.minEndDate = new Date(
          this.today.getFullYear(),
          this.today.getMonth(),
          this.today.getDate() + 1
        );
      }
      expiryControl?.setErrors(null);
      expiryControl?.updateValueAndValidity({ onlySelf: true });
    });
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

  private endDateAfterStartValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const setEndDate = parent.get('SetEndDate')?.value;
      if (!setEndDate) {
        return null;
      }

      const startDateRaw = parent.get('StartDate')?.value;
      const endDateRaw = control.value;

      if (!startDateRaw || !endDateRaw) {
        return null;
      }

      const startDate = this.normalizeDate(startDateRaw);
      const endDate = this.normalizeDate(endDateRaw);

      if (endDate.getTime() <= startDate.getTime()) {
        return { endBeforeStart: true };
      }

      return null;
    };
  }

  onNext() {
    const executionFrequencyValue = this.fxConversionForm.get('executionFrequency');
    const startDateValue = this.fxConversionForm.get('StartDate');
    const expiryValue = this.fxConversionForm.get('Expiry');
    
    executionFrequencyValue?.markAsTouched();
    startDateValue?.markAsTouched();
    
    if (this.fxConversionForm.get('SetEndDate')?.value) {
      expiryValue?.markAsTouched();
    }

    if (executionFrequencyValue?.valid && startDateValue?.valid && 
        (!this.fxConversionForm.get('SetEndDate')?.value || expiryValue?.valid)) {
      this.stepper.next();
    }
  }

  // Helper function to check if a date is a weekend (Saturday = 6, Sunday = 0)
  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  startDateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const normalizedDate = this.normalizeDate(date);
    const normalizedToday = this.normalizeDate(this.today);
    
    return normalizedDate >= normalizedToday && !this.isWeekend(normalizedDate);
  };

  endDateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const normalizedDate = this.normalizeDate(date);
    const startDateRaw = this.fxConversionForm?.get('StartDate')?.value;
    
    // Check if it's a weekend first
    if (this.isWeekend(normalizedDate)) {
      return false;
    }
    
    if (!startDateRaw) {
      const normalizedToday = this.normalizeDate(this.today);
      return normalizedDate > normalizedToday;
    }
    
    const startDate = this.normalizeDate(startDateRaw);
    return normalizedDate > startDate;
  };

  normalizeDate(date: any): Date {
    if (!date) {
      return new Date();
    }

    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = new Date(date);
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date._d && date._d instanceof Date) {
      dateObj = new Date(date._d);
    } else if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else {
      dateObj = new Date(date);
    }

    if (isNaN(dateObj.getTime())) {
      return new Date();
    }
    
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  }

  startOfDay(date: any): Date {
    return this.normalizeDate(date);
  }

  previous() {
    this.stepper.previous();
  }

  hasError(controlName: string): boolean {
    const control = this.fxConversionForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  setEndDate() {
    const expiryControl = this.fxConversionForm.get('Expiry');
    const setEndDateValue = this.fxConversionForm.get('SetEndDate')?.value;
    
    if (!setEndDateValue) {
      expiryControl?.reset();
      expiryControl?.setErrors(null);
      expiryControl?.markAsUntouched();
      expiryControl?.markAsPristine();
    } else {
      expiryControl?.setErrors(null);
      expiryControl?.markAsUntouched();
      expiryControl?.markAsPristine();
      expiryControl?.updateValueAndValidity();
    }
  }
}