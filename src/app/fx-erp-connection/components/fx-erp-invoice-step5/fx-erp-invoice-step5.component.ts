import { AfterViewInit, Component, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { InvoiceSteps } from '../../../connector/enums/status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fx-erp-invoice-step5',
  templateUrl: './fx-erp-invoice-step5.component.html',
  styleUrls: ['./fx-erp-invoice-step5.component.scss'],
  imports:[CommonModule]
})
export class FxErpInvoiceStep5Component implements AfterViewInit {
  @Input() stepper!: MatStepper; 
  isERPConnected!: number;

  ngOnInit() {
    this.isERPConnected = JSON.parse(localStorage.getItem('user')!)['isERPConnected'];
  }
  ngAfterViewInit() {
    setTimeout(() => {
      let snackbar = document.querySelector('.snackbar-container')!;
      snackbar?.classList?.add('show');
    }, 1000);
  }
  closeMsg() {
    let snackbar = document.querySelector('.snackbar-container')!;
    snackbar?.classList?.remove('show');
  }

  // redirect to the step 4
  onBack() {
    if (this.isERPConnected === 1) {
      this.stepper.selectedIndex = InvoiceSteps.IndexOne;
    } else {
      this.stepper.selectedIndex = InvoiceSteps.IndexTwo;
    }
  }

  // redirect to the step 6
  onNext() {
    this.stepper.selectedIndex = InvoiceSteps.IndexFour;
  }
}
