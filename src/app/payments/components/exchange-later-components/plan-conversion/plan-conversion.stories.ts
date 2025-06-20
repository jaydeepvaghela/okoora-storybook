import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { PlanConversionComponent } from './plan-conversion.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

// Subcomponents
import { PlanConversionStep1Component } from '../plan-conversion-step1/plan-conversion-step1.component';
import { ConvertStep3Component } from '../convert-step3/convert-step3.component';
import { PlanConversionDoneComponent } from '../plan-conversion-done/plan-conversion-done.component';
import { provideNativeDateAdapter } from '@angular/material/core';

// Mock Service
class MockWalletsService {
  activeCurrentWallet = of({
    wallet_Currency: {
      sign: '$',
      code: 'USD',
    },
  });
}

const meta: Meta<PlanConversionComponent> = {
  title: 'Payments/Payment Dashboard/Exchange/Future Exchange',
  component: PlanConversionComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatMenuModule,
        MatStepperModule,
        MatProgressBarModule,
        PlanConversionStep1Component,
        ConvertStep3Component,
        PlanConversionDoneComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: 'WalletsService', useClass: MockWalletsService },
        provideNativeDateAdapter(),
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PlanConversionComponent>;

// Step 1 Story
export const Step1_SelectFutureDate : Story = {
  args: {
    currentStep: 0,
    data: {
      selectedwalletInfo: {
        wallet_Currency: { code: 'USD', sign: '$' },
      },
    },
  },
};

// Step 2 Story
export const Step2_YourOwnRate: Story = {
  args: {
    currentStep: 1,
    data: {
      selectedwalletInfo: {
        selectedwalletInfo: JSON.parse(localStorage.getItem('activeWallet')!),
      },
    },
  },
};

// Step 3 (Done) Story
export const Step3_CurrencySimplified: Story = {
  args: {
    currentStep: 2,
    data: {
      selectedwalletInfo: JSON.parse(localStorage.getItem('activeWallet')!),
    },
  },
};
