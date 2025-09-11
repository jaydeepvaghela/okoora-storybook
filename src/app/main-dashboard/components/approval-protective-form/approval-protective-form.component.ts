import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountdownComponent } from 'ngx-countdown';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WalletCurrencyModel } from '../../models/WalletCurrencyModel';
import { CreateHedgeResponseModel } from '../../models/CreateHedgeResponseModel';
import { WalletsService } from '../../services/wallets.service';
import { FutureOverviewLockUpdownComponent } from '../future-overview-lock-updown/future-overview-lock-updown.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-approval-protective-form',
  templateUrl: './approval-protective-form.component.html',
  styleUrls: ['./approval-protective-form.component.scss'],
  imports: [CommonModule, MatCheckboxModule]
})
export class ApprovalProtectiveFormComponent {
  @ViewChild('cd') counter!: CountdownComponent;
  currentDate!: Date;
  confirmCondition: any;
  showLoader = false;
  config = { leftTime: 300, format: 'mm:ss' };
  strike!: number;
  sellAmount: any;
  secondaryCurrency!: WalletCurrencyModel;
  errorMessage: any;
  countdownMinutes: string = '05';
  countdownSeconds: string = '00';
  private countdownInterval: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      orderData: any;
      type: string;
      fromNewdashboard: boolean;
      invoiceDetailResult: CreateHedgeResponseModel;
      colleteralData: CreateHedgeResponseModel;
      protectAllData: any;
      invoiceNo: number;
      buyCurrency: WalletCurrencyModel;
      sellCurrency: WalletCurrencyModel;
      collateralCurrency: WalletCurrencyModel;
      HedgeData: any;
      expiryDate: any;
      lockAmount: any;
      protectAmount: any;
      hedgeType:any
    },
    private lockUpDialogRef: MatDialogRef<FutureOverviewLockUpdownComponent>,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _walletService: WalletsService,
    private approvalDialogRef: MatDialogRef<ApprovalProtectiveFormComponent>
  ) {}

  ngOnInit() {
    this.startCountdown(5 * 60);
    this.strike = this.data?.type == 'protect' ? this.data?.invoiceDetailResult?.strike : this.data?.type == 'lockUP' ? this.data?.HedgeData?.strike : this.data?.protectAllData?.averageStrikeRate;

    this.sellAmount = this.data?.type == 'protect' ? this.data?.invoiceDetailResult?.youSell : this.data?.protectAllData?.totalSellAmount;
    this.currentDate = new Date();
  }

  startCountdown(duration: number) {
    let timer = duration;
    this.updateCountdown(timer);

    this.countdownInterval = setInterval(() => {
      timer--;
      this.updateCountdown(timer);

      if (timer <= 0) {
        clearInterval(this.countdownInterval);
        this.onCountdownEnd();
      }
    }, 1000);
  }

  updateCountdown(timer: number) {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  this.countdownMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
  this.countdownSeconds = seconds < 10 ? '0' + seconds : seconds.toString();
}

onCountdownEnd() {
  console.log('Countdown finished');
}

  RiskInfoDialog() {
  }

  handleEvent(e: any) {
    this.showLoader = false;
    if (e.action == 'done') {
      this.showLoader = true;
      this.config = { leftTime: 300, format: 'mm:ss' };
      this.showLoader = false;
    }
  }

  onChange(ev: any) {
    this.confirmCondition = ev.checked;
  }

  completeHedgeSuccess() {
    let strikeRate = this.data?.type == 'protect' ? this.data?.invoiceDetailResult?.strike : this.strike;
    let buyAmount = this.data?.type == 'protect' ? this.data?.invoiceDetailResult?.youBuy : this.data?.protectAllData?.totalYouBuy;
    let orderInvoiceNo = this.data?.type == 'protect' ? this.data?.invoiceNo : this.data?.protectAllData?.orderId;
    let type = this.data?.type == 'protect' ? 'invoice' : 'order';
    let message =
      "<p class='success-msg' style='color: black;'>You’ve successfully locked the rate <strong>" +
      strikeRate.toString() +
      '</strong> for the amount <strong>' +
      buyAmount.toString() +
      '</strong> in ' +
      type +
      ' <strong>' +
      orderInvoiceNo +
      '</strong><p>';
    let config: MatSnackBarConfig = {
      panelClass: 'snack-message',
      horizontalPosition: 'left',
      data: {
        message: message,
        type: 'success',
      },
    };
  }

  completeQuickHedge() {
    this.showLoader = true;
  }

  continueClick() {
    setTimeout(() => {
      this.approvalDialogRef.close();    
    }, 1000);
  }

  closeForm() {
    this.approvalDialogRef.close();
  }
  completeLockup() {
  }
  parseExpiryDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }
  completeHedgeOcrForProtectAll() {
    this.showLoader = true;
  }
}
