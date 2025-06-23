import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { SendComponent } from './send.component';
import { SendStep2Component } from './components/send-step2/send-step2.component';
import { SendStep3Component } from './components/send-step3/send-step3.component';
import { SendStep4Component } from './components/send-step4/send-step4.component';
import { SendStep5Component } from './components/send-step5/send-step5.component';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { balanceList } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { of } from 'rxjs';

const mockDialogData = {
  type: 'future_payment',
  fromWallet: true,
  calendarDateValue: new Date()
};

const mockMatDialogRef = {
  close: () => {}
};

const defaultBeneficiary = {
  beneficiaryId: '81abbf9e-cf2b-4132-9826-7758073243ff',
  product_reference: 'Goha',
  beneficiarySign: '₪',
  currency: 'ILS',
  costType: '',
  costList: [
    { key: '1 - regular', value: 0 },
    { key: '2 - our', value: 21.42 }
  ],
  charge: '43.58',
  note: '',
  spot: 0.4817,
  invoiceNumber: '',
  signAndFiles: {
    needSign: false,
    needFile: false,
    needStamp: false
  },
  amount: '21',
  files: [],
  previewFiles: [],
  stamp: null,
  previewStamp: [],
  requestId: '81abbf9e-cf2b-4132-9826-7758073243ff'
};

const fb = new FormBuilder();
const mockForm = fb.group({
  type: fb.group({
    paymentType: ['future_payment'],
    dueDate: [new Date()]
  }),
  beneficiaryName: [defaultBeneficiary],
  futurePayment: fb.group({
    amount: ['5000'],
    currency: ['USD'],
    senderName: ['John Smith'],
    expiryDate: [new Date()],
    beneficiaryId: ['123'],
    createPaymentResponse: [''],
    strategyId: [''],
    buyCurrency: [''],
    invoiceFileList: [''],
    costType: ['']
  }),
  createPayment: fb.group({
    amount: ['5000'],
    chargeCurrency: ['USD'],
    costType: ['standard'],
    spotRate: ['1.1'],
    currentRate: ['1.09'],
    expiryDate: [new Date()],
    transferOnly: [''],
    termsCondition: [''],
    requestId: ['REQ123'],
    subscription: [''],
    userName: ['John Smith'],
    CurrencyImage: [''],
    isApproved: [true]
  }),
  uploadFile: fb.group({
    file: [[]]
  }),
  OCR_uploadFile: fb.group({
    file: [[]],
    OCRUploadData: [],
    OCRPdfPreview: []
  }),
  OCR_PreviewData: fb.group({
    beneficiaryName: ['John Smith'],
    CurrencyToBeCharge: ['USD'],
    updateCostType: ['standard']
  })
});

const meta: Meta<SendComponent> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps',
  component: SendComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatProgressBarModule,
        MatStepperModule,
        SendStep2Component,
        SendStep3Component,
        SendStep4Component,
        SendStep5Component,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: DateAdapter, useClass: NativeDateAdapter },
        {
          provide: MAT_DATE_FORMATS,
          useValue: {
            parse: { dateInput: 'l' },
            display: {
              dateInput: 'DD/MM/YYYY',
              monthYearLabel: 'MMM YYYY',
              dateA11yLabel: 'LL',
              monthYearA11yLabel: 'MMMM YYYY'
            }
          }
        },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        TranslateService
      ]
    })
  ],
  render: (args) => ({
    props: {
      ...args,
      data: { ...mockDialogData, ...args.data },
      paymentRequestForm: mockForm,
      isStorybook: true
    }
  })
};

export default meta;

type Story = StoryObj<SendComponent>;

export const Step2: Story = {
  name: 'Step 1 - Beneficiary Info',
  args: {
    data: {
      ...mockDialogData,
      type: false
    },
    currentStepIndex: 1
  }
};

// export const Step3: Story = {
//   name: 'Step 2 - Payment Info',
//   args: {
//     data: {
//       ...mockDialogData,
//       type: 'future_payment'
//     },
//     currentStepIndex: 2,
//   }
  // render: (args) => ({
  //   props: {
  //     ...args,
  //     paymentRequestForm: mockForm
  //   }
  // })
// };

export const Step4: Story = {
  name: 'Step 3 - Lock Rate',
  args: {
    data: {
      ...mockDialogData,
      type: 'future_payment'
    },
    currentStepIndex: 3
  }
};

export const Step5: Story = {
  name: 'Step 4 - Your Own Rate',
  args: {
    data: {
      ...mockDialogData,
      type: 'future_payment'
    },
    currentStepIndex: 4
  }
};
