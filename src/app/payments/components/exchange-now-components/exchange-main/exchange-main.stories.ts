import { Meta, StoryObj } from '@storybook/angular';
import { ExchangeMainComponent } from './exchange-main.component';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ExchangeNewStep1Component } from '../exchange-new-step1/exchange-new-step1.component';
import { ExchangeNewSummaryComponent } from '../exchange-new-summary/exchange-new-summary.component';
import { ExchangeDoneComponent } from '../exchange-done/exchange-done.component';

const mockDialogData = {
  selectedType: 'buy',
  fromDashboadConvert: true
};

const mockActiveCurrency = {
  wallet_Currency: { code: 'USD' },
  wallet_Hedging: { exposureBaseCurrency: 'EUR' }
};

const mockExchangeForm = {
  currencyFrom: 'USD',
  currencyTo: 'EUR',
  amount: 1000
};

const mockCreatedConvertData = {
  id: 'conversion-123',
  rate: 1.1
};

const mockCompletedPaymentData = {
  status: 'Completed',
  reference: 'TX123456'
};

const mockMatDialogRef = {
  close: () => {}
};

const meta: Meta<ExchangeMainComponent> = {
  title: 'Payments/Payment Dashboard/Exchange/Exchange Now',
  component: ExchangeMainComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatDialogModule,
        MatStepperModule,
        MatProgressBarModule,
        ExchangeNewStep1Component,
        ExchangeNewSummaryComponent,
        ExchangeDoneComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }),
  ],
  args: {
    activeCurrency: mockActiveCurrency,
  },
};

export const Step1_NewExchange: Story = {
  args: {
    currentStepIndex: 0
  }
};

export const Step2_Summary: Story = {
  args: {
    currentStepIndex: 1,
    exchangeForm: mockExchangeForm,
    createdConvertData: mockCreatedConvertData,
    timerSubscription: { timeLeft: 60 },
    timerSubscriptionWithTimerData: { timerStarted: true }
  }
};

export const Step3_Done: Story = {
  args: {
    currentStepIndex: 2,
    exchangeForm: mockExchangeForm,
    completedPaymentData: mockCompletedPaymentData
  }
};


export default meta;
type Story = StoryObj<ExchangeMainComponent>;
