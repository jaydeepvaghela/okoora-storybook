import { Meta, StoryObj } from '@storybook/angular';
import { EditCashflowRulesDrawerComponent } from './edit-cashflow-rules-drawer.component';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'Automation/Edit Cashflow Rules Drawer',
  component: EditCashflowRulesDrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatChipsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        // Mock services if needed
      ],
    }),
  ],
  argTypes: {
    importExosureType: {
      control: 'select',
      options: ['invoice', 'cashflow'],
      description: 'Type of exposure to display',
    },
    isPayableProtectFilled: {
      control: 'boolean',
      description: 'Whether payable protect is filled',
    },
  },
} as Meta<EditCashflowRulesDrawerComponent>;

// Mock data for currencies
const mockCurrencies = [
  {
    currency: { code: 'USD', name: 'US Dollar' },
    flag: '/images/flags/usd.svg',
  },
  {
    currency: { code: 'EUR', name: 'Euro' },
    flag: '/images/flags/eur.svg',
  },
  {
    currency: { code: 'GBP', name: 'British Pound' },
    flag: '/images/flags/gbp.svg',
  },
  {
    currency: { code: 'ILS', name: 'Israeli Shekel' },
    flag: '/images/flags/ils.svg',
  },
];

// Mock data for contacts
const mockContacts = [
  { id: '1', name: 'Vendor A', type: 'supplier' },
  { id: '2', name: 'Vendor B', type: 'supplier' },
  { id: '3', name: 'Customer X', type: 'customer' },
  { id: '4', name: 'Customer Y', type: 'customer' },
];

// Mock rules data
const mockInvoiceRules = {
  ruleType: 'Invoice',
  importExosureType: 'invoice',
  directionType: 1,
  invoiceBillCurrencies: ['USD', 'EUR'],
  invoiceBillMinExposureAmount: 1000,
  invoiceBillMaxExposureAmount: 50000,
  invoiceBillMaxDuePeriod: '1 Month',
  invoiceBillBlacklist: [
    { counterpartyId: '1', counterpartyName: 'Vendor A', counterpartyType: 'supplier' },
  ],
};

const mockCashflowRules = {
  ruleType: 'Cashflow',
  importExosureType: 'cashflow',
  directionType: 3,
  cashflowCurrencies: ['USD', 'GBP'],
  cashflowMinExposureAmount: 2000,
  cashflowMaxExposureAmount: 75000,
  cashflowMaxDuePeriod: '3 Months',
};

export const InvoiceTab: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [mockInvoiceRules],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const CashflowTab: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'cashflow',
    isPayableProtectFilled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [mockCashflowRules],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const BothTabsAvailable: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'cashflow',
    isPayableProtectFilled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [mockInvoiceRules, mockCashflowRules],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const WithValidationErrors: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [
        {
          ...mockInvoiceRules,
          invoiceBillMinExposureAmount: 60000,
          invoiceBillMaxExposureAmount: 50000,
        },
      ],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
      validationErrors: ['Maximum amount must be above or equal to minimum.'],
    },
  }),
};

export const EmptyState: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: [],
      rulesData: [],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const LoadingState: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      loading: true,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [mockInvoiceRules],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const IncomingInvoicesOnly: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [
        {
          ...mockInvoiceRules,
          directionType: 1,
        },
      ],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const BillsOnly: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [
        {
          ...mockInvoiceRules,
          directionType: 2,
        },
      ],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};

export const MultipleExcludedBeneficiaries: StoryObj<EditCashflowRulesDrawerComponent> = {
  args: {
    importExosureType: 'invoice',
    isPayableProtectFilled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      walletList: mockCurrencies,
      ERPcontactsList: mockContacts,
      rulesData: [
        {
          ...mockInvoiceRules,
          invoiceBillBlacklist: [
            { counterpartyId: '1', counterpartyName: 'Vendor A', counterpartyType: 'supplier' },
            { counterpartyId: '2', counterpartyName: 'Vendor B', counterpartyType: 'supplier' },
            { counterpartyId: '3', counterpartyName: 'Customer X', counterpartyType: 'customer' },
          ],
        },
      ],
      dueDateTypes: ['24 Hours', '7 Days', '1 Month', '3 Months'],
    },
  }),
};