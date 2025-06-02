import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MarketOverviewChartComponent } from '../market-overview-chart/market-overview-chart.component';
import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';

@Component({
  selector: 'app-trade-view-wrapper',
  imports: [MatCardModule, MarketOverviewChartComponent, HtmlTooltipDirective],
  templateUrl: './trade-view-wrapper.component.html',
  styleUrl: './trade-view-wrapper.component.scss'
})
export class TradeViewWrapperComponent {
  @Input() lastPaymentRateData: any;
  @Input() currencyOfUser: any;
  activeCurrency: any;
}
