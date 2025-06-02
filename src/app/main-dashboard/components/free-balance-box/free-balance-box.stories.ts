import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FreeBalanceBoxComponent } from './free-balance-box.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Main Dashboard/Second Row Cards/1. Free Balance Box',
  component: FreeBalanceBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FreeBalanceBoxComponent>;

type Story = StoryObj<FreeBalanceBoxComponent>;

export const Default: Story = {
  args: {
    activeCurrency: {
      wallet_Currency: {
        sign: '$',
      },
      wallet_Available: 12345.67,
    },
  },
};
