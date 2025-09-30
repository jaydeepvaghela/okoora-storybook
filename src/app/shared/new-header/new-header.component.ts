import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged, fromEvent, Observable, of, Subject, Subscribable, Subscription, takeUntil, tap } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { WalletsService } from '../../main-dashboard/services/wallets.service';
import { CommonService } from '../../common/services/common.service';
import { ContactsService } from '../../contacts-dashboard/services/contacts.service';
import { WalletBalanceListModal } from '../../common/models/WalletBalanceListModal';
import { ConnectionStatus } from '../../common/enums/connectionStatus';
import { PaymentDashboardTransactionComponent } from '../../payments/components/payment-dashboard-transaction/payment-dashboard-transaction.component';
import { HedgingDataService } from '../../risk-dashboard/components/hedging-proposal/hedging-data.service';
import { ConnectorService } from '../../connector/connector.service';
import { DashboardService } from '../../main-dashboard/services/dashboard.service';
import { GetActiveHedgingCurrency } from '../../main-dashboard/dashboard-data/all-currency-data';
import { ErpConnectionStatus, ErpConnectionType } from '../enums/enums';
import { SinglePaymentSendComponent } from '../../payments/components/single-payment-components/single-payment-send/single-payment-send.component';
import { CommonModule } from '@angular/common';
import { LanguageDropdownComponent } from '../components/language-dropdown/language-dropdown.component';
import { AddWalletComponent } from '../../main-dashboard/components/add-wallet/add-wallet.component';
import { ExchangeMainComponent } from '../../payments/components/exchange-now-components/exchange-main/exchange-main.component';
import { SendComponent } from '../../payments/components/send/send.component';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HedgeAllDrawerComponent } from '../../risk-dashboard/components/hedging-proposal/components/hedge-all-drawer/hedge-all-drawer.component';
import { QuickHedgeDrawerComponent } from '../../risk-dashboard/components/hedging-proposal/components/quick-hedge-drawer/quick-hedge-drawer.component';
import { EditCashflowRulesDrawerComponent } from '../../connector/components/edit-cashflow-rules-drawer/edit-cashflow-rules-drawer.component';
import { ErpConnectionDialogComponent } from '../components/erp-connection-dialog/erp-connection-dialog.component';
import { AddWalletMoneyComponent } from '../../add-wallet-money/add-wallet-money.component';
@Component({
  selector: 'app-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.scss'],
  imports:[CommonModule,LanguageDropdownComponent,FormsModule,MatMenuModule,MatIconModule,MatDrawer,HedgeAllDrawerComponent,QuickHedgeDrawerComponent, EditCashflowRulesDrawerComponent,AddWalletMoneyComponent]
})
export class NewHeaderComponent {
  /**
   * If true, hides the header actions (Deposit, Send payment, Convert, Lock Rate, ERP Connection) for use in Storybook WalletDropdown story.
   */
  @Input() hideHeaderActions = false;
  @Output() openSidebar = new EventEmitter();
  maxFlaglocalStorage!: boolean;
  maxSiteName!: string | null;
  maxLogo: boolean = false;
  subSite!: string | null;
  imageUrl!: string | null;
  timerSubscription: any;
  activeCurrencyListFilter: any;
  walletList: any;
  affiliateCountry!: string;
  selectedWallet!: WalletBalanceListModal;
  userRoleType!: number;
  unSubScribe$ = new Subject<void>();
  showDlg = false;
  isManageApiDrawerOpened = false;
  @ViewChild(PaymentDashboardTransactionComponent) child!: PaymentDashboardTransactionComponent;
  showLoader!: boolean;
  connectionStatus!: ConnectionStatus;

