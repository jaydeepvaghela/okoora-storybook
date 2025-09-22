import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { InvoiceSteps } from '../../../connector/enums/status';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-fx-erp-invoice-step8',
  templateUrl: './fx-erp-invoice-step8.component.html',
  styleUrls: ['./fx-erp-invoice-step8.component.scss'],
  imports:[ReactiveFormsModule,MatSliderModule,CommonModule,MatInputModule]
})
export class FxErpInvoiceStep8Component implements OnInit, AfterViewInit {

  @ViewChild('minInput') minInput!: ElementRef<HTMLInputElement>;
  @ViewChild('maxInput') maxInput!: ElementRef<HTMLInputElement>;
  @Input() stepper!: MatStepper; 
  @Output() stepperData = new EventEmitter<void>();
  @Input() autoPilotForm!: FormGroup;

  minLimit: number = 1;
  maxLimit: number = 100000;
  step: number = 1;
  validationErrors: string[] = [];

ngAfterViewInit(): void {
  setTimeout(() => {
    const min = this.autoPilotForm.get('InvoiceBillMinExposureAmount')?.value || 0;
    const max = this.autoPilotForm.get('InvoiceBillMaxExposureAmount')?.value || 0;

    this.minInput.nativeElement.value = this.formatAmount(min);
    this.maxInput.nativeElement.value = this.formatAmount(max);
  });
}

  ngOnInit(): void {
    // this.autoPilotForm.patchValue({
    //   InvoiceBillMinExposureAmount: this.minLimit,
    //   InvoiceBillMaxExposureAmount: this.maxLimit
    // })
    if (!this.autoPilotForm.get('InvoiceBillMinExposureAmount')?.value) {
      this.autoPilotForm.patchValue({ InvoiceBillMinExposureAmount: this.minLimit });
    }
    if (!this.autoPilotForm.get('InvoiceBillMaxExposureAmount')?.value) {
      this.autoPilotForm.patchValue({ InvoiceBillMaxExposureAmount: this.maxLimit });
    }

    this.autoPilotForm.get('InvoiceBillMinExposureAmount')?.valueChanges.subscribe(() => {
      this.validateAmounts();
    });

    this.autoPilotForm.get('InvoiceBillMaxExposureAmount')?.valueChanges.subscribe(() => {
      this.validateAmounts();
    });
  }

  get min(): number {
    return this.autoPilotForm.get('InvoiceBillMinExposureAmount')?.value || 0;
  }

  get max(): number {
    return this.autoPilotForm.get('InvoiceBillMaxExposureAmount')?.value || 0;
  }

  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexFive;
  }

  onNext() {
    this.stepper.selectedIndex = InvoiceSteps.IndexSeven;
  }

  formatAmount(value: number | null): string {
  if (value === null || isNaN(Number(value))) return '$0';
  return `$${Number(value).toLocaleString('en-US')}`;
  }

  // Parse and update min from input
  onMinChange(val: string) {
    const parsed = this.parseCurrency(val);
    this.autoPilotForm.get('InvoiceBillMinExposureAmount')?.setValue(parsed);
  this.validateAmounts();
  }

  // Parse and update max from input
  onMaxChange(val: string) {
    const parsed = this.parseCurrency(val);
    this.autoPilotForm.get('InvoiceBillMaxExposureAmount')?.setValue(parsed);
   this.validateAmounts();

  }

  // Strip $ and non-numeric characters
  parseCurrency(val: any): number {
    if (val == null) return 0;
    const strVal = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(strVal) || 0;
  }

   validateAmounts() {
    this.validationErrors = [];
    if (!this.minLimit && !this.maxLimit) {
      return;
    }
    const min = parseFloat(this.min.toString().replace(/,/g, ''));
    const max = parseFloat(this.max.toString().replace(/,/g, ''));
    if (isNaN(min) || min <= 0) {
      this.validationErrors.push('Minimum amount must be greater than 0.');
    }
    if (!isNaN(min)) {
      if (isNaN(max)) {
        this.validationErrors.push('Maximum amount must be above or equal to minimum.');
      } else if (max < min) {
        this.validationErrors.push('Maximum amount must be above or equal to minimum.');
      }
    }
  }
}

