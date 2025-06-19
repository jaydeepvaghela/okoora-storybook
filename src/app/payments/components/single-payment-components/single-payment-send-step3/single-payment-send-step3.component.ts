import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SinglePaymentSendComponent } from '../single-payment-send/single-payment-send.component';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CountdownModule } from 'ngx-countdown';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MassPaymentComponent } from '../../mass-payment-components/mass-payment/mass-payment.component';

@Component({
  selector: 'app-single-payment-send-step3',
  templateUrl: './single-payment-send-step3.component.html',
  styleUrls: ['./single-payment-send-step3.component.scss'],
  imports: [CommonModule, MatMenuModule, MatRadioModule, ReactiveFormsModule, FormsModule, MatProgressSpinnerModule, CountdownModule, NgbTooltipModule, MatCheckboxModule]
})
export class SinglePaymentSendStep3Component {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress: any;
  @Input('timerSubscription') timerSubscription: any;
  @Input('createdPaymentData') createdPaymentData: any;
  @Input('signObjectForSummery') signObjectForSummery: any;
  @Input('walletList') walletList: any;
  config = { leftTime: 15, format: 'mm:ss' };

  selectedOption: any
  costTypeAPIError: any;
  accountDetailsToCopy: any;
  termsAndCondition: boolean = false;
  paymentRequestAPIError: any;
  showLoader: boolean = false;
  showLoaderSpinner: boolean = false;
  termsPolicyFlag: boolean = false;
  copyDataText: any;
  chargedAmount: any;
  createdSpotRate!: number;
  afterExchangeRate!: number;
  refreshAPIError: any;
  forRefreshDataFlag: boolean = false;
  timerSubscriptionFortransfer: any;
  SendAmount: any;
  chargedAmountAfterRefresh: any;
  affiliateCountry: any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SinglePaymentSendStep3Component>,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    console.log("signObjectForSummerysignObjectForSummery", this.signObjectForSummery);
    console.log("this.createdPaymentData", this.createdPaymentData);
    if (!this.signObjectForSummery && !this.createdPaymentData) {
      this._walletService.currentCreatedPayment?.subscribe((data: any) => {
        if (data) {
          this.showLoaderSpinner = true;
          // delete this.chargedAmount
          // delete this.SendAmount
          // delete this.createdPaymentData
          this.createdPaymentData = data || this.createdPaymentData
          this.cd.detectChanges()
          this.forRefreshDataFlag = true
          if (data.paymentRequst.chargeCurrency == data.paymentRequst.sendCurrency) {
            this.chargedAmountAfterRefresh = true;
            this.chargedAmountAfterRefresh = data.paymentRequst.charge + data.costList[0].value;
          }
        }
      })
      this._walletService.currentCreatedPaymentSummery?.subscribe((data: any) => {
        this.signObjectForSummery = data

        this.cd.detectChanges()
      })
    }
    

