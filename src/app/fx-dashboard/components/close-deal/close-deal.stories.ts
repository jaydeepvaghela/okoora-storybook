import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CloseDealComponent } from './close-deal.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SafeValuePipe } from '../pipes/safe-value.pipe';
import { CountdownModule } from 'ngx-countdown';

const mockDealData = {
  mainHedgeDealDto: {
    id: 7656,
    tradeDate: "2025-09-15T15:31:57.867",
    dealType: 1,
    pair: "AUDILS",
    strike: 2.21214046,
    amount: 197.1,
    currencySign: "$",
    isOnline: true,
    expiryDate: "2025-09-29T00:00:00",
    isOpen: true,
    isProfit: false,
    canCloseDeal: true,
    callPutType: 0,
    fairValue: 2.5,
    dealStatus: 3,
    strategyId: 161913
  },
  hedgeDeals: [
    {
      id: 92916,
      tradeDate: "2025-09-15T15:31:57.867",
      dealType: 1,
      pair: "AUDILS",
      strike: 2.21214046,
      amount: 197.1,
      currencySign: "$",
      isOnline: true,
      expiryDate: "2025-09-29T00:00:00",
      isOpen: true,
      isProfit: true,
      canCloseDeal: true,
      callPutType: 0,
      fairValue: 2.5,
      dealStatus: 3,
      strategyId: 161913
    },
    {
      id: 92917,
      tradeDate: "2025-09-15T15:31:57.867",
      dealType: 1,
      pair: "AUDILS",
      strike: 2.21214046,
      amount: 197.1,
      currencySign: "$",
      isOnline: true,
      expiryDate: "2025-09-29T00:00:00",
      isOpen: true,
      isProfit: false,
      canCloseDeal: true,
      callPutType: 1,
      fairValue: 2.5,
      dealStatus: 3,
      strategyId: 161913
    }
  ]
};

const meta: Meta<CloseDealComponent> = {
  title: 'FX Dashboard/ManageHedgeDeals/Close Deal',
  component: CloseDealComponent,
  decorators: [
    moduleMetadata({
      imports: [MatDialogModule, CommonModule, SafeValuePipe, CountdownModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockDealData }, // Provide static mock data
      ]
    })
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {}, // Remove data from args
};
export default meta;

type Story = StoryObj<CloseDealComponent>;

export const Default: Story = {
  args: {}, // No data in args
};
