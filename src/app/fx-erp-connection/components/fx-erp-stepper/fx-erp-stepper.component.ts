import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { of, Subject, takeUntil } from 'rxjs';
import { customerSupplierList } from '../../../fx-dashboard/components/fx-dashboard-data/customer-supplier-list';
import { getActiveHedgingCurrency } from '../../../fx-dashboard/components/fx-dashboard-data/active-hedging-currency';
import { InvoiceSteps } from '../../../connector/enums/status';
import { ConnectorService } from '../../../connector/connector.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FxErpInvoiceStep1Component } from '../fx-erp-invoice-step1/fx-erp-invoice-step1.component';
import { CommonModule } from '@angular/common';
import { FxErpInvoiceStep2Component } from '../fx-erp-invoice-step2/fx-erp-invoice-step2.component';
import { FxErpInvoiceStep3Component } from '../fx-erp-invoice-step3/fx-erp-invoice-step3.component';
import { FxErpInvoiceStep5Component } from '../fx-erp-invoice-step5/fx-erp-invoice-step5.component';
import { FxErpInvoiceStep6Component } from '../fx-erp-invoice-step6/fx-erp-invoice-step6.component';
import { FxErpInvoiceStep7Component } from '../fx-erp-invoice-step7/fx-erp-invoice-step7.component';
import { FxErpInvoiceStep8Component } from '../fx-erp-invoice-step8/fx-erp-invoice-step8.component';
import { FxErpInvoiceStep9Component } from '../fx-erp-invoice-step9/fx-erp-invoice-step9.component';
import { FxErpInvoiceStep10Component } from '../fx-erp-invoice-step10/fx-erp-invoice-step10.component';
import { FxErpInvoiceStep11Component } from '../fx-erp-invoice-step11/fx-erp-invoice-step11.component';
import { FxErpInvoiceStep12Component } from '../fx-erp-invoice-step12/fx-erp-invoice-step12.component';
import { FxConversionSteppersComponent } from '../fx-conversion/components/fx-conversion-steppers/fx-conversion-steppers.component';

@Component({
  selector: 'app-fx-erp-stepper',
  templateUrl: './fx-erp-stepper.component.html',
  styleUrls: ['./fx-erp-stepper.component.scss'],
  imports:[MatStepperModule,MatProgressBarModule,CommonModule,FxErpInvoiceStep1Component,FxErpInvoiceStep2Component,FxErpInvoiceStep3Component,FxErpInvoiceStep5Component,FxErpInvoiceStep6Component,FxErpInvoiceStep7Component,FxErpInvoiceStep8Component,FxErpInvoiceStep9Component,FxErpInvoiceStep10Component,FxErpInvoiceStep11Component,FxErpInvoiceStep12Component,ReactiveFormsModule,MatDialogModule, FxConversionSteppersComponent]
})
export class FxErpStepperComponent implements OnInit, AfterViewInit, OnDestroy{
  inVoiceSteps = InvoiceSteps; // invoice flow steps enum
  @ViewChild('stepper') formStepper!: MatStepper;
  autoPilotForm!: FormGroup;
  _onDestroy = new Subject<void>();
  erpCustomerSuppliersList: any = [];
  selectedStepIndex: any;
  walletList: any = [];
  summaryList:any;
  selectedType: any;
  
  constructor(private readonly _connectorService: ConnectorService,
    private readonly fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data:any, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createAutoPilotForm();
    this.GetErpCustomerSupplierList();

    if (this.data && this.data?.walletList) {
      this.walletList = this.data.walletList;
    } else {
      this.getAllCurrencies();
    }
    this._connectorService.selectedAutoPilot$
      .pipe(takeUntil(this._onDestroy))
      .subscribe((res: any) => {
        if (res) {
          this.selectedType = res;
          console.log('Selected Auto Pilot Type:', this.selectedType);
          this.cdr.detectChanges();
        }
      });

     
  }

  closeDrawer() {
     this._connectorService.setSelectedAutoPilot('');
  }

  ngAfterViewInit() {
       if(this.data?.isNewAutomation) {
        this.formStepper.selectedIndex = InvoiceSteps.IndexOne; 
      }
    }

  // create the auto pilot form for all the steps
  createAutoPilotForm() {
    this.autoPilotForm = this.fb.group({
      ImportExosureType: [''],
      invoiceType: [''],
      InvoiceBillCurrencies: [''],
      InvoiceBillMinExposureAmount: [''],
      InvoiceBillMaxExposureAmount: [''],
      InvoiceBillMaxDuePeriod: [''],
      InvoiceBillBlacklist: ['']
    });
  }
  // get the erp customer supplier list
  GetErpCustomerSupplierList() { 
    of(customerSupplierList)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (res:any) => {
          this.erpCustomerSuppliersList = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  // destroy the component
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // get all the currencies
  getAllCurrencies() {
     of(getActiveHedgingCurrency).pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res:any) => {
        this.walletList  = res?.supportedHedge;
       
      },
      error: (err) => { },
     })
  }

  summaryData(event:any){
    this.summaryList = event;
  }

  handleBackToErp() {
  this.selectedType = null; // or 'invoice' or whatever represents ERP
  this.cdr.detectChanges(); // optional, if needed
}
}
