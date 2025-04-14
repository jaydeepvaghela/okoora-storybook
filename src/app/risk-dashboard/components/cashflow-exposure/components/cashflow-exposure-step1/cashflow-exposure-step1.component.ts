import { Component } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-cashflow-exposure-step1',
  imports: [],
  templateUrl: './cashflow-exposure-step1.component.html',
  styleUrl: './cashflow-exposure-step1.component.scss'
})
export class CashflowExposureStep1Component {

  constructor(private matStepper: MatStepper) { }

  cashflowExposureNextStep() {
   
  }
}
