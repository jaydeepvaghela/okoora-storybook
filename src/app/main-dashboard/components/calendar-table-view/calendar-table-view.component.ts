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
// import { RecheckingInvoiceComponent } from '../rechecking-invoice/rechecking-invoice.component';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { CommonDialogService } from 'src/app/shared/services/common-dialog.service';
// import { CompareHedgeComponent } from '../hedge/hedge-popup/compare-hedge.component';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';

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
    // private commonDialog: CommonDialogService,
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

    // const dialogRef = this.dialog
    //   .open(CompareHedgeComponent, {
    //     width: '70vw',
    //     maxWidth: '95vw',
    //     maxHeight: '95vh',
    //     height:'650px',
    //     panelClass: 'hedge-dialog',
    //   })
    //   .afterClosed()
    //   .subscribe((shouldReload: any) => {
    //     // this.loadCalendarDataOnChange(new Date);
    //   });
  }

  DeleteAlert(id:any){
  //   this.commonDialog
  //       .confirmDialog({
  //         title: 'Please confirm action',
  //         message: 'Are you sure want to remove?',
  //         confirmText: 'Confirm',
  //         cancelText: 'Cancel',
  //       })
  //       .subscribe((isConfirmed) => {
  //         // console.log('isConfirmed',isConfirmed)
  //         if (isConfirmed) {
  //           this.visibleLoader = true
  //           this._walletService.deleteExposure(id).subscribe(res => {
  //             if (res) {
  //               this.visibleLoader = false;
  //               this.calendarData.emit();
  //             }
  //           },err => {
  //             this.visibleLoader = false;
  //           })
  //         }
  //       });
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
