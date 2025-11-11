import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { of, Subject, take, takeUntil } from 'rxjs';
import { ConnectorService } from '../../../connector/connector.service';
import { InvoiceSteps } from '../../../connector/enums/status';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ruleSummaryData } from '../fx-conversion-data/rule-summary-data';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-fx-erp-invoice-step11',
  templateUrl: './fx-erp-invoice-step11.component.html',
  styleUrls: ['./fx-erp-invoice-step11.component.scss'],
  imports:[CommonModule,NgbTooltipModule,FormsModule,MatCheckboxModule]
})
export class FxErpInvoiceStep11Component implements OnDestroy {
  @Input() stepper!: MatStepper;
  @Input() walletList: any = [];

  isInvoiceType!: boolean;
  summaryData: any;
  firstTwoNames: string = '—';
  remainingCount: number = 0;
  walletData: any;
  checkboxChecked: any;
  showCheckboxError!: boolean;
  isLoading = false;
  _onDestroy = new Subject<void>();
  rulesData: any;
  isFromCashFlowAPI: any;
  directionTypeMap: { [key: number]: string } = {
    1: 'Incoming Invoice',
    2: 'Bill',
    3: 'Both'
  };

  constructor(private readonly _connectorService: ConnectorService, private readonly router: Router, private readonly dialog: MatDialog
  ) { }

  ngOnInit() {
    this._connectorService.selectedAutoPilot$
      .pipe(take(1))
      .subscribe(roleType => {
        this.isInvoiceType = roleType?.toLowerCase() === 'invoice';
      });
    this.setSummaryData();
  }

  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexEight;
  }

  setSummaryData() {
    of(ruleSummaryData)
    .pipe(takeUntil(this._onDestroy))
    .subscribe((res: any) => {
      this.summaryData = res?.rules;
      this.rulesData = res;
      const list = this.summaryData?.[0]?.invoiceBillBlacklist;
      this.walletList = this.walletList?.map((c: any) => c.currency?.code) || [];

      if (Array.isArray(list) && list.length > 0) {
        const names = list.map((item: any) => item?.counterpartyName);
        this.firstTwoNames = names.slice(0, 2).join(', ');
        this.remainingCount = names.length > 2 ? names.length - 2 : 0;
      } else {
        this.firstTwoNames = '—';
        this.remainingCount = 0;
      }
    })
  }

  confirmSummary() {
 if (!this.checkboxChecked) {
      this.showCheckboxError = true;
      return; // Stop further execution
    }
          const currency = this.rulesData?.collateralCurrency ? this.rulesData?.collateralCurrency : null;
          const isSync = this.checkboxChecked;
          const collateralAmount = this.rulesData?.collateralAmount;
          const importExposureType = this.rulesData?.rules?.[0]?.importExosureType;

          const payload = {
            currency: currency,
            isSync: isSync,
            collateralAmount: collateralAmount,
            importExposureType: importExposureType
          };
          console.log("payload", payload);
          this.isLoading = true;
          // if(!this.isFromCashFlowAPI) {
                  // this._connectorService
            // .GetFilteredInvoiceBillList(payload)
            // .pipe(takeUntil(this._onDestroy))
            // .subscribe({
            //   next: (res: any) => {
            //     if (res) {
            //          setTimeout(() => {
            //         this.getUpdatedUserProfile();
            //       }, 1000);
            //       this.isLoading = false;
            //       const data = res;
            //       this._connectorService.setApprovedList(data);
            //     }
            //   },
            //   error: (err:any) => {
            //     this.isLoading = false;
            //   }
            // });
            this.stepper.selectedIndex = InvoiceSteps.IndexTen;
          }
  
  getUpdatedUserProfile() {
    // this._authService.getUserProfile().subscribe(res => {
    //    localStorage.setItem('user', JSON.stringify(res));
    // });
  }

   ngOnDestroy(){
   this._onDestroy.next();
   this._onDestroy.complete();
  }
}
