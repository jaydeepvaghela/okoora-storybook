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
import { FormGroup, FormControl } from '@angular/forms';

const mockDialogData = {
  selectedType: 'buy',
  fromDashboadConvert: true,
  selectedwalletInfo: JSON.parse(localStorage.getItem('activeWallet')!),
};

const mockActiveCurrency = {
  wallet_Currency: { code: 'USD' },
  wallet_Hedging: { exposureBaseCurrency: 'EUR' }
};

const mockExchangeForm = {
  value: {
    firstExchangeCurrency: 'AUD',
    firstExchangeAmount: '22.00',
    firstSelectedCurrency: '',
    firstChargeCurrencyAmount: '',
    secondExchangeCurrency: 'ILS',
    secondExchangeAmount: '31.35',
    secondSelectedCurrency: '',
    secondChargeCurrencyAmount: '',
    firstExchangeSign: '$',
    secondExchangeSign: '₪',
    buy: true,
  }
};


const mockCreatedConvertData = {
  status: "Create Request Successfully",
  convertRequest: {
    pair: "AUDILS",
    requestId: "808f45de-5065-4be0-9296-d37c067bca20",
    buy: { currency: "AUD", amount: "22.00" },
    charge: { currency: "ILS", amount: "31.35" },
    finalQuote: 0.7018,
    exchangeRate: {
      major: {
        rate: 1,
        currency: { code: "AUD", sign: "$", flag: null, currencyName: null }
      },
      minor: {
        rate: 0.7018,
        currency: { code: "ILS", sign: "₪", flag: null, currencyName: null }
      }
    },
    dealNumber: null
  }
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
    currentStepIndex: 0,
    data: mockDialogData
  }
};


export const Step2_Summary: Story = {
  args: {
    currentStepIndex: 1,
    exchangeForm: mockExchangeForm,
    createdConvertData: mockCreatedConvertData,
    timerSubscription: { timeLeft: 5 },
    timerSubscriptionWithTimerData:  { circumference: 63, progress: 21, currentNumber: 10 }
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
