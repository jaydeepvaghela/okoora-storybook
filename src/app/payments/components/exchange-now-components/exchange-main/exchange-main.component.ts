import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExchangeNewStep1Component } from '../exchange-new-step1/exchange-new-step1.component';
import { ExchangeNewSummaryComponent } from '../exchange-new-summary/exchange-new-summary.component';
import { ExchangeDoneComponent } from '../exchange-done/exchange-done.component';
import { balanceList, getAllActiveCurrencies } from '../../../../main-dashboard/dashboard-data/balanceList-data';

@Component({
  selector: 'app-exchange-main',
  templateUrl: './exchange-main.component.html',
  styleUrls: ['./exchange-main.component.scss'],
  imports: [CommonModule, MatDialogModule, MatStepperModule, MatProgressBarModule, ExchangeNewStep1Component, ExchangeNewSummaryComponent, ExchangeDoneComponent]
})
export class ExchangeMainComponent {
  @Input() activeCurrency: any;
  @Input() currentStepIndex: number = 0;
  exchangeForm: any;
  createdConvertData: any;
  timerSubscription: any;
  completedPaymentData: any;
  fromDashboardConvertObject: any;
  timerSubscriptionWithTimerData: any;
  dialogData = {
    selectedType: 'buy',
    fromDashboadConvert: true
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _walletService: WalletsService,
  ) {}
  getAllActiveCurrencies = getAllActiveCurrencies;
  balanceList = balanceList;

  ngOnInit() {
    console.log('data',this.data)
    
    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      this.activeCurrency = wallet;
      let buyValue = this.dialogData?.selectedType === 'buy' ? this.activeCurrency?.wallet_Currency?.code : this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency
      let sellValue = this.dialogData?.selectedType === 'buy' ? this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency : this.activeCurrency?.wallet_Currency?.code

      this.fromDashboardConvertObject = {
        selectedType: this.dialogData?.selectedType,
        fromDashboadConvert: this.dialogData?.fromDashboadConvert,
        buyValue: buyValue,
        sellValue: sellValue
      }
    });
  }

  getExchangeFormDetails(event: any) {
    this.exchangeForm = event
  }
  getCreatedData(event: any) {
    this.createdConvertData = event
  }

  gettimerSubscriptionForComplete(event: any) {
    this.timerSubscription = event;
  }

  getCompletedData(event: any) {
    this.completedPaymentData = event
  }

  timerSubscriptionWithTimerdata(event:any) {
    this.timerSubscriptionWithTimerData = event;
  }
}
