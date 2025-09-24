import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactsService } from '../../services/contacts.service';
import { PayerService } from '../../services/payer.service';
import { NewPayerStepTwoComponent } from './new-payer-step-two.component';
import { Countries } from '../../../main-dashboard/dashboard-data/all-currency-data';

export default {
  title: 'Contacts/Payer/Step Two',
  component: NewPayerStepTwoComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgbTooltipModule,
        MatProgressSpinnerModule
      ],
      providers: [
        ContactsService,
        PayerService,
      ],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<NewPayerStepTwoComponent>;

type Story = StoryObj<NewPayerStepTwoComponent>;

const createPayerAccountDetailForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    entityType: [''],
    currency: [''],
    bankAccountHolderName: [''],
    accountType: [''],
    bankName: [''],
    bankNumber: [''],
    bankBranch: [''],
    accountNumber: [''],
    iban: [''],
    bicSwift: [''],
    bankCountry: [''],
    unionCountry: [''],
    payerCountry: [''],
    foundsSourceDetails: ['']
  });
};

// Base story for common props
const baseStory: Story = {
  args: {
    editPayer: false,
    editPayerObj: null,
    stepIndex: 1,
    parentCountryList: Countries,
  },
};

// Business Entity with CC Account Holder
export const BusinessWithCCAccountHolder: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['2'], // My accounts
        currency: ['ILS'],
      }),
      payerAccountDetail: createPayerAccountDetailForm(),
    });

    const payerAccountDetail = payerForm.get('payerAccountDetail');
    payerAccountDetail?.patchValue({
      entityType: '1', // Business
      currency: 'ILS',
      bankAccountHolderName: 'Test Business',
      accountType: '1', // IBAN
      bankName: null,
      bankNumber: null,
      bankBranch: null,
      accountNumber: null,
      iban: null,
      bicSwift: null,
      bankCountry: 'il',
      unionCountry: 'il',
      payerCountry: null,
      foundsSourceDetails: null
    });

    return {
      props: {
        ...args,
        payerForm,
        payerAccountDetail: payerAccountDetail,
        formStepper: {
          steps: [{}, {}, {}, {}],
          selectedIndex: 1,
          next: () => console.log('Next clicked'),
          previous: () => console.log('Previous clicked'),
        },
        isCCAccountHolder: true,
      },
    };
  },
};

// Individual Entity with CC Account Holder
export const IndividualWithCCAccountHolder: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['2'], // My accounts
        currency: ['ILS'],
      }),
      payerAccountDetail: createPayerAccountDetailForm(),
    });

    const payerAccountDetail = payerForm.get('payerAccountDetail');
    payerAccountDetail?.patchValue({
      entityType: '2', // Individual
      currency: 'ILS',
      bankAccountHolderName: 'John Doe',
      accountType: '1', // IBAN
      bankName: null,
      bankNumber: null,
      bankBranch: null,
      accountNumber: null,
      iban: null,
      bicSwift: null,
      bankCountry: 'il',
      unionCountry: null,
      payerCountry: 'il',
      foundsSourceDetails: null
    });

    return {
      props: {
        ...args,
        payerForm,
        payerAccountDetail: payerAccountDetail,
        formStepper: {
          steps: [{}, {}, {}, {}],
          selectedIndex: 1,
          next: () => console.log('Next clicked'),
          previous: () => console.log('Previous clicked'),
        },
        isCCAccountHolder: true,
      },
    };
  },
};

// Business Entity without CC Account Holder
export const BusinessWithoutCCAccountHolder: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['2'], // My accounts
        currency: ['ILS'],
      }),
      payerAccountDetail: createPayerAccountDetailForm(),
    });

    const payerAccountDetail = payerForm.get('payerAccountDetail');
    payerAccountDetail?.patchValue({
      entityType: '1', // Business
      currency: 'USD',
      bankAccountHolderName: 'Test Business International',
      accountType: '2', // BIC/SWIFT
      bankName: 'International Bank',
      bankNumber: null,
      bankBranch: null,
      accountNumber: '123456789',
      iban: null,
      bicSwift: 'BOFAUS3N',
      bankCountry: 'us',
      unionCountry: 'us',
      payerCountry: null,
      foundsSourceDetails: null
    });

    return {
      props: {
        ...args,
        payerForm,
        payerAccountDetail: payerAccountDetail,
        formStepper: {
          steps: [{}, {}, {}, {}],
          selectedIndex: 1,
          next: () => console.log('Next clicked'),
          previous: () => console.log('Previous clicked'),
        },
        isCCAccountHolder: false,
      },
    };
  },
};

// Individual Entity without CC Account Holder
export const IndividualWithoutCCAccountHolder: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['2'], // My accounts
        currency: ['ILS'],
      }),
      payerAccountDetail: createPayerAccountDetailForm(),
    });

    const payerAccountDetail = payerForm.get('payerAccountDetail');
    payerAccountDetail?.patchValue({
      entityType: '2', // Individual
      currency: 'USD',
      bankAccountHolderName: 'Jane Doe',
      accountType: '2', // BIC/SWIFT
      bankName: 'International Bank',
      bankNumber: null,
      bankBranch: null,
      accountNumber: '987654321',
      iban: null,
      bicSwift: 'NWBKGB2L',
      bankCountry: 'gb',
      unionCountry: null,
      payerCountry: 'gb',
      foundsSourceDetails: null
    });

    return {
      props: {
        ...args,
        payerForm,
        payerAccountDetail: payerAccountDetail,
        formStepper: {
          steps: [{}, {}, {}, {}],
          selectedIndex: 1,
          next: () => console.log('Next clicked'),
          previous: () => console.log('Previous clicked'),
        },
        isCCAccountHolder: false,
      },
    };
  },
};