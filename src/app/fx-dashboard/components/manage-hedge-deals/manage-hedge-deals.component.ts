import { ChangeDetectorRef, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { of, Subject, takeUntil } from 'rxjs';
import { FxDashboardService } from '../../services/fx-dashboard.service';
import { CallPutType, DealStatusType, DealType, HeadgingHeaderEnum, OnLineOffline } from '../../enums/manageHeadging';
import { ManageHedgeDealsFilterComponent } from '../manage-hedge-deals-filter/manage-hedge-deals-filter.component';
import { WalletBalanceListModal } from '../../../common/models/WalletBalanceListModal';
import { saveAs } from 'file-saver';
import * as excel from 'exceljs';
import { hedgeDealTable } from '../fx-dashboard-data/hedgeDealTable';
import { SinglePaymentSendComponent } from '../../../payments/components/single-payment-components/single-payment-send/single-payment-send.component';
import { ExchangeMainComponent } from '../../../payments/components/exchange-now-components/exchange-main/exchange-main.component';
import { PaymentDashboardTransactionComponent } from '../../../payments/components/payment-dashboard-transaction/payment-dashboard-transaction.component';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { ConnectorService } from '../../../connector/connector.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeValuePipe } from "../pipes/safe-value.pipe";
import { ManageDealsSubtableComponent } from '../manage-deals-subtable/manage-deals-subtable.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';

interface HedgeDeal {
  id: number;
  tradeDate: string;
  dealType: number;
  pair: string;
  strike: number;
  amount: string;
  callPutType: number;
  isOnline: boolean;
  expiryDate: string;
  dealStatus: number;
  isProfit: boolean;
  canCloseDeal: boolean;
  isOpen: boolean;
  mainHedgeDealDto?: {
    id: number;
    tradeDate: string;
    dealType: number;
    pair: string;
    strike: number;
    amount: string;
    callPutType: number;
    isOnline: boolean;
    expiryDate: string;
    dealStatus: number;
    isProfit: boolean;
    canCloseDeal: boolean;
    isOpen: boolean;
  };
  hedgeDeals?: HedgeDeal[];
}
export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMM YY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-manage-hedge-deals',
  templateUrl: './manage-hedge-deals.component.html',
  styleUrls: ['./manage-hedge-deals.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  standalone:true,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [
    FormsModule, CommonModule, SafeValuePipe, MatTableModule, ManageDealsSubtableComponent, MatMenuModule, MatSelectModule, NgbPagination,MatDialogModule, MatExpansionModule
  ]
})
export class ManageHedgeDealsComponent implements OnInit {
  lastFilterPayload: any = null;
  private relatedDealIdToExpand: number | null = null;
  @ViewChild(MatSort) sort!: MatSort; // sorting
  searchText: string = '';
  timerSubscription: any;
  activeCurrencyListFilter: any;
  walletList: any;
  @ViewChild(PaymentDashboardTransactionComponent) child!: PaymentDashboardTransactionComponent;
  selectedWallet!: WalletBalanceListModal;
  selectedWalletIndex: number | null = null;
  unSubScribe$ = new Subject<void>();
  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: any = null,
  ) {
    // Ensure dialogData is always an object to avoid null reference errors
    if (this.dialogData == null) {
      this.dialogData = {};
    }
  }

  /**
   * Loads table data, then (if needed) loads info API and expands related deal
   */
  private getHedgeDealsTableWithRelatedDeal() {
    this.showLoader = true;

    const payload: {
      dealTypes: any;
      tradeDateFrom: any;
      tradeDateTo: any;
      expiryDateFrom: any;
      expiryDateTo: any;
      hedgeStatus: any;
      currencies: any;
    } = {
      dealTypes: null,
      tradeDateFrom: null,
      tradeDateTo: null,
      expiryDateFrom: null,
      expiryDateTo: null,
      hedgeStatus: null,
      currencies: null
    };
    of(hedgeDealTable)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (res) => {
          if (res) {
            this.showLoader = false;
            this.hedgingData = res;
            this.page = 1;
            this.setPageData();
            // Now, if info API is needed, call it
            // if (this.dialogData && this.dialogData.erpDataObj) {
            //   this._connectorService.getHedgingInfo(this.dialogData.erpDataObj)
            //     .pipe(takeUntil(this._onDestroy))
            //     .subscribe({
            //       next: (infoRes: any) => {
            //         const result = infoRes.body;
            //         const hedgingInfo = result[0]?.mainHedgeDealDto; // removed result?.hedgingInfo as not getting hedgingInfo in result.
            //         if (hedgingInfo !== null && hedgingInfo !== undefined) {
            //           this.relatedDealIdToExpand = hedgingInfo.id || null; // removed hedgingInfo.relatedId as not getting relatedId in result.
            //           this.expandRelatedDeal();
            //         }
            //       },
            //       error: (err) => {
            //         // Optionally handle error from getHedgingInfo
            //       }
            //     });
            // }
            this.expandRelatedDeal();
          }
        },
        error: (err) => {
          this.showLoader = false;
          // Prefer apiErrorMessages.detail, then detail, then message, then fallback
          //this.errorMessage = err?.error?.apiErrorMessages?.detail || err?.error?.detail || err?.error?.message || err?.message || 'Failed to load hedge deals. Please try again.';
        }
      });
  }

  /**
   * Expands the related deal, navigating to the correct page if needed
   */
  private expandRelatedDeal() {
    if (!this.relatedDealIdToExpand || !this.hedgingData) return;
    // Find the parent deal (main or subdeal)
    let foundDeal = (this.hedgingData as any[]).find((deal: any) => deal.mainHedgeDealDto?.id === this.relatedDealIdToExpand);
    let parentDeal = foundDeal;
    if (!foundDeal) {
      for (const deal of this.hedgingData as any[]) {
        if ((deal as any).hedgeDeals && Array.isArray((deal as any).hedgeDeals)) {
          foundDeal = (deal as any).hedgeDeals.find((sub: any) => sub.id === this.relatedDealIdToExpand);
          if (foundDeal) {
            parentDeal = deal;
            break;
          }
        }
      }
    }
    if (parentDeal && (parentDeal as any).hedgeDeals && (parentDeal as any).hedgeDeals.length > 0) {
      // Find the index of the parent deal in the full data
      const parentIndex = (this.hedgingData as any[]).findIndex((deal: any) => deal.mainHedgeDealDto?.id === (parentDeal as any).mainHedgeDealDto?.id);
      if (parentIndex !== -1) {
        // Calculate the page where this deal appears
        const pageIndex = Math.floor(parentIndex / this.pageSize) + 1;
        if (this.page !== pageIndex) {
          this.page = pageIndex;
          this.setPageData();
        }
        // After pagination, set expandedElement to the correct row
        setTimeout(() => {
          const pagedRow = this.dataSource.data.find((row: any) => (row as any).mainHedgeDealDto?.id === (parentDeal as any).mainHedgeDealDto?.id);
          if (pagedRow) {
            this.expandedElement = pagedRow;
          } else {
            this.expandedElement = parentDeal;
          }
        }, 0);
      }
    }
    this.relatedDealIdToExpand = null;
  }
  displayedColumns: string[] = [
    'id', 'tradeDate', 'dealType', 'callPutType', 'pair', 'strike', 'amount', 'isOnline', 'expiryDate', 'hedgeStatus', 'isProfit', 'canCloseDeal'
  ]; // table columns
  dataSource = new MatTableDataSource<HedgeDeal>(); // data source
  showLoader = false; // loader flag
  expandedElement: any; // expanded element
  page = 1; // page number
  pageSize = 10; // page size per page
  pageSizeOptions = [10, 20, 50, 100]; // page size options for pagination
  private readonly _onDestroy = new Subject<void>(); // unsubscribe
  hedgingData: any; // hedging data
  dealStatusType = DealStatusType; // deal status type enum
  onLineOffline = OnLineOffline; // online offline enum

  ngOnInit() {
    // Always load table data first
    this.getHedgeDealsTableWithRelatedDeal();
    // To reflect the changes of the balanceList
    this._walletService.availableWalletsData.pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
      this.walletList = data || [];
      const baseCurrencyWallet = this.walletList.find((wallet: any) => wallet.wallet_IsBaseCurency == true);
      this.selectedWallet = JSON.parse(localStorage.getItem('activeWallet')!) || baseCurrencyWallet;
      this.selectedWalletIndex = this.walletList.findIndex((wallet: any) => wallet.wallet_Id === this.selectedWallet.wallet_Id);
      this.cd.detectChanges();
    });
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'id':
          return item.mainHedgeDealDto?.id;
        case 'tradeDate':
          return new Date(item.mainHedgeDealDto?.tradeDate);
        case 'dealType':
          return this.getDealTypeName(item.mainHedgeDealDto?.dealType) || '';
        case 'callPutType':
          return this.getPutCall(item.hedgeDeals) || '----';
        case 'pair':
          return this.formatCurrencyPair(item.mainHedgeDealDto?.pair) || '';
        case 'strike':
          return item.mainHedgeDealDto?.strike ?? 0;
        case 'amount':
          return parseFloat(item.mainHedgeDealDto?.amount as any);
        case 'isOnline':
          return item.mainHedgeDealDto?.isOnline;
        case 'expiryDate':
          return new Date(item.mainHedgeDealDto?.expiryDate);
        case 'hedgeStatus':
          return this.getDealStatusName(item.mainHedgeDealDto?.dealStatus) || '';
        case 'isProfit':
          return item.mainHedgeDealDto?.isProfit;
        default:
          return '';
      }
    };
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      filter = filter.trim().toLowerCase();
      const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
      };
      const formatPair = (pair: string) => {
        if (pair?.length === 6) {
          return pair.slice(0, 3) + '/' + pair.slice(3, 6);
        }
        return pair;
      };
      const values = [
        data.mainHedgeDealDto?.id,
        data.mainHedgeDealDto?.tradeDate,
        formatDate(data.mainHedgeDealDto?.tradeDate),
        this.getDealTypeName(data.mainHedgeDealDto?.dealType),
        this.getPutCall(data.hedgeDeals),
        this.formatCurrencyPair(data.mainHedgeDealDto?.pair),
        formatPair(data.mainHedgeDealDto?.pair),
        data.mainHedgeDealDto?.strike,
        data.mainHedgeDealDto?.amount,
        data.mainHedgeDealDto?.isOnline ? this.onLineOffline.Online : this.onLineOffline.Offline,
        data.mainHedgeDealDto?.expiryDate,
        formatDate(data.mainHedgeDealDto?.expiryDate),
        this.getDealStatusName(data.mainHedgeDealDto?.dealStatus),
        data.mainHedgeDealDto?.isProfit,
        data.mainHedgeDealDto?.canCloseDeal
      ];
      return values.some(val => (val !== undefined && val !== null && val.toString().toLowerCase()?.includes(filter)));
    };
  }

  // set page data 
  setPageData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pagedData = this.hedgingData.slice(startIndex, endIndex);

    this.dataSource.data = pagedData;
    this.dataSource.sort = this.sort;
    // Re-apply filter after pagination
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }
  // on page change
  pageChanged(event: number) {
    this.page = event;
    this.setPageData();
  }
  // on page size change 
  onPageSizeChange() {
    this.page = 1;
    this.setPageData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchText = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async closeDeal(list: any) {
    // Open CloseDealComponent as a child dialog. Do NOT close the parent (manage hedge deal) dialog on close.
    const { CloseDealComponent } = await import('../close-deal/close-deal.component');
    this.dialog.open(CloseDealComponent, {
      width: 'auto',
      height: '100vh',
      maxWidth: '506px',
      maxHeight: '694px',
      panelClass: 'close-deal-dialog',
      disableClose: true,
      data: list
    }).afterClosed().subscribe((result: any) => {
      // Only refresh data, do not close this dialog
      if (result) {
        this.getHedgeDealsTable();
      }

    });
  }
  // get hedging data with filter payload
  getHedgeDealsTable(filterPayload?: any) {
    this.showLoader = true;
    // Default payload if no filter applied
    const payload = filterPayload || {
      dealTypes: null,
      tradeDateFrom: null,
      tradeDateTo: null,
      expiryDateFrom: null,
      expiryDateTo: null,
      hedgeStatus: null,
      currencies: null
    };
    of(hedgeDealTable)
      .pipe(takeUntil(this._onDestroy))
      .subscribe((res) => {
        if (res) {
          this.showLoader = false;
          this.hedgingData = res;
          this.page = 1; // Start from first page
          this.setPageData(); // Slice for pagination
        } else {
          this.showLoader = false;
        }
      }, err => {
        this.showLoader = false;
      });
  }

  // get deal type name based on the value
  getDealTypeName(value: number): string {
    return DealType[value];
  }
  // give only 4 decimals
  giveOnlyDecimal(num: number) {
    return num?.toFixed(4);
  }
  // get deal status name
  getDealStatusName(value: number): string {
    return DealStatusType[value] || '-';
  }
  // format currency pair
  formatCurrencyPair(pair: string): string {
    if (pair?.length === 6) {
      return pair.slice(0, 3) + '/' + pair.slice(3, 6);
    }
    return pair; // Return as-is if not 6 characters
  }
  // get call or put based on value
  // have same value in all sub deals then return it for main hedge deal
  getPutCall(hedgeDeals: HedgeDeal[]): string {
    // return '----' if hedgeDeals is null or empty
    if (!hedgeDeals?.length) return '----';

    // take the callPutType from the first deal
    const firstType = hedgeDeals[0].callPutType;

    // check if all hedgeDeals have the same callPutType
    const allSame = hedgeDeals.every(deal => deal.callPutType === firstType);

    // return call or put if all are same, otherwise return '----'
    return allSame
      ? (firstType === CallPutType.Put ? CallPutType.PUT : CallPutType.CALL)
      : '----';
  }

  async openFilter() {
    const { ManageHedgeDealsFilterComponent } = await import('../manage-hedge-deals-filter/manage-hedge-deals-filter.component');
    this.dialog.open(ManageHedgeDealsFilterComponent, {
      width: '100%',
      height: '100vh',
      maxWidth: '745px',
      maxHeight: '866px',
      panelClass: 'hedge-filter-deal',
      disableClose: true,
      data: { filterPayload: this.lastFilterPayload }
    }).afterClosed().subscribe((result: any) => {
      // result: { filteredData, filterPayload }
      if (result && result.filterPayload) {
        // If filter applied but no data, still save filter
        this.lastFilterPayload = result.filterPayload;
        this.getHedgeDealsTable(this.lastFilterPayload);
      }
    });
  }
  createSinglePayment(data?: any) {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(SinglePaymentSendComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
          payment: true,
          benificiaryFromContacts: data,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((shouldReload: any) => {
        // console.log('shouldReload', shouldReload);
        if (shouldReload) {
          this.timerSubscription = shouldReload;
          // this.timerSubscription?.unsubscribe()
        }
        if (shouldReload == 'completedSend') {
          let activeWallet: any = localStorage.getItem('activeWallet');
          let currency = JSON.parse(activeWallet);
          this.activeCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase()?.includes(currency?.wallet_Currency?.code?.toLowerCase()));
          this._walletService.setCurrentCurrencyData(this.activeCurrencyListFilter);
          this.child?.getAllData();
        }
      });
  }
  exchangeNow() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.selectedWallet = this.walletList[0]
    this._walletService.setCurrentCurrencyData(this.selectedWallet)
    this.dialog
      .open(ExchangeMainComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data: any) => {
        if (data == 'convert-completed') {
          this.child?.getAllData();
        }
      });
  }
  // export deals to CSV
  exportData() {
    let data = [];

    for (const item of this.hedgingData) {
      const main = item.mainHedgeDealDto;

      // add main deal row
      data.push({
        [HeadgingHeaderEnum.ID]: main?.id ?? '',
        [HeadgingHeaderEnum.TRADE_DATE]: main?.tradeDate ? this.formatDate(main.tradeDate) : '',
        [HeadgingHeaderEnum.DEAL_TYPE]: this.getDealTypeName(main?.dealType ?? 0),
        [HeadgingHeaderEnum.PUT_CALL]: this.getPutCall(item.hedgeDeals),
        [HeadgingHeaderEnum.CURRENCIES]: main?.pair ? this.formatCurrencyPair(main.pair) : '',
        [HeadgingHeaderEnum.STRIKE]: this.giveOnlyDecimal(main?.strike ?? 0),
        [HeadgingHeaderEnum.AMOUNT]: this.formatAmount(main?.amount),
        [HeadgingHeaderEnum.ONLINE_OFFLINE]: main?.isOnline ? OnLineOffline.Online : OnLineOffline.Offline,
        [HeadgingHeaderEnum.EXPIRY_DATE]: main?.expiryDate ? this.formatDate(main.expiryDate) : '',
        [HeadgingHeaderEnum.HEDGE_STATUS]: main?.dealStatus ? this.getDealStatusName(main.dealStatus) : '',
        [HeadgingHeaderEnum.PL]: main?.isProfit ? 'True' : 'False',
      });

      // add sub deal rows
      if (item.hedgeDeals && item.hedgeDeals.length > 0) {
        for (const sub of item.hedgeDeals) {
          if (sub.id === main?.id) continue; // skip if same as main deal

          data.push({
            [HeadgingHeaderEnum.ID]: sub?.id ?? '',
            [HeadgingHeaderEnum.TRADE_DATE]: sub?.tradeDate ? this.formatDate(sub.tradeDate) : '',
            [HeadgingHeaderEnum.DEAL_TYPE]: this.getDealTypeName(sub?.dealType),
            [HeadgingHeaderEnum.PUT_CALL]: sub?.callPutType === 0 ? CallPutType.PUT : CallPutType.CALL,
            [HeadgingHeaderEnum.CURRENCIES]: sub?.pair ? this.formatCurrencyPair(sub.pair) : '',
            [HeadgingHeaderEnum.STRIKE]: this.giveOnlyDecimal(sub?.strike),
            [HeadgingHeaderEnum.AMOUNT]: this.formatAmount(sub?.amount),
            [HeadgingHeaderEnum.ONLINE_OFFLINE]: sub?.isOnline ? OnLineOffline.Online : OnLineOffline.Offline,
            [HeadgingHeaderEnum.EXPIRY_DATE]: sub?.expiryDate ? this.formatDate(sub.expiryDate) : '',
            [HeadgingHeaderEnum.HEDGE_STATUS]: sub?.dealStatus ? this.getDealStatusName(sub.dealStatus) : '',
            [HeadgingHeaderEnum.PL]: '-',
          });
        }
      }
    }
    this.generateCSV(data, 'manage-headge-deals'); // generate file
  }

  // to generate XLSX file
  generateCSV(data: string | any[], name: string) {
    const workbook = new excel.Workbook();
    const sheet = workbook.addWorksheet(name);

    // add rows
    for (let i = 0; i < data.length; i++) {
      let row = [];
      let key = [];
      for (const property in data[i]) {
        if (i == 0) {
          key.push(property);
        }
        row.push(data[i][property]);
      }
      if (i == 0) {
        sheet.addRows([key]);
      }
      sheet.addRows([row]);
    }

    // bold header
    sheet.getRow(1).font = { bold: true };

    // auto-fit column widths
    sheet.columns.forEach((column) => {
      let maxLength = 10; // default min width
      if (typeof column.eachCell === 'function') {
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 0;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
      }
      column.width = maxLength + 2; // add some padding
    });

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `${name}.xlsx`);
    });
  }

  // format date to dd/MM/yy
  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
  // format amount to 4 decimal places
  formatAmount(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  }
}
