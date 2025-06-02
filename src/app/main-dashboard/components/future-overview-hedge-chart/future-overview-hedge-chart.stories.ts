import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FutureOverviewHedgeChartComponent } from './future-overview-hedge-chart.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';

import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';
import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

// Mock data for active wallet and other dependencies
const mockActiveCurrency = {
  wallet_Currency: {
    sign: '$',
    code: 'USD',
  },
  wallet_Hedging: {
    direction: 1, // Assuming 1 = Up, 2 = Down (match your Direction enum)
    buy_Sell: 0,
    pair: 'USDEUR',
    exposureAmount: 50000,
  },
};

const walletsServiceMock = {
  activeCurrentWallet: of(mockActiveCurrency),
};

const dashboardServiceMock = {
  // Add any mock methods if needed for DashboardService
};

export default {
  title: 'Main Dashboard/Third Row Sections/Future Overview Hedge Chart (Side Tab-3)',
  component: FutureOverviewHedgeChartComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatSelectModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatNativeDateModule,
        HtmlTooltipDirective
      ],
      providers: [
        CurrencyPipe,
        { provide: WalletsService, useValue: walletsServiceMock },
        { provide: DashboardService, useValue: dashboardServiceMock },
      ],
    }),
  ],
  args: {},
} as Meta<FutureOverviewHedgeChartComponent>;

type Story = StoryObj<FutureOverviewHedgeChartComponent>;

export const Default: Story = {};
