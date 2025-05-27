import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { BuySell } from '../../enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { CommonService } from 'src/app/common/services/common.service';
// import { ExchangeMainComponent } from 'src/app/exchange/components/exchange-main/exchange-main.component';
// import { ConvertComponent } from 'src/app/wallets/components/convert/convert.component';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
@Component({
  selector: 'app-convert-now',
  imports: [CommonModule, FormsModule],
  templateUrl: './convert-now.component.html',
  styleUrls: ['./convert-now.component.scss']
})
export class ConvertNowComponent {
  activeCurrency: any;
  currencyOfUser: any;
  selectedType: any;
  buySellCurrency: string = 'Buy';
  currentCurrencyValue= {"AUD":1.0,"ILS":2.3128};
  userRoleType!: number;
  walletList: any;
  baseCurrencyListFilter: any;
  showLoader!: boolean;

  constructor(
    private _walletService: WalletsService,
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.showLoader = true
    this.activeCurrency = JSON.parse(localStorage.getItem('activeWallet') || '');
    this.currencyOfUser = 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png';

    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      this.activeCurrency = wallet;
      
      this.selectedType = BuySell[this.activeCurrency?.wallet_Hedging?.buy_Sell]
      this.buySellCurrency = this.selectedType === 'buy' ? 'Buy' : 'Sell';
      let buyValue = this.selectedType === 'buy' ? this.activeCurrency?.wallet_Currency?.code : this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency
      let sellValue = this.selectedType === 'buy' ? this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency : this.activeCurrency?.wallet_Currency?.code
    
      // this._commonService.getCurrentRate(buyValue, sellValue).subscribe((data: any) => {
      //   this.showLoader = false
      //   this.currentCurrencyValue = data;
      //   this.cd.detectChanges()
      // })

    });
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletList = data;
      this.baseCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency?.toLowerCase()));
      // console.log("baseCurrencyListFilter", this.baseCurrencyListFilter);
      this.currencyOfUser = this.baseCurrencyListFilter[0]?.wallet_Currency?.flag

    })

    // this.userRoleType = this._authService.getRoleType();
  }

  ngDoCheck() {
    // this.userRoleType = this._authService.getRoleType();
  }

  openConvertComponent() {
    let activeWallet: any = JSON.parse(localStorage.getItem("activeWallet") || '');

    // this.dialog
    //   .open(ExchangeMainComponent, {
    //     width: '100vw',
    //     maxWidth: '100vw',
    //     data: {
    //       selectedwalletInfo: activeWallet,
    //       fromDashboadConvert: true,
    //       selectedType: this.selectedType
    //     },
    //     disableClose: true,
    //   })
    //   .afterClosed()
    //   .subscribe((shouldReload: any) => {
    //   });
    // this.dialog.open(ConvertComponent, {
    //   width: '95vw',
    //   height: '95vh',
    //   maxWidth: '95vw',
    //   maxHeight: '95vh',
    //   panelClass: 'convert-dialog',
    //   data: {
    //     selectedwalletInfo: activeWallet,
    //     fromFutureOverview: true,
    //     selectedType: this.selectedType
    //   },
    //   disableClose: true,
    // }).afterClosed()
    //   .subscribe((shouldReload: any) => {
    //   });
  }

  changeType(event: any) {
    this.showLoader = true

    this.buySellCurrency = this.selectedType === 'buy' ? 'Buy' : 'Sell';

    // console.log("exposureBaseCurrency", this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency);
    // console.log("exposureBaseCurrency", this.activeCurrency?.wallet_Currency?.code);


    let buyValue = this.selectedType === 'buy' ? this.activeCurrency?.wallet_Currency?.code : this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency
    let sellValue = this.selectedType === 'buy' ? this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency : this.activeCurrency?.wallet_Currency?.code


    // this._commonService.getCurrentRate(buyValue, sellValue).subscribe((data: any) => {
    //   this.showLoader = false
    //   this.currentCurrencyValue = data;
    //   this.cd.detectChanges()
    // })


    // const dialogRef = this.dialog.open(ConvertComponent, {
    //   width: '95vw',
    //   height: '95vh',
    //   maxWidth: '95vw',
    //   maxHeight: '95vh',
    //   panelClass: 'convert-dialog',
    //   data: {
    //     selectedwalletInfo: activeWallet,
    //     fromFutureOverview: true,
    //     selectedType: this.selectedType
    //   },
    //   disableClose: true,
    // }).afterClosed()
    //   .subscribe((shouldReload: any) => {
    //   });
  }
}
