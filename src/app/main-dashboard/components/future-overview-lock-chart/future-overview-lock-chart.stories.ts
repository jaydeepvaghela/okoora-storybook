import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FutureOverviewLockChartComponent } from './future-overview-lock-chart.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const timesPoints = ['Today', '1M', '3M', '6M', '9M', '1Y'];
const spotPoints = [2.5912, 2.5941, 2.5981, 2.6054, 2.6118, 2.6168];
const ratio = 0.005; // approximate ratio based on your logic
const colorForStroke = '#ED626E';

const chartOptionsMock = {
  series: [
    {
      name: 'Rate',
      type: 'line',
      data: spotPoints,
    },
  ],
  chart: {
    height: 300,
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  annotations: {
    yaxis: [
      {
        y: spotPoints[0],
        borderColor: '#000000',
        label: {
          borderColor: '#000000',
          position: 'top',
          offsetX: 25,
          offsetY: 7,
          borderRadius: 8,
          style: {
            color: '#FFF',
            background: '#000000',
          },
          text: spotPoints[0].toFixed(4),
        },
      },
      {
        y: spotPoints[0] < spotPoints[1] ? Math.min(...spotPoints) - ratio : Math.min(...spotPoints),
        y2: spotPoints[0] > spotPoints[1] ? Math.max(...spotPoints) + ratio : Math.max(...spotPoints),
        strokeDashArray: 1,
        fillColor: 'white',
        borderColor: 'white',
        opacity: 0,
      },
    ],
    points: [], // You can populate this with mock annotation points if needed
    xaxis: timesPoints.map(label => ({
      x: label,
      borderColor: '#D9DADD',
      strokeDashArray: 2,
    })),
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'straight',
    colors: [colorForStroke],
    width: 3,
  },
  colors: [colorForStroke],
  grid: {
    yaxis: {
      lines: { offsetX: 0, show: false },
    },
    xaxis: {
      lines: { offsetX: 0, show: false },
    },
  },
  title: { align: 'left' },
  labels: timesPoints,
  xaxis: {
    axisBorder: {
      show: true,
      color: 'false',
    },
    axisTicks: { show: false },
    labels: {
      style: {
        fontSize: '12px',
        colors: ['#909199', '#909199', '#909199', '#909199', '#909199', '#909199'],
      },
    },
  },
  yaxis: {
    min: spotPoints[0] < spotPoints[2]
      ? Math.max(Math.min(...spotPoints) - ratio, 0)
      : Math.min(...spotPoints),
    max: spotPoints[0] > spotPoints[2]
      ? Math.max(...spotPoints) + ratio
      : Math.max(...spotPoints),
    opposite: true,
    tickAmount: 5,
    axisBorder: {
      show: true,
      color: '#78909C',
    },
    labels: {
      style: {
        fontSize: '12px',
        colors: ['#909199'],
      },
    },
  },
};

export default {
  title: 'Main Dashboard/Third Row Sections/Future Overview Lock Chart (Side Tab-1)',
  component: FutureOverviewLockChartComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        NgApexchartsModule,
        NgbTooltipModule,
      ],
    }),
  ],
  args: {
    activeCurrency: {
      wallet_Currency: { code: 'USD' },
      wallet_Flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png',
      wallet_Hedging: {
        exposureBaseCurrency: 'ILS',
        direction: 2,
        pair: 'USDILS',
        exposureAmount: 50000,
      },
    },
    currentCurrencyValue: {
      USD: 1,
      ILS: 3.7,
    },
    currentExposureRate: {
      CAD: 1.0,
      ILS: 2.5966,
    },
    getLockHedgeGrafhData: {
      timesPoints,
      spotPoints,
    },
    createdHedgeData: { strike: 3.5 },
    Directions: {
      Down: 1,
      Up: 2,
    },
    userRoleType: 1,
    chartOptions: chartOptionsMock,
    currencyOfUser: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png',
    currencyPairFromHedge: 'USD/ILS',
    showLoader: false,
    isCalendarEnable: false,
    selectedTimeFrame: '',
    lockDate: null,
    lockDateValue: null,
    errorMsg: null,
    timeFrameMsg: null,
    dateErrMsg: null,
    errFlag: false,
  },
} as Meta<FutureOverviewLockChartComponent>;

type Story = StoryObj<FutureOverviewLockChartComponent>;

export const Default: Story = {};
