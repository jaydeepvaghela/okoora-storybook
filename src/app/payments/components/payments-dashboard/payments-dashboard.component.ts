import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { WalletBalanceListModal } from '../../../main-dashboard/models/WalletBalanceListModal';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { PaymentDashboardTransactionComponent } from '../payment-dashboard-transaction/payment-dashboard-transaction.component';
import { SinglePaymentSendComponent } from '../single-payment-components/single-payment-send/single-payment-send.component';
import { MassPaymentComponent } from '../mass-payment-components/mass-payment/mass-payment.component';
import { ExchangeMainComponent } from '../exchange-now-components/exchange-main/exchange-main.component';
import { PlanConversionComponent } from '../exchange-later-components/plan-conversion/plan-conversion.component';
import { SendComponent } from '../send/send.component';
import { PaymentsOptionWrapComponent } from '../payments-option-wrap/payments-option-wrap.component';

@Component({
  selector: 'app-payments-dashboard',
  templateUrl: './payments-dashboard.component.html',
  styleUrls: ['./payments-dashboard.component.scss'],
  imports: [CommonModule, MatMenuModule, PaymentDashboardTransactionComponent, PaymentsOptionWrapComponent]
})
export class PaymentsDashboardComponent {
  timerSubscription: any;
  showLoader!: boolean;
  walletList: any;
  selectedWallet!: WalletBalanceListModal;
  userRoleType!: number;
  activeCurrencyListFilter: any;
  unSubScribe$ = new Subject<void>();


  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
  ) {}

  ngOnInit() {
    this.showLoader = true;
    this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe((res) => {
      this.walletList = res;
      this.showLoader = false;
    });
    this._walletService.activeCurrentWallet.pipe(takeUntil(this.unSubScribe$)).subscribe((wallet) => {
      this.selectedWallet = wallet;
    });
  }

  createSinglePayment(data?: any) {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(SinglePaymentSendComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
          payment: true,
          benificiaryFromContacts: data
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((shouldReload: any) => {
        if (shouldReload) {
          this.timerSubscription = shouldReload;
        }
        if (shouldReload == 'completedSend') {
          let activeWallet: any = localStorage.getItem('activeWallet');
          let currency = JSON.parse(activeWallet);
          this.activeCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(currency?.wallet_Currency?.code?.toLowerCase()));
          this._walletService.setCurrentCurrencyData(this.activeCurrencyListFilter);
        }
      });
  }

  createConvertDialog() {
    let activeWallet;
    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      activeWallet = wallet;
    });
  }

  CreateLockRateDialog() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(SendComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
          type: true,
          payment: false,
          transaction: true,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((shouldReload: any) => {
      });
  }

  exchangeNow() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.selectedWallet = this.walletList[0]
    this._walletService.setCurrentCurrencyData(this.selectedWallet)
    this.dialog
      .open(ExchangeMainComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data: any) => {
        if(data == 'convert-completed') {
        }
      });
  }

  exchangePlanConvert() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(PlanConversionComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe(() => {
      });
  }
  createMassPayment() {
    const dialogRef = this.dialog
      .open(MassPaymentComponent, {
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        data: {
          walletList: this.walletList,
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if(data === 'completedMassPayment') {
          let activeWallet: any = localStorage.getItem('activeWallet');
          let currency = JSON.parse(activeWallet);
          this.activeCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(currency?.wallet_Currency?.code?.toLowerCase()));
          this._walletService.setCurrentCurrencyData(this.activeCurrencyListFilter);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
  }
}
