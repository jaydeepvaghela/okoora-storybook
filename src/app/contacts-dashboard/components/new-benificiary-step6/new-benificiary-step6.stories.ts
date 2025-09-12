import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { of, BehaviorSubject } from 'rxjs';

import { NewBenificiaryStep6Component } from './new-benificiary-step6.component';

// Mock services with BehaviorSubjects to ensure proper subscription behavior
const mockContactsService = {
  currentObjectForFile: new BehaviorSubject({}),
  getBankDetailssummaryControls: new BehaviorSubject(['iban', 'swiftCode', 'bankName', 'accountNumber', 'bankAccountHolderName', 'beneficiaryIdNumber', 'firstName', 'lastName']),
  selectedPaymentReasonName: new BehaviorSubject('Business Payment'),
  getIlsBankBranchCode: new BehaviorSubject({ ilsBankNumberExist: 'Test Bank', ilsBranchNumberExist: 'Test Branch' }),
  isBeneficiarySummaryInit: { next: () => {} },
  closeAllDialog: () => {},
  setNewBeniStepperIndexFromSummary: () => {},
  createSinglePaymentFromBeneficiaryStep6: () => {},
  isRedirectToPayerList: { next: () => {} },
  isNewBenificiaryconfirmClicked: { next: () => {} },
  isCreateBeneficiaryFromLastStep: { next: () => {} },
  setBeneficiaryDataForEdit: () => {},
  getAllBeneficieryByAccount: () => of([]),
  addBenificieryAccount: () => of({ body: { id: '123' } }),
  uploadBeneficiaryFile: () => of({}),
  getBeneficiaryById: () => of({ status: 2 }),
  changeBeneficiaryStatus: () => of({})
};

const mockRouter = {
  navigate: () => Promise.resolve(true),
  url: '/beneficiaries'
};

const mockTranslateService = {
  instant: (key: string) => key
};

// Create form groups using FormBuilder
const createMockForms = () => {
  const fb = new FormBuilder();
  
  const newBenificiaryStep2 = fb.group({
    beneficiaryAccountType: '2',
    beneficiaryCountry: 'us',
    bankCountry: 'us',
    currency: 'USD'
  });

  const newBenificiaryBankDetails = fb.group({
    iban: 'GB82WEST12345698765432',
    swiftCode: 'ABCDUS33',
    bankName: 'Chase Bank',
    accountNumber: '1234567890',
    bankAccountHolderName: 'John Doe',
    bankAccountHolderNickname: 'Johnny',
    bankAccountHolderEmail: 'john.doe@example.com',
    beneficiaryIdNumber: '123456789',
    firstName: 'John',
    lastName: 'Doe',
    beneficiaryCity: 'New York',
    beneficiaryState: 'NY',
    beneficiaryStreet: '123 Main St',
    beneficiaryHouseNumber: '123',
    beneficiaryZipCode: '10001',
    bankNumber: '001',
    bankBranch: '001',
    routingCodeType: 6, // ABA
    routingCodeValue: '123456789'
  });

  const uploadFile = fb.group({
    file: fb.array([
      fb.group({
        fileName: 'document.pdf',
        docType: 'ID'
      })
    ])
  });

  const transactions = fb.group({
    paymentReason: 'business',
    reasonDesc: 'Payment for services'
  });

  return { newBenificiaryStep2, newBenificiaryBankDetails, uploadFile, transactions };
};

const countryList = [
  { countryCode: 'us', countryName: 'United States' },
  { countryCode: 'gb', countryName: 'United Kingdom' },
  { countryCode: 'il', countryName: 'Israel' },
  { countryCode: 'ca', countryName: 'Canada' }
];

// Bank details array as specified
const bankDetailsArr = [
  {
    "label": "BIC / SWIFT",
    "value": "SULCUS62"
  },
  {
    "label": "Bank name",
    "value": "INCAPITAL LLC"
  },
  {
    "label": "Account number",
    "value": "001234567890"
  },
  {
    "label": "Bank account holder's name",
    "value": "Emily Grace Thompson"
  },
  {
    "label": "Beneficiary's nickname",
    "value": "Emmy"
  },
  {
    "label": "ABA",
    "value": "021000021"
  },
  {
    "label": "Beneficiary's email address",
    "value": "emmy@yopmail.com"
  },
  {
    "label": "State / Province",
    "value": "California"
  },
  {
    "label": "City",
    "value": "Los Angeles"
  },
  {
    "label": "Street",
    "value": "Broadway"
  },
  {
    "label": "House number",
    "value": "30"
  },
  {
    "label": "Zip code",
    "value": "90210"
  }
];

