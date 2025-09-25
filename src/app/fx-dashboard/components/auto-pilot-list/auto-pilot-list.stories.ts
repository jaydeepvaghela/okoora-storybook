// Storybook usage note:
// The correct story ID for this file is 'fx-dashboard-autopilotlist--exposures'.
// If you see an error about 'exposured', update your Storybook URL or navigation to use 'exposures'.
import { Meta, StoryObj } from '@storybook/angular';
import { AutoPilotListComponent } from './auto-pilot-list.component';
import { moduleMetadata } from '@storybook/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Listing',
  component: AutoPilotListComponent,
  decorators: [
    moduleMetadata({
      imports: [MatTabsModule, MatSlideToggleModule, CommonModule, MatTooltipModule],
    }),
  ],
} as Meta<AutoPilotListComponent>;

const automationTableData = [
  {
    ruleType: 'Invoice',
    invoiceBillCurrencies: ['USD', 'EUR', 'ILS'],
    invoiceBillMinExposureAmount: 1000,
    invoiceBillMaxExposureAmount: 5000,
    invoiceBillMaxDuePeriod: '30 days',
    invoiceBillBlacklist: ['Vendor A', 'Vendor B', 'Vendor C'],
    directionType: 1,
  },
  {
    ruleType: 'Cashflow',
    cashflowCurrencies: ['USD', 'EUR'],
    cashflowMinExposureAmount: 2000,
    cashflowMaxExposureAmount: 8000,
    cashflowMaxDuePeriod: '60 days',
    directionType: 2,
  },
];

const conversionData = [
  {
    id: 1,
    ruleName: 'Convert USD to EUR',
    status: 1,
    startDate: new Date(),
    buyCurrency: 'USD',
    sellCurrency: 'EUR',
    operator: 1,
    targetRate: 3.5,
    buyAmount: 1000,
    sellAmount: 900,
    executionFrequency: 'Monthly',
  },
];


export const ExposuresTab: StoryObj<AutoPilotListComponent> = {
  args: {
    automationTableData,
    conversionData,
    tabindex: 0,
    isAutomatedHedging: true,
    isIsraeliUser: true,
  },
};

export const ConvertsTab: StoryObj<AutoPilotListComponent> = {
  args: {
    automationTableData,
    conversionData,
    tabindex: 1,
    isAutomatedHedging: true,
    isIsraeliUser: true,
  },
};
