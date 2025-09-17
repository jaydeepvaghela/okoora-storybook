import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CallPutType, DealStatusType, DealType, OnLineOffline } from '../../enums/manageHeadging';
import { SafeValuePipe } from '../pipes/safe-value.pipe';
import { CommonModule } from '@angular/common';
interface HedgeSubDeal {
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
  isProfit?: boolean;
  canCloseDeal?: boolean;
  fairValue?: string;
  isOpen?: boolean;
}
@Component({
  selector: 'app-manage-deals-subtable',
  templateUrl: './manage-deals-subtable.component.html',
  styleUrls: ['./manage-deals-subtable.component.scss'],
  imports:[MatTableModule,SafeValuePipe,CommonModule]
})
export class ManageDealsSubtableComponent implements OnChanges, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort; // for sorting
  @Input() hedgeDeals!: HedgeSubDeal[]; // get hedging data from manage headge deals
  constructor(public dialog: MatDialog) { }
  displayedSubColumns: string[] = [
    'id', 'tradeDate', 'dealType', 'callPutType', 'pair', 'strike', 'amount', 'isOnline', 'expiryDate', 'hedgeStatus']; // displayed columns
  SubdataSource = new MatTableDataSource<HedgeSubDeal>(); // data source
  showLoader = false; // show loader
  onLineOffline = OnLineOffline; // online offline enum
  dealStatusType = DealStatusType; // deal status enum
  showSpacerRow = true; // Always show, or set based on condition
  // after view init 
  ngAfterViewInit() {
    this.SubdataSource.sort = this.sort; // set sort
    this.setupSortingAccessor(); // set sorting accessor
  }
  // if have headging data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['hedgeDeals'] && this.hedgeDeals) {
      this.SubdataSource.data = this.hedgeDeals;
    }
  }
  // sorting accessor must return string or number
  setupSortingAccessor() {
    this.SubdataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'id':
          return item.id ?? 0;
        case 'tradeDate':
          return new Date(item.tradeDate).getTime();
        case 'dealType':
          return this.getDealTypeName(item.dealType) || '';
        case 'callPutType':
          return this.getPutCall(item.callPutType) || '';
        case 'pair':
          return this.formatCurrencyPair(item.pair) || '';
        case 'strike':
          return item.strike ?? 0;
        case 'amount':
          return parseFloat(item.amount) || 0;
        case 'isOnline':
          return item.isOnline ? 1 : 0;
        case 'expiryDate':
          return new Date(item.expiryDate).getTime();
        case 'hedgeStatus':
          return this.getDealStatusName(item.dealStatus) || '';
        default:
          return item[property] ?? '';
      }
    };
  }

  // get deal type name based on the value
  getDealTypeName(value: number): string {
    return DealType[value];
  }
  // give only 4 decimals
  giveOnlyDecimal(num: number) {
    return num?.toFixed(4);
  }
  // get call or put based on value
  getPutCall(value: number) {
    return value === CallPutType.Put ? CallPutType.PUT : CallPutType.CALL;
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
    return pair;
  }
}
