import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { SinglePaymentSendStep1Component } from '../single-payment-send-step1/single-payment-send-step1.component';
import { SinglePaymentSendStep2Component } from '../single-payment-send-step2/single-payment-send-step2.component';
import { SinglePaymentSendStep3Component } from '../single-payment-send-step3/single-payment-send-step3.component';
import { SinglePaymentSendCompletedComponent } from '../single-payment-send-completed/single-payment-send-completed.component';

@Component({
  selector: 'app-single-payment-send',
  templateUrl: './single-payment-send.component.html',
  styleUrls: ['./single-payment-send.component.scss'],
  imports: [CommonModule, MatDialogModule, MatStepperModule, MatProgressBarModule, SinglePaymentSendStep1Component, SinglePaymentSendStep2Component, SinglePaymentSendStep3Component, SinglePaymentSendCompletedComponent]
})
export class SinglePaymentSendComponent {
  timerSubscription: any;
  createdPaymentData: any;
  signObjectForSummery: any;
  walletList: any;
  benificiaryFromContacts: any;
  isNonIsraeliUsers: boolean = false;

  constructor(
    private _walletService: WalletsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._walletService.getAllBalanceList().subscribe((res) => {
      res.sort(function (a: any, b: any) { return b.wallet_Amount - a.wallet_Amount });
      this.walletList = res;
    })
    this.benificiaryFromContacts = this.data?.benificiaryFromContacts;
    this.cd.detectChanges()


    // if(this.data?.benificiaryFromContacts){
    //   this.benificiaryFromContacts = this.data?.benificiaryFromContacts
    // }
  }

  gettimerSubscriptionForComplete(event: any){
    // console.log("gettimerSubscriptionForComplete", event);
    this.timerSubscription = event;
  }
  createdPaymentDataFortransfer(event:any){
    this.createdPaymentData = event
  }
  signObjectForSummeryForTransfer(event:any){
    this.signObjectForSummery = event
  }

}