    if (!this.forRefreshDataFlag) {
      // this.forRefreshData()
    }
    this.selectedOption = "1"
    this.getAccountDetailsToCopy()
    this.forRefreshData()
  }

  commaseprate(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      return false;
    }
  }


  previousStep() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscriptionFortransfer?.unsubscribe()
    this.formStepper?.previous()
  }

  handleEvent(e: any) {
    if (e.action == 'done') {
      this.forRefreshData()
    }
  }
  forRefreshData() {
    if (this.createdPaymentData?.paymentRequst?.sendCurrency != this.createdPaymentData?.paymentRequst?.chargeCurrency) {
      // this.timerSubscriptionFortransfer = timer(0, 15000).pipe(
      //   map(() => {
      this.showLoaderSpinner = true;
      // this._walletService.refreshQuote(this.createdPaymentData?.requestId).subscribe(
      //   (data: any) => {
      //     // console.log(data);
      //     this.showLoaderSpinner = false;
      //     this.chargedAmount = data?.charge?.toFixed(2)
      //     this.chargedAmountAfterRefresh = data?.chargeTotal?.toFixed(2)
      //     this.SendAmount = data?.send?.toFixed(2)
      //     this.createdSpotRate = data?.spot
      //     const refreshedSendValue: any = data?.send
      //     this.afterExchangeRate = refreshedSendValue * this.createdSpotRate
      //     this.config = { leftTime: 15, format: 'mm:ss' };

      //     this.cd.detectChanges()
      //   },
      //   (err) => {
      //     this.showLoaderSpinner = false;
      //     if (this.createdPaymentData?.paymentRequst?.sendCurrency != this.createdPaymentData?.paymentRequst?.chargeCurrency) {
      //       this.refreshAPIError = err?.error?.apiErrorMessage[0] ?? '';
      //       this.timerSubscription.unsubscribe()
      //       this.timerSubscriptionFortransfer.unsubscribe()
      //     }
      //     else {
      //       this.timerSubscription.unsubscribe()
      //       this.timerSubscriptionFortransfer.unsubscribe()
      //     }
      //   }
      // );
      // })).subscribe();
    }
    else {
      this.showLoaderSpinner = false
      this.timerSubscription?.unsubscribe()
    }
  }
  radioChange(event: any) {
    // console.log("event", event?.value)
    this.changeCostType(event?.value, this.createdPaymentData?.requestId)
  }
  changeCostType(costvalue: any, requestID: any) {
    this.showLoader = true
    const ev = costvalue;
    let index = costvalue === "1" ? 0 : 1;
    let body = {
      requestId: requestID,
      costType: ev,
    };
    // this._walletService.updateCostType(body).subscribe(
    //   (data: UpdateCostListResponseModel) => {
    //     // console.log("cost updated", data);
    //     delete this.costTypeAPIError
    //     this.showLoader = false
    //     this.timerSubscription?.unsubscribe();
    //     if (this.createdPaymentData?.paymentRequst?.sendCurrency === this.createdPaymentData?.paymentRequst?.chargeCurrency) {
    //       this.chargedAmountAfterRefresh = this.createdPaymentData?.paymentRequst?.charge + this.createdPaymentData?.costList[index]?.value;
    //     } else {
    //     this.forRefreshData()
    //     }
    //   },
    //   (err) => {
    //     this.costTypeAPIError = err?.error?.apiErrorMessage[0] ?? '';
    //   }
    // );
  }
  openPrivacyPolicyDialog() {
    // this.dialog.open(PrivacyPolicyComponent, {
    //   width: '90vw',
    //   height: '90vh',
    //   panelClass: 'signature-modal',
    //   maxWidth: '90vw',
    //   disableClose: true,
    // });
  }
  copyData() {
    this.copyDataText = "Copied"
    setTimeout(() => {
      this.copyDataText = ""
    }, 1000);
  }
  closeButton() {
    this.dialogRef.close(this.timerSubscription);
    this.dialog.closeAll()
  }
  nextStep(stepper: any, progress: any) {
    this.showLoaderSpinner = true
    this.termsPolicyFlag = !Boolean(this.termsAndCondition)
    // if (this.formStepper) {
    //   this._walletService.completePaymentRequest(this.createdPaymentData?.requestId, false, "").subscribe((data: any) => {
    //     this.showLoaderSpinner = false
    //     delete this.paymentRequestAPIError
    //     this.timerSubscription?.unsubscribe()
        stepper.next()
      // }, (err) => {
      //   this.showLoaderSpinner = false
      //   this.paymentRequestAPIError = err?.error?.apiErrorMessage[0] ?? '';
      //   if (this.paymentRequestAPIError == 'Missing Funds') {
      //     this.paymentRequestAPIError = "You don't have enough money in your account";
      //   }
      // })
  // }
    // document.getElementsByClassName('mat-dialog-content')[0].scrollTop = 0;
  }
  getAccountDetailsToCopy() {
    const recipient = this.signObjectForSummery?.bankAccountHolderName || '-';

    const send = +this.createdPaymentData?.paymentRequst?.send;
    const charge = +this.createdPaymentData?.paymentRequst?.charge;
    const transferValue =
      this.selectedOption === 1
        ? +this.createdPaymentData?.costList?.[0]?.value
        : +this.createdPaymentData?.costList?.[1]?.value;

    const amountSent =
      (this.signObjectForSummery?.beneficiarySign || '') +
      (isNaN(send) ? '-' : send.toFixed(2));

    const chargedWallet =
      (this.signObjectForSummery?.selectedWalletSign || '') +
      (isNaN(charge) ? '-' : charge.toFixed(2));

    const transferType = this.selectedOption === 1 ? 'Regular' : 'Our';

    const transferPrice =
      (this.signObjectForSummery?.selectedWalletSign || '') +
      (isNaN(transferValue) ? '-' : transferValue.toFixed(2));

    const totalCost =
      (this.signObjectForSummery?.selectedWalletSign || '') +
      (isNaN(charge) ? '-' : charge.toFixed(2));

    this.accountDetailsToCopy =
      `Recipient: ${recipient}\n` +
      `Amount Sent: ${amountSent}\n` +
      `Charged wallet: ${chargedWallet}\n` +
      `Transfer type: ${transferType}\n` +
      `Transfer price: ${transferPrice}\n` +
      `Total transaction cost: ${totalCost}`;
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
        // console.log("shouldReload", shouldReload);
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
