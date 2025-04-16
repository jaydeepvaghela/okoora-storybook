import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-cashflow-exposure-step1',
  imports: [CommonModule],
  templateUrl: './cashflow-exposure-step1.component.html',
  styleUrl: './cashflow-exposure-step1.component.scss'
})
export class CashflowExposureStep1Component {
  @Input() stepper!: MatStepper;
  constructor() { }
  @Input() heading: string = 'Introducing risk manager';
  @Input() subHeading: string = 'Your cash flow is at';
  @Input() actionWords: string[] = ['Buy', 'Sell', 'Pay', 'Convert'];
  @Input() introText: string = 'Introducing ABCM™ risk manager, the tool that can protect your cash flow from market volatility';

  cashflowExposureNextStep() {
    this.stepper.next();
  }
}
