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
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
// import { WalletBalanceListModal } from 'src/app/common/models/WalletBalanceListModal';
// import { ContactsService } from 'src/app/contacts/services/contacts.service';
// import { ExchangeMainComponent } from 'src/app/exchange/components/exchange-main/exchange-main.component';
// import { MassPaymentComponent } from 'src/app/mass-payment/components/mass-payment/mass-payment.component';
// import { PlanConversionComponent } from 'src/app/plan-conversion/components/plan-conversion.component';
// import { AddMoneyComponent } from 'src/app/wallets/components/add-money/add-money.component';
// import { ConvertComponent } from 'src/app/wallets/components/convert/convert.component';
// import { SendComponent } from 'src/app/wallets/components/send/components/send.component';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { PaymentDashboardTransactionComponent } from '../payment-dashboard-transaction/payment-dashboard-transaction.component';
// import { SinglePaymentSendComponent } from '../single-payment-send/single-payment-send.component';

@Component({
  selector: 'app-payments-dashboard',
  templateUrl: './payments-dashboard.component.html',
  styleUrls: ['./payments-dashboard.component.scss'],
  imports: [CommonModule, MatMenuModule, PaymentDashboardTransactionComponent]
})
export class PaymentsDashboardComponent {
  timerSubscription: any;
  showLoader!: boolean;
  walletList: any;
  // @ViewChild(PaymentDashboardTransactionComponent) child: PaymentDashboardTransactionComponent;
  selectedWallet!: WalletBalanceListModal;
  userRoleType!: number;
  activeCurrencyListFilter: any;
  unSubScribe$ = new Subject<void>();


  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    // private contactsService:ContactsService
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

    // this.contactsService.createSinglePaymentFromBeneficiary.pipe(takeUntil(this.unSubScribe$)).subscribe(res => {   
    //   if(res !== null) {
    //     this.createSinglePayment(res ? res : null);
        
    //   }
    // })
  }

  createRequest() {
    // this.dialog
    //   .open(AddMoneyComponent, {
    //     width: '100vw',
    //     maxWidth: '100vw',
    //     disableClose: true,
    //     data: {
    //       activeWallet: this.selectedWallet,
    //     },
    //   })
    //   .afterClosed()
    //   .subscribe((shouldReload: any) => {
    //     this.ngOnInit();
    //   });
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
        // console.log('shouldReload', shouldReload);
        if (shouldReload) {
          this.timerSubscription = shouldReload;
          // this.timerSubscription?.unsubscribe()
        }
        if (shouldReload == 'completedSend') {
          let activeWallet: any = localStorage.getItem('activeWallet');
          let currency = JSON.parse(activeWallet);
          this.activeCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(currency?.wallet_Currency?.code?.toLowerCase()));
          this._walletService.setCurrentCurrencyData(this.activeCurrencyListFilter);
          // this.child?.getAllData();
        }
      });
  }

  createConvertDialog() {
    let activeWallet;
    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      activeWallet = wallet;
    });

    // const dialogRef = this.dialog
    //   .open(ConvertComponent, {
    //     width: '100vw',
    //     maxWidth: '100vw',
    //     disableClose: true,
    //     data: {
    //       selectedwalletInfo: activeWallet,
    //       transaction: true,
    //     },
    //   })
    //   .afterClosed()
    //   .subscribe((shouldReload: any) => {
    //     this.child?.getAllData();
    //   });
  }

  CreateLockRateDialog() {
    // let activeWallet: any = localStorage.getItem('activeWallet');
    // let currency = JSON.parse(activeWallet);
    // this.dialog
    //   .open(SendComponent, {
    //     width: '100vw',
    //     maxWidth: '100vw',
    //     data: {
    //       selectedwalletInfo: currency,
    //       type: true,
    //       payment: false,
    //       transaction: true,
    //     },
    //     disableClose: true,
    //   })
    //   .afterClosed()
    //   .subscribe((shouldReload: any) => {
    //     this.child?.getAllData();
    //   });
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
          // this.child?.getAllData();
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
        // this.child?.getAllData();
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
          // this.child?.getAllData();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    // this.contactsService.createSinglePaymentFromBeneficiaryStep6(null);
  }
}
