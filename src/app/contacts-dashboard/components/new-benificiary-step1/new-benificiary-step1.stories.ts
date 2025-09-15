import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NewBenificiaryStep1Component } from './new-benificiary-step1.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContactsService } from '../../services/contacts.service';

export default {
  title: 'Contacts/Beneficiary/Step 1: Upload Invoice Steps/Informative Text',
  component: NewBenificiaryStep1Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatButtonModule,
      ],
      providers: [
        {
          provide: ContactsService,
          useValue: {
            isUploadDocClickedFromNewBeniStep1: {
              pipe: () => ({ subscribe: (fn: any) => fn(false) })
            },
            isUploadDocNewBenFileExist: {
              pipe: () => ({ subscribe: (fn: any) => fn(false) })
            },
            isUploadFileScreenNotExist: {
              pipe: () => ({ subscribe: (fn: any) => fn(false) })
            },
            isInvoiceUploadedFromFirstStep: {
              pipe: () => ({ subscribe: (fn: any) => fn(false) })
            },
            usUploadFileFromGeneralDetails: {
              next: (val: any) => console.log('usUploadFileFromGeneralDetails next:', val)
            },
            setBeneficiaryObject: (obj: any) => console.log('setBeneficiaryObject called with:', obj),
          },
        }
      ],
    }),
  ],
} as Meta<NewBenificiaryStep1Component>;

type Story = StoryObj<NewBenificiaryStep1Component>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      stepChanged: () => console.log('Step changed event emitted'),
    },
  }),
  args: {
    newBenificiaryBankDetails: {},
    iseditBenificiary: false,
    newBenificiaryStepper: {},
    stepIndex: 0,
  },
};
