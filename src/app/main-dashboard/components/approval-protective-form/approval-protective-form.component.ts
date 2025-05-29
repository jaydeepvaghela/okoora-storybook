import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountdownComponent } from 'ngx-countdown';
// import { PaymentInvoicesModel } from 'src/app/my-cashflow/models/PaymentInvoicesModel';
// import { PurchaseHedgeService } from '../../services/purchase-hedge.service';
import { tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WalletCurrencyModel } from '../../models/WalletCurrencyModel';
import { CreateHedgeResponseModel } from '../../models/CreateHedgeResponseModel';
import { WalletsService } from '../../services/wallets.service';
import { FutureOverviewLockUpdownComponent } from '../future-overview-lock-updown/future-overview-lock-updown.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { SnackMessageComponent } from 'src/app/shared/components/snack-message/snack-message.component';
// import { CreateHedgeResponseModel } from '../../models/CreateHedgeResponseModel';
// import { RefreshHedgeResponseModel } from '../../models/RefreshHedgeResponseModel';
// import { GeneralService } from 'src/app/services/general.service';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
// import { PurchaseRiskInfoComponent } from '../purchase-risk-info/purchase-risk-info.component';
// import { WalletCurrencyModel } from 'src/app/common/models/WalletCurrencyModel';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { environment } from 'src/environments/environment';
// import { WelldoneNewDashboardComponent } from 'src/app/dashboard/components/welldone-new-dashboard/welldone-new-dashboard.component';
// import { FutureOverviewLockUpdownComponent } from 'src/app/dashboard/components/future-overview-lock-updown/future-overview-lock-updown.component';

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
    this.strike = this.data?.type == 'protect' ? this.data?.invoiceDetailResult?.strike : this.data?.type == 'lockUP' ? this.data?.HedgeData?.strike : this.data?.protectAllData?.averageStrikeRate;

    this.sellAmount = this.data?.type == 'protect' ? this.data?.invoiceDetailResult?.youSell : this.data?.protectAllData?.totalSellAmount;
    this.currentDate = new Date();
    let sellCurrency = this.data?.invoiceDetailResult?.sellCurrency;
    let buyCurrency = this.data?.buyCurrency;
    // this._walletService
    //   .GetPair(sellCurrency?.code, buyCurrency?.code)
    //   .pipe(
    //     tap((result) => {
    //       if (result) {
    //         let secondaryCurr = result?.pair.substring(3, 6);
    //         this.secondaryCurrency = secondaryCurr == sellCurrency?.code ? sellCurrency : buyCurrency;
    //       }
    //     })
    //   )
    //   .subscribe();
      // console.log(this.data)
  }

  RiskInfoDialog() {
    // this.dialog.open(PurchaseRiskInfoComponent, {
    //   width: '800px',
    //   maxWidth: '800px',
    //   panelClass: 'specific-date-dialog-after-modal',
    //   // disableClose: true
    // });
  }

  handleEvent(e: any) {
    this.showLoader = false;
    if (e.action == 'done') {
      this.showLoader = true;

      // if (this.data?.type == 'lockUP') {
      //   this._purchaseHedgeService.refreshlockHedge(this.data?.HedgeData?.strategyId).subscribe((result: any) => {
      //     if (result) {
      //       this.strike = result?.result?.strike;
      //       // this.sellAmount = result?.items[0]?.sellAmount?.toFixed(2);
      //     }
      //   });
      // }
      // if (this.data?.type == 'protect') {
      //   this._purchaseHedgeService.refreshQuickHedge(this.data?.colleteralData?.strategyId).subscribe((result: any) => {
      //     if (result) {
      //       this.strike = result?.strike;
      //       this.sellAmount = result?.items[0]?.sellAmount?.toFixed(2);
      //     }
      //   });
      // }

      // if (this.data?.type == 'protectAll') {
      //   this._purchaseHedgeService.refreshHedgeOcrProtectAll(this.data?.protectAllData?.strategyIds).subscribe((result) => {
      //     if (result) {
      //       this.strike = result?.strike;
      //       this.sellAmount = result?.items[0]?.sellAmount?.toFixed(2);
      //     }
      //   });
      // }
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
      // duration: 5000,
      data: {
        message: message,
        type: 'success',
      },
    };
    // this._snackBar.openFromComponent(SnackMessageComponent, config);
  }

  completeQuickHedge() {
    this.showLoader = true;
    // this._purchaseHedgeService.completeQuickHedge(this.data?.invoiceDetailResult?.strategyId).subscribe(
    //   (data) => {
    //     // console.log('invoiceDetailResult', this.data);
    //     const customQuickHedge = {
    //       protectAmount: this.data?.invoiceDetailResult?.youBuy,
    //       notionalCurrency: this.data?.invoiceDetailResult?.buyCurrency?.code,
    //       notionalCurrencyFlag: environment.imageUrl + '/Images/Flags/' + this.data?.invoiceDetailResult?.buyCurrency?.code + '.png',
    //       collateralVal: this.data?.colleteralData.collateral,
    //       collateralCur: this.data?.collateralCurrency.sign,
    //       collateralCurFlag: environment.imageUrl + '/Images/Flags/' + this.data?.collateralCurrency?.code + '.png',
    //       secondCurrencyFlag: environment.imageUrl + '/Images/Flags/' + this.data?.invoiceDetailResult?.sellCurrency?.code + '.png',
    //       premiumAmount: this.data?.invoiceDetailResult?.premiumAmount,
    //       secondCurrency: this.data?.invoiceDetailResult?.sellCurrency?.code,
    //       createAt: new Date(this.data?.invoiceDetailResult?.paymentDate),
    //     };
    //     const purchaseGroupId = data.purchaseGroupId;
    //     const newData = { ...customQuickHedge, purchaseGroupId };
    //     this.showLoader = false;
    //     if (this.auth.isEligible()) {
    //       this.generalService.closeHedgeDeal.next(newData);
    //     } else {
    //       this.generalService.closeHedgeDeal.next(newData);
    //     }
    //   },
    //   (err) => {
    //     this.showLoader = false;
    //     this.errorMessage = err.error.apiErrorMessage[0];
    //   }
    // );
  }

  continueClick() {
    this.approvalDialogRef.close();
  }
  completeLockup() {
    // this._purchaseHedgeService.completeQuickHedge(this.data?.HedgeData?.strategyId)
    // .subscribe({
    //   next: (data) => {
    //     if (data) {
    //       this.showLoader = false;
    //       const purchaseGroupId = this.data?.HedgeData.purchaseGroupId;
    //       const customQuickHedge = {
    //         protectAmount: this.data?.HedgeData?.protectAmount,
    //         notionalCurrency: this.data?.HedgeData?.notionalCurrency,
    //         notionalCurrencyFlag: environment.imageUrl + '/Images/Flags/' + this.data?.HedgeData?.notionalCurrency + '.png',
    //         collateralVal: this.data?.HedgeData?.collateral,
    //         collateralCur: this.data?.HedgeData?.collateralCur,
    //         collateralCurFlag: environment.imageUrl + '/Images/Flags/' + this.data?.HedgeData?.collateralCur + '.png',
    //         secondCurrencyFlag: environment.imageUrl + '/Images/Flags/' + this.data?.HedgeData?.secondCurrency + '.png',
    //         premiumAmount: this.data?.HedgeData?.premiumAmount,
    //         secondCurrency: this.data?.HedgeData?.secondCurrency,
    //         createAt: this.parseExpiryDate(this.data?.HedgeData?.expiryDate || ''),
    //       };
    //       const newData = { ...customQuickHedge, purchaseGroupId };
    //       this.generalService.closeHedgeDeal.next(newData);
    //     }
    //   },
    //   error: (err) => {
    //     this.showLoader = false;
    //     this.errorMessage = err.error.apiErrorMessage[0];
    //   }
    // });

  }
  parseExpiryDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }
  completeHedgeOcrForProtectAll() {
    this.showLoader = true;
    // this._purchaseHedgeService.completeHedgeOcrProtectAll(this.data?.protectAllData?.strategyIds).subscribe(
    //   (data) => {
    //     if (data) {
    //       this.showLoader = false;
    //       if (this.auth.isEligible()) {
    //         if (data) {
    //           this.dialog.closeAll();
    //           this.completeHedgeSuccess();
    //         }
    //       } else {
    //         const customQuickHedge = {
    //           protectAmount: data?.hedge?.youBuy,
    //           notionalCurrency: data?.hedge?.buyCurrency?.sign,
    //           notionalCurrencyFlag: environment.imageUrl + '/Images/Flags/' + data?.hedge?.buyCurrency?.code + '.png',
    //           collateralVal: data.hedge.collateral,
    //           collateralCur: this.data?.collateralCurrency.sign,
    //           collateralCurFlag: environment.imageUrl + '/Images/Flags/' + this.data?.collateralCurrency.code + '.png',
    //           secondCurrencyFlag: environment.imageUrl + '/Images/Flags/' + data?.hedge?.sellCurrency?.code + '.png',
    //           premiumAmount: data?.hedge.premiumAmount,
    //           secondCurrency: data?.hedge?.sellCurrency.sign,
    //           createAt: new Date(data?.hedge?.paymentDate),
    //         };
    //         const purchaseGroupId = data.purchaseGroupId;
    //         const newData = { ...customQuickHedge, purchaseGroupId };
    //         this.generalService.closeHedgeDeal.next(newData);
    //       }
    //     }
    //   },
    //   (err) => {
    //     this.showLoader = false;
    //     this.errorMessage = err.error.apiErrorMessage[0];
    //   }
    // );
  }
}
