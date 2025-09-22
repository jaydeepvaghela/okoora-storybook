import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { Subject, takeUntil } from 'rxjs';
import { ConnectorService } from '../../../connector/connector.service';
import { DirectionType, ERPType, InvoiceSteps } from '../../../connector/enums/status';
import { stripDollar } from '../../../connector/stripDollar.util';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectSearchComponent } from '../../../shared/components/mat-select-search/mat-select-search.component';

@Component({
  selector: 'app-fx-erp-invoice-step10',
  templateUrl: './fx-erp-invoice-step10.component.html',
  styleUrls: ['./fx-erp-invoice-step10.component.scss'],
  imports:[ReactiveFormsModule,CommonModule,MatSelectModule,MatChipsModule,MatSelectSearchComponent,LottieComponent]
})
export class FxErpInvoiceStep10Component implements OnInit {
  @Input() autoPilotForm!: FormGroup; // form group for the auto pilot
  @Input() erpCustomerSuppliersList: any = []; // list of erp customer suppliers
  @Input() stepper!: MatStepper;
  @Input() walletList: any; // list of wallets     
  InvoiceBillBlacklist = new FormControl([]); // form control for the invoice blacklist
  excludeContactFilterCnt = new FormControl(''); // form control for the search
  Searchbeneficiaries = 'Search beneficiaries'; // placeholder for the search
  private readonly _onDestroy = new Subject<void>(); // destroy the component
  filteredCustomerSuppliersList: any[] = []; // list after filtering
  importExosureType!: string | null; // 
  isLoading: boolean = false;
  isMissingFunds!: boolean;
  options: AnimationOptions = {
    path: 'assets/images/fx-erp/progress-loader.json',
  };
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '48px',
    margin: '0 auto',
  };
  constructor(private readonly _connectorService: ConnectorService,
    private readonly dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.filteredCustomerSuppliersList = [...this.erpCustomerSuppliersList];
    this.excludeContactSearch();
    this.getSelectedAutoPilot();
    this._connectorService.setSummaryDataFromAPI('');
  }

  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexSeven;
  }

  onNext() {
    this.isLoading = true;
    const {
      invoiceType,
      InvoiceBillMinExposureAmount,
      InvoiceBillMaxExposureAmount,
      InvoiceBillMaxDuePeriod,
      InvoiceBillCurrencies,
      InvoiceBillBlacklist,
    } = this.autoPilotForm.value;

    const directionTypeValue = DirectionType[invoiceType as keyof typeof DirectionType];

    const allCurrencies = this.walletList?.map((c: any) => c.currency?.code);
    const defaultDuePeriod = '1 Year';

    console.log('invoiceType', invoiceType);


    const body: any = {
      DirectionType: directionTypeValue,
      InvoiceBillCurrencies: InvoiceBillCurrencies?.length ? InvoiceBillCurrencies.map((data: any) => data?.currency?.code) : allCurrencies,
      InvoiceBillMinExposureAmount: stripDollar(InvoiceBillMinExposureAmount),
      InvoiceBillMaxExposureAmount: stripDollar(InvoiceBillMaxExposureAmount),
      InvoiceBillMaxDuePeriod: InvoiceBillMaxDuePeriod || defaultDuePeriod,
      InvoiceBillBlacklist:
        Array.isArray(InvoiceBillBlacklist)
          ? InvoiceBillBlacklist.map((item: any) => ({
            counterpartyId: item.id,
            counterpartyType: item.type,
            counterpartyName: item.name,
          }))
          : [],
      ImportExosureType: this.importExosureType,
      createdAt: '',
      updatedAt: '',
    };

    if (this.importExosureType === ERPType.CashFlow.toLowerCase()) {
      body.CashflowCurrencies = InvoiceBillCurrencies?.length ? InvoiceBillCurrencies.map((data: any) => data?.currency?.code) : allCurrencies;
      body.CashflowMinExposureAmount = stripDollar(InvoiceBillMinExposureAmount);
      body.CashflowMaxExposureAmount = stripDollar(InvoiceBillMaxExposureAmount);
      body.CashflowMaxDuePeriod = InvoiceBillMaxDuePeriod || defaultDuePeriod;
    } else {
      body.CashflowCurrencies = null;
      body.CashflowMinExposureAmount = null;
      body.CashflowMaxExposureAmount = null;
      body.CashflowMaxDuePeriod = null;
    }
    this.AddRule(body);
  }
  // to add rule API
  AddRule(body: any): void {
    // this._connectorService
    //   .AddRule(body)
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe({
    //     next: (response: any) => {
    //       const addRuleResponse = response?.body;
    //       this._connectorService.setSummaryDataFromAPI(response?.body);
    //       this.isMissingFunds = addRuleResponse?.isMissingFunds;
    //       this.isLoading = false;
    //       if (this.isMissingFunds) {
    //         const missingFundsData = {
    //           collateralAmount: addRuleResponse.collateralAmount,
    //           missingCollateralAmount: addRuleResponse.missingCollateralAmount,
    //           missingCollateralAmountSign: addRuleResponse.missingCollateralAmountSign,
    //           collateralCurrency: addRuleResponse.collateralCurrency,
    //           collateralCurrencySign: addRuleResponse.collateralCurrencySign,
    //         };
    //         this.openMissingFunds(missingFundsData);
    //       } else {
    //         this.stepper.selectedIndex = InvoiceSteps.IndexNine;
    //       }

    //     },
    //     error: (error) => {
    //       this.isLoading = false;
    //     },
    //   });
      // this.stepper.selectedIndex = InvoiceSteps.IndexNine;
  }

  // to filter the list
  excludeContactSearch() {
    this.excludeContactFilterCnt.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((searchTerm) => {
      if (!searchTerm) {
        this.filteredCustomerSuppliersList = [...this.erpCustomerSuppliersList];
      } else {
        const lowerSearch = searchTerm.toLowerCase();
        this.filteredCustomerSuppliersList = this.erpCustomerSuppliersList.filter((item: any) =>
          item?.name?.toLowerCase().includes(lowerSearch)
        );
      }
    });
  }

  // to remove a vendor
  removeExcludedVendor(vendorToRemove: any) {
    const currentVendors = this.autoPilotForm.get('InvoiceBillBlacklist')?.value || [];
    const updatedVendors = currentVendors.filter((v: any) => v.id !== vendorToRemove.id);
    this.autoPilotForm.get('InvoiceBillBlacklist')?.setValue(updatedVendors);
    this.autoPilotForm.get('InvoiceBillBlacklist')?.markAsDirty();
    this.autoPilotForm.get('InvoiceBillBlacklist')?.markAsTouched();
  }

  // subscribe to the selected ERP type from the service
  getSelectedAutoPilot() {
    this._connectorService.selectedAutoPilot$.subscribe(res => {
      this.importExosureType = res;
    })
  }

  openMissingFunds(missingFundsData: any) {
    this._connectorService.setFromAutoPilot(true);
    // this.dialog
    //   .open(ConnectorMissingComponentComponent, {
    //     width: '600px',
    //     disableClose: true,
    //     panelClass: 'connector-missing-funds',
    //     data: missingFundsData // pass response here
    //   })
    //   .afterClosed()
    //   .subscribe((res) => {
    //     if (res) {
    //       this.stepper.selectedIndex = InvoiceSteps.IndexOne;
    //     }
    //   });
  }
}
