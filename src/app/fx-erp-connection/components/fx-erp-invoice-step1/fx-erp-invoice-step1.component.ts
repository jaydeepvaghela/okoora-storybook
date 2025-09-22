import { Component, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { InvoiceSteps } from '../../../connector/enums/status';

@Component({
  selector: 'app-fx-erp-invoice-step1',
  templateUrl: './fx-erp-invoice-step1.component.html',
  styleUrls: ['./fx-erp-invoice-step1.component.scss']
})
export class FxErpInvoiceStep1Component {
  @Input() stepper!: MatStepper; 
  constructor() {}
  // redirect to the step 2
  nextStep() {
    this.stepper.selectedIndex = InvoiceSteps.IndexOne;
  }
}
