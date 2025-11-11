import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ContactsService } from '../../services/contacts.service';
import { PayerService } from '../../services/payer.service';
import { NewPayerStepThreeComponent } from './new-payer-step-three.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export default {
  title: 'Contacts/Payer/Step Three',
  component: NewPayerStepThreeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        NgbTooltipModule,
        NgxDropzoneModule,
        MatDialogModule,
        HttpClientModule,
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
      ],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<NewPayerStepThreeComponent>;

type Story = StoryObj<NewPayerStepThreeComponent>;

const createUploadFileForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    file: fb.array([]),
    beneficiaryStateResidenceRecipient: ['']
  });
};

const createPayerAccountDetailForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    foundsSourceDetails: ['']
  });
};

// Base story configuration
const baseStory: Story = {
  args: {
    editPayer: false,
    editPayerObj: null,
    stepIndex: 2,
  },
  parameters: {
    translationConfig: {
      defaultLanguage: 'en',
      translationStrings: {
        'FORMS_ERRORS.fileSizeExceedsForUpload': 'File size exceeds the maximum limit of 5MB',
        'FORMS_ERRORS.fileNotSupported': 'File type not supported',
      }
    }
  }
};

// My Accounts - Document Upload with Invoice & Tax Authority
export const MyAccountsDocuments: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['2'], // My accounts
      }),
    });

    const uploadFileForm = createUploadFileForm();
    const payerAccountDetail = createPayerAccountDetailForm();

    return {
      props: {
        ...args,
        payerForm,
        uploadFileForm,
        payerAccountDetail,
        selectedPaymentReason: '2',
        beneficiaryObjectForFilelength: [1, 4], // 1: Invoice, 4: Tax Authority Document
        fileArray: [],
        uploadedfile: [],
        uploadProgressArray: [],
        fileUploadErrors: [],
        cancelUpload: [],
        NewPayerDocTypeName: {
          1: 'Invoice',
          4: 'Tax Authority Document'
        },
      },
    };
  },
};

// Invoice Upload Success
export const SuccessfulDocumentUpload: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['1'], // Export goods
      }),
    });

    const uploadFileForm = createUploadFileForm();
    const payerAccountDetail = createPayerAccountDetailForm();

    // Simulate uploaded file
    const mockFile = new File([], 'invoice.pdf', { type: 'application/pdf' });
    
    return {
      props: {
        ...args,
        payerForm,
        uploadFileForm,
        payerAccountDetail,
        selectedPaymentReason: '1',
        beneficiaryObjectForFilelength: [],
        fileArray: [mockFile],
        uploadedfile: [{ type: 1 }], // Invoice type
        uploadProgressArray: [100], // 100% complete
        fileUploadErrors: [''],
        cancelUpload: [false],
        NewPayerDocTypeName: {
          1: 'Invoice',
          4: 'Tax Authority Document'
        },
      },
    };
  },
};

// Failed Upload
export const FailedDocumentUpload: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['1'],
      }),
    });

    const uploadFileForm = createUploadFileForm();
    const payerAccountDetail = createPayerAccountDetailForm();

    const mockFile = new File([], 'large_invoice.pdf', { type: 'application/pdf' });

    return {
      props: {
        ...args,
        payerForm,
        uploadFileForm,
        payerAccountDetail,
        selectedPaymentReason: '1',
        beneficiaryObjectForFilelength: [],
        fileArray: [mockFile],
        uploadedfile: [{ type: 1 }],
        uploadProgressArray: [20],
        fileUploadErrors: ['File size exceeds the maximum limit of 5MB'],
        cancelUpload: [false],
        NewPayerDocTypeName: {
          1: 'Invoice',
          4: 'Tax Authority Document'
        },
      },
    };
  },
};

// Cancelled Upload
export const CancelledUpload: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['1'],
      }),
    });

    const uploadFileForm = createUploadFileForm();
    const payerAccountDetail = createPayerAccountDetailForm();

    const mockFile = new File([], 'cancelled_invoice.pdf', { type: 'application/pdf' });

    return {
      props: {
        ...args,
        payerForm,
        uploadFileForm,
        payerAccountDetail,
        selectedPaymentReason: '1',
        beneficiaryObjectForFilelength: [],
        fileArray: [mockFile],
        uploadedfile: [{ type: 1 }],
        uploadProgressArray: [20],
        fileUploadErrors: [''],
        cancelUpload: [true],
        NewPayerDocTypeName: {
          1: 'Invoice',
          4: 'Tax Authority Document'
        },
      },
    };
  },
};

// Other Reason with Note (Notes Only)
export const OtherReasonWithNote: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['4'], // Other reason
      }),
    });

    const payerAccountDetail = createPayerAccountDetailForm();
    
    // Set note for other reason
    payerAccountDetail.patchValue({
      foundsSourceDetails: 'Payment for consulting services provided during Q3 2025.'
    });

    return {
      props: {
        ...args,
        payerForm,
        payerAccountDetail,
        selectedPaymentReason: 4
      },
    };
  },
};

// Labor/ROI Documents
export const LaborROIDocuments: Story = {
  ...baseStory,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: new FormBuilder().group({
        paymentReason: ['3'], // Labor/ROI
      }),
    });

    const uploadFileForm = createUploadFileForm();
    const payerAccountDetail = createPayerAccountDetailForm();

    return {
      props: {
        ...args,
        payerForm,
        uploadFileForm,
        payerAccountDetail,
        selectedPaymentReason: '3',
        beneficiaryObjectForFilelength: [2, 4], // 2: Investment Contract, 4: Tax Authority
        fileArray: [],
        uploadedfile: [],
        uploadProgressArray: [],
        fileUploadErrors: [],
        cancelUpload: [],
        NewPayerDocTypeName: {
          2: 'Investment Contract',
          4: 'Tax Authority Document'
        },
      },
    };
  },
};