const meta: Meta<NewBenificiaryStep6Component> = {
  title: 'Contacts/Beneficiary/Step 6: Review & Confirm',
  component: NewBenificiaryStep6Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: 'ContactsService', useValue: mockContactsService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    })
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for reviewing and confirming beneficiary details in the final step of beneficiary creation.'
      }
    }
  },
  argTypes: {
    stepIndex: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Current step index in the beneficiary creation process'
    },
    isNonIsraeliUser: {
      control: 'boolean',
      description: 'Flag indicating if the user is non-Israeli'
    },
    iseditBenificiary: {
      control: 'boolean',
      description: 'Flag indicating if this is an edit operation'
    },
    isPayCmarix: {
      control: 'boolean',
      description: 'Flag indicating if the Pay Cmarix dialog should be shown'
    },
    isReviewCmarix: {
      control: 'boolean',
      description: 'Flag indicating if the beneficiary is in review state'
    },
    stepChanged: { action: 'stepChanged' },
    movePreviousStep: { action: 'movePreviousStep' },
    uploadFileFormValues: { action: 'uploadFileFormValues' }
  }
};

export default meta;
type Story = StoryObj<NewBenificiaryStep6Component>;

export const Default: Story = {
  args: {
    stepIndex: 6,
    isNonIsraeliUser: false,
    iseditBenificiary: false,
    countryList,
    uploadFileFormStep5Values: {},
    editBenificiaryObj: null,
    transactions: null,
    newBenificiaryStep2Values: {},
    bankDetailsArr, // Add the bank details array here
  },
  render: (args) => {
    const fb = new FormBuilder();
    const newBenificiaryStep2 = fb.group({
      beneficiaryAccountType: '2',
      beneficiaryCountry: 'us',
      bankCountry: 'us',
      currency: 'USD'
    });
    const newBenificiaryBankDetails = fb.group({
      iban: 'GB82WEST12345698765432',
      swiftCode: 'SULCUS62',
      bankName: 'INCAPITAL LLC',
      accountNumber: '001234567890',
      bankAccountHolderName: 'Emily Grace Thompson',
      bankAccountHolderEmail: 'emmy@yopmail.com',
      firstName: 'Emily Grace',
      lastName: 'Thompson',
      beneficiaryCity: 'Los Angeles',
      beneficiaryState: 'California',
      beneficiaryStreet: 'Broadway',
      beneficiaryHouseNumber: '30',
      beneficiaryZipCode: '90210',
      bankNumber: '001',
      bankBranch: '001',
      routingCodeType: 6, // ABA
      routingCodeValue: '021000021'
    });
    const uploadFile = fb.group({
      file: fb.array([
        fb.group({
          fileName: 'document.pdf',
          docType: 'ID'
        })
      ])
    });
    const transactions = fb.group({
      paymentReason: 'Import of goods not including books',
      reasonDesc: 'Payment for services' 
    });
    return {
      props: {
        ...args,
        newBenificiaryStep2,
        newBenificiaryBankDetails,
        uploadFile,
        transactions,
        bankDetailsArr: args.bankDetailsArr, // Ensure bankDetailsArr is passed to the component
        selectedPaymentReasonName: 'Import of goods not including books',
        reasonDesc: 'Payment for services'
      }
    };
  },
  play: async ({ canvasElement, args }) => {
    setTimeout(() => {
      mockContactsService.selectedPaymentReasonName.next('Import of goods not including books');
      mockContactsService.getBankDetailssummaryControls.next([
        'swiftCode', 'bankName', 'accountNumber', 'bankAccountHolderName',
        'bankAccountHolderEmail', 'firstName', 'lastName', 'beneficiaryState',
        'beneficiaryCity', 'beneficiaryStreet', 'beneficiaryHouseNumber', 'beneficiaryZipCode', 'iban'
      ]);
      mockContactsService.currentObjectForFile.next({
        id: '123',
        saveBeneficiaryRes: {},
        fileArray: []
      });
    }, 100);
  }
};

