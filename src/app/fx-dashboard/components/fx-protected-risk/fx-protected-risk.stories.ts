import { Meta, StoryObj } from '@storybook/angular';
// ...existing imports...
// Shared chart angle constants
const RADIAL_START_ANGLE = -180;
const RADIAL_END_ANGLE = 180;
import { FxProtectedRiskComponent } from './fx-protected-risk.component';
import { moduleMetadata } from '@storybook/angular';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';

export default {
  title: 'FX Dashboard/AutoPilotList/FxProtectedRisk',
  component: FxProtectedRiskComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatSelectModule, MatTabsModule, NgApexchartsModule, FormsModule],
    }),
  ],
} as Meta<FxProtectedRiskComponent>;

export const Monthly: StoryObj<FxProtectedRiskComponent> = {
  args: {
    selectedTab: 0,
    isYearly: false,
    currentYear: 2025,
    currentData: {
      protectedPercent: 10.0,
      protected: 95336.14,
      unProtectedPercent: 90.0,
      unProtected: 904663.86,
      total: 1000000.00,
    },
    baseCurrencyWallet: {
      wallet_Currency: { sign: '₪' }
    },
    next12Months: [
      { label: 'January', value: 'January' },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
      { label: 'April', value: 'April' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' }
    ],
    selectedMonth: 'January',
    chartOptionsCovered: {
      series: [10.0],
      chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: RADIAL_START_ANGLE,
          endAngle: RADIAL_END_ANGLE,
          hollow: { size: '70%' },
          dataLabels: { show: false },
          track: { show: false }
        }
      },
      fill: { type: 'solid' },
      stroke: { lineCap: 'round' },
      labels: ['Covered Risk'],
      colors: ['#2320E6']
    },
    chartOptionsUncovered: {
      series: [90.0],
      chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: RADIAL_START_ANGLE,
          endAngle: RADIAL_END_ANGLE,
          hollow: { size: '70%' },
          dataLabels: { show: false },
          track: { background: '#ECECFF', strokeWidth: '100%', margin: 0 }
        }
      },
      fill: { type: 'solid' },
      stroke: { lineCap: 'round' },
      labels: ['Uncovered Risk'],
      colors: ['#FF3B30']
    }
  },
  play: async () => {
    (window as any).STORYBOOK_ARGS_MONTHLY = {
      chartOptionsCovered: {
        series: [10.0],
        chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
        plotOptions: {
          radialBar: {
            startAngle: RADIAL_START_ANGLE,
            endAngle: RADIAL_END_ANGLE,
            hollow: { size: '70%' },
            dataLabels: { show: false },
            track: { show: false }
          }
        },
        fill: { type: 'solid' },
        stroke: { lineCap: 'round' },
        labels: ['Covered Risk'],
        colors: ['#2320E6']
      },
      chartOptionsUncovered: {
        series: [90.0],
        chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
        plotOptions: {
          radialBar: {
            startAngle: RADIAL_START_ANGLE,
            endAngle: RADIAL_END_ANGLE,
            hollow: { size: '70%' },
            dataLabels: { show: false },
            track: { background: '#ECECFF', strokeWidth: '100%', margin: 0 }
          }
        },
        fill: { type: 'solid' },
        stroke: { lineCap: 'round' },
        labels: ['Uncovered Risk'],
        colors: ['#FF3B30']
      },
      currentData: {
        protectedPercent: 10.0,
        protected: 95336.14,
        unProtectedPercent: 90.0,
        unProtected: 904663.86,
        total: 1000000.00,
      },
      baseCurrencyWallet: {
        wallet_Currency: { sign: '₪' }
      },
    showUncoveredFirst: true
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Monthly tab always shows 10% protected and 90% uncovered.'
      }
    },
    actions: {
      handles: ['tabChange'],
    },
  },
};

export const Yearly: StoryObj<FxProtectedRiskComponent> = {
  args: {
    selectedTab: 1,
    isYearly: true,
    currentYear: 2025,
    currentData: {
      protectedPercent: 10.0,
      protected: 95336.14,
      unProtectedPercent: 90.0,
      unProtected: 904663.86,
      total: 1000000.00,
    },
    baseCurrencyWallet: {
      wallet_Currency: { sign: '₪' }
    },
    next12Months: [
      { label: 'January', value: 'January' },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
      { label: 'April', value: 'April' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' }
    ],
    selectedMonth: 'January',
    chartOptionsCovered: {
      series: [10],
      chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: RADIAL_START_ANGLE,
          endAngle: RADIAL_END_ANGLE,
          hollow: { size: '70%' },
          dataLabels: { show: false },
          track: { background: '#ECECFF', strokeWidth: '100%', margin: 0 }
        }
      },
      fill: { type: 'solid' },
      stroke: { lineCap: 'round' },
      labels: ['Covered Risk'],
      colors: ['#2320E6']
    },
    chartOptionsUncovered: {
      series: [90],
      chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: RADIAL_START_ANGLE,
          endAngle: RADIAL_END_ANGLE,
          hollow: { size: '70%' },
          dataLabels: { show: false },
          track: { background: '#ECECFF', strokeWidth: '100%', margin: 0 }
        }
      },
      fill: { type: 'solid' },
      stroke: { lineCap: 'round' },
      labels: ['Uncovered Risk'],
      colors: ['#FF3B30']
    }
  },
  play: async () => {
    (window as any).STORYBOOK_ARGS_YEARLY = {
      chartOptionsCovered: {
        series: [10],
        chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
        plotOptions: {
          radialBar: {
            startAngle: RADIAL_START_ANGLE,
            endAngle: RADIAL_END_ANGLE,
            hollow: { size: '70%' },
            dataLabels: { show: false },
            track: { background: '#ECECFF', strokeWidth: '100%', margin: 0 }
          }
        },
        fill: { type: 'solid' },
        stroke: { lineCap: 'round' },
        labels: ['Covered Risk'],
        colors: ['#2320E6']
      },
      chartOptionsUncovered: {
        series: [90],
        chart: { type: 'radialBar', height: 295, sparkline: { enabled: true } },
        plotOptions: {
          radialBar: {
            startAngle: RADIAL_START_ANGLE,
            endAngle: RADIAL_END_ANGLE,
            hollow: { size: '70%' },
            dataLabels: { show: false },
            track: { background: '#ECECFF', strokeWidth: '100%', margin: 0 }
          }
        },
        fill: { type: 'solid' },
        stroke: { lineCap: 'round' },
        labels: ['Uncovered Risk'],
        colors: ['#FF3B30']
      },
      currentData: {
        protectedPercent: 40,
        protected: 4000,
        unProtectedPercent: 60,
        unProtected: 6000,
        total: 10000,
      },
      baseCurrencyWallet: {
        wallet_Currency: { sign: '₪' }
      },
  showUncoveredFirst: true
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Yearly tab always shows 40% protected and 60% uncovered.'
      }
    },
    actions: {
      handles: ['tabChange'],
    },
  },
};
