import { Component, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { InvoiceSteps } from '../../../connector/enums/status';

@Component({
  selector: 'app-fx-erp-cashflow-step1',
  templateUrl: './fx-erp-cashflow-step1.component.html',
  styleUrls: ['./fx-erp-cashflow-step1.component.scss']
})
export class FxErpCashflowStep1Component {
  @Input() stepper!: MatStepper; 

  constructor() {}

  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexOne;
  }

  onNext() {
    this.stepper.selectedIndex = InvoiceSteps.IndexSix;
  }
}
