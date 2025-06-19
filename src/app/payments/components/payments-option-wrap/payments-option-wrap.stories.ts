import { Meta, StoryObj } from '@storybook/angular';
import { PaymentsOptionWrapComponent } from './payments-option-wrap.component';
import { moduleMetadata } from '@storybook/angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<PaymentsOptionWrapComponent> = {
  title: 'Payments/Payment Dashboard/Dashboard Transactions/Transaction header',
  component: PaymentsOptionWrapComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatMenuModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    singlePayment: { action: 'Single Payment clicked' },
    massPayment: { action: 'Mass Payment clicked' },
    exchangeNow: { action: 'Exchange Now clicked' },
    exchangePlan: { action: 'Future Exchange clicked' },
    lockRate: { action: 'Lock Rate clicked' },
  },
};

export default meta;

type Story = StoryObj<PaymentsOptionWrapComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      emitSinglePayment: () => args.singlePayment?.(),
      emitMassPayment: () => args.massPayment?.(),
      emitExchangeNow: () => args.exchangeNow?.(),
      emitExchangePlan: () => args.exchangePlan?.(),
      emitLockRate: () => args.lockRate?.(),
    },
  }),
};
