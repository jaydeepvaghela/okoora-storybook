import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExchangeMainComponent } from '../exchange-main/exchange-main.component';
import { of } from 'rxjs';
import { getAllActiveCurrencies } from '../../../../main-dashboard/dashboard-data/balanceList-data';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-done',
  templateUrl: './exchange-done.component.html',
  styleUrls: ['./exchange-done.component.scss'],
  imports: [MatMenuModule, CommonModule]
})
export class ExchangeDoneComponent {
  timerSubscription: any;
  @Input('exchangeForm') exchangeForm?: any;
  @Input('completedPaymentData') completedPaymentData?: any;
  activeCurrencyList: any;
  getSelectedCurrencyDetails: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ExchangeDoneComponent>,
    private cd: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    of(getAllActiveCurrencies).subscribe(res => {
      this.activeCurrencyList = res;
      this.selectExchangeCurrency()
    })
  }
  closeDialog() {
    this.dialogRef.close('convert-completed');
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
  selectExchangeCurrency() {
    const getSelectedCurrencyDetails = this.activeCurrencyList.filter((option: any) => option?.currency?.code?.toLowerCase().includes(this.exchangeForm?.value?.exchangeCurrency?.toLowerCase()));
    this.getSelectedCurrencyDetails = getSelectedCurrencyDetails[0]
    this.cd?.detectChanges()
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
        if (shouldReload) {
          this.timerSubscription = shouldReload
          this.timerSubscription.unsubscribe()
        }
      });
  }
}
