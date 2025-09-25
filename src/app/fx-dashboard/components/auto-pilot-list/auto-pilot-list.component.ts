import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { of, Subject, takeUntil } from 'rxjs';
import AppPages from '../../../common/constants/AppPages';
import { ConnectorService } from '../../../connector/connector.service';
import { FxRuleFrequency } from '../../../fx-erp-connection/components/fx-conversion/enums/enums';
import { DeleteConversionRuleComponent } from '../delete-conversion-rule/delete-conversion-rule.component';
import { getActiveHedgingCurrency } from '../fx-dashboard-data/active-hedging-currency';
import { userHedgingRule } from '../fx-dashboard-data/user-hedging-rule';
import { customerSupplierList } from '../fx-dashboard-data/customer-supplier-list';
import { getConversionRules } from '../fx-dashboard-data/conversionRules';
import { ConnectorAutoProtectComponent } from '../../../connector/components/connector-auto-protect/connector-auto-protect.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FxErpStepperComponent } from '../../../fx-erp-connection/components/fx-erp-stepper/fx-erp-stepper.component';

@Component({
  selector: 'app-auto-pilot-list',
  templateUrl: './auto-pilot-list.component.html',
  styleUrls: ['./auto-pilot-list.component.scss'],
  imports: [MatSlideToggleModule,MatTabsModule,CommonModule,MatTooltipModule]
})
export class AutoPilotListComponent {
  @Input() conversionData: any;
  isPayableProtectFilled: any;
  automationTableData: any[] = [];
  showLoader!: boolean;
  directionTypeMap: { [key: number]: string } = {
    1: 'Incoming Invoice',
    2: 'Bill',
    3: 'Both'
  };
  isAutomatedHedging: any;
  _onDestroy = new Subject<void>();
  tabindex: number = 0;
  frequencyTypeMap!: typeof FxRuleFrequency;
  isIsraeliUser!: boolean;
  walletList: any;

  constructor(private dialog: MatDialog, private router: Router, private _connectorService: ConnectorService) { }


  ngOnInit() {
    this.checkForSelectedTabIndex();
    const user = JSON.parse(localStorage.getItem('user')!);
    this.isPayableProtectFilled = true;
    this.isAutomatedHedging = true;
    this.isIsraeliUser = true;
    console.log(this.isIsraeliUser);
    console.log('conversion data', this.conversionData)
    this.GetErpCustomerSupplierList();
    this.getAutomationTableData();
    this.getFxConversionRulesData();
    this.getAllCurrencies();
    this.frequencyTypeMap = FxRuleFrequency;
  }

