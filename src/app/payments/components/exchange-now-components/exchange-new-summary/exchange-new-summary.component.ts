import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExchangeMainComponent } from '../exchange-main/exchange-main.component';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { getAllActiveCurrencies } from '../../../../main-dashboard/dashboard-data/balanceList-data';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-exchange-new-summary',
  templateUrl: './exchange-new-summary.component.html',
  styleUrls: ['./exchange-new-summary.component.scss'],
  imports: [CommonModule, MatMenuModule, MatCheckboxModule, FormsModule]
})
export class ExchangeNewSummaryComponent {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('exchangeForm') exchangeForm?: any;
  @Input('createdConvertData') createdConvertData?: any;
  @Input('timerSubscription') timerSubscription?: any
  @Input('timerSubscriptionWithTimerData') timerSubscriptionWithTimerData?: any

  @Output() completedPaymentRequestDetails = new EventEmitter<any>();
  activeCurrencyList: any;
  getSelectedCurrencyDetails: any;
  termsAndCondition: any
  errMsg: any;
  completedPaymentRequest: any;
  showLoader = false;


  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ExchangeNewSummaryComponent>,
    private fb: FormBuilder,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    // console.log(this.exchangeForm)
    of(getAllActiveCurrencies).subscribe(res => {
      this.activeCurrencyList = res;
      this.selectExchangeCurrency()
    })
    // this.searchData()
  }

  ngOnChanges() {
    this.selectExchangeCurrency()
  }

  selectExchangeCurrency() {
    const getSelectedCurrencyDetails = this.activeCurrencyList?.filter((option: any) => option?.currency?.code?.toLowerCase().includes(this.exchangeForm?.value?.exchangeCurrency?.toLowerCase()));
    if (getSelectedCurrencyDetails && getSelectedCurrencyDetails[0]) {
      this.getSelectedCurrencyDetails = getSelectedCurrencyDetails[0];
    }
    this.cd?.detectChanges()
  }


  nextStep(stepper: any, progress: any) {
    if (this.formStepper) {

      // if (this.createdConvertData?.convertRequest?.requestId) {
      //   this.showLoader = true
      //   this._walletService.completeConvertRequest(this.createdConvertData?.convertRequest?.requestId).subscribe((data: any) => {
      //     this.completedPaymentRequest = data
      //     this.completedPaymentRequestDetails.emit(this.completedPaymentRequest)

          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
      //     this.showLoader = false
      //     delete this.errMsg;
          this.formStepper.next();
          this.formStepperProgress.value = (this.formStepper?.selectedIndex + 1) * 100 / this.formStepper?.steps?.length;
          // this.timerSubscription.unsubscribe();
      //   }, err => {
      //     this.showLoader = false
      //     this.errMsg = err.error[0]?.message;
      //     this.errMsg = err.error?.apiErrorMessage;
      //   })
      // }
    }
  }

  goToPreviousStep() {
    delete this.errMsg;
  }


  closeButton() {
    this.dialogRef.close(this.timerSubscription);
    this.dialog.closeAll()
    this.timerSubscription?.unsubscribe();

  }


  openConvertNow() {
    let activeWallet: any = localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(ExchangeMainComponent, {
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
          // this.timerSubscription = shouldReload
          this.timerSubscription.unsubscribe()
        }
      });
  }

  exchangePlanConvert() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    // this.dialog
    //   .open(PlanConversionComponent, {
    //     width: '100vw',
    //     maxWidth: '100vw',
    //     data: {
    //       selectedwalletInfo: currency,
    //     },
    //     disableClose: true,
    //   })
    //   .afterClosed()
    //   .subscribe((data: any) => {
    //     // console.log('Exchange now dialog closed!');
    //   });
  }

  commaseprate(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e?.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      return false;
    }
  }

}
