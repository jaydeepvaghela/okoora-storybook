import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogUploadFileComponent } from '../confirm-dialog-upload-file/confirm-dialog-upload-file.component';

export default {
  title: 'Contacts/Beneficiary/Step 1: Upload Invoice Steps/Upload Invoice(OCR)/Confirm Upload Invoice',
  component: ConfirmDialogUploadFileComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatButtonModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            message: 'Are you sure you want to cancel the upload?',
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No',
          },
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
} as Meta<ConfirmDialogUploadFileComponent>;

type Story = StoryObj<ConfirmDialogUploadFileComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
  }),
  args: {},
};
