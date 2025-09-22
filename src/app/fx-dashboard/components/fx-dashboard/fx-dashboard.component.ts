import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { FxErpStepperComponent } from 'src/app/fx-erp-connection/components/fx-erp-stepper/fx-erp-stepper.component';
// import { OnboardingService } from 'src/app/common/services/onboarding.service';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
import { distinctUntilChanged, map, of, Subject, takeUntil, timer } from 'rxjs';
import { QuestionnaireComponent } from '../../../main-dashboard/components/questionnaire/questionnaire.component';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { DashboardService } from '../../../main-dashboard/services/dashboard.service';
import { balanceList } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { defaultCurrency } from '../../../main-dashboard/dashboard-data/default-currency';
import { CommonModule } from '@angular/common';
import { AutoPilotListComponent } from '../auto-pilot-list/auto-pilot-list.component';
import { FxProtectedRiskComponent } from '../fx-protected-risk/fx-protected-risk.component';
import { FxErpStepperComponent } from '../../../fx-erp-connection/components/fx-erp-stepper/fx-erp-stepper.component';
import { getConversionRules } from '../fx-dashboard-data/conversionRules';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
// import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
// import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
// import { QuestionnaireComponent } from 'src/app/dashboard/components/questionnaire/questionnaire.component';
// import { FxDashboardService } from '../../services/fx-dashboard.service';

@Component({
  selector: 'app-fx-dashboard',
  templateUrl: './fx-dashboard.component.html',
  styleUrls: ['./fx-dashboard.component.scss'],
  imports: [CommonModule, AutoPilotListComponent, FxProtectedRiskComponent, MatDialogModule]
})
export class FxDashboardComponent {
  isPayableProtectFilled: boolean = false;
  showLoader: boolean = false;
  balanceListSubscription: any;
  user: any;
  unSubScribe$ = new Subject<void>();
  isQuestionaireOpened: any;
  currencyOfUser!: string;
  activeCurrency: any;
  lastPaymentRateData: any;
  timerSubscription: any;
  isQuestionaireAlreadyOpened!: boolean;
  allowedHedgeCurrencies: any;
  hedgingLoaded!: boolean;
  conversionData: any;

  _onDestroy = new Subject<void>();
  defaultCurrency: any;

