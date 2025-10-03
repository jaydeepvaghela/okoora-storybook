import { Meta, StoryObj } from "@storybook/angular";
import { RiskEstimateChartComponent } from "./risk-estimate-chart.component";

const meta: Meta<RiskEstimateChartComponent> = {
    title: 'Risk Manager/Risk Manager Dashboard/Risk Estimate Chart',
    component: RiskEstimateChartComponent,
    tags: ['autodocs'],
  render: (args: RiskEstimateChartComponent) => ({
    props: args,
  }),
  argTypes: {
    selectedYear: {
      control: { type: 'select' },
      options: ['Y5', 'Y10', 'Y20'],
      description: 'Selected year for the chart',
      defaultValue: 'Y10',
    },
    totalRiskLevel: {
      control: { type: 'select' },
      options: ['HIGH', 'MEDIUM', 'LOW'],
      description: 'Total risk level',
      defaultValue: 'HIGH',
    },
    benchmarkRotate: {
      control: { type: 'number' },
      description: 'Rotation angle for benchmark',
      defaultValue: 65,
    },
    annualLoss: {
      control: { type: 'text' },
      description: 'Annual loss amount',
      defaultValue: '₪4,476,001.2',
    },
    initialloss: {
      control: { type: 'text' },
      description: 'Initial loss amount',
      defaultValue: '₪4,476,001.2',
    },
    benchmarkloss: {
      control: { type: 'text' },
      description: 'Benchmark loss amount',
      defaultValue: '₪5,220,001.2',
    },
    myloss: {
      control: { type: 'text' },
      description: 'My loss amount',
      defaultValue: '₪4,476,001.2',
    },
    avginitialloss: {
      control: { type: 'text' },
      description: 'Average initial loss',
      defaultValue: '₪5,220,001.2',
    },
    avgbenchmarkloss: {
      control: { type: 'text' },
      description: 'Average benchmark loss',
      defaultValue: '₪3,170,001.2',
    },
    avgmyloss: {
      control: { type: 'text' },
      description: 'Average my loss',
      defaultValue: '₪5,220,001.2',
    },
  },
};
export default meta;
type Story = StoryObj<RiskEstimateChartComponent>;

export const Default: Story = {
    args: {
        selectedYear: 'Y10',
        totalRiskLevel: 'HIGH',
        benchmarkRotate: 65,
        annualLoss: '₪4,476,001.2',
        initialloss: '₪4,476,001.2',
        benchmarkloss: '₪2,685,001.2',
        myloss: '₪4,476,001.2',
        avginitialloss: '₪5,220,001.2',
        avgbenchmarkloss: '₪3,170,001.2',
        avgmyloss: '₪5,220,001.2',
      },
};
