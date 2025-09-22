import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PayerPaymentReason } from '../../enums/PayerPaymentReason';
import { NewPayerSummaryStepComponent } from './new-payer-step-summary.component';
import { ContactsService } from '../../services/contacts.service';
import { PayerService } from '../../services/payer.service';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// const MockRouter = {
//   navigate: () => Promise.resolve(true),
//   url: '/payer'
// };

// AoT requires an exported function for factories
function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

type Story = StoryObj<NewPayerSummaryStepComponent>;



export default {
  title: 'Contacts/Payer/Step Summary',
  component: NewPayerSummaryStepComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        HttpClientModule,
        MatDialogModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        ContactsService,
        PayerService,
        // { provide: Router, useValue: MockRouter }
      ]
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<NewPayerSummaryStepComponent>;

// Base story configuration
const baseStory: Story = {
  args: {
    isSummaryConfirmed: false,
    isSubmitForm: false,
    PayerPaymentReason: PayerPaymentReason
  }
};

// Business Payer Summary View
export const BusinessPayerSummary: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['1'], // Export goods
        currency: ['USD']
      }),
      payerAccountDetail: new FormBuilder().group({
        entityType: ['1'], // Business
        bankCountry: ['US'],
        payerCountry: ['US'],
        unionCountry: [''],
        currency: ['USD'],
        bankAccountHolderName: ['Acme Corporation']
      })
    });

    return {
      props: {
        ...args,
        payerForm,
        displayCountryName: (code: string) => code === 'US' ? 'United States' : code
      },
    };
  },
};

// Individual Payer Summary View
export const IndividualPayerSummary: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['3'], // Labor/ROI
        currency: ['EUR']
      }),
      payerAccountDetail: new FormBuilder().group({
        entityType: ['2'], // Individual
        bankCountry: ['DE'],
        payerCountry: ['DE'],
        unionCountry: [''],
        currency: ['EUR'],
        bankAccountHolderName: ['John Doe']
      })
    });

    return {
      props: {
        ...args,
        payerForm,
        displayCountryName: (code: string) => code === 'DE' ? 'Germany' : code
      },
    };
  },
};

// Israeli Account Summary View
export const IsraeliAccountSummary: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['2'], // My accounts
        currency: ['ILS']
      }),
      payerAccountDetail: new FormBuilder().group({
        entityType: ['1'],
        bankCountry: ['IL'],
        payerCountry: ['IL'],
        unionCountry: [''],
        currency: ['ILS'],
        bankAccountHolderName: ['David Cohen']
      })
    });

    return {
      props: {
        ...args,
        payerForm,
        displayCountryName: (code: string) => code === 'IL' ? 'Israel' : code
      },
    };
  },
};

// Confirmed Summary View
export const ConfirmedSummary: Story = {
  ...baseStory,
  args: {
    ...baseStory.args,
    isSummaryConfirmed: true,
  },
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['1'],
        currency: ['USD']
      }),
      payerAccountDetail: new FormBuilder().group({
        entityType: ['1'],
        bankCountry: ['US'],
        payerCountry: ['US'],
        unionCountry: [''],
        currency: ['USD'],
        bankAccountHolderName: ['Global Trade Inc.']
      })
    });

    return {
      props: {
        ...args,
        payerForm,
        displayCountryName: (code: string) => code === 'US' ? 'United States' : code
      },
    };
  },
};