  searchTerm: string = '';
  selectedWalletIndex: number | null = null;
  @ViewChild('eventDrawer') eventDrawer!: MatDrawer;
  // @ViewChild('notificationDrawer') notificationDrawer: MatDrawer;
  // @ViewChild('walletDetailsDrawer') walletDetailsDrawer: MatDrawer;
  // @ViewChild('manageApiDrawer') manageApiDrawer: MatDrawer;
  // @ViewChild('riskManagerDrawer') riskManagerDrawer: MatDrawer;
  @ViewChild('quickHedgeDrawer') quickHedgeDrawer!: MatDrawer;
  @ViewChild('hedgeAllDrawer') hedgeAllDrawer!: MatDrawer;
 @ViewChild('editCashflowRulesDrawer') editCashflowRulesDrawer: MatDrawer | undefined;
  // @ViewChild('openInfoERPDrawer') openInfoERPDrawer: MatDrawer;
  // @ViewChild('editFxConversionDrawer') editFxConversionDrawer: MatDrawer;
  bacdropSourceSubscription!: Subscription;
  userProfileData: any;
  userProfile$!: Observable<any>;
  isERPConnected: any;
  erpConnectionLabel!: string;
  subscription!: Subscription;
  activeWallet!: WalletBalanceListModal;
  user: any;
  unsubscribe$ = new Subject<void>();


  constructor(
    private dialog: MatDialog,
    private _walletService: WalletsService,
    private contactsService: ContactsService,
    private headerCommService: CommonService,
    public router: Router,
    private hedgeService: HedgingDataService,
    private _connectorService: ConnectorService,
    private cd: ChangeDetectorRef,
    private commonService: CommonService,
    private _dashboardService: DashboardService) { }

