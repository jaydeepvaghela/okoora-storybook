import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { NewBenificiaryStep5Component } from './new-benificiary-step5.component';
import { ContactsService } from '../../services/contacts.service';

// Mock ContactsService
class MockContactsService {
  currentObjectForFile = of({
    id: 'mock-id',
    saveBeneficiaryRes: {
      beneficiaryName: 'John Doe',
      beneficiaryEmail: 'john@example.com'
    },
    type: [1, 2], // Mock document types
    fileArray: []
  });

  getBeneficiaryDataForEdit = of({});

  setBeneficiaryFileObject(data: any) {
    console.log('Setting beneficiary file object:', data);
  }
}

// Mock TranslateService
class MockTranslateService {
  instant(key: string): string {
    const translations: Record<string, string> = {
      'FORMS_ERRORS.fileSizeExceedsForUpload': 'File size exceeds the maximum limit of 5MB',
      'FORMS_ERRORS.fileNotSupported': 'File format not supported'
    };
    return translations[key] || key;
  }
}

// Mock payment reasons data
const mockPaymentReasons = {
  'Business Payments': [
    {
      paymentReason: 1,
      paymentReasonName: 'Goods & Services',
      documentTypes: [1, 2]
    },
    {
      paymentReason: 2,
      paymentReasonName: 'Professional Services',
      documentTypes: [1, 3]
    }
  ],
  'Personal Payments': [
    {
      paymentReason: 26,
      paymentReasonName: 'Family Support',
      documentTypes: [2, 4]
    }
  ]
};

// Mock country data
const mockCountryList = [
  {
    countryCode: 'US',
    countryName: 'United States',
    flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/us.svg'
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/gb.svg'
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/ca.svg'
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/au.svg'
  }
];

// Helper function to create form groups
function createMockForms() {
  const fb = new FormBuilder();
  
  const uploadFile = fb.group({
    file: fb.array([]),
    beneficiaryStateResidenceRecipient: ['', Validators.required],
    deductionNum: ['', Validators.required]
  });

  const benificiaryForm = fb.group({
    beneficiaryName: ['John Doe'],
    beneficiaryEmail: ['john@example.com']
  });

  const newBenificiaryBankDetails = fb.group({
    beneficiaryCity: ['New York'],
    beneficiaryState: ['NY'],
    deductionNum: ['']
  });

  const transactions = fb.group({
    paymentReason: [1]
  });

  return {
    uploadFile,
    benificiaryForm,
    newBenificiaryBankDetails,
    transactions
  };
}

const meta: Meta<NewBenificiaryStep5Component> = {
  title: 'Contacts/Beneficiary/Step 5: Upload Documents & Additional Info',
  component: NewBenificiaryStep5Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxDropzoneModule,
        MatProgressBarModule,
        MatSelectModule,
        MatDialogModule,
        NgbTooltipModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ContactsService, useClass: MockContactsService },
        { provide: TranslateService, useClass: MockTranslateService },
        FormBuilder
      ]
    })
  ],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    stepIndex: {
      control: 'number',
      description: 'Current step index in the stepper'
    },
    iseditBenificiary: {
      control: 'boolean',
      description: 'Whether component is in edit mode'
    },
    stepChanged: {
      action: 'stepChanged',
      description: 'Emitted when moving to next step'
    },
    movePreviousStep: {
      action: 'movePreviousStep',
      description: 'Emitted when moving to previous step'
    },
    uploadFileFormValues: {
      action: 'uploadFileFormValues',
      description: 'Emitted when form values change'
    }
  }
};

export default meta;
type Story = StoryObj<NewBenificiaryStep5Component>;

export const Default: Story = {
  args: {
    stepIndex: 4,
    iseditBenificiary: false,
    paymentReasons: mockPaymentReasons,
    parentCountryList: mockCountryList,
    uploadFileFormStep5Values: {},
    transcationFormStep3Values: {
      paymentReason: 1
    }
  },
  render: (args) => {
    const forms = createMockForms();
    
    return {
      props: {
        ...args,
        uploadFile: forms.uploadFile,
        benificiaryForm: forms.benificiaryForm,
        newBenificiaryBankDetails: forms.newBenificiaryBankDetails,
        transactions: forms.transactions,
        formStepper: null,
        formStepperProgress: null,
        editBenificiaryObj: null,
        newBenificiaryStep2: null
      }
    };
  }
};

export const WithTaxFields: Story = {
  args: {
    ...Default.args,
    transcationFormStep3Values: {
      paymentReason: 1 // This will trigger tax fields display
    }
  },
  render: (args) => {
    const forms = createMockForms();
    // Pre-populate tax fields
    forms.uploadFile.patchValue({
      beneficiaryStateResidenceRecipient: 'US',
      deductionNum: 'TAX123456'
    });
    
    return {
      props: {
        ...args,
        uploadFile: forms.uploadFile,
        benificiaryForm: forms.benificiaryForm,
        newBenificiaryBankDetails: forms.newBenificiaryBankDetails,
        transactions: forms.transactions,
        formStepper: null,
        formStepperProgress: null,
        editBenificiaryObj: null,
        newBenificiaryStep2: null
      }
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Story showing the component with tax residence country and withholding tax file fields visible.'
      }
    }
  }
};

export const WithValidationErrors: Story = {
  args: {
    ...Default.args,
    transcationFormStep3Values: {
      paymentReason: 1 // Requires tax fields
    }
  },
  render: (args) => {
    const forms = createMockForms();
    
    // Mark form as touched to show validation errors
    forms.uploadFile.markAllAsTouched();
    
    return {
      props: {
        ...args,
        uploadFile: forms.uploadFile,
        benificiaryForm: forms.benificiaryForm,
        newBenificiaryBankDetails: forms.newBenificiaryBankDetails,
        transactions: forms.transactions,
        formStepper: null,
        formStepperProgress: null,
        editBenificiaryObj: null,
        newBenificiaryStep2: null
      }
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Story showing the component with validation errors displayed for required fields.'
      }
    }
  }
};

export const WithUploadProgress: Story = {
  args: {
    ...Default.args
  },
  render: (args) => {
    const forms = createMockForms();
    
    return {
      props: {
        ...args,
        uploadFile: forms.uploadFile,
        benificiaryForm: forms.benificiaryForm,
        newBenificiaryBankDetails: forms.newBenificiaryBankDetails,
        transactions: forms.transactions,
        formStepper: null,
        formStepperProgress: null,
        editBenificiaryObj: null,
        newBenificiaryStep2: null,
        // Simulate files being uploaded
        fileArray: [
          new File([''], 'document1.pdf', { type: 'application/pdf' }),
          new File([''], 'document2.pdf', { type: 'application/pdf' })
        ],
        uploadProgressArray: [45, 78], // Progress percentages
        uploadedfile: [
          { type: 1 },
          { type: 2 }
        ]
      }
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Story showing the component with files being uploaded and progress bars displayed.'
      }
    }
  }
};