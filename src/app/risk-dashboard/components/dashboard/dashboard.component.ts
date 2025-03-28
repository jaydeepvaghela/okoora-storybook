import { Component } from '@angular/core';
import { AnnualExposureDetailsComponent } from "./components/annual-exposure-details/annual-exposure-details.component";
import { BreadcrumbWalletComponent } from './components/breadcrumb-wallet/breadcrumb-wallet.component';
import { ChartsTabsComponent } from "./components/charts-tabs/charts-tabs.component";
import { RiskEstimateChartComponent } from "./components/risk-estimate-chart/risk-estimate-chart.component";
import { TradeViewChartComponent } from "./components/trade-view-chart/trade-view-chart.component";
import { VolatilityChartComponent } from "./components/volatility-chart/volatility-chart.component";
import { MomentumIndicatorChartComponent } from "./components/momentum-indicator-chart/momentum-indicator-chart.component";

@Component({
  selector: 'app-dashboard',
  imports: [AnnualExposureDetailsComponent, BreadcrumbWalletComponent, ChartsTabsComponent, RiskEstimateChartComponent, TradeViewChartComponent, VolatilityChartComponent, MomentumIndicatorChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}