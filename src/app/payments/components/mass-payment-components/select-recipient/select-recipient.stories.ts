import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SelectRecipientComponent } from './select-recipient.component';

export default {
  title: 'Main Dashboard/Dialogs/Select Recipient',
  component: SelectRecipientComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (result?: any) => {
              console.log('Dialog closed with result:', result);
            },
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            approvedBeneficiaries: [
              {
                id: 1,
                bankAccountHolderName: 'Alice Johnson',
                currency: 'USD',
                accountNumber: '12345678',
                beneficiaryIdNumber: 'ID001',
              },
              {
                id: 2,
                bankAccountHolderName: 'Bob Smith',
                currency: 'EUR',
                accountNumber: '87654321',
                beneficiaryIdNumber: 'ID002',
              },
            ],
            selectedBeneficiaries: [],
          },
        },
      ],
    }),
  ],
} as Meta<SelectRecipientComponent>;

type Story = StoryObj<SelectRecipientComponent>;

export const Default: Story = {
  args: {},
};
