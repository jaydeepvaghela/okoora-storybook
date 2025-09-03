import type { Meta, StoryObj } from '@storybook/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SendStep2Component } from './send-step2.component';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { SendStep3Component } from '../send-step3/send-step3.component';
import { BenificiaryModel, BenificiaryStatus } from '../../../../models/BenificiaryModel';

// Mock services
class MockWalletsService {
  setApiObs(param: string) {
    console.log('Mock setApiObs called with:', param);
  }
}

class MockSendStep3Component {
  ngOnInit() {
    console.log('Mock SendStep3 ngOnInit');
  }
  ngAfterViewInit() {
    console.log('Mock SendStep3 ngAfterViewInit');
  }
}

class MockMatDialog {
  closeAll() {
    console.log('Mock dialog closeAll');
  }
}

// Mock data
const mockBeneficiaries: any = [
  {
    id: '1',
    bankAccountHolderName: 'John Doe',
    bankName: 'Chase Bank',
    bankBranch: 'Main Branch',
    bankNumber: '123456',
    accountNumber: '987654321',
    bankCountry: 'USA',
    currency: 'USD',
    currencyISO: {
      code: 'USD',
      flag: 'https://flagcdn.com/us.svg'
    },
    status: BenificiaryStatus.Approved
  },
  {
    id: '2',
    bankAccountHolderName: 'Jane Smith',
    bankName: 'Bank of America',
    bankBranch: 'Downtown Branch',
    bankNumber: '654321',
    accountNumber: '123456789',
    bankCountry: 'USA',
    currency: 'EUR',
    currencyISO: {
      code: 'EUR',
      flag: 'https://flagcdn.com/eu.svg'
    },
    status: BenificiaryStatus.Approved
  },
  {
    id: '3',
    bankAccountHolderName: 'Robert Johnson',
    bankName: 'Wells Fargo',
    bankBranch: 'West Branch',
    bankNumber: '789123',
    accountNumber: '456789123',
    bankCountry: 'USA',
    currency: 'GBP',
    currencyISO: {
      code: 'GBP',
      flag: 'https://flagcdn.com/gb.svg'
    },
    status: BenificiaryStatus.Approved
  }
];

const mockActiveWalletCurrency = {
  selectedwalletInfo: {
    wallet_Currency: {
      code: 'USD'
    }
  },
  payment: true,
  transaction: false
};

// Create form groups
const createFuturePaymentForm = () => new FormGroup({
  expiryDate: new FormControl('', [Validators.required]),
  beneficiaryId: new FormControl('', [Validators.required]),
  amount: new FormControl(''),
  currency: new FormControl('')
});

const createBeneficiaryNameForm = () => new FormGroup({
  currency: new FormControl(''),
  bankDetails: new FormControl('')
});

const createPaymentForm = () => new FormGroup({
  currentRate: new FormControl(''),
  amount: new FormControl('')
});

const createTypeForm = () => new FormGroup({
  paymentType: new FormControl('future_payment')
});

// Mock stepper
const mockFormStepper = {
  steps: { length: 4 },
  selectedIndex: 1,
  next: () => console.log('Stepper next called')
};

const mockFormStepperProgress = {
  value: 50
};

const meta: Meta<SendStep2Component> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 1 - Beneficiary Info',
  component: SendStep2Component,
  decorators: [
    // Add required modules and providers
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    paymentType: {
      control: { type: 'select' },
      options: ['future_payment', 'payment_manually', 'regular_payment']
    }
  }
};

export default meta;
type Story = StoryObj<SendStep2Component>;

// Default story
export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      futurePayment: createFuturePaymentForm(),
      beneficiaryName: createBeneficiaryNameForm(),
      createPayment: createPaymentForm(),
      type: createTypeForm(),
      formStepper: mockFormStepper,
      formStepperProgress: mockFormStepperProgress,
      activeWalletCurrency: mockActiveWalletCurrency,
      OCR_payment_uploadFile: null
    },
    moduleMetadata: {
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: SendStep3Component, useClass: MockSendStep3Component },
        { provide: MatDialog, useClass: MockMatDialog },
         { provide: MatDialogRef, useValue: { close: (val?: any) => console.log('Dialog closed with:', val) } },
      ]
    }
  }),
  args: {}
};