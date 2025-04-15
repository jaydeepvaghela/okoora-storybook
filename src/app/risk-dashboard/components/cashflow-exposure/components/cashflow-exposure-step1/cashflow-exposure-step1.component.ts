import { Component, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-cashflow-exposure-step1',
  imports: [],
  templateUrl: './cashflow-exposure-step1.component.html',
  styleUrl: './cashflow-exposure-step1.component.scss'
})
export class CashflowExposureStep1Component {
  @Input() stepper!: MatStepper;
  constructor() { }

  cashflowExposureNextStep() {
    this.stepper.next();
  }
}