// Story for Pay Cmarix Success State (Israeli User)
export const PayBeneficiarySuccess: Story = {
  args: {
    stepIndex: 6,
    isNonIsraeliUser: false,
    iseditBenificiary: false,
    countryList,
    uploadFileFormStep5Values: {},
    editBenificiaryObj: null,
    transactions: null,
    newBenificiaryStep2Values: {},
    bankDetailsArr,
    isPayCmarix: true,
    isReviewCmarix: false,
  },
  render: (args) => {
    const fb = new FormBuilder();
    const newBenificiaryStep2 = fb.group({
      beneficiaryAccountType: '2',
      beneficiaryCountry: 'us',
      bankCountry: 'us',
      currency: 'USD'
    });
    const newBenificiaryBankDetails = fb.group({
      iban: 'GB82WEST12345698765432',
      swiftCode: 'SULCUS62',
      bankName: 'INCAPITAL LLC',
      accountNumber: '001234567890',
      bankAccountHolderName: 'Emily Grace Thompson',
      bankAccountHolderEmail: 'emmy@yopmail.com',
      firstName: 'Emily Grace',
      lastName: 'Thompson',
      beneficiaryCity: 'Los Angeles',
      beneficiaryState: 'California',
      beneficiaryStreet: 'Broadway',
      beneficiaryHouseNumber: '30',
      beneficiaryZipCode: '90210',
      bankNumber: '001',
      bankBranch: '001',
      routingCodeType: 6,
      routingCodeValue: '021000021'
    });
    const uploadFile = fb.group({
      file: fb.array([
        fb.group({
          fileName: 'document.pdf',
          docType: 'ID'
        })
      ])
    });
    const transactions = fb.group({
      paymentReason: 'Import of goods not including books',
      reasonDesc: 'Payment for services' 
    });
    return {
      props: {
        ...args,
        newBenificiaryStep2,
        newBenificiaryBankDetails,
        uploadFile,
        transactions,
        bankDetailsArr: args.bankDetailsArr,
        selectedPaymentReasonName: 'Import of goods not including books',
        reasonDesc: 'Payment for services',
        reviewCmarix: () => console.log('Pay button clicked'),
        navigateToContactPage: () => console.log('View beneficiaries list clicked'),
        createNewBenificiary: () => console.log('Add new beneficiary clicked')
      }
    };
  }
};

// Story for Pay Cmarix Review State (Israeli User)
export const PayBeneficiaryReview: Story = {
  args: {
    stepIndex: 6,
    isNonIsraeliUser: false,
    iseditBenificiary: false,
    countryList,
    uploadFileFormStep5Values: {},
    editBenificiaryObj: null,
    transactions: null,
    newBenificiaryStep2Values: {},
    bankDetailsArr,
    isPayCmarix: true,
    isReviewCmarix: true,
  },
  render: (args) => {
    const fb = new FormBuilder();
    const newBenificiaryStep2 = fb.group({
      beneficiaryAccountType: '2',
      beneficiaryCountry: 'us',
      bankCountry: 'us',
      currency: 'USD'
    });
    const newBenificiaryBankDetails = fb.group({
      iban: 'GB82WEST12345698765432',
      swiftCode: 'SULCUS62',
      bankName: 'INCAPITAL LLC',
      accountNumber: '001234567890',
      bankAccountHolderName: 'Emily Grace Thompson',
      bankAccountHolderEmail: 'emmy@yopmail.com',
      firstName: 'Emily Grace',
      lastName: 'Thompson',
      beneficiaryCity: 'Los Angeles',
      beneficiaryState: 'California',
      beneficiaryStreet: 'Broadway',
      beneficiaryHouseNumber: '30',
      beneficiaryZipCode: '90210',
      bankNumber: '001',
      bankBranch: '001',
      routingCodeType: 6,
      routingCodeValue: '021000021'
    });
    const uploadFile = fb.group({
      file: fb.array([
        fb.group({
          fileName: 'document.pdf',
          docType: 'ID'
        })
      ])
    });
    const transactions = fb.group({
      paymentReason: 'Import of goods not including books',
      reasonDesc: 'Payment for services' 
    });
    return {
      props: {
        ...args,
        newBenificiaryStep2,
        newBenificiaryBankDetails,
        uploadFile,
        transactions,
        bankDetailsArr: args.bankDetailsArr,
        selectedPaymentReasonName: 'Import of goods not including books',
        reasonDesc: 'Payment for services',
        navigateToContactPage: () => console.log('View beneficiaries list clicked'),
        createNewBenificiary: () => console.log('Add new beneficiary clicked')
      }
    };
  }
};