  getAllCurrencies() {
    of(getActiveHedgingCurrency).pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.walletList = res?.supportedHedge;
      },
      error: (err: any) => {
      },
    })
  }

  checkForSelectedTabIndex() {
    this._connectorService.selectedTabIndex$.pipe(takeUntil(this._onDestroy)).subscribe((tabIndex: number) => {
      this.tabindex = tabIndex;
    })
  }

  getFrequencyLabel(value: number): string {
    if (value === FxRuleFrequency.OneTime) {
      return FxRuleFrequency.OneTimeLabel;
    }
    return FxRuleFrequency[value] || '';
  }

  getFxConversionRulesData() {
    of(getConversionRules)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (result: any) => {
          this.conversionData = result;
        },
        error: (err: any) => {
          console.error('Error fetching conversion rules:', err);
        }
      });
  }

  onAutoProtectToggle(event: MatSlideToggleChange): void {
    const requestedState = event.checked;
    const dialogRef = this.dialog.open(ConnectorAutoProtectComponent, {
      width: '465px',
      disableClose: true,
      panelClass: 'connector-auto-protect',
      data: {
        loading: true,
        isAutoProtectEnabled: requestedState,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        event.source.checked = this.isAutomatedHedging;
        return;
      }

      const isConfirmed = result.confirmed;

      // Update the actual state
      this.isAutomatedHedging = isConfirmed;
      this.showLoader = true;
    });
  }

  isRulePaused(rule: any): boolean {
    return !this.isAutomatedHedging || rule.isPaused === true;
  }

  getRuleInnerClasses(rule: any): string {
    const classes = [];

    // Add paused class if rule is paused
    if (this.isRulePaused(rule)) {
      classes.push('rule-paused');
    }

    // You can add other conditional classes here if needed
    // For example, if you want different styling for globally vs individually paused rules:
    if (!this.isAutomatedHedging) {
      classes.push('globally-paused');
    } else if (rule.isPaused === true) {
      classes.push('individually-paused');
    }

    return classes.join(' ');
  }

  autoHedgingPlayPauseActions(status: boolean) {
    this.showLoader = true;
    this.isAutomatedHedging = status;

    this.automationTableData = this.automationTableData.map(rule => {
      rule.isPaused = !status; // true if paused
      return rule;
    });

    // Update conversion data as well
    this.conversionData = this.conversionData.map((rule: any) => {
      rule.isPaused = !status; // true if paused
      return rule;
    });

    this.showLoader = false;
  }

  GetErpCustomerSupplierList() {
    of(customerSupplierList)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (res: any) => {
          this._connectorService.erpCustomerSuppliersListSubject.next(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }


  addNewAutomation() {
    const dialogRef = this.dialog.open(FxErpStepperComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '1627px',
      maxHeight: '966px',
      panelClass: 'fx-erp-dialog',
      disableClose: true,
      data: {
        isNewAutomation: true, // pass data to the dialog
        walletList: this.walletList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getFxConversionRulesData();
    });
  }

  redirectToExposureTable(id: string) {
    this.router.navigate(['/automation'])
    // set the current rule ID in the observable when having converts tab 
    if (this.tabindex === 1) {
      this._connectorService.setCurrentRuleIdSubject(id);
    }
  }

  editRule(rule?: any) {
    // If rule is provided, handle edit for that rule, otherwise fallback
    this._connectorService.openEditCashflowRules(true);
  }


  getAutomationTableData() {
    this.showLoader = true;
    of(userHedgingRule).subscribe({
      // this._connectorService.getAutomationTableData().subscribe({
      next: (res: any) => {
        this.automationTableData = res?.map((r: any) => {
          r.invoiceBillBlacklist = r.invoiceBillBlacklist
            ? r.invoiceBillBlacklist.map((m: any) => m.counterpartyName)
            : [];
          return r;
        });
        this.showLoader = false;
      },
      error: (err) => {
        console.error('Error fetching automation data:', err);
        this.showLoader = false;
      }
    });
  }
  changeStatus(id: any, status?: any) {
    this.showLoader = true;
    if (status === 1) {
      // this._connectorService.disableRuleStatus(id).subscribe({
      //   next: (res: any) => {
      this.showLoader = false;
      this.getFxConversionRulesData();
      //   },
      //   error: (err: any) => {
      //     console.error('Error changing status:', err);
      //     this.showLoader = false;
      //   }
      // });
      return;
    } else if (status === 2) {
      // this._connectorService.enableRuleStatus(id).subscribe({
      //   next: (res: any) => {
      this.showLoader = false;
      this.getFxConversionRulesData();
      //   },
      //   error: (err: any) => {
      //     console.error('Error changing status:', err);
      //     this.showLoader = false;
      //   }
      // });
    }
  }
  deleteRule(id: any) {
    const dialogRef = this.dialog.open(DeleteConversionRuleComponent, {
      width: '465px',
      disableClose: true,
      panelClass: 'convert-delete-panel',
      data: {
        loading: true,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        // this._connectorService.deleteConversionRule(id).subscribe({
        //   next: (res: any) => {
        //     this.showLoader = false;
        //     this.getFxConversionRulesData();
        //   },
        //   error: (err: any) => {
        //     console.error('Error changing status:', err);
        //     this.showLoader = false;
        //   }
        // });
        return;
      }
    });
  }
  ruleStatus(status: number): string {
    switch (status) {
      case 1:
        return 'active';
      case 2:
        return 'disable';
      case 3:
        return 'expired';
      case 4:
        return 'deleted';
      case 5:
        return 'pending';
      default:
        return '';
    }
  }

}
