import { Meta, StoryObj } from '@storybook/angular';
import { CurrentHedgeBoxComponent } from './current-hedge-box.component';

const meta: Meta<CurrentHedgeBoxComponent> = {
  title: 'Main Dashboard/Second Row Cards/3. Current Hedge Box',
  component: CurrentHedgeBoxComponent,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<CurrentHedgeBoxComponent>;

export const Default: Story = {
  args: {
    activeCurrency: {
      wallet_Currency: { sign: '$' },
      wallet_Hedging: {
        percentage: 57.43,
        totalHedging: 123456.78,
        exposureAmount: 200000.0,
      }
    }
  }
};

export const NoData: Story = {
  args: {
    activeCurrency: {
      wallet_Currency: { sign: '$' },
      wallet_Hedging: null
    }
  }
};

export const PartialData: Story = {
  args: {
    activeCurrency: {
      wallet_Currency: { sign: '€' },
      wallet_Hedging: {
        percentage: null,
        totalHedging: null,
        exposureAmount: 120000.0,
      }
    }
  }
};
