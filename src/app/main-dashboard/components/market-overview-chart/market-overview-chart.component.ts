import { Component, Input, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit, Renderer2, RendererFactory2, Inject, ChangeDetectorRef, ElementRef } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DOCUMENT } from '@angular/common';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
  grid: ApexGrid
  plotOptions: ApexPlotOptions,
  legend: ApexLegend
};
import { Direction, tradingSource } from '../../enums/riskProfitLoss.enum';
import { WalletsService } from '../../services/wallets.service';
import { data, data1 } from '../../dashboard-data/market-overview-chartSeries';
declare const TradingView: any;
@Component({
  selector: 'app-market-overview-chart',
  imports: [CommonModule],
  templateUrl: './market-overview-chart.component.html',
  styleUrls: ['./market-overview-chart.component.scss']
})
export class MarketOverviewChartComponent implements AfterViewInit {
  @Input('lastPaymentRateData') lastPaymentRateData: any;
  @ViewChild('marketChart', { static: false }) marketChartElement: ElementRef | null = null;

  private _renderer2: Renderer2;
  tradingSource: any
  public chartOptions!: Partial<ChartOptions>;
  public activeOptionButton = "all";
  updateOptionsData: any;
  @Input() activeCurrency!: any;
  currencyOfUser!: any;
  currentExchangeRate: any;
  Directions: any
  walletList: any;
  baseCurrencyListFilter: any;
  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    rendererFactory: RendererFactory2,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,

  ) {
    this._renderer2 = rendererFactory.createRenderer(null, null);

  }

  ngOnInit() {
    this.Directions = Direction;
    this.tradingSource = tradingSource;

    this._walletService.activeCurrentWallet.subscribe((wallet) => {

      this.activeCurrency = wallet;
      let currencyPair = this.activeCurrency?.wallet_Currency?.code + this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency || "USDILS";
      document.getElementById("marketChart")!.outerHTML = "<div id=\"marketChart\"></div>"
      this.loadScripts(currencyPair);
      this.cd.detectChanges();

    })
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletList = data;
      this.baseCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency?.toLowerCase()));
      // console.log("baseCurrencyListFilter", this.baseCurrencyListFilter);
      this.currencyOfUser = this.baseCurrencyListFilter[0]?.wallet_Currency?.flag
      this.cd?.detectChanges()
    })


    this.initChart();


  }

  // ngAfterViewInit() {
  //   // this.loadScripts();
  //   this.myContainer.createEmbeddedView(this.myTemplate);
  // }
  private loadScripts(currencyPair: any) {
    const script = this._renderer2.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.text = `
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
    let marChartContainer = document.getElementById("marketChart")
    this._renderer2?.appendChild(marChartContainer, script)
    this.cd?.detectChanges();

  }


  initChart(): void {
    this.chartOptions = {
      series: [
        {
          data: data
        },
        {
          data: data1
        }
      ],
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: false
        }
      },
      annotations: {
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime",
        min: new Date("01 Mar 2012").getTime(),
        tickAmount: 6,

      },
      yaxis: {
        opposite: true,
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        }
      },
      stroke: {
        curve: "smooth",
        colors: ['rgb(8,153,129)', 'rgb(178,181,190)'],
        width: 2,
      },

      plotOptions: {
        heatmap: {
          colorScale: {

          }
        }
      },

      colors: ['#EFF8F7', '#FAFAFB'],
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },

      fill: {

        type: "gradient",

        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    };
  }


  ngAfterViewInit() {
    // Ensure that the DOM element is available after the view is initialized
    if (this.marketChartElement) {
      this.marketChartElement.nativeElement.outerHTML = "<div id=\"marketChart\"></div>";
    }
  }



}
