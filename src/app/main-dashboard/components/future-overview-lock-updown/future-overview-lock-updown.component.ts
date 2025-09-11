import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from '../../services/dashboard.service';
import { WalletsService } from '../../services/wallets.service';
import { Direction } from '../../enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createHedgeByCategory } from '../../dashboard-data/balanceList-data';
import { of } from 'rxjs';
import { ApprovalProtectiveFormComponent } from '../approval-protective-form/approval-protective-form.component';
@Component({
  selector: 'app-future-overview-lock-updown',
  templateUrl: './future-overview-lock-updown.component.html',
  styleUrls: ['./future-overview-lock-updown.component.scss'], 
  imports: [CommonModule, MatDatepickerModule, FormsModule]
})

export class FutureOverviewLockUpdownComponent {
  minDate: string;
  expDate: any;
  lockAmount: any
  parts: any;
  formattedDate: any;
  activeCurrency: any;
  Directions: any;
  hedgeData: any;
  errorMsg: any;

  constructor(
    public dialog: MatDialog,
    public lockUpDialogRef: MatDialogRef<FutureOverviewLockUpdownComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _walletService: WalletsService,
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef,


  ) {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toJSON();
  }

  ngOnInit() {
    this.Directions = Direction
    this._walletService.activeWallet$.subscribe((wallet) => {
      this.activeCurrency = wallet;
    });
    this.expDate = new Date(this.data?.hedgeData?.expiryDate).toDateString();

    this.parts = this.data?.hedgeData?.expiryDate.split('/');
    this.formattedDate = new Date(
      this.parts[2],
      this.parts[1] - 1,
      this.parts[0]
    );
  }

  getHedgeData() {
    let createHedgeObject = {
      amount: this.lockAmount,
      productType: "1",
      expiryDate: this.data?.hedgeData?.expiryDate,
      currencyPair: this.data?.hedgeData?.notionalCurrency + this.data?.hedgeData?.secondCurrency,
      Strike: this.data?.hedgeData?.strike,
      direction: this.activeCurrency?.wallet_Hedging?.direction
    }

    of(createHedgeByCategory).subscribe((data: any) => {
      this.hedgeData = data
      this.cd.detectChanges()
    },
    err => {
      this.errorMsg = err.error.apiErrorMessage;

    })

  }
  keyupvalue(e: any) {
    this.lockAmount = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  }


  getColotralformate(e: any) {
    return e?.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  }
  opneLockup(lockAmount: any) {
    let createHedgeObject = {
      amount: lockAmount.replace(/\,/g, ''),
      productType: "1",
      expiryDate: this.data?.hedgeData?.expiryDate,
      currencyPair: this.activeCurrency?.wallet_Hedging?.pair,
      Strike: this.data?.hedgeData?.strike,
      direction: this.activeCurrency?.wallet_Hedging?.direction
    }
      this.lockUpDialogRef.close();
      this.dialog.open(ApprovalProtectiveFormComponent, {
        width: '600px',
        disableClose: true,
        panelClass: 'approval-protective-dialog',
        data: {
          type: 'lockUP',
          fromNewdashboard: true,
          expiryDate: this.data?.hedgeData?.expiryDate,
          buyCurrency: this.data?.hedgeData?.buyCurrency,
          sellCurrency: this.data?.hedgeData?.sellCurrency,
          lockAmount: lockAmount.replace(/\,/g, '')
        }
      })
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

  }

}
