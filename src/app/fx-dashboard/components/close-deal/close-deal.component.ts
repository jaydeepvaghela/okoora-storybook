import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CallPutType, DealStatusType, DealType, OnLineOffline } from '../../enums/manageHeadging';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';
import { ManageHedgeDealsComponent } from '../manage-hedge-deals/manage-hedge-deals.component';
import { CommonModule } from '@angular/common';
import { SafeValuePipe } from '../pipes/safe-value.pipe';

@Component({
  selector: 'app-close-deal',
  templateUrl: './close-deal.component.html',
  styleUrls: ['./close-deal.component.scss'],
  imports: [MatDialogModule,CommonModule,SafeValuePipe,CountdownModule]
})
export class CloseDealComponent implements OnInit {
  errorMessage: string | null = null;
  private readonly _onDestroy = new Subject<void>(); // subject for unsubscribing
  dealId!: string; // deal ID to close
  onLineOffline = OnLineOffline; // online offline enum
  dealList: any; // list of deals to close
  config = { leftTime: 60, format: 'mm:ss' }; // countdown configuration
  totalPL = 0; // store sum of PL from all API calls
  showLoader: boolean = false;
  @ViewChild('cd', { static: false }) private readonly countdown!: CountdownComponent;
  @ViewChild(ManageHedgeDealsComponent) manageDeals!: ManageHedgeDealsComponent;

  constructor(public dialog: MatDialog,private readonly dialogRef: MatDialogRef<CloseDealComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // get the deal data from the mat dailog data
    this.dealList = this.data;
    this.GetFairValueDeal(this.dealList.mainHedgeDealDto?.strategyId);
  }

  // call the fair value deal API to get proft/loss value
  GetFairValueDeal(id: string) {
    // this.fxDashboardService.GetFairValueDeal(id)
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe((res) => {
    //     if (res) {
    //       this.totalPL = res;
    //     }
    //   });
  }

  // format PL value to display with + sign for positive values
  // negative values will already have the - sign
  formatPL(value: number): string {
    if (value > 0) {
      return `+${value.toFixed(4)}`;
    }
    return `${value.toFixed(4)}`; // negative will already have the - sign
  }

  // close the deal and close the dialog
  CloseDeal() {
    this.errorMessage = null;
    this.dialogRef.close(true); // Close the dialog after closing the deal
    this.manageDeals.getHedgeDealsTable(); // Refresh the hedge deals table
    // this.fxDashboardService.CloseDeal(this.dealList?.mainHedgeDealDto?.strategyId)
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe({
    //     next: (res) => {
    //       if (res) {
    //         this.dialogRef.close(true); // Close the dialog after closing the deal
    //         this.manageDeals.getHedgeDealsTable(); // Refresh the hedge deals table
    //       }
    //     },
    //     error: (err) => {
    //       // Prefer apiErrorMessages.detail, then detail, then message, then fallback
    //       this.errorMessage = err?.error?.apiErrorMessages?.detail || err?.error?.detail || err?.error?.message || err?.message || 'Failed to close deal. Please try again.';
    //     }
    //   });
  }

  // when timer ends, call the fair value deals API again and start the timer again
  handleEvent(e: any) {
    if (e.action == 'done') {
      this.GetFairValueDeal(this.dealList.mainHedgeDealDto?.strategyId);
      this.countdown.restart();
    }
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
  // have same value in all sub deals then return it
  getPutCall(hedgeDeals: any) {
      // return '----' if hedgeDeals is null or empty
        if (!hedgeDeals?.length) return '----';
  
        // take the callPutType from the first deal
        const firstType = hedgeDeals[0].callPutType;
  
        // check if all hedgeDeals have the same callPutType
        const allSame = hedgeDeals.every((deal: { callPutType: any; }) => deal.callPutType === firstType);
  
        // return call or put if all are same, otherwise return '----'
        return allSame
          ? (firstType === CallPutType.Put ? CallPutType.PUT : CallPutType.CALL)
          : '----';
    }
}