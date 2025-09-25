import { Component, ComponentRef, Injector, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { ConnectorService } from '../../../connector/connector.service';
import { ERPType, InvoiceSteps } from '../../../connector/enums/status';
import AppPages from '../../../common/constants/AppPages';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fx-erp-invoice-step2',
  templateUrl: './fx-erp-invoice-step2.component.html',
  styleUrls: ['./fx-erp-invoice-step2.component.scss'],
  imports:[NgbTooltipModule,CommonModule,]
})
export class FxErpInvoiceStep2Component implements OnInit {
  @Input() stepper!: MatStepper;
  @Input() autoPilotForm!: FormGroup; // form group for the auto pilot
  erpOptionType = ERPType; // enum for ERP types
  @Input() walletList: any = [];
  ERPType = ERPType; // enum for ERP types
  isPayableProtectFilled: any;
  isSelectedSameAsPrevious: boolean = false;
  previousValue: string | null = null;
  selectedAutoPilot: any;
  @ViewChild('dynamicHost', { read: ViewContainerRef, static: true })
  dynamicHost!: ViewContainerRef;
  showConversion: boolean = false; // flag to show conversion option
  constructor(private readonly _connectorService: ConnectorService,
    private readonly dailog: MatDialog, private readonly router: Router, private injector: Injector
  ) {
  }
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.isPayableProtectFilled = user['isPayableProtectFilled'];
    this.showConversion = user?.afiiliate?.currency.toLowerCase() == 'ils'; // check if conversion is enabled
    this.getSelectedAutoPilot(); // for check only the cuurent selected value
  }

  // redirect to the step 1
  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexZero;
  }

  // check previous and cuurent selected value
  getSelectedAutoPilot() {
    this._connectorService.selectedAutoPilot$
      .pipe(
        filter(current => current !== null && current !== '') // skip null/empty
      )
      .subscribe(current => {
        this.selectedAutoPilot = current;
        if (this.previousValue !== null) {
          this.isSelectedSameAsPrevious = this.previousValue === current; // set flag true if same
          console.log('Previous:', this.previousValue, 'Current:', current, 'Flag (same?):', this.isSelectedSameAsPrevious);
          if (!this.isSelectedSameAsPrevious) {
            this.autoPilotForm.reset();
          }
        } else {
          console.log('First value received:', current);
        }
        // update previous value
        this.previousValue = current;
      });
  }

  erpType(type: string) {
    debugger
    this._connectorService.setSelectedAutoPilot(type);
    const isERPConnected = JSON.parse(localStorage.getItem('user')!)['isERPConnected'];
    if (type.toLowerCase() === 'conversion') {
      this.stepper.selectedIndex = 0; // optional
      return;
    } else {
      if (!this.isPayableProtectFilled) {
        this.stepper.selectedIndex = InvoiceSteps.IndexZero;
        // redirect to the step 3 for both invoice and cash flow
        if (isERPConnected === 1) {
          this.stepper.selectedIndex = InvoiceSteps.IndexThree;
        } else {
          this.stepper.selectedIndex = InvoiceSteps.IndexTwo;
        }
      }
      else {
        this.dailog.closeAll();
        // this.route.navigateByUrl('/payablesprotect');
        this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + `${AppPages.Automations}` : `${AppPages.Automations}`])
      }
    }
    // store the selected ERP type in the service

  }
}
