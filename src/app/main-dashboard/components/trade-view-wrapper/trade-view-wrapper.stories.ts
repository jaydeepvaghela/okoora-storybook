import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TradeViewWrapperComponent } from './trade-view-wrapper.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MarketOverviewChartComponent } from '../market-overview-chart/market-overview-chart.component';
import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';

export default {
  title: 'Main Dashboard/Trade View Wrapper',
  component: TradeViewWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatCardModule,
        MarketOverviewChartComponent,
        HtmlTooltipDirective,
      ],
    }),
  ],
} as Meta<TradeViewWrapperComponent>;

type Story = StoryObj<TradeViewWrapperComponent>;

const mockLastPaymentRateData = {
  previousPaymentRate: 2.299963,
  currentPaymentRate: 2.372,
  percentages: 3.13,
  direction: 1,
  buySell: 1,
};

const mockActiveCurrency = {
  wallet_Flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png',
  wallet_Currency: {
    code: 'USD',
  },
  wallet_Hedging: {
    exposureBaseCurrency: 'ILS',
  },
};

export const Default: Story = {
  args: {
    lastPaymentRateData: mockLastPaymentRateData,
    currencyOfUser: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png',
    activeCurrency: mockActiveCurrency,
  },
};
