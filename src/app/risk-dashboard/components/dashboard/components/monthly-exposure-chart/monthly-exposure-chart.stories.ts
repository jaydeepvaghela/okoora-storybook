import { Meta, StoryObj } from "@storybook/angular";
import { MonthlyExposureChartComponent } from "./monthly-exposure-chart.component";

const meta: Meta<MonthlyExposureChartComponent> = {
    title: 'Components/Risk-Manager/Monthly-exposure-chart',
    component: MonthlyExposureChartComponent,
    argTypes: {
        chartSeries: {
          control: 'object',
          description: 'Data series for the chart',
        },
        xAxisOptions: {
          control: 'object',
          description: 'X-axis configuration',
        },
        yAxisOptions: {
          control: 'object',
          description: 'Y-axis configuration',
        },
        tooltipOptions: {
          control: 'object',
          description: 'Tooltip options',
        },
      },
};
export default meta;
type Story = StoryObj<MonthlyExposureChartComponent>;

export const Default: Story = {
    args : {
        chartSeries: [
          {
            name: 'Exposure-negative',
            type: 'bar',
            group: 'exposer',
            data: [0,0,50000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          },
          {
            name: 'Exposure',
            type: 'bar',
            group: 'exposer',
            data: [95000,95000,45000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000,95000],
          },
          {
            name: 'Recommended hedging',
            type: 'bar',
            group: 'rechedge',
            data: [60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000,60000],
          },
          {
            name: 'Actual hedging',
            type: 'bar',
            group: 'acthedge',
            data: [1000,1000,1000,20000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000],
          },
        ],
        xAxisOptions: {
          categories: ['Jan 24','Feb 24','Mar 24','Apr 24','May 24','Jun 24','Jul 24','Aug 24','Sep 24','Oct 24','Nov 24','Dec 24','Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25'],
          labels: {
            style: {
              colors: '#98A2B3',
              fontSize: '12px',
              fontFamily: 'Inter'
            },
            rotate: -45,
            hideOverlappingLabels: false,
          },
        },
        yAxisOptions: {
          min: 0,
          max: 100000,
          tickAmount: 5,
          labels: {
            formatter: (val) => `$${val}`,
            style: {
              colors: 'rgba(0, 0, 0, 0.70)',
              fontSize: '12px',
              fontFamily: 'Inter'
            },
          },
        },
        tooltipOptions: {
          enabled: false,
        }
    }
};
