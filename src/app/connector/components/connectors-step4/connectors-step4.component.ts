import { Component, ViewChild, AfterViewInit, Input, ChangeDetectorRef, AfterContentInit, AfterViewChecked } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { timer, takeUntil, switchMap, Subject, take, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { HedgeState, recordType } from '../../enums/status';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConnectorAutoProtectComponent } from '../connector-auto-protect/connector-auto-protect.component';
import { MatStepper } from '@angular/material/stepper';

import { MatSort } from '@angular/material/sort';
import { MatSelect, MatSelectModule } from '@angular/material/select';

import {  ExposureList, getAutomatedHedging } from '../../connectors-data';
import { FxDashboardService } from '../../../fx-dashboard/services/fx-dashboard.service';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { FxErpStepperComponent } from '../../../fx-erp-connection/components/fx-erp-stepper/fx-erp-stepper.component';
import { CommonService } from '../../../common/services/common.service';
import { getActiveHedgingCurrency } from '../../../fx-dashboard/components/fx-dashboard-data/active-hedging-currency';
import { ManageHedgeDealsComponent } from '../../../fx-dashboard/components/manage-hedge-deals/manage-hedge-deals.component';
import { AddContactsComponent } from '../../../contacts-dashboard/components/add-contacts/add-contacts.component';
import { getConversionRules } from '../../../fx-dashboard/components/fx-dashboard-data/conversionRules';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-connectors-step4',
  templateUrl: './connectors-step4.component.html',
  styleUrls: ['./connectors-step4.component.scss'],
  imports:[MatSlideToggleModule,MatTabsModule,CommonModule, TranslateModule, NgbTooltipModule, MatTableModule, MatSelectModule, NgbPaginationModule, FormsModule, ReactiveFormsModule]
})
export class ConnectorsStep4Component implements AfterViewChecked {
  dataSource: MatTableDataSource<any> | undefined;
  convertDataSource: MatTableDataSource<any> | undefined;
  recordType = recordType;
  displayedColumns: string[] = ['displayName', 'status', 'currency', 'total', 'dueDate', 'erpRecordId', 'recordType'];
  displayedColumnsConvert: string[] = ['ruleName', 'sourceNTargetCurrency', 'targetRate', 'executedRate', 'executionDateNTime'];
  @Input() connectorForm: FormGroup | undefined;
  allData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  collectionLength: number = 0;
  convertcollectionLength: number = 0;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatSort) convertSort: MatSort | undefined;
  @ViewChild('ruleNameSelect') ruleNameSelect: MatSelect | undefined;
  private _onDestroy = new Subject<void>();
  exposureData: any;
  hedgeStateLabels: { [key: number]: string } = {
    [HedgeState.Pending]: 'Pending',
    [HedgeState.Hedged]: 'Hedged',
    [HedgeState.Completed]: 'Completed',
    [HedgeState['Missing Collateral']]: 'Missing Collateral',
    [HedgeState['Missing Collateral For Active Deal']]: 'Missing Collateral For Active Deal',
    [HedgeState.Closed]: 'Closed'
  };
  rulesData: any;
  loading: boolean | undefined;
  isAutoProtectEnabled: boolean | undefined;
  selectedExposureType: string | null | undefined;
  isPayableProtectFilled: any;
  exposuteTypeFromAPI: any;
  unsubscribe$ = new Subject<void>();
  selectedTab = 'exposures';
  ruleConvertList: any;
  ruleConvertId: string = ''; // rule convert ID if available
  walletList: any;
  conversionData: any[] = [];
  filteredRuleConvertList: any[]= [];
  isNonisraeliUser: boolean | undefined;
  matchedConvertRule: any;
  latestRuleConvert: any;
  showMatchedConvertRule: boolean = false;
  showLatestRuleConvert: boolean = false;
  selectedRule: any = null;
  activeHedgeCurrencies: any;
  hedgingStatus!: typeof HedgeState;
  constructor(private _connectorService: ConnectorService, public dialog: MatDialog, private headerCommService: CommonService, private stepper: MatStepper, private cdr: ChangeDetectorRef, private commonService: CommonService, private matStepper: MatStepper,
    private _fxDashboardService: FxDashboardService, private _walletService: WalletsService,
  ) {
    //  this.commonService.getErpFlagsFromClientProfile$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
    //   if (res) {
    //     if (!res.isPayableProtectFilled) {
    //       this.matStepper.selectedIndex = 0;
    //     }
    //   }
    // })
  }

  ngOnInit() {
    this.getRuleConvertListById(); // get the current conversion rule ID from the subject

    this.isNonisraeliUser = false
    this.getAllCurrencies();
    this.getActiveHedgingCurrency();
    this.getFxConversionRulesData();
    const user = JSON.parse(localStorage.getItem('user')!);
    this.isAutoProtectEnabled = user['isAutomatedHedging'];
    this.isPayableProtectFilled = user['isPayableProtectFilled'] = true
    this.selectedExposureType = this._connectorService.getSelectedExposureType();
    this._connectorService.ruleResponse$.pipe(take(1)).subscribe({
      next: (response) => {
        const result = response?.body;
        //console.log('Rule Response:', result);
        this.rulesData = result || null;
        // this.loading = false;
      },
      error: (err) => {
        //  console.error('Error reading ruleResponse$:', err);
        // this.loading = false;
      },
    });
    if (this.isPayableProtectFilled) {
      console.log('connector data:', getAutomatedHedging);
      
      this.loading = true;
      of(getAutomatedHedging).subscribe({
        next: (response: any) => {
          
          // console.log('Automated Hedging Response:', response);
          const list = response;
           this.rulesData = list;
          this.exposuteTypeFromAPI = list?.exposureType;
          this._connectorService.setSelectedExposureType(this.exposuteTypeFromAPI);
          this.updateDataSource(list);
         
          console.log(this.rulesData);
          
          this.loading = false;
        },
        error: (error) => {
          //  console.log('Automated Hedging Error:', error);
          this.loading = false;
        }
      });
    }

    // STEP 1: Use initial BehaviorSubject value
    // this._connectorService.approvedList$.pipe(takeUntil(this._onDestroy)).subscribe((list) => {
    //   this.updateDataSource(list);
    // });


    this.hedgingStatus = HedgeState;


    // Show warning messages for 5 seconds if present
    if (this.matchedConvertRule?.status == 3) {
      this.showMatchedConvertRule = true;
      setTimeout(() => {
        this.showMatchedConvertRule = false;
        this.cdr.detectChanges();
      }, 50000);
    }
    if (this.latestRuleConvert) {
      this.showLatestRuleConvert = true;
      setTimeout(() => {
        this.showLatestRuleConvert = false;
        this.cdr.detectChanges();
      }, 55000);
    }

    // STEP 2: Trigger API call every 2 hours with payload
    // timer(7200000, 7200000) // call immediately and every 2 hours
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.loading = true;
    //     this._connectorService.ruleResponse$
    //       .pipe(take(1)) // take latest emitted value only once
    //       .subscribe({
    //         next: (response) => {
    //           const result = response?.body;
    //           const rulesData = result || [];

    //           const currency = rulesData?.colletralCurrency; // replace with dynamic value if needed
    //           const isSync = true;
    //           const collateralAmount = rulesData?.collateralAmount;
    //           const importExposureType = rulesData?.rules?.[0]?.importExosureType;

    //           const payload = {
    //             currency,
    //             isSync,
    //             collateralAmount,
    //             importExposureType,
    //           };
    //           this.loading = true;
    //             of(ExposureList)
    //             .pipe(takeUntil(this._onDestroy))
    //             .subscribe({
    //               next: (list: any) => {
    //                 const data = list;
    //                 this._connectorService.setApprovedList(data); // update BehaviorSubject
    //                 this.loading = false;
    //               },
    //               error: (err: any) => {
    //                 // console.error('Error in listing API with payload:', err);
    //                 this.loading = false;
    //               },
    //             });
    //         },
    //         error: (err) => {
    //           //  console.error('Error reading ruleResponse$:', err);
    //           this.loading = false;
    //         },
    //       });
    //   });
  }
  getAllCurrencies() {
    this._walletService.getAllBalanceList().pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.walletList = res;
      },
      error: (err) => { },
    })
  }

  getActiveHedgingCurrency() {
   of(getActiveHedgingCurrency).pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.activeHedgeCurrencies = res?.supportedHedge;
      },
      error: (err) => { },
    });
  }

  getFxConversionRulesData() {
    of(getConversionRules)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (result: any) => {
          this.conversionData = result;

          const matchedRule = this.conversionData.find(
            rule => rule.id === this.ruleConvertId
          );

          if (matchedRule) {
            console.log('Matched Rule:', matchedRule);
            this.matchedConvertRule = matchedRule;
            // Show warning for 5 seconds
            this.showMatchedConvertRule = true;
            setTimeout(() => {
              this.showMatchedConvertRule = false;
              this.cdr.detectChanges();
            }, 5000);
          } else {
            console.warn(`No rule found for id: ${this.ruleConvertId}`);
          }
        },
        error: (err: any) => {
          console.error('Error fetching conversion rules:', err);
        }
      });
  }



  // private updateDataSource(list: any) {
  //   this.exposureData = list;
  //   console.log('exposureData', this.exposureData);
  //   const invoiceList = list?.invoiceBillResponses ?? []; // fallback to empty array
  //   this.dataSource = new MatTableDataSource(invoiceList);
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     switch (property) {
  //       case 'displayName':
  //         return item.user?.displayName?.toLowerCase() || '';
  //       default:
  //         return item[property];
  //     }
  //   };

  //   this.dataSource.sort = this.sort;
  //   this.filteredData = [...invoiceList]; // ✅ same fix here
  //   this.collectionLength = this.filteredData.length;
  //   this.refreshData();
  // }

  private updateDataSource(list: any) {
    this.exposureData = list;
    //console.log('exposureData', this.exposureData);
    const rawInvoiceList = list?.invoiceBillResponses;
    const allInvoices = rawInvoiceList?.allInvoices || [];
    const invoiceList = rawInvoiceList ? allInvoices : [];

    this.dataSource = new MatTableDataSource(invoiceList);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'displayName':
          return item.user?.displayName?.toLowerCase() || '';
        default:
          return item[property];
      }
    };

    if (this.dataSource && this.sort) {
      this.dataSource.sort = this.sort;
    } else if (this.dataSource) {
      this.dataSource.sort = null;
    }
    this.filteredData = [...invoiceList];
    this.collectionLength = this.filteredData.length;
    this.refreshData();
  }


  ngAfterViewChecked() {
    if (this.selectedTab === 'exposures') {
      if (this.dataSource) {
        this.dataSource.sort = this.sort ?? null;
      }
    } else if (this.selectedTab === 'converts') {
      if (this.convertDataSource) {
        this.convertDataSource.sort = this.convertSort ?? null;
      }
    }
  }

  // Refreshes the data shown in the current page
  refreshData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    if (this.dataSource) {
      this.dataSource.data = this.paginatedData;
    }
    this.cdr.detectChanges();
    // this.loading = false; // Set loading to false after data is refreshed
  }
  refreshConvertData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredRuleConvertList.slice(startIndex, endIndex);
    if (this.convertDataSource) {
      this.convertDataSource.data = this.paginatedData;
    }
    this.cdr.detectChanges();
    // this.loading = false; // Set loading to false after data is refreshed
  }

  // Triggered when the page changes
  pageChanged(newPage: number): void {
    // this.loading = true;
    this.page = newPage;
    this.refreshData();
  }
  convertpageChanged(newPage: number): void {
    // this.loading = true;
    this.page = newPage;
    this.refreshConvertData();
  }

  // Triggered when page size dropdown changes
  onPageSizeChange(): void {
    // this.loading = true;
    this.page = 1;
    this.refreshData();
  }
  onConvertPageSizeChange(): void {
    // this.loading = true;
    this.page = 1;
    this.refreshConvertData();
  }

  // Search filter input event
  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.filteredData = this.allData.filter(user =>
  //     user.currency.toLowerCase().includes(filterValue) ||
  //     user.amount.toLowerCase().includes(filterValue) ||
  //     user.status.toLowerCase().includes(filterValue) ||
  //     user.exposure_type.toLowerCase().includes(filterValue) ||
  //     user.to.toLowerCase().includes(filterValue)

  //   );
  //   this.collectionLength = this.filteredData.length;
  //   this.page = 1;
  //   this.refreshData();
  // }

  // Opens edit modal or section
  editConnectorRules(): void {
    this._connectorService.openEditCashflowRules(true);
  }

  openInfoERPListing(row: any): void {
    if (!row.isRelatedDeals) return;
    const erpDataObj = {
      // erpRecordId: row.erpRecordId,
      // isMissingBeneficiary: row.isMissingBeneficiary,
      // companyName: row.user.displayName,
      // recordType: recordType[row.recordType],
      strategyId : row.strategyId
    };

    this.dialog.open(ManageHedgeDealsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '1412px',
      panelClass: 'manage-hedge-dialog',
      disableClose: true,
      data: {
        erpDataObj: erpDataObj
      }
    });
  }

  getStatusClass(status: string): string {
    //enum HedgeState using now
    switch (status) {
      case 'Closed':
        return 'Closed';
      case 'Completed':
        return 'Completed';
      case 'Hedged':
        return 'Hedged';
      case 'Missing Collateral':
        return 'Missing-collateral';
      case 'Missing Collateral For Active Deal':
        return 'Missing-collateral';
      default:
        return 'Hedged'
    }
  }

  openAddMoney() {
    // this._connectorService.setFromConnector(false);
    this.headerCommService.triggerHeaderMethod();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this._connectorService.setCurrentRuleIdSubject('');
  }
  createBenificiaryDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddContactsComponent, {
      width: '100vw',
      maxWidth: '100vw',
      disableClose: true,
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
        // User cancelled - revert the toggle
        event.source.checked = this.isAutoProtectEnabled ?? false;
        return;
      }

      const isConfirmed = result.confirmed;
      // console.log('Auto Protect Dialog Result:', isConfirmed);

      // Update the actual state
      this.isAutoProtectEnabled = isConfirmed;
      //  console.log('Auto Protect Enabled:', this.isAutoProtectEnabled);
      this.loading = true;
      of(getAutomatedHedging).subscribe({
        next: (response: any) => {
          //  console.log('Automated Hedging Response:', response);
          const list = response;
          this.updateDataSource(list);
          this.loading = false;
          // this.authenticateService.getUserProfile().subscribe((data: any) => {
          //   localStorage.setItem('user', JSON.stringify(data));
          // });
        },
        error: (error) => {
          console.log('Automated Hedging Error:', error);
          this.loading = false;
        }
      });
    });
  }

  redirectToCashflowAPI() {
    // if (this.selectedExposureType == "invoice" || this.exposuteTypeFromAPI == 'invoice') {
    //   this.stepper.selectedIndex = 1;
    //   this._connectorService.setSelectedExposureType("cashflow");
    //   this._connectorService.setCashflowRedirectHandler(true);
    // } else {
    this.stepper.next();
    // }
  }
  // store the selected tab in a variable
  selectTab(tab: 'exposures' | 'converts') {
    this.selectedTab = tab;
  }
  // method to open the edit conversion drawer
  editPopUpRules() {
    this._connectorService.openEditCashflowRules(true);
  }

  /**
   * method to get the rule conversion list
   * if have ruleConvertId, then get the list by that id
   * else get the all the conversion rule list
   */
  getRuleConvertList() {
    of(getConversionRules)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (list: any[]) => {
          this.ruleConvertList = list;
          this.filteredRuleConvertList = list;
          this.convertcollectionLength = list.length;
          this.updateFilteredTable(this.filteredRuleConvertList);

          const latestRecord = [...list].sort((a, b) =>
            new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
          )[0];

          console.log('Latest record:', latestRecord);
          this.latestRuleConvert = latestRecord; // store for later use
          if (this.latestRuleConvert) {
            this.showLatestRuleConvert = true;
            setTimeout(() => {
              this.showLatestRuleConvert = false;
              this.cdr.detectChanges();
            }, 5000);
          }
          this.onConvertPageSizeChange();
        },
        error: (er: any) => {
          console.error('Error fetching rule convert list:', er);
        },
      });
  }
  // method to get the current conversion rule id from the subject
  getRuleConvertListById() {
    this._connectorService
      .getCurrentRuleIdSubject$
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (id: any) => {
          if (id) {
            this.ruleConvertId = id;
            this.selectedTab = 'converts'; // switch to converts tab if id is available
          }
          this.getRuleConvertList(); // always call, with or without id
        }
      });
  }
  getCurrencyData(currencyCode: string) {
    return this.walletList?.find(
      (wallet: { wallet_Currency: { code: string; }; }) => wallet?.wallet_Currency?.code === currencyCode
    )?.wallet_Currency || {};
  }

  getCurrencyFlag(currencyCode: string) {
    return this.getCurrencyData(currencyCode)?.flag || '';
  }

  getCurrencySign(currencyCode: string) {
    return this.getCurrencyData(currencyCode)?.sign || '';
  }

  onRuleNameChange(ruleId: string) {
    this.selectedRule = this.conversionData.find(rule => rule.id === ruleId) || null;

    this.filteredRuleConvertList = this.ruleConvertList.filter(
      (rule: any) => rule.ruleName === this.selectedRule.ruleName
    );

    this.updateFilteredTable(this.filteredRuleConvertList);
  }

  updateFilteredTable(data: any[]) {
    this.convertDataSource = new MatTableDataSource(data);
    this.convertDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'ruleName':
          return item.ruleName?.toLowerCase() || '';
        case 'executionDateNTime':
          return new Date(item.executedAt).getTime() || 0; // for date sorting
        default:
          return item[property];
      }
    };
    this.convertDataSource.sort = this.convertSort ?? null;
    this.convertcollectionLength = this.convertDataSource.data.length;
  }

  setNewRule() {
    this.dialog.open(FxErpStepperComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '1627px',
      maxHeight: '966px',
      panelClass: 'fx-erp-dialog',
      disableClose: true,
      data: {
        isNewAutomation: true,
        walletList: this.activeHedgeCurrencies,
      }
    });
  }
  getAllRuleConvertList() {
    this.ruleConvertId = '';
    this.getRuleConvertList();
    this.selectedRule = null;
    if (this.ruleNameSelect) {
      this.ruleNameSelect.close();
    }
  }
}