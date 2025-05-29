import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'], 
  imports: [CommonModule, MatTableModule, MatMenuModule]
})
export class TableMenuComponent {
  @Input() resource: any;
  @Input('tableData') tableData: any;
  displayedColumnsForPayment: string[] = ['createdDate', 'type', 'rate', 'beneficiary', 'targetDate', 'status'];
  displayedColumnsForConvert: string[] = ['createdDate', 'type', 'buy', 'sell', 'rate', 'targetDate', 'status'];
  displayedColumnsForHedge: string[] = ['createDate', 'type', 'currencyPair', 'hedgeAmount', 'rate', 'expiryDate'];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {

  }

  strTrim(str: string) {
    return str.replace(/\s+/g, '-').toLowerCase();
  }

  recheckInvoice(requestId:String){
    // this.dialog.open(RecheckingInvoiceComponent, {
    //   disableClose: false,
    //   width: '1500px',
    //   data: {
    //     requestId: requestId
    //   },
    //   // height: '100vh'
    //   panelClass: 'fix-invoice-dialog',
    // });
  }
}
