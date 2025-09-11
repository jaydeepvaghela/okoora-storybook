import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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
import { MarketOverviewChartComponent } from './components/market-overview-chart/market-overview-chart.component';
import { MatCardModule } from '@angular/material/card';
import { LockNextPaymentComponent } from './components/lock-next-payment/lock-next-payment.component';
import { balanceList, lastPaymentRateData } from './dashboard-data/balanceList-data';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SideTabsContainerComponent } from './components/side-tabs-container/side-tabs-container.component';
import { HtmlTooltipDirective } from '../directives/html-tooltip.directive';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { FreeBalanceBoxComponent } from "./components/free-balance-box/free-balance-box.component";
import { OpenInvoicesBoxComponent } from './components/open-invoices-box/open-invoices-box.component';
import { CurrentHedgeBoxComponent } from './components/current-hedge-box/current-hedge-box.component';
import { MarketRiskBoxComponent } from "./components/market-risk-box/market-risk-box.component";
import { TradeViewWrapperComponent } from "./components/trade-view-wrapper/trade-view-wrapper.component";

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  imports: [CommonModule, HtmlTooltipDirective, WalletListGeneralComponent, SideTabsContainerComponent, CalendarComponent, FooterComponent, LockNextPaymentComponent, MatCardModule, MarketOverviewChartComponent, DragDropModule, FreeBalanceBoxComponent, OpenInvoicesBoxComponent, CurrentHedgeBoxComponent, MarketRiskBoxComponent, TradeViewWrapperComponent]
})
export class MainDashboardComponent {
  @ViewChild('notificationDrawer') notificationDrawer: MatDrawer | undefined;
  @ViewChild(LockNextPaymentComponent)
  lockNextPaymentComponent!: LockNextPaymentComponent;
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
  ) { }

  ngOnInit() {
    this._walletService.activeWallet$.subscribe((wallet) => {
      this.activeCurrency = wallet;
    });

    this._walletService.walletDataForLock.subscribe((walletData: any) => {
      if (walletData) {
          const currenciesRequiringHedging = ['HKD', 'SGD', 'THB', 'SEK'];
          if (currenciesRequiringHedging.includes(walletData?.wallet_Currency?.code) && walletData?.wallet_Hedging == null) {
            this.openQuestionnaireDialog();
          }
      }
    })
    this.user = JSON.parse(localStorage.getItem('user')!);
   

      this.Loader = true;
      this.balanceListSubscription = this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe(
        {
          next:(res) => {
            this.Loader = false;
            res.sort(function (a: any, b: any) {
              return b.wallet_Amount - a.wallet_Amount;
            });
            let selectedWallet;
            let index = res.findIndex((x: any) => x.wallet_SupportBaseHedging == true && x.wallet_Hedging != null);
            let j = res.findIndex((x: any) => x.wallet_SupportBaseHedging == true);
            if (index != -1) {
              selectedWallet = res[index];
            } else if (j != -1) {
              selectedWallet = res[j];
            }
            this._walletService.setCurrentCurrencyData(selectedWallet);
            this._walletService.setwalletObs(selectedWallet);
          },
          error:(err) => {
            this.Loader = false;
          }
        }
      );

      this.currencyOfUser = 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png';
      this._walletService.activeCurrentWallet
        .pipe(
          takeUntil(this.unSubScribe$),
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
        )
        .subscribe((wallet) => {
          this.activeCurrency = wallet;
          if (this.activeCurrency?.wallet_Hedging === null && this.activeCurrency?.wallet_SupportBaseHedging === true && !this.isQuestionaireOpened && this.user.type == 'Business') {  
                    this.dialog.closeAll();
                    this.isQuestionaireOpened = true;
                    this.openQuestionnaireDialog()
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

  }
  
  ngAfterViewInit() {
    this._dashboardService.getSlidePosition().subscribe((position: number) => {
      this.isFirstSlide = position === 0;
      this.isLastSlide = position === 2;
    });

   
  }

  getDashboardPanelData(wallet: any) {
    this.showLoader = true;
  }

  drop(event: any) {
    moveItemInArray(this.dashboardItems, event.previousIndex, event.currentIndex);
  }


  goToPreviousSlide() {
    if (this.lockNextPaymentComponent && this.lockNextPaymentComponent.mySwiper) {
      this.lockNextPaymentComponent.mySwiper.slidePrev();
    }
  }

  goToNextSlide() {
    if (this.lockNextPaymentComponent && this.lockNextPaymentComponent.mySwiper) {
      this.lockNextPaymentComponent.mySwiper.slideNext();
    }
  }

  openQuestionnaireDialog() {
    const dialogRef = this.dialog.open(QuestionnaireComponent, {
      width: '668px',
      maxWidth: '800px',
      data: { selectedCurrency: this.activeCurrency },
      backdropClass: 'questionnaire-dark-backdrop',
      panelClass: 'specific-questionare-dialog',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        of(balanceList).pipe(takeUntil(this.unSubScribe$)).subscribe((res: any) => {
          if (res) {
            let wallet = res?.findIndex((x: any) => x.wallet_Currency.code == this.activeCurrency?.wallet_Currency?.code);
            if (res[wallet] && res[wallet]?.wallet_SupportBaseHedging == true) {
              this._walletService.setCurrentCurrencyData(res[wallet]);
            }
          }
        });
      }
      this.isQuestionaireOpened = false;
    });
  }

  changeTableVisibility(ev: any) {
    this.showTable = ev;
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    this.balanceListSubscription?.unsubscribe();
  }
}
