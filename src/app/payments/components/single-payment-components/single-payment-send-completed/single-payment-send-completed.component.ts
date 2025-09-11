import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SinglePaymentSendComponent } from '../single-payment-send/single-payment-send.component';
import { Router } from '@angular/router';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MassPaymentComponent } from '../../mass-payment-components/mass-payment/mass-payment.component';

@Component({
  selector: 'app-single-payment-send-completed',
  templateUrl: './single-payment-send-completed.component.html',
  styleUrls: ['./single-payment-send-completed.component.scss'],
  imports: [MatMenuModule, CommonModule]
})
export class SinglePaymentSendCompletedComponent {
  @Input('timerSubscription') timerSubscription?: any;
  @Input('walletList') walletList: any;
  @Input('benificiaryFromContacts') benificiaryFromContacts: any;
  @Input('openBeneficiaryList') openBeneficiaryList = true;
  @Input('signObjectForSummery') signObjectForSummery: any;
  mockSignObject: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SinglePaymentSendCompletedComponent>,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.signObjectForSummery) {
      this._walletService.currentCreatedPaymentSummery?.subscribe((data: any) => {
        this.signObjectForSummery = data;
        this.cd.detectChanges()
      })
    }
  }


  closeDialog() {
    this.dialogRef.close('completedSend')
  }

  sendAnotherPayment() {
    let activeWallet: any = localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(SinglePaymentSendComponent, {
      width: '100vw',
      maxWidth: '100vw',
      data: {
        selectedwalletInfo: currency,
        payment: true
      },
      disableClose: true,
    }).afterClosed()
      .subscribe((shouldReload: any) => {
        if (shouldReload) {
          this.timerSubscription = shouldReload
          this.timerSubscription.unsubscribe()
        }
      });
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
}
