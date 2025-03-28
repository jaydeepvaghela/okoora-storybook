import { Meta, StoryObj } from "@storybook/angular";
import { TradeViewChartComponent } from "./trade-view-chart.component";

const meta: Meta<TradeViewChartComponent> = {
    title: 'Components/Risk-Manager/Trade-View-Chart',
    component: TradeViewChartComponent,
    argTypes: {
        firstCurrency: {
          control: 'text',
          description: 'First currency in the pair',
          defaultValue: 'USD',
        },
        baseCurrency: {
          control: 'text',
          description: 'Base currency in the pair',
          defaultValue: 'ILS',
        },
        selectedPeriod: {
          control: 'select',
          options: ['1D', '1M', '3M', '1Y', '60M', 'all'],
          description: 'Selected period for trading view chart',
          defaultValue: '1M',
        },
        tradeRate: {
          control: 'number',
          description: 'Current trade rate',
          defaultValue: 3.4324,
        },
      },
};
export default meta;
type Story = StoryObj<TradeViewChartComponent>;

export const Default: Story = {
    args: {
        firstCurrency: "USD",
        baseCurrency: 'ILS',
        selectedPeriod: "1M",
        tradeRate: 3.4245,
      },
};
