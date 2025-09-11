import { ChangeDetectorRef, Component, Input, Renderer2, RendererFactory2 } from '@angular/core';
import { tradingSource } from '../../enums/riskProfitLoss.enum';
import { WalletsService } from '../../services/wallets.service';
import { Direction } from '../../../shared/constants/alertWallet.enum';
import { CommonModule } from '@angular/common';
import { AlertExchangeRateFormComponent } from '../alert-exchange-rate-form/alert-exchange-rate-form.component';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-lock-payment-add-alert',
  templateUrl: './lock-payment-add-alert.component.html',
  styleUrls: ['./lock-payment-add-alert.component.scss'], 
  imports: [CommonModule, AlertExchangeRateFormComponent]
})
export class LockPaymentAddAlertComponent {
  activeCurrency: any;
  private _renderer2: Renderer2;
  visible = true;
  currencyOfUser: any;
  lastPaymentRateData: any;
  Directions: any
  tradingSource :any
  walletList:any;
  baseCurrencyListFilter:any;
  @Input() drawer!: MatDrawer;
  constructor(
    rendererFactory: RendererFactory2,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
  ) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {
    this.currencyOfUser = 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png';
    this.Directions = Direction;
    this.tradingSource = tradingSource
    this._walletService.AlertExposure.subscribe((res: any) => {
      if (res?.show) {
        this.visible = false
      } else {
        this.visible = true;
        let currencyPair = this.activeCurrency?.wallet_Currency?.code + "ILS"
        this.cd?.detectChanges();
        document.getElementById("marketChart2")!.outerHTML = "<div id=\"marketChart2\"></div>"
        this.loadScripts(currencyPair);
      }
      this.cd?.detectChanges();
    })
    this._walletService.activeCurrentWallet?.subscribe((wallet) => {
      this.activeCurrency = wallet;
      let currencyPair = this.activeCurrency?.wallet_Currency?.code + "ILS"
      document.getElementById("marketChart2")!.outerHTML = "<div id=\"marketChart2\"></div>"
      this.loadScripts(currencyPair);
    })
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletList = data;
      this.baseCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency?.toLowerCase()));
      this.currencyOfUser = this.baseCurrencyListFilter[0]?.wallet_Currency?.flag
      this.cd?.detectChanges()
    })
  }

  private loadScripts(currencyPair: any) {
    const script2 = this._renderer2.createElement("script");
    script2.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script2.type = "text/javascript";
    script2.async = true;
    script2.text = `
    {
      "symbols": [
        [
          "${this.tradingSource[currencyPair]}|1M"
        ]
      ],
      "chartOnly": true,
      "locale": "en",
      "colorTheme": "light",
      "autosize": false,
      "showVolume": false,
      "showMA": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "fontSize": "10",
      "noTimeScale": false,
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "chartType": "area",
      "maLineColor": "#2962FF",
      "maLineWidth": 1,
      "maLength": 9,
      "lineWidth": 1,
      "lineType": 0,
      "dateRanges": [
        "1m|30"
      ],
      "lineColor": "rgba(49, 121, 245, 1)",
      "topColor": "rgba(144, 191, 249, 1)",
      "bottomColor": "rgba(187, 217, 251, 0)"
    }`;
    let marChartContainer1 = document.getElementById("marketChart2")
    this._renderer2?.appendChild(marChartContainer1, script2)
  }
}
