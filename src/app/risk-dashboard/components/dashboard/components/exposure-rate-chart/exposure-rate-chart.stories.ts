import { Meta, StoryObj } from "@storybook/angular";
import { ExposureRateChartComponent } from "./exposure-rate-chart.component";

const meta: Meta<ExposureRateChartComponent> = {
    title: 'Risk Manager/Risk Manager Dashboard/Exposure Rate Chart',
    component: ExposureRateChartComponent,
    argTypes: {
        chartSeries: {
            control: 'object',
            description: 'Data series for the chart',
        },
        xAxisOptions: {
            control: 'object',
            description: 'X-axis configuration',
        },
    },
};
export default meta;
type Story = StoryObj<ExposureRateChartComponent>;
export const Default: Story = {
    args: {
        chartSeries: [
            {
                name: "Hedged",
                type: "line",
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
            },
            {
                name: "Liability",
                type: "line",
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
            },
            {
                name: "Spot",
                type: "line",
                data: [4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110, 4.2110]
            },
            {
                name: "Budget",
                type: "line",
                data: [4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712, 4.0712]
            },
            {
                name: "Exposure",
                type: "bar",
                data: [25,10,15,18,20,16,14,12,8,17,13,10]
            },
            {
                name: "Recommended hedging",
                type: "bar",
                data: [10.50,8.5,6.3,5.5,2.5,8.3,4.6,3.8,4.9,7.5,3.6,2.3]
            },
            {
                name: "Actual hedging",
                type: "bar",
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
            }
        ],
        xAxisOptions: {
            categories: ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
            labels: {
                style: {
                    cssClass: 'apexcharts-xaxis-label'
                }
            },
        },
    }
}
