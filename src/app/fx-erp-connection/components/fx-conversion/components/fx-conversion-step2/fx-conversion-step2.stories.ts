import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

import { FxConversionStep2Component } from './fx-conversion-step2.component';

// Mock services
class MockWalletsService {
  getAllBalanceList() {
    return of([
      {
        wallet_Id: 1,
        wallet_Amount: 10000,
        wallet_Currency: {
          code: 'USD',
          sign: '$',
          name: 'US Dollar'
        },
        wallet_IsBaseCurency: true
      },
      {
        wallet_Id: 2,
        wallet_Amount: 5000,
        wallet_Currency: {
          code: 'EUR',
          sign: '€',
          name: 'Euro'
        },
        wallet_IsBaseCurency: false
      },
      {
        wallet_Id: 3,
        wallet_Amount: 7500,
        wallet_Currency: {
          code: 'GBP',
          sign: '£',
          name: 'British Pound'
        },
        wallet_IsBaseCurency: false
      },
      {
        wallet_Id: 4,
        wallet_Amount: 0,
        wallet_Currency: {
          code: 'JPY',
          sign: '¥',
          name: 'Japanese Yen'
        },
        wallet_IsBaseCurency: false
      }
    ]);
  }
}

class MockFxDashboardService {
  currencySignForBuySell$ = new BehaviorSubject('');
  spotRateSubject = new BehaviorSubject({});
}

class MockMatStepper {
  next() {
    console.log('Next step called');
  }
  
  previous() {
    console.log('Previous step called');
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(false)
    };
  }
}

// Mock the getAllActiveCurrencies function
const mockGetAllActiveCurrencies = [
  { code: 'USD', sign: '$', name: 'US Dollar' },
  { code: 'EUR', sign: '€', name: 'Euro' },
  { code: 'GBP', sign: '£', name: 'British Pound' },
  { code: 'JPY', sign: '¥', name: 'Japanese Yen' },
  { code: 'CAD', sign: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', sign: 'A$', name: 'Australian Dollar' }
];

// Create a mock form group
const createMockFormGroup = () => new FormGroup({
  buyCurrency: new FormControl('EUR', [Validators.required]),
  BuyAmount: new FormControl('', [Validators.required]),
  sellCurrency: new FormControl('USD', [Validators.required]),
  SellAmount: new FormControl('', [Validators.required])
});

const meta: Meta<FxConversionStep2Component> = {
  title: 'FX Dashboard/Auto-pilot Functionality/Conversion Steps/Conversion Step 2',
  component: FxConversionStep2Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDialogModule,
        MatStepperModule,
        NgbTooltipModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: 'WalletsService', useClass: MockWalletsService },
        { provide: 'FxDashboardService', useClass: MockFxDashboardService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(NoopAnimationsModule)
      ]
    })
  ],
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['buy', 'sell'],
      description: 'The current mode of the conversion (buy or sell)'
    },
    stepper: {
      control: false,
      description: 'Material Stepper instance for navigation'
    },
    fxConversionForm: {
      control: false,
      description: 'Reactive form group for the conversion'
    }
  }
};

export default meta;
type Story = StoryObj<FxConversionStep2Component>;

// Default story
export const Default: Story = {
  args: {
    stepper: new MockMatStepper() as any,
    fxConversionForm: createMockFormGroup(),
    mode: 'buy'
  },
  render: (args) => ({
    props: {
      ...args,
      // Mock the getAllActiveCurrencies import
      getAllActiveCurrencies: mockGetAllActiveCurrencies
    },
    template: `
      <div>
        <app-fx-conversion-step2 
          [stepper]="stepper"
          [fxConversionForm]="fxConversionForm"
          [mode]="mode"
          (modeChanged)="onModeChanged($event)"
          (exchangeFormDetails)="onExchangeFormDetails($event)"
          (createdConvertDataDetails)="onCreatedConvertDataDetails($event)"
          (timerSubscriptionForComplete)="onTimerSubscriptionForComplete($event)"
          (timerSubscriptionWithTimerdata)="onTimerSubscriptionWithTimerdata($event)">
        </app-fx-conversion-step2>
      </div>
    `,
    methods: {
      onModeChanged: (mode: 'buy' | 'sell') => console.log('Mode changed:', mode),
      onExchangeFormDetails: (details: any) => console.log('Exchange form details:', details),
      onCreatedConvertDataDetails: (details: any) => console.log('Created convert data details:', details),
      onTimerSubscriptionForComplete: (timer: any) => console.log('Timer subscription for complete:', timer),
      onTimerSubscriptionWithTimerdata: (timer: any) => console.log('Timer subscription with timer data:', timer)
    }
  })
};

