import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { BuySell } from '../../enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';
@Component({
  selector: 'app-convert-now',
  imports: [CommonModule, FormsModule, HtmlTooltipDirective],
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
    });
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletList = data;
      this.baseCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency?.toLowerCase()));
      this.currencyOfUser = this.baseCurrencyListFilter[0]?.wallet_Currency?.flag

    })

  }

  ngDoCheck() {
  }

  openConvertComponent() {
    
  }

  changeType(event: any) {
    this.showLoader = true

    this.buySellCurrency = this.selectedType === 'buy' ? 'Buy' : 'Sell';
  }
}
