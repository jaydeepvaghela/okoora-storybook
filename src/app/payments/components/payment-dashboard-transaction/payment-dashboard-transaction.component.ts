import { Component, HostListener, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { of, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { balanceList } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { TransactionStatusPayment } from '../../enums/TransactionStatusPayment.enum';
import { WalletBalanceListModal } from '../../../main-dashboard/models/WalletBalanceListModal';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { AccountTransactionsData } from '../../payments-data/account-transactions-data';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectSearchComponent } from '../../../shared/components/mat-select-search/mat-select-search.component';
import { PaymentCalendarHeaderComponent } from '../../../shared/components/payment-calendar-header/payment-calendar-header.component';
import { SinglePaymentSendComponent } from '../single-payment-components/single-payment-send/single-payment-send.component';
import { MassPaymentComponent } from '../mass-payment-components/mass-payment/mass-payment.component';
@Component({
  selector: 'app-payment-dashboard-transaction',
  templateUrl: './payment-dashboard-transaction.component.html',
  styleUrls: ['./payment-dashboard-transaction.component.scss'],
  imports: [CommonModule, MatMenuModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatDateRangePicker, MatTableModule, MatDividerModule, FormsModule, NgbPaginationModule, MatSelectSearchComponent, SinglePaymentSendComponent],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PaymentDashboardTransactionComponent {
  walletTransaction: any;
  transactionFilter!: FormGroup;
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay: string[] = ['flag', 'Action', 'WalletCharged', 'Duedate', 'Status', 'Amount', 'TransferDetails'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any;
  showLoader: boolean = false;
  walletList: any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activeCurrencyListFilter: any;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  @ViewChild(NgbPagination)
  ngbPagination!: NgbPagination;
  today = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  maxDate: any;
  walletTransactionAll: any;
  customCalendarHeader = PaymentCalendarHeaderComponent;
  searchFlag: boolean = true;
  userRoleType!: number;
  transactionDetails: any;
  transactionStatusPayment = TransactionStatusPayment;
  multiFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  filteredCurrencies: ReplaySubject<WalletBalanceListModal[]> = new ReplaySubject<WalletBalanceListModal[]>(1);
  collectionLength!: number;
  pageSize!: number;
  page = 1;
  numberOfPages!: number;
  finalTableData: any[] = [];
  isTooltipLeft: boolean = false;
  isTooltipBottom: boolean = false;
  pdfPreviewFirst!: string;
  zoom: number = 1.0;
  isAfiiliate: boolean = false;
  affiliateCountry!: string;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); }

  ngOnInit() {
    this.pageSize = 10;
    this.page = 1;
    this.getAllData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateTooltipPlacement();
  }

  ngAfterViewInit() {
    this.getPaginationList();
    this.updateTooltipPlacement();
  }

  updateTooltipPlacement() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1440 && screenWidth >= 1025) {
      this.isTooltipBottom = true;
      this.isTooltipLeft = false;
    }
    else if (screenWidth <= 1024) {
      this.isTooltipLeft = true;
      this.isTooltipBottom = false;
    }
  }

  getPaginationList() {
    if (this.ngbPagination) {
      this.ngbPagination.pageSize = this.pageSize;
      this.ngbPagination.page = this.page;
      this.ngbPagination.collectionSize = this.walletTransactionAll?.length;
      this.collectionLength = this.ngbPagination?.collectionSize;
    }
  }

  getAllData() {
    // this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    this.transactionFilter = new FormGroup({
      currency: new FormControl(''),
      start: new FormControl(moment().subtract(1, 'months').add(1, 'day').toDate(), [Validators.required]),
      end: new FormControl(moment().toDate()),
    });
    this.showLoader = true
    of(balanceList).pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res) => {
        this.showLoader = false
        res.sort(function (a: any, b: any) { return b.wallet_Amount - a.wallet_Amount });
        this.walletList = res;
        this.filteredCurrencies.next(this.walletList.slice());
        this.multiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this._currencyFilter();
          });
        this.activeCurrencyListFilter = res;
        this.getPaginationList();
        this.allTransactionData();
      }, error: (err) => {
        this.showLoader = false;
        this.calculatePages();
        // this.dataSource = new MatTableDataSource([]);
      }
    }
    )
  }

  private _currencyFilter() {
    if (!this.walletList) {
      return;
    }

    let searchTerm = this.multiFilterCtrl.value;
    if (!searchTerm) {
      this.filteredCurrencies.next(this.walletList.slice());
      return;
    } else {
      searchTerm = searchTerm.toLowerCase();
    }

    this.filteredCurrencies.next(
      this.walletList.filter((wallet: WalletBalanceListModal) => wallet?.wallet_Currency?.code.toLowerCase().indexOf(searchTerm) > -1)
    );
  }

  getInitialTransactions() {
    if (this.walletList?.length !== 0) {
      this.getPaginationList();
      this.calculatePages();
      if (this.walletTransactionAll?.length !== 0) {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.dataSource = new MatTableDataSource(this.finalTableData.slice(startIndex, endIndex));
        this.calculatePages();
      }
    }
  }
  calculatePages(): void {
    this.collectionLength = this.walletTransactionAll?.length;
    this.numberOfPages = Math.ceil(this.collectionLength / this.pageSize);
  }

  closeMenu(): void {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }

  SearchBarVisible() {
    this.searchFlag = !this.searchFlag;
  }

  pageChanged(event: any): void {
    this.page = event;
    this.getInitialTransactions();
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.getInitialTransactions();
  }

  filterData() {
    var data = {
      MainTypes: [1, 2, 10],
      ExecutedOn: {
        From: this.transactionFilter.get('start')?.value ? moment(this.transactionFilter.get('start')?.value).format('DD-MM-YYYY') : '',
        To: this.transactionFilter.get('end')?.value ? moment(this.transactionFilter.get('end')?.value).format('DD-MM-YYYY') : '',
      },
      Currencies: this.transactionFilter.get('currency')?.value ? this.transactionFilter.get('currency')?.value.map((item: any) => item?.wallet_Currency?.code) : ''
    };
    this.showLoader = true;
    of(AccountTransactionsData).subscribe(
      (res) => {
        this.showLoader = false;
        this.walletTransaction = res;
        this.walletTransactionAll = res;
        let finalTableDatas = [];
        for (let index = 0; index < this.walletTransaction?.length; index++) {
          let formatedTables = {
            mainType: this.walletTransaction[index]?.mainType ? this.walletTransaction[index]?.mainType : '-',
            Action:
              this.walletTransaction[index]?.mainType == 1 && this.walletTransaction[index]?.moneyTransferred != null && this.walletTransaction[index]?.moneyReceived != null
                ? 'Payment & Exchange'
                : this.walletTransaction[index]?.mainType == 2
                  ? 'Exchange'
                  : this.walletTransaction[index]?.mainType == 1 && this.walletTransaction[index]?.moneyTransferred != null && this.walletTransaction[index]?.moneyReceived == null
                    ? 'Send money'
                    : this.walletTransaction[index]?.mainType == 10
                      ? 'Future Payment'
                      : '-',
            moneyTransferredFlag: this.walletTransaction[index]?.moneyTransferred?.currency?.flag || '-',
            moneyReceivedFlag: this.walletTransaction[index]?.moneyReceived?.currency?.flag || '-',
            WalletCharged:
              this.walletTransaction[index]?.mainType == 2 ||
                (this.walletTransaction[index]?.mainType == 1 && this.walletTransaction[index]?.moneyTransferred != null && this.walletTransaction[index]?.moneyReceived != null)
                ? this.walletTransaction[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  ? this.walletTransaction[index]?.moneyTransferred?.currency?.sign + this.walletTransaction[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  : '-'
                : (this.walletTransaction[index]?.mainType == 1 && this.walletTransaction[index]?.moneyTransferred != null && this.walletTransaction[index]?.moneyReceived == null) ||
                  this.walletTransaction[index]?.mainType == 10
                  ? this.walletTransaction[index]?.to?.name
                  : '-',
            Duedate: this.walletTransaction[index]?.submitedOn ? this.formatDate(new Date(this.walletTransaction[index]?.submitedOn)) : '-',
            Status: TransactionStatusPayment[this.walletTransaction[index]?.traferStatus],
            Amount:
              this.walletTransaction[index]?.mainType == 10 || this.walletTransaction[index]?.mainType == 2
                ? this.walletTransaction[index]?.moneyReceived?.amount
                  ? this.walletTransaction[index]?.moneyReceived?.currency?.sign + this.walletTransaction[index]?.moneyReceived?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  : '-'
                : this.walletTransaction[index]?.mainType == 1
                  ? this.walletTransaction[index]?.moneyTransferred?.amount
                    ? this.walletTransaction[index]?.moneyTransferred?.currency?.sign + this.walletTransaction[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    : '-'
                  : '-',
            moneyTransferredReadyToUse: this.walletTransaction[index]?.moneyTransferred?.readyToUse
              ? this.walletTransaction[index]?.moneyTransferred?.currency?.sign + this.walletTransaction[index]?.moneyTransferred?.readyToUse?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            Currency: this.walletTransaction[index]?.moneyTransferred?.currency?.code || '-',
            Fee: this.walletTransaction[index]?.fee?.amount
              ? this.walletTransaction[index]?.fee?.currency?.sign + this.walletTransaction[index]?.fee?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            Commission: this.walletTransaction[index]?.commission || '-',
            exeutedOn: this.walletTransaction[index]?.exeutedOn ? this.formatDate(new Date(this.walletTransaction[index]?.exeutedOn)) : '-',
            Buying: this.walletTransaction[index]?.moneyReceived !== null ?
              this.walletTransaction[index]?.moneyReceived?.currency?.code +
              ' (' +
              this.walletTransaction[index]?.moneyReceived?.currency?.sign +
              this.walletTransaction[index]?.moneyReceived?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
              ')' : '-',
            Selling:
              this.walletTransaction[index]?.moneyTransferred?.currency?.code +
              ' (' +
              this.walletTransaction[index]?.moneyTransferred?.currency?.sign +
              this.walletTransaction[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
              ')',
            moneyReceiveReadyToUse: this.walletTransaction[index]?.moneyReceived?.readyToUse
              ? this.walletTransaction[index]?.moneyReceived?.currency?.sign + this.walletTransaction[index]?.moneyReceived?.readyToUse?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            Transferamount: this.walletTransaction[index]?.moneyTransferred?.amount
              ? this.walletTransaction[index]?.moneyTransferred?.currency?.sign + this.walletTransaction[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            moneyTransferredexchangeRate: this.walletTransaction[index]?.moneyTransferred?.exchangeRate,
            moneyReceivedexchangeRate: this.walletTransaction[index]?.moneyReceived?.exchangeRate,
            moneyTransferredSign: this.walletTransaction[index]?.moneyTransferred?.currency?.sign,
            moneyReceivedSign: this.walletTransaction[index]?.moneyReceived?.currency?.sign,
            moneyTransferred: this.walletTransaction[index]?.moneyTransferred,
            moneyReceived: this.walletTransaction[index]?.moneyReceived,
            from: this.walletTransaction[index]?.from,
            traferStatus: this.walletTransaction[index]?.traferStatus
          };
          finalTableDatas.push(formatedTables);
        }
        this.calculatePages();
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.dataSource = new MatTableDataSource(finalTableDatas.slice(startIndex, endIndex));
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.showLoader = false;
      }
    );
  }

  allTransactionData() {
    var data = {
      MainTypes: [1, 2, 10],
      ExecutedOn: {
        From: this.transactionFilter.get('start')?.value ? moment(this.transactionFilter.get('start')?.value).format('DD-MM-YYYY') : '',
        To: this.transactionFilter.get('end')?.value ? moment(this.transactionFilter.get('end')?.value).format('DD-MM-YYYY') : '',
      },
      Currencies: this.transactionFilter.get('currency')?.value ? this.transactionFilter.get('currency')?.value.map((item: any) => item?.wallet_Currency?.code) : ''
    };
    this.showLoader = true;
    of(AccountTransactionsData).subscribe(
      (res) => {
        this.showLoader = false;
        this.walletTransactionAll = res;
        this.walletTransaction = this.walletTransactionAll;
        this.transactionDetails = res;
        this.finalTableData = [];
        for (let index = 0; index < this.walletTransactionAll?.length; index++) {
          let formatedTable = {
            mainType: this.walletTransactionAll[index]?.mainType ? this.walletTransactionAll[index]?.mainType : '-',
            Action:
              this.walletTransactionAll[index]?.mainType == 1 && this.walletTransactionAll[index]?.moneyTransferred != null && this.walletTransactionAll[index]?.moneyReceived != null
                ? 'Payment & Exchange'
                : this.walletTransactionAll[index]?.mainType == 2 && this.walletTransactionAll[index]?.submitedOn !== this.walletTransactionAll[index]?.exeutedOn
                  ? 'Future Exchange'
                  : this.walletTransactionAll[index]?.mainType == 2
                    ? 'Exchange'
                    : this.walletTransactionAll[index]?.mainType == 1 && this.walletTransactionAll[index]?.moneyTransferred != null && this.walletTransactionAll[index]?.moneyReceived == null
                      ? 'Send money'
                      : this.walletTransactionAll[index]?.mainType == 10
                        ? 'Future Payment'
                        : '-',
            moneyTransferredFlag: this.walletTransactionAll[index]?.moneyTransferred?.currency?.flag || '-',
            moneyReceivedFlag: this.walletTransactionAll[index]?.moneyReceived?.currency?.flag || '-',
            WalletCharged:
              this.walletTransactionAll[index]?.mainType == 2 ||
                (this.walletTransactionAll[index]?.mainType == 1 && this.walletTransactionAll[index]?.moneyTransferred != null && this.walletTransactionAll[index]?.moneyReceived != null)
                ? this.walletTransactionAll[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  ? this.walletTransactionAll[index]?.moneyTransferred?.currency?.sign +
                  this.walletTransactionAll[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  : '-'
                : (this.walletTransactionAll[index]?.mainType == 1 && this.walletTransactionAll[index]?.moneyTransferred != null && this.walletTransactionAll[index]?.moneyReceived == null) ||
                  this.walletTransactionAll[index]?.mainType == 10
                  ? this.walletTransactionAll[index]?.to?.name
                  : '-',
            Duedate: this.walletTransactionAll[index]?.submitedOn ? this.formatDate(new Date(this.walletTransactionAll[index]?.submitedOn)) : '-',
            Status: TransactionStatusPayment[this.walletTransactionAll[index]?.traferStatus],
            Amount:
              this.walletTransactionAll[index]?.mainType == 10 || this.walletTransactionAll[index]?.mainType == 2
                ? this.walletTransactionAll[index]?.moneyReceived?.amount
                  ? this.walletTransactionAll[index]?.moneyReceived?.currency?.sign + this.walletTransactionAll[index]?.moneyReceived?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  : '-'
                : this.walletTransactionAll[index]?.mainType == 1
                  ? this.walletTransactionAll[index]?.moneyTransferred?.amount
                    ? this.walletTransactionAll[index]?.moneyTransferred?.currency?.sign +
                    this.walletTransactionAll[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    : '-'
                  : '-',
            moneyTransferredReadyToUse: this.walletTransactionAll[index]?.moneyTransferred?.readyToUse
              ? this.walletTransactionAll[index]?.moneyTransferred?.currency?.sign +
              this.walletTransactionAll[index]?.moneyTransferred?.readyToUse?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            Currency: this.walletTransactionAll[index]?.moneyTransferred?.currency?.code || '-',
            Fee: this.walletTransactionAll[index]?.fee?.amount
              ? this.walletTransactionAll[index]?.fee?.currency?.sign + this.walletTransactionAll[index]?.fee?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            Commission: this.walletTransactionAll[index]?.commission || '-',
            exeutedOn: this.walletTransactionAll[index]?.exeutedOn ? this.formatDate(new Date(this.walletTransactionAll[index]?.exeutedOn)) : '-',
            dispatchedFileId: this.walletTransactionAll[index]?.dispatchedFileId ? this.walletTransactionAll[index]?.dispatchedFileId : '',
            Buying: this.walletTransactionAll[index]?.moneyReceived !== null ?
              this.walletTransactionAll[index]?.moneyReceived?.currency?.code +
              ' (' +
              this.walletTransactionAll[index]?.moneyReceived?.currency?.sign +
              this.walletTransactionAll[index]?.moneyReceived?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
              ')' : '-',
            Selling:
              this.walletTransactionAll[index]?.moneyTransferred?.currency?.code +
              ' (' +
              this.walletTransactionAll[index]?.moneyTransferred?.currency?.sign +
              this.walletTransactionAll[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
              ')',
            moneyReceiveReadyToUse: this.walletTransactionAll[index]?.moneyReceived?.readyToUse
              ? this.walletTransactionAll[index]?.moneyReceived?.currency?.sign + this.walletTransactionAll[index]?.moneyReceived?.readyToUse?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            Transferamount: this.walletTransactionAll[index]?.moneyTransferred?.amount
              ? this.walletTransactionAll[index]?.moneyTransferred?.currency?.sign + this.walletTransactionAll[index]?.moneyTransferred?.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              : '-',
            moneyTransferredexchangeRate: this.walletTransactionAll[index]?.moneyTransferred?.exchangeRate,
            moneyReceivedexchangeRate: this.walletTransactionAll[index]?.moneyReceived?.exchangeRate,
            moneyTransferredSign: this.walletTransactionAll[index]?.moneyTransferred?.currency?.sign,
            moneyReceivedSign: this.walletTransactionAll[index]?.moneyReceived?.currency?.sign,
            moneyTransferred: this.walletTransactionAll[index]?.moneyTransferred,
            moneyReceived: this.walletTransactionAll[index]?.moneyReceived,
            from: this.walletTransactionAll[index]?.from,
            traferStatus: this.walletTransaction[index]?.traferStatus
          }
          this.finalTableData.push(formatedTable);
        }
        this.calculatePages();
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.dataSource = new MatTableDataSource(this.finalTableData.slice(startIndex, endIndex));
        // this.dataSource = new MatTableDataSource(finalTableData);
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        this.showLoader = false;
      }
    );
  }


  deletePayment(payment: any, index: any) {
  }

  applyFilter(filterValue: any) {
    let isnum = /^\d+$/.test(filterValue?.target?.value);
    let isDate = filterValue?.target?.value?.includes('/');
    this.dataSource.filter =
      isnum && !isDate
        ? filterValue.target.value
          ?.toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          .trim()
          .toLowerCase()
        : filterValue.target.value.trim().toLowerCase();
  }

  defaultDate() {
    if (!this.transactionFilter?.value?.end) {
      this.transactionFilter.patchValue({ end: this.transactionFilter?.value?.start });
    }
  }

  createSinglePayment() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(SinglePaymentSendComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
          payment: true,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((shouldReload: any) => {
        if (shouldReload == 'completedSend') {
          this.getAllData();
        }
        // this.walletService.setFutureActivityObs('success');
      });
  }

  getProfile(name: string) {
    let FullName = name?.split(' ');
    let fName = FullName && FullName[0] ? FullName[0].substring(0, 1).toUpperCase() : '';
    let lName = FullName && FullName[1] ? FullName[1].substring(0, 1).toUpperCase() : '';
    return fName + lName;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
  }
  export() {
    const exportData = this.walletTransaction?.map((item: any) => {
      const submitedOn = this.formatDate(new Date(item.submitedOn));
      const exeutedOn = this.formatDate(new Date(item.exeutedOn));
      if (item?.mainType == 2) {
        return {
          Currencies: item?.moneyTransferred?.currency?.code + ' ' + item?.moneyReceived?.currency?.code || '-',
          Action: 'Exchange',
          DueDate: submitedOn || '-',
          WalletCharged: item?.moneyTransferred?.amount ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount || '-' : '-',
          Status: TransactionStatusPayment[item?.traferStatus],
          Received: item?.moneyReceived?.amount ? item?.moneyReceived?.currency?.sign + item?.moneyReceived?.amount || '-' : '-',
          Buying: item?.moneyReceived !== null ? (item?.moneyReceived?.currency?.code + ' (' + item?.moneyReceived?.currency?.sign + item?.moneyReceived?.amount ? item?.moneyReceived?.amount : '-' + ')') : '-',
          Selling: item?.moneyTransferred?.currency?.code + ' (' + item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount ? item?.moneyTransferred?.amount : '-' + ')',
          AvailableBalance: item?.moneyReceived?.readyToUse ? item?.moneyReceived?.currency?.sign + item?.moneyReceived?.readyToUse || '-' : '-',
          Available_Balance: item?.moneyTransferred?.readyToUse ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.readyToUse || '-' : '-',
          Fee: item?.fee?.amount ? item?.fee?.currency?.sign + item?.fee?.amount : '-',
          Commission: item?.Commission || '-',
          Creationdate: submitedOn || '-',
          ExchangeRate: item?.moneyTransferred?.exchangeRate != 1 ? item?.moneyTransferred?.exchangeRate : (item?.moneyReceived?.exchangeRate != 1 ? item?.moneyReceived?.exchangeRate : '-') || '-',
          // Transferamount: item?.moneyTransferred?.amount ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount || '-' : '-',
          // Currency: item?.moneyTransferred?.currency?.code || '-',
        };
      } else if (item?.mainType == 10) {
        return {
          Action: 'Future Payment',
          To: item?.to?.name || '-',
          DueDate: submitedOn || '-',
          Status: TransactionStatusPayment[item?.traferStatus],
          Received: item?.moneyReceived?.amount ? item?.moneyReceived?.currency?.sign + item?.moneyReceived?.amount || '-' : '-',
          Buying: item?.moneyReceived !== null ? (item?.moneyReceived?.currency?.code + ' (' + item?.moneyReceived?.currency?.sign + item?.moneyReceived?.amount ? item?.moneyReceived?.amount : '-' + ')') : '-',
          Selling: item?.moneyTransferred?.currency?.code + ' (' + item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount ? item?.moneyTransferred?.amount : '-' + ')',
          AvailableBalance: item?.moneyReceived?.readyToUse ? item?.moneyReceived?.currency?.sign + item?.moneyReceived?.readyToUse || '-' : '-',
          Available_Balance: item?.moneyTransferred?.readyToUse ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.readyToUse || '-' : '-',
          Fee: item?.fee?.amount ? item?.fee?.currency?.sign + item?.fee?.amount : '-',
          Commission: item?.Commission || '-',
          Creationdate: exeutedOn || '-',
          ExchangeRate: item?.moneyTransferred?.exchangeRate != 1 ? item?.moneyTransferred?.exchangeRate : (item?.moneyReceived?.exchangeRate != 1 ? item?.moneyReceived?.exchangeRate : '-') || '-',
        };
      } else if (item?.mainType == 1 && item?.moneyTransferred != null && item?.moneyReceived == null) {
        return {
          Action: 'Send money',
          To: item?.to?.name || '-',
          DueDate: submitedOn || '-',
          Status: TransactionStatusPayment[item?.traferStatus],
          Sent: item?.moneyTransferred?.amount ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount || '-' : '-',
          Available_Balance: item?.moneyTransferred?.readyToUse ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.readyToUse || '-' : '-',
          Currency: item?.moneyTransferred?.currency?.code || '-',
          Fee: item?.fee?.amount ? item?.fee?.currency?.sign + item?.fee?.amount : '-',
          Commission: item?.Commission || '-',
          Creationdate: exeutedOn || '-',
        };
      }
      if (item?.mainType == 1 && item?.moneyTransferred != null && item?.moneyReceived != null) {
        return {
          Currencies: item?.moneyTransferred?.currency?.code + ' ' + item?.moneyReceived?.currency?.code || '-',
          Action: 'Payment & Exchange',
          DueDate: submitedOn || '-',
          WalletCharged: item?.moneyTransferred?.amount ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount || '-' : '-',
          Status: TransactionStatusPayment[item?.traferStatus],
          Received: item?.moneyReceived?.amount ? item?.moneyReceived?.currency?.sign + item?.moneyReceived?.amount || '-' : '-',
          Buying: item?.moneyReceived !== null ? (item?.moneyReceived?.currency?.code + ' (' + item?.moneyReceived?.currency?.sign + item?.moneyReceived?.amount ? item?.moneyReceived?.amount : '-' + ')') : '-',
          Selling: item?.moneyTransferred?.currency?.code + ' (' + item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount ? item?.moneyTransferred?.amount : '-' + ')',
          AvailableBalance: item?.moneyReceived?.readyToUse ? item?.moneyReceived?.currency?.sign + item?.moneyReceived?.readyToUse || '-' : '-',
          Available_Balance: item?.moneyTransferred?.readyToUse ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.readyToUse || '-' : '-',
          Fee: item?.fee?.amount ? item?.fee?.currency?.sign + item?.fee?.amount : '-',
          Commission: item?.Commission || '-',
          Creationdate: submitedOn || '-',
          ExchangeRate: item?.moneyTransferred?.exchangeRate != 1 ? item?.moneyTransferred?.exchangeRate : (item?.moneyReceived?.exchangeRate != 1 ? item?.moneyReceived?.exchangeRate : '-') || '-',
          // Transferamount: item?.moneyTransferred?.amount ? item?.moneyTransferred?.currency?.sign + item?.moneyTransferred?.amount || '-' : '-',
          // Currency: item?.moneyTransferred?.currency?.code || '-',
        };
      } else {
        return false;
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const excelName = `All_transaction.${new Date().toLocaleDateString('en-US')}`;
    const fileName: string = `${excelName}.xlsx`;

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(data);
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  createMassPayment() {
    const dialogRef = this.dialog.open(MassPaymentComponent, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      data: {
        walletList: this.walletList,
      },
    });
  }

  fixInvoice(requestId: string) {
  }

  checkSelectedCurrency(selectedSource: any) {
    const currencyValues = this.transactionFilter.get('currency')?.value;
    if (selectedSource?.value == '' && selectedSource?.selected) {
      this.transactionFilter.get('currency')?.patchValue('');
    } else if (selectedSource?.value != '' && selectedSource?.selected && currencyValues.includes('')) {
      setTimeout(() => {
        const updatedValue = this.transactionFilter.get('currency')?.value?.filter((item: any) => item != '');
        this.transactionFilter.get('currency')?.patchValue(updatedValue);
      }, 5);
    }
  }

  downloadPDF(fileId: string, index: any) {

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
