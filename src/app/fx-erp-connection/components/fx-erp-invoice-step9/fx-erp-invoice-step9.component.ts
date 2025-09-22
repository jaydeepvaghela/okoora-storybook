import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ConnectorService } from '../../../connector/connector.service';
import { InvoiceSteps } from '../../../connector/enums/status';
import { MatRadioModule } from '@angular/material/radio';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fx-erp-invoice-step9',
  templateUrl: './fx-erp-invoice-step9.component.html',
  styleUrls: ['./fx-erp-invoice-step9.component.scss'],
  imports:[ReactiveFormsModule,MatRadioModule,NgbTooltipModule,CommonModule]
})
export class FxErpInvoiceStep9Component {
  @Input() autoPilotForm!: FormGroup; // form group for the auto pilot
  InvoiceBillMaxDuePeriod = new FormControl([]); // form control for the invoice max due period

  dueDateOptions = [
    { label: '+24 hours', value: '24 Hours' },
    { label: '+7 Days', value: '7 Days' },
    { label: '+30 Days', value: '1 Month' },
    { label: '+3 Month', value: '3 Months' }
  ];

  protectionOptions = [
    {
      description: 'Protect invoices scheduled for payment within the next day',
      label: 'Due in next 24 hours'
    },
    {
      description: 'Protect invoices due in the upcoming week',
      label: 'Due in next 7 days'
    },
    {
      description: 'Most common choice — protects invoices due soon',
      label: 'Due in next 30 days'
    },
    {
      description: 'Wider coverage for mid-term invoices',
      label: 'Due in next 3 months'
    }
  ];

  @Input() stepper!: MatStepper; 

  constructor(private _connectorService: ConnectorService) {}
  
  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexSix;
  }

  onNext() {
      this.stepper.selectedIndex = InvoiceSteps.IndexEight;
  }
}
