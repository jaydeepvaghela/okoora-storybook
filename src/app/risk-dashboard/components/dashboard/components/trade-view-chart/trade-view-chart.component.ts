import { ChangeDetectorRef, Component, Input, Renderer2, RendererFactory2 } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-trade-view-chart',
  imports: [MatSelectModule],
  templateUrl: './trade-view-chart.component.html',
  styleUrl: './trade-view-chart.component.scss'
})
export class TradeViewChartComponent {
  private _renderer2: Renderer2;
  tradingSource: any = {
    USDILS: "SAXO:USDILS",
  };
  @Input() tradeRate: any = 3.4324;
  @Input() firstCurrency: string = "USD";
  @Input() baseCurrency: string = "ILS";
  currencyPair: string = this.firstCurrency + this.baseCurrency;
  @Input() selectedPeriod: string = '1M';
  tradeViewChartRate: any;
  cashFlowExposureData: any;

  constructor(private cd: ChangeDetectorRef, rendererFactory: RendererFactory2) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    this.getExposureDetails();
  }

  getExposureDetails() {
    this.tradingSource = this.tradingSource;
    this.loadTradingViewScripts(this.currencyPair, this.selectedPeriod);
  }


  onPeriodChange(period: string) {
    this.selectedPeriod = period;
    this.loadTradingViewScripts(this.currencyPair, period);
  }

  loadTradingViewScripts(currencyPair: string, period: string) {
    const existingScript = document.getElementById("tradingViewScript");
    if (existingScript) {
      existingScript.remove();
    }

    const script = this._renderer2.createElement("script");
    script.id = "tradingViewScript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.text = `
        {
          "symbols": [
            [
              "${this.tradingSource[currencyPair]}|${period}"
            ]
          ],
          "chartOnly": true,
          "locale": "en",
          "colorTheme": "light",
          "autosize": true,
          "showVolume": false,
          "hideMA": true,
          "hideDateRanges": true,
          "hideMarketStatus": true,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "maLineColor": "#089981",
          "maLineWidth": 1,
          "maLength": 9,
          "lineWidth": 1,
          "lineType": 0,
          "lineColor": "#089981",
          "topColor": "rgba(8,153,129, 0)",
          "bottomColor": "rgba(8,153,129, 0)",
          "isTransparent": true
        }`;

    const chartContainer = document.getElementById("tradeViewChart");
    this._renderer2.appendChild(chartContainer, script);
    this.cd.detectChanges();
  }
}
