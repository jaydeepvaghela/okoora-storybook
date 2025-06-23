import type { Meta, StoryObj } from '@storybook/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

import { SendStep4Component } from './send-step4.component';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { SignatureComponent } from '../signature/signature.component';
import { ActiveCurrencyModel } from '../../../../../main-dashboard/models/ActiveCurrencyModel';

// Mock services
class MockWalletsService {
  getAllBalanceList() {
    return of([
      {
        currency: 'USD',
        balance: 1000,
        symbol: '$'
      },
      {
        currency: 'EUR',
        balance: 850,
        symbol: '€'
      },
      {
        currency: 'GBP',
        balance: 750,
        symbol: '£'
      }
    ]);
  }

  updateFuturePaymentRequest(requestId: string, body: any) {
    return of({ success: true });
  }

  createPaymentRequest(body: any) {
    return of({
      signAndFiles: {
        needStamp: false
      }
    });
  }
}

class MockMatDialog {
  open(component: any, config: any) {
    return {
    //   afterClosed: () => of({
    //     signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    //   })
    };
  }
}

class MockMatDialogRef {
  close(result?: any) {
    console.log('Dialog closed with result:', result);
  }
}

class MockTranslateService {
  instant(key: string) {
    const translations: { [key: string]: string } = {
      'FORMS_ERRORS.fileNotSupported': 'File type not supported',
      'FORMS_ERRORS.fileSizeExceedsForUpload': 'File size exceeds the limit'
    };
    return translations[key] || key;
  }
}

// Mock data
const mockActiveCurrencies: any = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: 'https://flagcdn.com/us.svg'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: 'https://flagcdn.com/eu.svg'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: 'https://flagcdn.com/gb.svg'
  }
];

// Create form groups
const createPaymentRateForm = (fb: FormBuilder) => fb.group({
  'fromCurrency': ['USD', [Validators.required]],
  'toCurrency': ['EUR', [Validators.required]],
  'sellAmount': ['1000', [Validators.required]],
  'buyAmount': ['850'],
  'uploadInvoice': ['', [Validators.required]],
  'invoiceNumber': ['INV-2024-001'],
  'invoiceUploadComment': ['Payment for services rendered']
});

const createPaymentForm = (fb: FormBuilder) => fb.group({
  amount: ['1000'],
  chargeCurrency: ['USD']
});

const createFuturePaymentForm = (fb: FormBuilder) => fb.group({
  createPaymentResponse: [{
    requestId: 'req-123456789'
  }]
});

// Mock stepper
const mockFormStepper = {
  steps: { length: 5 },
  selectedIndex: 3,
  next: () => console.log('Stepper next called'),
  previous: () => console.log('Stepper previous called')
};

const mockFormStepperProgress = {
  value: 75
};

const meta: Meta<SendStep4Component> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 3: Lock Rate/Lock rate without Signature Popup',
  component: SendStep4Component,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    paymentType: {
      control: { type: 'select' },
      options: ['future_payment', 'regular_payment', 'instant_payment']
    },
    currency: {
      control: { type: 'select' },
      options: ['USD', 'EUR', 'GBP', 'JPY']
    },
    isSigned: {
      control: { type: 'boolean' }
    },
    invoiceUploaded: {
      control: { type: 'boolean' }
    }
  }
};

export default meta;
type Story = StoryObj<SendStep4Component>;

// Default story
export const Default: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        formStepper: mockFormStepper,
        formStepperProgress: mockFormStepperProgress,
        createPayment: createPaymentForm(fb),
        futurePayment: createFuturePaymentForm(fb),
        currency: 'EUR',
        benificiaryId: 'ben-123456',
        paymentType: 'future_payment'
      },
      moduleMetadata: {
        imports: [
          CommonModule,
          ReactiveFormsModule,
          MatDatepickerModule,
          MatSelectModule,
          MatListModule,
          MatButtonModule,
          MatIconModule,
          MatInputModule,
          MatFormFieldModule,
          MatDialogModule,
          NgxDropzoneModule,
          TranslateModule.forRoot(),
          BrowserAnimationsModule,
          SignatureComponent
        ],
        providers: [
          FormBuilder,
          { provide: WalletsService, useClass: MockWalletsService },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: TranslateService, useClass: MockTranslateService }
        ]
      }
    };
  },
  args: {}
};
