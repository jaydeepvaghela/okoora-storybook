import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { distinctUntilChanged, map, of, Subject, takeUntil, timer } from 'rxjs';
import { WalletBalanceListModal } from './models/WalletBalanceListModal';
import { WalletListGeneralComponent } from './components/wallet-list-general/wallet-list-general.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardService } from './services/dashboard.service';
import { CommonModule } from '@angular/common';
import { WalletsService } from './services/wallets.service';
import { MarketRiskChartComponent } from './components/market-risk-chart/market-risk-chart.component';
import { MarketOverviewChartComponent } from './components/market-overview-chart/market-overview-chart.component';
import { MatCardModule } from '@angular/material/card';
import { LockNextPaymentComponent } from './components/lock-next-payment/lock-next-payment.component';
import { lastPaymentRateData } from './dashboard-data/balanceList-data';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SideTabsContainerComponent } from './components/side-tabs-container/side-tabs-container.component';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
// import { WalletBalanceListModal } from 'src/app/common/models/WalletBalanceListModal';
// import { OnboardingService } from 'src/app/common/services/onboarding.service';
// import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
// import { AddMoneyComponent } from 'src/app/wallets/components/add-money/add-money.component';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { DashboardService } from '../../services/dashboard.service';
// import { LockNextPaymentComponent } from '../lock-next-payment/lock-next-payment.component';
// import { MarketRiskChartComponent } from '../market-risk-chart/market-risk-chart.component';
// import { QuestionnaireComponent } from '../questionnaire/questionnaire.component';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  imports: [CommonModule, WalletListGeneralComponent, MarketRiskChartComponent, SideTabsContainerComponent, CalendarComponent, FooterComponent, LockNextPaymentComponent, CdkDrag, MatCardModule, MarketOverviewChartComponent]
})
export class MainDashboardComponent {
  @ViewChild('notificationDrawer') notificationDrawer: MatDrawer | undefined;
  // @ViewChild(LockNextPaymentComponent)
  // lockNextPaymentComponent: LockNextPaymentComponent;
  // @ViewChild(MarketRiskChartComponent) child: MarketRiskChartComponent;
  activeCurrency: any;
  currencyOfUser: any;
  dashboardpanelData: any;
  showLoader!: boolean;
  isFirstSlide!: boolean;
  isLastSlide!: boolean;
  errormsg: any;
  lastPaymentRateData = lastPaymentRateData;
  dashboardItems = [
    {
      index: 1,
      class: 'first-row',
    },
    {
      index: 2,
      class: 'second-row',
    },
    {
      index: 3,
      class: 'third-row',
    },
  ];
  timerSubscription: any;
  showTable = false;
  resourceId = 0;
  Loader: boolean = false;
  isQuestionaireOpened = false;
  balanceListSubscription: any;
  selectedWallet!: WalletBalanceListModal;
  user: any;
  unSubScribe$ = new Subject<void>();
  constructor(
    private _walletService: WalletsService,
    public dialog: MatDialog,
    private _dashboardService: DashboardService,
    // private _onboardingService: OnboardingService,
    // private authenticationService: AuthenticationService,
    // private authGuard : AuthGuard
  ) { }

  ngOnInit() {
    this.activeCurrency = JSON.parse(
      localStorage.getItem('activeWallet') || ''
    );
    this.user = JSON.parse(localStorage.getItem('user')!);
    // const tokenString = localStorage.getItem('token');
    // if (tokenString) {

      this.Loader = true;
      // this.balanceListSubscription = this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe(
      //   {
      //     next:(res) => {
      //       this.Loader = false;
      //       res.sort(function (a: any, b: any) {
      //         return b.wallet_Amount - a.wallet_Amount;
      //       });
      //       let selectedWallet;
      //       let index = res.findIndex((x: any) => x.wallet_SupportBaseHedging == true && x.wallet_Hedging != null);
      //       let j = res.findIndex((x: any) => x.wallet_SupportBaseHedging == true);
      //       if (index != -1) {
      //         selectedWallet = res[index];
      //       } else if (j != -1) {
      //         selectedWallet = res[j];
      //       }
      //       this._walletService.setCurrentCurrencyData(selectedWallet);
      //       this._walletService.setwalletObs(selectedWallet);
      //       let firsttimePopup = res?.find((x: any) => x?.wallet_Hedging != null && x?.wallet_SupportBaseHedging === true);
      //       const userPlan = JSON.parse(localStorage.getItem('user') || '');
      //       if (firsttimePopup) {
      //         // console.log('pair is there');
      //       } else if (userPlan?.plan != null && this.user.type == 'Business' && !this.isQuestionaireOpened) {
      //         const ilsUser = JSON.parse(localStorage.getItem('user')!)['afiiliate'];
      //         if(ilsUser?.country !== 'il') {
      //           this.authGuard.isUserCompleteKybAndApprovedByAirWallex().subscribe(isKYBCompleted => {
      //             if(isKYBCompleted) {
      //             this.dialog.closeAll();
      //             this.isQuestionaireOpened = true;
      //             this.openQuestionnaireDialog()
      //             }
      //            })
      //         } else {
      //           this.isQuestionaireOpened = true;
      //           this.openQuestionnaireDialog()
      //         }
      //       }
      //     },
      //     error:(err) => {
      //       this.Loader = false;
      //     }
      //   }
      // );

      this.currencyOfUser = 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png';
      this._walletService.activeCurrentWallet
        .pipe(
          takeUntil(this.unSubScribe$),
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
        )
        .subscribe((wallet) => {
          this.activeCurrency = wallet;
          if (this.activeCurrency?.wallet_Hedging === null && this.activeCurrency?.wallet_SupportBaseHedging === true && !this.isQuestionaireOpened && this.user.type == 'Business') {  
            const ilsUser = JSON.parse(localStorage.getItem('user')!)['afiiliate'];
            if(ilsUser?.country !== 'il') {
                // this.authGuard.isUserCompleteKybAndApprovedByAirWallex().subscribe(isKYBCompleted => {
                //   if(isKYBCompleted) {
                    this.dialog.closeAll();
                    this.isQuestionaireOpened = true;
                    this.openQuestionnaireDialog()
                //   }
                //  })
              } else {
                this.isQuestionaireOpened = true;
                this.openQuestionnaireDialog()
              }
          }
          if (wallet?.wallet_Hedging?.pair) {
            this.getDashboardPanelData(wallet?.wallet_Hedging?.pair);
            of(this.lastPaymentRateData).pipe(
              takeUntil(this.unSubScribe$)).subscribe((res) => {
              this.lastPaymentRateData = res;
              this._dashboardService.setlastPaymentRateData(this.lastPaymentRateData);
            });
          }
        });

      this.openQuestionnaireDialog();
    
      // const dialogRef = this.dialog.open(ApprovalProtectiveFormComponent, {
      //   width: '600px',
      //   disableClose: true,
      //   panelClass: 'approval-protective-dialog',
      //   data: {
      //     type: 'protect',
      //     fromNewdashboard: true,
      //     invoiceDetailResult: "test",
      //     colleteralData: "test",
      //     invoiceNo: "test",
      //     buyCurrency: "USD",
      //     sellCurrency: "ILS",
      //     collateralCurrency: "test"
      //   }
      // })
    // }
  }
  
