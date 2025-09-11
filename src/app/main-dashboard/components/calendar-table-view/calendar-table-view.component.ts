import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertTableDataModel } from '../../models/AlertTableDataModel';
import { PaymentTableDataModel } from '../../models/PaymentTableDataModel';
import { ConvertTableDataModel } from '../../models/ConvertTableDataModel';
import { HedgeTableDataModel } from '../../models/HedgeTableDataModel';
import { MatDialog } from '@angular/material/dialog';
import { WalletsService } from '../../services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-calendar-table-view',
  templateUrl: './calendar-table-view.component.html',
  styleUrls: ['./calendar-table-view.component.scss'],
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatMenuModule, NgxPaginationModule ],
})
export class CalendarTableViewComponent {
  @Input('selectedTab') selectedTab: any;
  @Input('data') data: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output('calendarData') calendarData = new EventEmitter();
  @Output('addAlertClick') addAlertClick = new EventEmitter();
  @Output('addPaymentClick') addPaymentClick = new EventEmitter();
  @Output('addConvertClick') addConvertClick = new EventEmitter();
  filteredTableData: any;
  alertDataSource: any;
  paymentDataSource: any;
  convertDataSource: any;
  hedgeDataSource: any;
  currentPage = 1;
  itemsPerPage = 5;
  pages: number[] = [];
  dataSource: any;
  displayedColumns: string[] = ['createdDate', 'buy', 'arrow', 'sell', 'rate', 'dueDate', 'status', 'action'];
  displayedColumnsPayment: string[] = ['createdDate', 'type', 'rate', 'beneficiary', 'targetDate', 'status'];
  displayedColumnsConvert: string[] = ['createdDate', 'type', 'buy', 'sell', 'rate', 'targetDate', 'status'];
  displayedColumnsHedge: string[] = ['createdDate', 'type', 'currencyPair', 'hedgeAmount', 'hedgeRate', 'expiryDate'];
  visibleLoader: boolean = false;
  size = 5;
  pageIndex = 0;
  p: number = 1;
  userRoleType!: number;

  constructor(public dialog: MatDialog,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef
  ){}
  ngOnInit() {
  }

  ngDoCheck(){
    this.cd.detectChanges()
  }

  ngOnChanges(change: any) {
    if (this.selectedTab === 0) {
      this.alertDataSource = new MatTableDataSource<AlertTableDataModel>(this.data?.['alert']);
    } else if (this.selectedTab === 1) {
      this.paymentDataSource = new MatTableDataSource<PaymentTableDataModel>(this.data['payment']);
    }
    else if (this.selectedTab === 2) {
      this.convertDataSource = new MatTableDataSource<ConvertTableDataModel>(this.data['convert']);
    }
    else if (this.selectedTab === 3) {
      this.hedgeDataSource = new MatTableDataSource<HedgeTableDataModel>(this.data['hedge']);
    }
  }

  strTrim(str: string) {
    return str.replace(/\s+/g, '-').toLowerCase();
  }

  openHedgeDialog(isMenu?: boolean, date?: any) {

  }

  DeleteAlert(id:any){
  }

  addNewAlert() {
    this.addAlertClick.emit();
  }

  addNewPayment() {
    this.addPaymentClick.emit();
  }

  addNewConvert() {
    this.addConvertClick.emit();
  }
}
