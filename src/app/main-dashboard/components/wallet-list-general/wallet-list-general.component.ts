import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { AuthenticationService } from '../auth/services/authentication.service';
// import { WalletBalanceListModal } from '../common/models/WalletBalanceListModal';
// import { AddWalletComponent } from '../wallets/components/add-wallet/add-wallet.component';
// import { WalletsService } from '../wallets/services/wallets.service';
import { Router } from '@angular/router';
// import { WalletListDialogComponent } from '../shared/wallet-list-dialog/wallet-list-dialog.component';
// import { AddMoneyComponent } from '../wallets/components/add-money/add-money.component';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import moment from 'moment';
import { Subject, debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs';
import { WalletBalanceListModal } from '../../models/WalletBalanceListModal';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WalletsService } from '../../services/wallets.service';
import { AddWalletComponent } from '../add-wallet/add-wallet.component';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-wallet-list-general',
  templateUrl: './wallet-list-general.component.html',
  styleUrls: ['./wallet-list-general.component.scss'],
  imports: [CommonModule, MatListModule, NgbTooltipModule]
})
export class WalletListGeneralComponent implements OnInit {
  @Input('isReadOnly') isReadOnly?: boolean;
  @Input('isDashboardBody') isDashboardBody = false;
  @ViewChild('swiperContainer', { read: ElementRef }) swiperContainer!: ElementRef;
  walletList: any = [];
  activeWallet!: WalletBalanceListModal;
  selectedWallet!: WalletBalanceListModal;
  roles: any = '2';
  @Output() selectedWalletData = new EventEmitter<WalletBalanceListModal>();
  @Output() onViewDetailClick = new EventEmitter<any>();
  showLoader = false;
  mySwiper!: Swiper;
  isFirstSlide!: boolean;
  isLastSlide!: boolean;
  screenWidth: number;
  activeCurrencyListFilter: any;
  unSubScribe$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    // private auth: AuthenticationService,
    private dashboardService: DashboardService,
    public router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.screenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    // console(this.screenWidth)
  }

  ngOnInit() {
    // localStorage.removeItem('selectedForRefresh');
    // localStorage.removeItem('activeWalletForRefresh');
    // this.roles = this.auth.getRoleOfUser();
    // this._walletService.getAllBalanceList().pipe(
    //   tap(result => {
    //     this.activeWallet = result[0];
    //   })
    // ).subscribe();

    this.getAllBalanceData();
    this._walletService.activeCurrentWallet.pipe(takeUntil(this.unSubScribe$)).subscribe(res => {
      // console({ res })
      // console(this.walletList)
      this.activeCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(res?.wallet_Currency?.code?.toLowerCase()));

      this.selectedWallet = this.activeCurrencyListFilter[0];
      // this._walletService.setwalletwalletDataForLock( this.selectedWallet)
      this.cdr?.detectChanges()
    });
    this._walletService.availableWalletsData.pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
      if (data.length > 0) {
        this.walletList = data;
        if (this.walletList.length) {
          this.loadWalletListSlider();
        }
        for (let index = 0; index < this.walletList.length; index++) {
          if (this.walletList[index].wallet_Hedging) {
            this.walletList[index].wallet_Hedging['base_flag'] = this.walletList?.find((x: any) => x.wallet_Currency.code === this.walletList[index].wallet_Hedging?.exposureBaseCurrency)?.wallet_Flag
          }
        }
        let selectedWalletI: any = localStorage.getItem('selectedForRefresh')
        let activeWalletI: any = localStorage.getItem('activeWalletForRefresh')
        if (selectedWalletI != undefined && activeWalletI != undefined && this.router.url != '/main-dashboard') {
          this.selectedWallet = this.walletList[selectedWalletI]
          this.activeWallet = this.walletList[activeWalletI];
        }
        else {
          if (this.router.url === '/main-dashboard') {
            let index = this.walletList.findIndex((x: any) => x.wallet_SupportBaseHedging == true && x.wallet_Hedging != null)
            let j = this.walletList.findIndex((x: any) => x.wallet_SupportBaseHedging == true)
            if (index != -1) {
              this.selectedWallet = this.walletList[index];
              this.activeWallet = this.walletList[index];
            } else if (j != -1) {
              this.selectedWallet = this.walletList[j];
              this.activeWallet = this.walletList[j];
            }
          } else {
            let activeWalletData = localStorage.getItem('activeWallet');
            if (activeWalletData !== null) {
              this.selectedWallet = JSON.parse(activeWalletData) as WalletBalanceListModal;
            } else {
              this.selectedWallet = this.walletList[0]
              this.activeWallet = this.walletList[0];
            }
          }
        }
        if (this.roles == '1' && this.router.url !== '/payments' && this.router.url !== '/main-dashboard') {
          if (this.selectedWallet?.wallet_Currency?.code) {
            let params = {
              activeWallet: this.selectedWallet?.wallet_Currency?.code,
              fromDate: moment().subtract(6, 'months').format('DD/MM/YYYY'),
              toDate: moment().format('DD/MM/YYYY')
            }
            // this._walletService.getWalletTransactionsWithFilter(params).subscribe();
          }
        }
      }
      this._walletService.alertListRefresh$
      .pipe(takeUntil(this.unSubScribe$), take(1))
      .subscribe((res) => {
        if (res === false) {
          this._walletService?.setCurrentCurrencyData(this.selectedWallet);
        }
      });

    });
    // this.transactionDebounceSubject
    // .pipe(debounceTime(300), takeUntil(this.unSubScribe$))
    // .subscribe(params => {
    //   this._walletService.getWalletTransactionsWithFilter(params).subscribe(() => {
    //     this.zone.run(() => {
    //       setTimeout(() => {
    //         this.cdr.detectChanges(); // Trigger change detection properly
    //       });
    //     });
    //   });
    // });
  }

  loadWalletListSlider() {
    this.dashboardService.getSlidePosition().pipe(takeUntil(this.unSubScribe$)).subscribe((position: number) => {
      this.isFirstSlide = position === 0;
      this.isLastSlide = position === this.walletList.length - 1;
    });
    this.mySwiper = new Swiper('.wallet-list-swiper-container', {
      allowSlideNext: true,
      allowSlidePrev: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        480: {
          slidesPerView: 'auto'
        },
        540: {
          slidesPerView: 3.10
        },
        768: {
          slidesPerView: 3.45
        },
        820: {
          slidesPerView: 3.70
        },
        912: {
          slidesPerView: 4.20
        },
        1024: {
          slidesPerView: 4.80
        },
        1280: {
          slidesPerView: 6.20
        },
        1366: {
          slidesPerView: 6.45
        },
        1600: {
          slidesPerView: 5.55
        },
        1920: {
          slidesPerView: 6.90
        }
      }
    });
  }


  goToPreviousSlide() {
    this.mySwiper.slidePrev();
    this.updateButtonVisibility();
  }

  goToNextSlide() {
    this.mySwiper.slideNext();
    this.updateButtonVisibility();
  }

  updateButtonVisibility() {
    this.isFirstSlide = this.mySwiper.isBeginning;
    this.isLastSlide = this.mySwiper.isEnd;
  }

  getModifiedWalletList(walletList: any[]): any[] {
    const baseCurrencyWallet = this.walletList.find((wallet: any) => wallet.wallet_IsBaseCurency);
    const otherWallets = this.walletList.filter((wallet: any) => !wallet.wallet_IsBaseCurency);
    return baseCurrencyWallet ? [baseCurrencyWallet].concat(otherWallets) : otherWallets;
  }

  getAllBalanceData() {
    this.showLoader = true;
    this._walletService.getAllBalanceList().pipe(distinctUntilChanged(), takeUntil(this.unSubScribe$)).subscribe((res:any) => {
      res.sort(function (a: any, b: any) { return b.wallet_Amount - a.wallet_Amount });
      this.walletList = res;
      for (let index = 0; index < this.walletList.length; index++) {
        if (this.walletList[index].wallet_Hedging) {
          this.walletList[index].wallet_Hedging['base_flag'] = this.walletList?.find((x: any) => x.wallet_Currency.code === this.walletList[index].wallet_Hedging?.exposureBaseCurrency)?.wallet_Flag
        }
      }
      this.showLoader = false;
      if (this.router.url === '/main-dashboard') {
        let index = this.walletList.findIndex((x: any) => x.wallet_SupportBaseHedging == true && x.wallet_Hedging != null)
        let j = this.walletList.findIndex((x: any) => x.wallet_SupportBaseHedging == true)
        if (index != -1) {
          this.selectedWallet = this.walletList[index];
          this.activeWallet = this.walletList[index];
        } else if (j != -1) {
          this.selectedWallet = this.walletList[j];
          this.activeWallet = this.walletList[j];
        }
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
      if (this.mySwiper) {
        // this.mySwiper?.update();
        this.loadWalletListSlider();
      }
      if (this.roles == '1' && this.router.url !== '/payments' && this.router.url !== '/main-dashboard') {
        let params = {
          activeWallet: this.selectedWallet?.wallet_Currency?.code,
          fromDate: moment().subtract(6, 'months').format('DD/MM/YYYY'),
          toDate: moment().format('DD/MM/YYYY')
        }
        // this._walletService.getWalletTransactionsWithFilter(params).subscribe();
      }
    }, () => {
      this.showLoader = false;
    });

    this._walletService.setCurrentCurrencyData(this.selectedWallet);

  }

  changeWalletForDashboard() {
    this._walletService.setwalletwalletDataForLock(this.selectedWallet)
  }
  walletSelectionChange(wallet: WalletBalanceListModal, i: any) {
    this.activeWallet = wallet;
    this._walletService.setActiveWallet(wallet);
  

    localStorage.setItem("activeWallet", JSON.stringify(this.selectedWallet));
    localStorage.setItem("activeWalletForRefresh", i);
    localStorage.setItem("selectedForRefresh", i);
    // this._walletService.setCurrentCurrencyData(this.activeWallet)
  }

  selectedWalllet(wallet: WalletBalanceListModal, i: any) {
    this.selectedWallet = wallet;
    localStorage.setItem("selectedForRefresh", i);
    this.selectedWalletData.emit(this.selectedWallet);
    // this._walletService.setCurrentCurrencyData(this.selectedWallet);
  }

  // addWalletModal() {
  //   const dialogRef = this.dialog.open(AddWalletComponent, {
  //     width: '520px',
  //     height: '200',
  //     panelClass: 'add-wallet'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getAllBalanceData();
  //     }
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
        // this._walletService.availableWalletsData.pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
        //   this.walletList = data || [];

        //   if (this.walletList.length) {
        //     this.cdr.detectChanges();

        //     setTimeout(() => {
        //       if (this.mySwiper && this.mySwiper.slides && this.mySwiper.slides.length) {
        //         this.mySwiper.update();
        //         this.loadWalletListSlider();
        //       }
        //     }, 300);
        //   }
        // });
        this.getAllBalanceData();
      }

    });
  }


  openWalletListDialog() {
    // const dialogRef = this.dialog.open(WalletListDialogComponent, {
    //   width: '562px',
    //   height: '544px',
    //   panelClass: 'wallet-list-dialog',
    //   disableClose: true,
    //   data: {
    //     walletList: this.walletList,
    //     selectedWallet: this.selectedWallet?.wallet_Currency?.code
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.selectedWalllet(result.wallet, result.index);
    //     this.walletSelectionChange(result.wallet, result.index);
    //     // this._walletService?.setwalletwalletData(result.wallet)
    //   }
    // });
    // dialogRef.componentInstance.onAddWalletClose.subscribe(result => {
    //   if (result) {
    //     this.getAllBalanceData();
    //   }
    // })
  }

  openAddMoney() {
    // this.onViewDetailClick.emit();
    // this.dialog.open(AddMoneyComponent, {
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   disableClose: true,
    //   data: {
    //     activeWallet: this.selectedWallet
    //   }
    // }).afterClosed()
    //   .subscribe((shouldReload: any) => {
    //     this.ngOnInit()
    //   });
  }
  ngOnDestroy() {
    localStorage.removeItem('activeWalletForRefresh');
    localStorage.removeItem('selectedForRefresh');
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
  }
}