  ngOnInit() {
    this.checkUserAffiliate();
    this.showLoader = true;
    // this._authService.getUserProfile();
    const user = localStorage.getItem('user');
    // this.userProfile$ = this._authService.currentUserProfile.pipe(
    //   tap(res => {
    //     this.userProfileData = res;
    //     this.cd.detectChanges();
    //   })
    // );
    // this.profileRelatedAccounts$ = this._authService.getProfileRelatedAccounts();
    
    this.commonService.getErpFlagsFromClientProfile$.pipe(takeUntil(this.unsubscribe$)).subscribe((res:any) => {
      if (res) {
        this.isERPConnected = res.isERPConnected;
        this.erpConnectionStatus();
        this.cd.detectChanges();
      }
    })

    // To reflect the changes of the balanceList
    this._walletService.availableWalletsData.pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
      this.walletList = data || [];
      const baseCurrencyWallet = this.walletList.find((wallet: any) => wallet.wallet_IsBaseCurency == true);
      // if (localStorage.getItem('activeWallet')) {
      this.selectedWallet = JSON.parse(localStorage.getItem('activeWallet')!) || baseCurrencyWallet;
      this.selectedWalletIndex = this.walletList.findIndex((wallet: any) => wallet.wallet_Id === this.selectedWallet.wallet_Id);
      this.cd.detectChanges();
    });
    this.getActiveHedgingCurrencies();

    this.loadBalanceList();

    this._walletService.balanceRefresh$.pipe(
      takeUntil(this.unSubScribe$)
    ).subscribe(() => {
      this.loadBalanceList();
    });
    // this._walletService.activeCurrentWallet.pipe(takeUntil(this.unSubScribe$)).subscribe((wallet) => {
    //   this.selectedWallet = wallet;
    // });
    // this.userRoleType = this._authService.getRoleType();

    this.contactsService.createSinglePaymentFromBeneficiary.pipe(takeUntil(this.unSubScribe$)).subscribe((res:any) => {
      if (res !== null) {
        this.createSinglePayment(res ? res : null);
      }
    })
    // this._fxDashboardService.fxNotificationDrawer$.subscribe((res:any) => {
    //   if (res) {
    //     this.manageFxNotificationDrawerOpen();
    //   } else {
    //     this.manageFxNotificationDrawerClose();
    //   }
    // });

    // this._fxDashboardService.fxEditConversionDrawer$.subscribe((res:any) => {
    //   if (res) {
    //     this.manageFxEditConversionDrawerOpen();
    //   } else {
    //     this.manageFxEditConversionDrawerClose();
    //   }
    // })
    // this._apiDashboardService.openMngApiSidebar.subscribe((res:any) => {
    //   if (res == null) {
    //     return
    //   }
    //   if (res !== null) {
    //     if (res) {
    //       this.isManageApiDrawerOpened = true;
    //       this.manageApiDrawerOpen();
    //     }else{
    //       this.isManageApiDrawerOpened = false;
    //       this.manageApiDrawerClose();
    //     } 
    //   }
    // });

    // this._riskManageService.openManageRiskSidebar.subscribe((res:any) => {
    //   if (res) {
    //     this.manageRiskDrawerOpen();
    //   } else {
    //     this.manageRiskDrawerClose();
    //   }
    // });

    this._connectorService.openEditCashflowRulesDrawer.subscribe((res:any) => {
      if (res !== null) {
        res ? this.manageEditRulesConnectorDrawerOpen() : this.manageEditRulesConnectorDrawerClose();
      }
    })

    // this._connectorService.openInfoERPDrawer.subscribe((res:any) => {
    //   if (res) {
    //     this.manageOpenERInfoDrawerOpen();
    //   } else {
    //     this.manageOpenERInfoDrawerClose();
    //   }
    // })

    // this._fxDashboardService.openInfoERPDrawer.subscribe((res) => {
    //   if (res) {
    //     this.manageOpenERInfoDrawerOpen();
    //   } else {
    //     this.manageOpenERInfoDrawerClose();
    //   }
    // })

    this.subscription = this.commonService.triggerHeaderMethod$.subscribe(() => {
      this.openAddMoney();
    });
  }

  // switchAccount(account: ProfileAccountsModel) {
  //   if (!account?.accountId) return;
  
  //   this._authService.changeSelectedAccount(account.accountId).pipe(
  //     tap({
  //       next: () => {
  //         this.profileRelatedAccounts$ = this._authService.getProfileRelatedAccounts();
  //         this.cd.detectChanges();
  //         // Wait for the user profile to be updated in localStorage
  //         setTimeout(() => {
  //           const user = localStorage.getItem('user');
  //           if (user) {
  //             this.cd.detectChanges();
  //           }
  //         }, 100); // Small delay to ensure localStorage is updated
  //       },
  //       error: () => {
  //         // Optionally handle error
  //       }
  //     })
  //   ).subscribe();
  // }

  getProfileName(name?: string) {
    let nameArr = name?.split(' ');
    let fName = nameArr && nameArr[0] ? nameArr[0].substring(0, 1).toUpperCase() : '';
    let lName = nameArr && nameArr[1] ? nameArr[1].substring(0, 1).toUpperCase() : '';
    return fName + lName;
  }

  getActiveHedgingCurrencies() {
    // as discussed with the team, we are setting the allowedHedgeCurrencies$ observable in the wallets service
    of(GetActiveHedgingCurrency)
      .pipe(takeUntil(this.unSubScribe$))
      .subscribe((res: any) => {
        const set = new Set<string>();
        if (res?.baseCurrency) {
          set.add(res.baseCurrency);
        }
        res?.supportedHedge?.forEach((h: any) => {
          if (h?.currency?.code) {
            set.add(h.currency.code);
          }
        });
        this._walletService.allowedHedgeCurrencies$.next(set);
      });
  }

  // ngAfterContentInit() {
  //   this.selectedWallet = JSON.parse(localStorage.getItem('activeWallet') || this.walletList[0]);
  //   this.cd.detectChanges();
  // }


  walletDetails() {
    // this.manageFxWalletSummaryDrawerOpen();
  }

  checkUserAffiliate() {
    const userAffiliate = JSON.parse(localStorage.getItem('user')!)['afiiliate'];
    this.isERPConnected = JSON.parse(localStorage.getItem('user')!)['isERPConnected'];
    this.affiliateCountry = userAffiliate?.country;
    this.erpConnectionStatus();
  }

  loadBalanceList() {
    this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe((res) => {
      this.walletList = res;
      this.showLoader = false;
      const baseCurrencyWallet = this.walletList.find((wallet: any) => wallet.wallet_IsBaseCurency == true);
      // if (localStorage.getItem('activeWallet')) {
      this.selectedWallet = JSON.parse(localStorage.getItem('activeWallet')!) || baseCurrencyWallet;
      this.selectedWalletIndex = this.walletList.findIndex((wallet: any) => wallet.wallet_Id === this.selectedWallet.wallet_Id);
      this.cd.detectChanges();
      // }

    });
  }
  erpConnectionStatus() {
    if (this.isERPConnected === ErpConnectionStatus.Connected) {
      this.erpConnectionLabel = ErpConnectionType.ERPConnected;
    } else if (this.isERPConnected === ErpConnectionStatus.Disconnected) {
      this.erpConnectionLabel = ErpConnectionType.ERPDisconnected;
    } else if (this.isERPConnected == ErpConnectionStatus.Connection) {
      this.erpConnectionLabel = ErpConnectionType.ERPConnection;
    } else {
      this.erpConnectionLabel = ErpConnectionType.ERPConnection;
    }
  }

  // openSendPaymentDialog() {
  //   this.dialog.open(SinglePaymentSendComponent, {
  //     width: '100vw',
  //     maxWidth: '100vw',
  //     disableClose: true,
  //   });
  // }

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
        if (data == 'convert-completed') {
          this.child?.getAllData();
        }
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
        this.child?.getAllData();
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
          benificiaryFromContacts: data,
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
          this.child?.getAllData();
        }
      });
  }

  logout() {
    // this._authService.logout();
  }

  onMakeDeposit() {
    // Trigger the header method from this component
    this.headerCommService.triggerHeaderMethod();
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    this.contactsService.createSinglePaymentFromBeneficiaryStep6(null);
  }
  openMenu() {
    this.openSidebar.emit();
  }

  get filteredWalletList() {
    if (!this.walletList) return [];

    let list = this.walletList;

    // Apply search filter
    if (this.searchTerm) {
      list = list.filter((wallet: { wallet_Currency: { code: string } }) =>
        wallet.wallet_Currency.code.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Sort to show base currency at the top
    return list.sort((a: any, b: any) => {
      if (a.wallet_IsBaseCurency === b.wallet_IsBaseCurency) return 0;
      return a.wallet_IsBaseCurency ? -1 : 1;
    });
  }


  onSelectWallet(index: number, wallet: any) {
    this.selectedWallet = wallet;
    localStorage.setItem('activeWallet', JSON.stringify(wallet));
    this._walletService.setCurrentCurrencyData(this.selectedWallet)
    this.selectedWalletIndex = index;
  }
  // manageApiDrawerOpen() {
  //   this.manageApiDrawer?.open();
  //   const bodyElem = document.querySelector('body') as HTMLElement;
  //   bodyElem.style.overflowY = 'hidden';
  //   if (!document.querySelector('.drawer-backdrop.mng-api-drawer-backdrop')) {
  //     document.querySelector('.manage-api-drawer')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop mng-api-drawer-backdrop'></div>");
  //   }
  //   const backdropElem = document.querySelector('.drawer-backdrop.mng-api-drawer-backdrop') as HTMLElement;
  //   this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(res => {
  //     this.manageApiDrawerClose();
  //   });
  // }

  // manageApiDrawerClose() {
  //   this.manageApiDrawer?.close().then(res => {
  //     const bodyElem = document.querySelector('body') as HTMLElement;
  //     bodyElem.style.overflowY = 'auto';
  //     document.querySelector('.drawer-backdrop.mng-api-drawer-backdrop')?.remove();
  //     if (this.bacdropSourceSubscription) {
  //       this.bacdropSourceSubscription.unsubscribe();
  //     }
  //   });
  // }

  // manageRiskDrawerOpen() {
  //   this.riskManagerDrawer?.open();
  //   this.showDlg = false;
  //   const bodyElem = document.querySelector('body') as HTMLElement;
  //   bodyElem.style.overflowY = 'hidden';
  //   if (!document.querySelector('.drawer-backdrop.mng-risk-drawer-backdrop')) {
  //     document.querySelector('.manage-risk-drawer')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop mng-risk-drawer-backdrop'></div>");
  //   }
  //   const backdropElem = document.querySelector('.drawer-backdrop.mng-risk-drawer-backdrop') as HTMLElement;
  //   this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(res => {
  //     this.manageRiskDrawerClose();
  //   });
  // }

  // manageRiskDrawerClose() {
  //   this.riskManagerDrawer?.close().then(() => {
  //     const bodyElem = document.querySelector('body') as HTMLElement;
  //     bodyElem.style.overflowY = 'auto';
  //     const backdropElem = document.querySelector('.drawer-backdrop.mng-risk-drawer-backdrop');
  //     if (backdropElem) {
  //       backdropElem.remove();
  //     }
  //     this.bacdropSourceSubscription.unsubscribe();
  //     this.showDlg = true;
  //   });
  // }

   ngAfterViewInit() {
    setTimeout(() => {
      this.checkHedgeAllDrawerState();
      this.checkQuickHedgeDrawerState();
    });
  }

  checkHedgeAllDrawerState() {
    this.hedgeService.hedgeAllDrawerState$
      .pipe(takeUntil(this.unSubScribe$))
      .subscribe((state) => {
        if (this.hedgeAllDrawer) {
          if (state) {
            this.hedgeAllDrawer.open();
            document.querySelector('body')!.style.overflowY = 'hidden';
            document.querySelector('.drawer-hedge-all')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop'></div>");
          } else {
            this.hedgeAllDrawer.close();
            document.querySelector('body')!.style.overflowY = 'auto';
            document.querySelector('.drawer-backdrop')?.remove();
          }
        }
      });
  }

  checkQuickHedgeDrawerState() {
    this.hedgeService.quickHedgeDrawerState$
      .pipe(takeUntil(this.unSubScribe$))
      .subscribe((state) => {
        if (this.quickHedgeDrawer) {
          if (state) {
            this.quickHedgeDrawer.open();
            document.querySelector('body')!.style.overflowY = 'hidden';
            document.querySelector('.drawer-hedge-quick')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop'></div>");
          } else {
            this.quickHedgeDrawer.close();
            document.querySelector('body')!.style.overflowY = 'auto';
            document.querySelector('.drawer-backdrop')?.remove();
          }
        }
      });
  }

  closeQuickHedgeDrawer() {
    this.hedgeService.closeQuickHedgeDrawer();
  }
  
  closeHedgeAllDrawer() {
    this.hedgeService.closeHedgeAllDrawer();
  }
  manageEditRulesConnectorDrawerOpen() {
    this.editCashflowRulesDrawer?.open();
    this.showDlg = false;
    const bodyElem = document.querySelector('body') as HTMLElement;
    bodyElem.style.overflowY = 'hidden';
    if (!document.querySelector('.drawer-backdrop.edit-rule-connector-drawer-backdrop')) {
      document.querySelector('.drawer-hedge-quick')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop edit-rule-connector-drawer-backdrop'></div>");
    }
    const backdropElem = document.querySelector('.drawer-backdrop.edit-rule-connector-drawer-backdrop') as HTMLElement;
    this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(res => {
      this.manageEditRulesConnectorDrawerClose();
    });
  }

  manageEditRulesConnectorDrawerClose() {
    this.editCashflowRulesDrawer?.close().then(() => {
      const bodyElem = document.querySelector('body') as HTMLElement;
      bodyElem.style.overflowY = 'auto';
      const backdropElem = document.querySelector('.drawer-backdrop.edit-rule-connector-drawer-backdrop');
      if (backdropElem) {
        backdropElem.remove();
      }
      this.bacdropSourceSubscription.unsubscribe();
      this.showDlg = true;
    });
  }

  // manageOpenERInfoDrawerOpen() {
  //   this.openInfoERPDrawer?.open();
  //   this.showDlg = false;
  //   const bodyElem = document.querySelector('body') as HTMLElement;
  //   bodyElem.style.overflowY = 'hidden';
  //   if (!document.querySelector('.drawer-backdrop.open-ERPInfo-drawer-backdrop')) {
  //     document.querySelector('.drawer-hedge-quick')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop open-ERPInfo-drawer-backdrop'></div>");
  //   }
  //   const backdropElem = document.querySelector('.drawer-backdrop.open-ERPInfo-drawer-backdrop') as HTMLElement;
  //   this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(res => {
  //     this.manageOpenERInfoDrawerClose();
  //   });
  // }

  // manageOpenERInfoDrawerClose() {
  //   this.openInfoERPDrawer?.close().then(() => {
  //     const bodyElem = document.querySelector('body') as HTMLElement;
  //     bodyElem.style.overflowY = 'auto';
  //     const backdropElem = document.querySelector('.drawer-backdrop.open-ERPInfo-drawer-backdrop');
  //     if (backdropElem) {
  //       backdropElem.remove();
  //     }
  //     this.bacdropSourceSubscription.unsubscribe();
  //     this.showDlg = true;
  //   });
  // }

  // manageFxNotificationDrawerOpen() {
  //   this.notificationDrawer?.open();
  //   this.showDlg = false;
  //   const bodyElem = document.querySelector('body') as HTMLElement;
  //   bodyElem.style.overflowY = 'hidden';
  //   if (!document.querySelector('.drawer-backdrop.mng-fx-notification-drawer-backdrop')) {
  //     document.querySelector('.fx-notification-drawer')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop mng-fx-notification-drawer-backdrop'></div>");
  //   }
  //   const backdropElem = document.querySelector('.drawer-backdrop.mng-fx-notification-drawer-backdrop') as HTMLElement;
  //   this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(res => {
  //     // this.manageQuickHedgeDrawerClose();
  //   });
  // }

  // manageFxNotificationDrawerClose() {
  //   this.notificationDrawer?.close().then(() => {
  //     const bodyElem = document.querySelector('body') as HTMLElement;
  //     bodyElem.style.overflowY = 'auto';
  //     const backdropElem = document.querySelector('.drawer-backdrop.mng-fx-notification-drawer-backdrop');
  //     if (backdropElem) {
  //       backdropElem.remove();
  //     }
  //     this.bacdropSourceSubscription.unsubscribe();
  //     this.showDlg = true;
  //   });
  // }

  //  manageFxEditConversionDrawerOpen() {
  //   this.editFxConversionDrawer?.open();
  //   this.showDlg = false;
  //   const bodyElem = document.querySelector('body') as HTMLElement;
  //   bodyElem.style.overflowY = 'hidden';
  //   if (!document.querySelector('.drawer-backdrop.mng-fx-conversion-drawer-backdrop')) {
  //     document.querySelector('.fx-conversion-drawer')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop mng-fx-conversion-drawer-backdrop'></div>");
  //   }
  //   const backdropElem = document.querySelector('.drawer-backdrop.mng-fx-conversion-drawer-backdrop') as HTMLElement;
  //   this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(res => {
  //     // this.manageQuickHedgeDrawerClose();
  //   });
  // }

  // manageFxEditConversionDrawerClose() {
  //   this.editFxConversionDrawer?.close().then(() => {
  //     const bodyElem = document.querySelector('body') as HTMLElement;
  //     bodyElem.style.overflowY = 'auto';
  //     const backdropElem = document.querySelector('.drawer-backdrop.mng-fx-conversion-drawer-backdrop');
  //     if (backdropElem) {
  //       backdropElem.remove();
  //     }
  //     this.bacdropSourceSubscription.unsubscribe();
  //     this.showDlg = true;
  //   });
  // }

  // manageFxWalletSummaryDrawerOpen() {
  //   this.walletDetailsDrawer?.open();
  //   this.showDlg = false;

  //   document.body.style.overflowY = 'hidden';

  //   if (!document.querySelector('.drawer-backdrop.mng-fx-wallet-drawer-backdrop')) {
  //     document.querySelector('.fx-wallet-details-drawer')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop mng-fx-wallet-drawer-backdrop'></div>");
  //   }

  //   const backdropElem = document.querySelector('.drawer-backdrop.mng-fx-wallet-drawer-backdrop') as HTMLElement;
  //   if (this.bacdropSourceSubscription) {
  //     this.bacdropSourceSubscription.unsubscribe();
  //   }

  //   this.bacdropSourceSubscription = fromEvent(backdropElem, 'click').subscribe(() => {
  //     this.manageFxWalletSummaryDrawerClose();
  //   });
  // }

  onWalletClick(event: MouseEvent, index: number, wallet: any): void {
    this.onSelectWallet(index, wallet);
  }


  // manageFxWalletSummaryDrawerClose() {
  //   this.walletDetailsDrawer?.close().then(() => {
  //     const bodyElem = document.querySelector('body') as HTMLElement;
  //     bodyElem.style.overflowY = 'auto';
  //     const backdropElem = document.querySelector('.drawer-backdrop.mng-fx-wallet-drawer-backdrop');
  //     if (backdropElem) {
  //       backdropElem.remove();
  //     }
  //     this.bacdropSourceSubscription.unsubscribe();
  //     this.showDlg = true;
  //   });
  // }
  openAddMoney() {
    this.eventDrawerOpen();
    // if (this.userProfileData?.openGlobalAccount) {
    // } else {
    //   this.dialog.open(AddMoneyComponent, {
    //     width: '100vw',
    //     maxWidth: '100vw',
    //     disableClose: true,
    //     data: {
    //       activeWallet: this.selectedWallet
    //     }
    //   }).afterClosed()
    //     .subscribe((shouldReload: any) => {
    //       this.ngOnInit()
    //     });
    // }
  }

  eventDrawerOpen() {
    this.eventDrawer?.open();
    document.querySelector('body')!.style.overflowY = 'hidden';
    document.querySelector('.add-wallet-drawer')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop'></div>");
  }

  eventDrawerClose() {
    this.eventDrawer?.close();
    document.querySelector('body')!.style.overflowY = 'auto';
    document.querySelector('.drawer-backdrop')?.remove();
    this.loadBalanceList();
    this.cd.detectChanges();
  }

  // onERPConnection() {
  //   // if (JSON.parse(localStorage.getItem('user')!)?.isERPConnected == 1) return;
  //   this.dialog.open(ErpConnectionDialogComponent, {
  //     width: '608px',
  //     maxWidth: '95vw',
  //     panelClass: 'custom-dialog-container'
  //   });
  // }

  // setAutoPilot() {
  //   this.dialog.open(SetAutoPilotDialogComponent, {
  //     height: '608px',
  //     width: '634px',
  //     panelClass: 'custom-dialog-container'
  //   });
  // }
  addWalletModal() {
    const dialogRef = this.dialog.open(AddWalletComponent, {
      width: '520px',
      height: '200',
      panelClass: 'add-wallet'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._walletService.availableWalletsData.pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
          this.walletList = data || [];
          if (this.walletList.length) {
            // this.filteredWalletList();
            this.cd.detectChanges();
          }
        });
        this.getAllBalanceData();
      }
    });
  }
  getAllBalanceData() {
    this.showLoader = true;
    this._walletService.getAllBalanceList().pipe(distinctUntilChanged(), takeUntil(this.unSubScribe$)).subscribe((res) => {
      res.sort(function (a: any, b: any) { return b.wallet_Amount - a.wallet_Amount });
      this.walletList = res;
      for (let index = 0; index < this.walletList.length; index++) {
        if (this.walletList[index].wallet_Hedging) {
          this.walletList[index].wallet_Hedging['base_flag'] = this.walletList?.find((x: any) => x.wallet_Currency.code === this.walletList[index].wallet_Hedging?.exposureBaseCurrency)?.wallet_Flag
        }
      }
      this.showLoader = false;
      if (this.router.url === (this.subSite ? this.subSite + 'dashboard' : '/dashboard')) {
        // Commented the below code to reflect the correct wallet selection logic

        // let index = this.walletList.findIndex((x: any) => x.wallet_SupportBaseHedging == true && x.wallet_Hedging != null)
        // let j = this.walletList.findIndex((x: any) => x.wallet_SupportBaseHedging == true)
        // if (index != -1) {
        //   this.selectedWallet = this.walletList[index];
        //   this.activeWallet = this.walletList[index];
        // } else if (j != -1) {
        //   this.selectedWallet = this.walletList[j];
        //   this.activeWallet = this.walletList[j];
        // }
      }
      else {
        let activeWalletData = localStorage.getItem('activeWallet');
        if (activeWalletData !== null) {
          this.selectedWallet = JSON.parse(activeWalletData) as WalletBalanceListModal;
        } else {
          this.selectedWallet = this.walletList[0]
          this.activeWallet = this.walletList[0];
        }
      }
      this._walletService.setCurrentCurrencyData(this.selectedWallet)
    }, err => {
      this.showLoader = false;
    });
    this._walletService.setCurrentCurrencyData(this.selectedWallet);
  }
  GetProfileSymbol() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if(this.user){
      let profileName = this.user.fullName.split(' ');
      let fName =
        profileName && profileName[0]
          ? profileName[0].substring(0, 1).toUpperCase()
          : '';
      let lName =
        profileName && profileName[1]
          ? profileName[1].substring(0, 1).toUpperCase()
          : '';
      return fName + lName;
    }
  }
}