  ngAfterViewInit() {
    // this.isNonIsraeliUsers = this.authenticationService.isNonIsraelUser();
    this._dashboardService.getSlidePosition().subscribe((position: number) => {
      this.isFirstSlide = position === 0;
      this.isLastSlide = position === 2;
    });
  }

  getDashboardPanelData(wallet: any) {
    this.showLoader = true;
    // this._dashboardService.GetMarketListData(wallet).subscribe(
    //   (res) => {
    //     this.showLoader = false;
    //     this.dashboardpanelData = res;
    //     this.errormsg = '';
    //     this.child.getData(res);
    //   },
    //   (err) => {
    //     this.showLoader = false;
    //     this.dashboardpanelData = [];
    //     this.errormsg = err?.error?.apiErrorMessage?.[0];
    //   }
    // );
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log('Drag event: ', event);
    moveItemInArray(this.dashboardItems, event.previousIndex, event.currentIndex);
  }

  notificationDrawerOpen() {
    // this.notificationDrawer.open();
    // document.querySelector('body').style.overflowY = 'hidden';
  }
  notificationDrawerClose() {
    // this.notificationDrawer.close();
    // document.querySelector('body').style.overflowY = 'auto';
  }

  goToPreviousSlide() {
    // if (this.lockNextPaymentComponent && this.lockNextPaymentComponent.mySwiper) {
    //   this.lockNextPaymentComponent.mySwiper.slidePrev();
    // }
  }

  goToNextSlide() {
    // if (this.lockNextPaymentComponent && this.lockNextPaymentComponent.mySwiper) {
    //   this.lockNextPaymentComponent.mySwiper.slideNext();
    // }
  }

  openQuestionnaireDialog() {
    // const dialogRef = this.dialog.open(QuestionnaireComponent, {
    //   width: '668px',
    //   // height: '560px',
    //   maxWidth: '800px',
    //   data: { selectedCurrency: this.activeCurrency },
    //   backdropClass: 'questionnaire-dark-backdrop',
    //   panelClass: 'specific-questionare-dialog',
    //   disableClose: true,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result == true) {
    //     this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe((res: any) => {
    //       if (res) {
    //         let wallet = res?.findIndex((x: any) => x.wallet_Currency.code == this.activeCurrency?.wallet_Currency?.code);
    //         if (res[wallet] && res[wallet]?.wallet_SupportBaseHedging == true) {
    //           this._walletService.setCurrentCurrencyData(res[wallet]);
    //         }
    //         // let wallet = res.findIndex((x)=> x.wallet_Hedging != null)
    //         // wallet ? this._walletService.setCurrentCurrencyData(res[wallet]) : ''
    //       }
    //     });
    //   }
    //   this.isQuestionaireOpened = false;
    // });
  }

  changeTableVisibility(ev: any) {
    this.showTable = ev;
  }

  openAddMoney() {
    // this.dialog.open(AddMoneyComponent, {
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   disableClose: true,
    //   data: {
    //     activeWallet: this.activeCurrency
    //   }
    // }).afterClosed()
    //   .subscribe((shouldReload: any) => {
    //     this.ngOnInit()
    //   });
    // this.eventDrawerOpen();
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    this.balanceListSubscription?.unsubscribe();
  }
}
