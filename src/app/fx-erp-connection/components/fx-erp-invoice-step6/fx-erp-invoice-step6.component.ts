import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { InvoiceSteps } from '../../../connector/enums/status';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-fx-erp-invoice-step6',
  templateUrl: './fx-erp-invoice-step6.component.html',
  styleUrls: ['./fx-erp-invoice-step6.component.scss'],
  imports:[MatRadioModule,ReactiveFormsModule]
})
export class FxErpInvoiceStep6Component  implements OnInit{
  @Input() stepper!: MatStepper; 
  @Input() autoPilotForm!: FormGroup; // form group for the auto pilot
  
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    if(!this.autoPilotForm.get('invoiceType')?.value){
      this.autoPilotForm.patchValue({ invoiceType: 'Both' });
    }
  }

  // redirect to the step 5
  onBack() {
      this.stepper.selectedIndex = InvoiceSteps.IndexThree;
  }

  // redirect to the step 7
  onNext() {
    this.stepper.selectedIndex = InvoiceSteps.IndexFive;
  }
}
