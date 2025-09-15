import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NewBenificiaryUploadFileComponent } from './new-benificiary-upload-file.component';

import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'Contacts/Beneficiary/Step 1: Upload Invoice Steps/Upload Invoice(OCR)',
  component: NewBenificiaryUploadFileComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        NgxDropzoneModule,
        MatProgressBarModule,
        MatDialogModule,
        HttpClientModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => console.log('Dialog closed'),
          },
        },
      ],
    }),
  ],
} as Meta<NewBenificiaryUploadFileComponent>;

// --------------------
// Default Story
// --------------------
type Story = StoryObj<NewBenificiaryUploadFileComponent>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args },
  }),
  args: {
    formStepper: { selectedIndex: 0, steps: [{}, {}, {}] },
    formStepperProgress: { value: 25 },
    payment: {},
    benificiaryForm: {},
    newBenificiaryStepper: { selectedIndex: 0, steps: [{}, {}, {}] },
  },
};

// --------------------
// WithPreview (file uploaded)
// --------------------
export const WithPreview: Story = {
  render: (args) => ({
    props: {
      ...args,
      files: [
        new File(['dummy content'], 'invoice.pdf', { type: 'application/pdf' }),
      ],
      uploadProgress: 100,
      isFileExist: true,
    },
  }),
  args: {
    formStepper: { selectedIndex: 0, steps: [{}, {}, {}] },
    formStepperProgress: { value: 50 },
    payment: {},
    benificiaryForm: {},
    newBenificiaryStepper: { selectedIndex: 0, steps: [{}, {}, {}] },
  },
};

export const UploadError: Story = {
  render: (args) => ({
    props: {
      ...args,
      files: [
        new File(['dummy content'], 'invoice.pdf', { type: 'application/pdf' }),
      ],
      uploadProgress: 40,  // mid-progress to show the error state
      fileUploadError: 'Failed to upload file. Please try again.',
      cancelUpload: false,
    },
  }),
  args: {
    formStepper: { selectedIndex: 0, steps: [{}, {}, {}] },
    formStepperProgress: { value: 25 },
    payment: {},
    benificiaryForm: {},
    newBenificiaryStepper: { selectedIndex: 0, steps: [{}, {}, {}] },
  },
};
