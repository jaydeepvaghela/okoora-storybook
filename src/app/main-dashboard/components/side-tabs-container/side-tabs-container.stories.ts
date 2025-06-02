import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { SideTabsContainerComponent } from './side-tabs-container.component';

import { MatTabsModule } from '@angular/material/tabs';
import { FutureOverviewLockChartComponent } from '../future-overview-lock-chart/future-overview-lock-chart.component';
import { FutureOverviewHedgeChartComponent } from '../future-overview-hedge-chart/future-overview-hedge-chart.component';
import { ConvertNowComponent } from '../convert-now/convert-now.component';

import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

// Mock WalletsService
class MockWalletsService {
  activeCurrentWallet = of({
    wallet_Hedging: {
      direction: 1 // Mocking "Lock & Down"
    }
  });
}

// Mock DashboardService
class MockDashboardService {
  setDashboardSideTabesType(index: number) {
    console.log('Dashboard tab index set to:', index);
  }
}

export default {
  title: 'Main dashboard/Side Tabs',
  component: SideTabsContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatTabsModule,
        FutureOverviewLockChartComponent,
        FutureOverviewHedgeChartComponent,
        ConvertNowComponent,
      ],
      providers: [
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }),
  ],
} as Meta<SideTabsContainerComponent>;

type Story = StoryObj<SideTabsContainerComponent>;

export const Default: Story = {
  args: {
    selectedIndex: 0,
  },
};

export const LockAndDownTab: Story = {
  name: 'Lock & Down Tab',
  args: {
    selectedIndex: 0,
    getLockHedgeGrafhData: {
      timesPoints: [
        "Today",
        "1M",
        "3M",
        "6M",
        "9M",
        "1Y"
      ],
      spotPoints: [
        2.5912,
        2.5941,
        2.5981,
        2.6054,
        2.6118,
        2.6168
      ],
      getCurrentExplosureRate: { "CAD": 1.0, "ILS": 2.5966 }
    }
  },
};

export const ExchangeNowTab: Story = {
  name: 'Exchange Now Tab',
  args: {
    selectedIndex: 1,
  },
};

export const HedgeTab: Story = {
  name: 'Hedge Tab',
  args: {
    selectedIndex: 2,
  },
};
