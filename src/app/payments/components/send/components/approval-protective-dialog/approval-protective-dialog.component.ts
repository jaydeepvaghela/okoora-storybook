import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountdownComponent } from 'ngx-countdown';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WelldoneNewDashboardComponent } from '../../../welldone-new-dashboard/welldone-new-dashboard.component';

@Component({
  selector: 'app-approval-protective-dialog',
  templateUrl: './approval-protective-dialog.component.html',
  styleUrls: ['./approval-protective-dialog.component.scss'],
  imports: [CommonModule, CountdownComponent, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovalProtectiveDialogComponent {
  @ViewChild('cd') counter!: CountdownComponent;
  showLoader = false;
  confirmCondition: any;
  currentDate: any;
  futurePayment: any;
  refreshFuturePaymentErr = '';
  completeFuturePaymentErr = '';
  userAffiliate: any;
  language = localStorage.getItem('lang') || 'en';
  costToUpdate: any;
  config: { leftTime: number; format: string } | any;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private walletService: WalletsService,
    private riskInfoDialog: MatDialogRef<ApprovalProtectiveDialogComponent>
  ) { }

  ngOnInit() {
    console.log('checking...', this.data)
    this.currentDate = new Date();
    this.config = { leftTime: this.data?.time, format: 'mm:ss' };
    // this.config = this.data?.time;
    this.futurePayment = this.data.futurePaymentCreateResponse?.futurePayment.filter((item: any) => this.data.strategyId == item.strategyId)[0];
    
  }

  RiskInfoDialog() {
    // this.dialog.open(PurchaseRiskInfoComponent, {
    //   width: '800px',
    //   maxWidth: '800px',
    //   panelClass: 'specific-date-dialog-after-modal'
    // })
  }

  onChange(ev: any) {
    this.confirmCondition = ev.checked;
  }

  handleEvent(e: any) {
    this.showLoader = false;
    if (e.action == 'done') {
      this.showLoader = true;
      this.futurePaymentRefresh();
    }
  }

  futurePaymentRefresh() {
    this.showLoader = true;
    if (this.userAffiliate?.afiiliate?.currency === 'EUR') {
      // this.walletService.refreshQuote(this.data?.futurePaymentCreateResponse.requestId).subscribe((result) => {
      //   this.config = { leftTime: 60, format: 'mm:ss' };
      //   this.showLoader = false;
      //   this.futurePayment = result;
      // }, err => {
      //   this.showLoader = false;
      //   this.refreshFuturePaymentErr = err?.error?.apiErrorMessage[0];
      // })
    }
    else {
      let params = {
        strategyId: this.data.strategyId,
        requestId: this.data.futurePaymentCreateResponse.requestId
      }
      // this.walletService.refreshFuturePayments(params).subscribe((result: any) => {
      //   // console.log({result})
      //   this.config = { leftTime: 60, format: 'mm:ss' };
      //   this.showLoader = false;
      //   this.futurePayment = result?.futurePayment[0];
      // }, err => {
      //   this.showLoader = false;
      //   this.refreshFuturePaymentErr = err?.error?.apiErrorMessage[0];
      // });
    }
  }

  futurePaymentComplete() {
    this.showLoader = true;
    // if (this.userAffiliate.afiiliate.currency === 'EUR') {
    //   // this.walletService.completePaymentRequest(this.data?.futurePaymentCreateResponse.requestId).subscribe((result) => {
    //   //   this.showLoader = false;
    //   //   this.riskInfoDialog.close('done');
    //   //   this.dialog.closeAll();
    //   //   this.dialog.open(WelldoneNewDashboardComponent, {
    //   //     panelClass: 'well-done-modal',
    //   //     data: {
    //   //       transaction: this.data?.transaction
    //   //     }
    //   //   });
    //   // },
    //   //   err => {
    //   //     this.showLoader = false;
    //   //     this.completeFuturePaymentErr = err.error.apiErrorMessage[0];
    //   //   });
    // }
    // else {
      let params = {
        strategyId: this.data.strategyId,
        requestId: this.data.futurePaymentCreateResponse.requestId
      }
      // this.walletService.completeFuturePayments(params).subscribe({
      //   next: (result) => {
      //     this.showLoader = false;
          this.riskInfoDialog.close('done');
          this.dialog.closeAll();
          this.dialog.open(WelldoneNewDashboardComponent, {
            panelClass: 'well-done-modal',
            data: {
              transaction: this.data?.transaction
            }
          });
      //   },
      //   error: (err) => {
      //     this.showLoader = false;
      //     this.completeFuturePaymentErr = err.error.apiErrorMessage[0];
      //   }
      // });
    // }
  }

  closeDialog() {
    this.riskInfoDialog.close({leftTime: (this.counter.left/ 1000)});
  }
}
