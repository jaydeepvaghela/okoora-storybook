import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MarketRiskBoxComponent } from './market-risk-box.component';
import { MarketRiskChartComponent } from '../market-risk-chart/market-risk-chart.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Main Dashboard/Second Row Cards/4. Market Risk Box',
  component: MarketRiskBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MarketRiskChartComponent],
    }),
  ],
  args: {
    dashboardpanelData: {
      marketRisk: {
        riskScore: 7,
        history: [5, 6, 7, 6, 7],
      },
    },
    defaultRisk: 7,
  },
  argTypes: {
    defaultRisk: {
      control: {
        type: 'number',
        min: 1,
        max: 7,
      },
      description: 'Select risk score (1 to 7)',
    },
  },
} as Meta<MarketRiskBoxComponent>;

type Story = StoryObj<MarketRiskBoxComponent>;

export const Default: Story = {
  args: {
    dashboardpanelData: {
      marketRisk: {
        riskScore: 7,
        history: [5, 6, 7, 6, 7],
      },
    },
    defaultRisk: 7,
  },
};