  constructor(public dialog: MatDialog, private _walletService: WalletsService,
    private _dashboardService: DashboardService
  ) {
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.isPayableProtectFilled = true;
    const tokenString = localStorage.getItem('token');
    this.getFxConversionRulesData();
    if (tokenString) {

      this.showLoader = true;
      // this.balanceListSubscription = this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe(
        of(balanceList).pipe(takeUntil(this.unSubScribe$)).subscribe({
          next: (res) => {
            this.showLoader = false;
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
            const activeCode = selectedWallet?.wallet_Currency?.code;
            console.log('activeCode', activeCode);
            console.log('this.isCurrencyAllowed(activeCode)', activeCode && this.isCurrencyAllowed(activeCode))
            let firsttimePopup = res?.find((x: any) => x?.wallet_Hedging != null && x?.wallet_SupportBaseHedging === true);
            const user = JSON.parse(localStorage.getItem('user') || '');
            // this.dialog.closeAll();
            if (firsttimePopup) {
              // console.log('pair is there');
            } else if (user?.plan != null && user?.type == 'Business' && !this.isQuestionaireOpened) {
              const ilsUser = JSON.parse(localStorage.getItem('user')!)['afiiliate'];
              if (ilsUser?.country !== 'il') {
                // this.authGuard.isUserCompleteKybAndApprovedByAirWallex().pipe(takeUntil(this.unSubScribe$)).subscribe(isKYBCompleted => {
                //   if (isKYBCompleted) {
                    this.dialog.closeAll();
                    this.isQuestionaireOpened = true;
                    if (!this.isQuestionaireAlreadyOpened && activeCode && this.isCurrencyAllowed(activeCode)) {
                      this.openQuestionnaireDialog()
                    }
                //   }
                // })
              } else {
                this.isQuestionaireOpened = true;
                if (!this.isQuestionaireAlreadyOpened && activeCode && this.isCurrencyAllowed(activeCode)) {
                  this.openQuestionnaireDialog()
                }
              }
            }
          },
          error: (err) => {
            this.showLoader = false;
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
          this.activeCurrency = wallet || localStorage.getItem('activeWallet') ? JSON.parse(localStorage.getItem('activeWallet')!) : null ; // temporary fix
          // this.dialog.closeAll();
          const activeCode = this.activeCurrency?.wallet_Currency?.code;
          console.log('activeCode', activeCode);
          console.log('this.isCurrencyAllowed(activeCode)', this.isCurrencyAllowed(activeCode))
          if (this.activeCurrency?.wallet_Hedging === null && this.activeCurrency?.wallet_SupportBaseHedging === true && !this.isQuestionaireOpened && user?.type == 'Business') {
            const ilsUser = JSON.parse(localStorage.getItem('user')!)['afiiliate'];
            if (ilsUser?.country !== 'il') {
              // this.authGuard.isUserCompleteKybAndApprovedByAirWallex().pipe(takeUntil(this.unSubScribe$)).subscribe(isKYBCompleted => {
              //   if (isKYBCompleted) {
                  this.dialog.closeAll();
                  this.isQuestionaireOpened = true;
                   if (!this.isQuestionaireAlreadyOpened && activeCode && this.isCurrencyAllowed(activeCode)) { 
                    this.openQuestionnaireDialog()
                   }
              //   }
              // })
            } else {
              this.isQuestionaireOpened = true;
              if (!this.isQuestionaireAlreadyOpened && activeCode && this.isCurrencyAllowed(activeCode)) {
                this.openQuestionnaireDialog() 
              }
            }
          }

          // if (wallet?.wallet_Hedging?.pair) {
          //   this.getDashboardPanelData(wallet?.wallet_Hedging?.pair);
          //   const obs$ = this._dashboardService.LastPaymentRate(this.activeCurrency?.wallet_Currency?.code);
          //   if (obs$) {
          //     obs$
          //       .pipe(takeUntil(this.unSubScribe$))
          //       .subscribe((res) => {
          //         this.lastPaymentRateData = res;
          //         this._dashboardService.setlastPaymentRateData(this.lastPaymentRateData);
          //       });
          //   }
          // }
        });

      this.timerSubscription = timer(60000, 60000).pipe(
        map(() => {
          // if (this.authenticationService.isUserLogin()) {
          //   const obs$ = this._dashboardService.LastPaymentRate(this.activeCurrency?.wallet_Currency?.code);
          //   if (obs$) {
          //     obs$
          //       .pipe(takeUntil(this.unSubScribe$))
          //       .subscribe((res) => {
          //         this.lastPaymentRateData = res;
          //         this._dashboardService.setlastPaymentRateData(this.lastPaymentRateData);
          //       });
          //   }
          // }
        })
      ).subscribe();
        this.checkForOnboarding(); // check if onboarding popup needs to be shown
      // this._onboardingService.showWelcomePopup();

      // this.openQuestionnaireDialog();

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
      
    }
  }

  checkForOnboarding() { // check if onboarding popup needs to be shown
    of(defaultCurrency).pipe(takeUntil(this.unSubScribe$)).subscribe(res => {
    // this._dashboardService.GetDefaultCurrency().subscribe(res => {
      this.defaultCurrency = res?.baseCurency;

      if (this.defaultCurrency && (!(this.isQuestionaireOpened || this.isQuestionaireAlreadyOpened))) {
        // this._onboardingService.showWelcomePopup();
      }
    })
  }

  getFxConversionRulesData() {
    of(getConversionRules)
      .pipe(takeUntil(this.unSubScribe$))
      .subscribe({
        next: (result: any) => {
          this.conversionData = result;
        },
        error: (err: any) => {
          console.error('Error fetching conversion rules:', err);
        }
      });
  }

  isCurrencyAllowed(code: string): boolean {
    return this._walletService.allowedHedgeCurrencies$.value.has(code);
  }

  openQuestionnaireDialog() {
      this.isQuestionaireAlreadyOpened = true;
      const dialogRef = this.dialog.open(QuestionnaireComponent, {
        width: '668px',
        // height: '560px',
        maxWidth: '800px',
        data: { selectedCurrency: this.activeCurrency },
        backdropClass: 'questionnaire-dark-backdrop',
        panelClass: 'specific-questionare-dialog',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'true') { 
           this._walletService.triggerBalanceRefresh();
          this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe((res: any) => {
            if (res) {
              let wallet = res?.findIndex((x: any) => x.wallet_Currency.code == this.activeCurrency?.wallet_Currency?.code);
              if (res[wallet] && res[wallet]?.wallet_SupportBaseHedging == true && res[wallet]?.wallet_Hedging == null) {
                this._walletService.setCurrentCurrencyData(res[wallet]);
              }
              // let wallet = res.findIndex((x)=> x.wallet_Hedging != null)
              // wallet ? this._walletService.setCurrentCurrencyData(res[wallet]) : ''
            }
          });
          this.isQuestionaireAlreadyOpened = false;
        }
        this.isQuestionaireOpened = false;
        this.isQuestionaireAlreadyOpened = false;
        // this._onboardingService.showWelcomePopup();
      });
    }

  getDashboardPanelData(pair: any) {
    // throw new Error('Method not implemented.');
  }

  async openManageHedgeDeals() {
    const { ManageHedgeDealsComponent } = await import('../manage-hedge-deals/manage-hedge-deals.component');
    this.dialog.open(ManageHedgeDealsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '1412px',
      panelClass: 'manage-hedge-dialog',
      disableClose: true,
    });
  }
  async openFxErp() {
    // const { FxErpStepperComponent } = await import('../../../fx-erp-connection/components/fx-erp-stepper/fx-erp-stepper.component');
    this.dialog.open(FxErpStepperComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '1627px',
      maxHeight: '966px',
      panelClass: 'fx-erp-dialog',
      disableClose: true,
    }).afterClosed().subscribe(res => {
      if (res && res === 'fromConversion') {
        this.getFxConversionRulesData();
      }
    });
  }

  ngOnDestroy() {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    
    if (this.balanceListSubscription) {
      this.balanceListSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
