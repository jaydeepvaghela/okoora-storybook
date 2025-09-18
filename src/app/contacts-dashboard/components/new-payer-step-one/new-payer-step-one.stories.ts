import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from '../../services/contacts.service';
import { PayerService } from '../../services/payer.service';

import { NewPayerStepOneComponent } from './new-payer-step-one.component';

export default {
  title: 'Contacts/Payer/Step One',
  component: NewPayerStepOneComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgbTooltipModule,
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
} as Meta<NewPayerStepOneComponent>;

type Story = StoryObj<NewPayerStepOneComponent>;

const createPayerForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    paymentReason: ['', Validators.required],
    currency: ['', Validators.required],
    bankNumber: [''],
    bankBranch: [''],
    accountNumber: [''],
    payerAccount: [''],
  });
};

export const Default: Story = {
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: createPayerForm(),
    });

    return {
      props: {
        ...args,
        payerForm,
        formStepper: {
          steps: [{}, {}, {}, {}],
          selectedIndex: 0,
          next: () => console.log('Next clicked'),
          previous: () => console.log('Previous clicked'),
        },
        formStepperProgress: {
          value: 0,
        },
        newPayerReasonForm: payerForm.get('newPayerReasonForm'),
      },
    };
  },
  args: {
    editPayer: false,
    editPayerObj: null,
    stepIndex: 0,
  },
};

export const WithSelectedMyAccounts: Story = {
  ...Default,
  render: (args) => {
    const payerForm = new FormGroup({
      newPayerReasonForm: createPayerForm(),
    });
    const newPayerReasonForm = payerForm.get('newPayerReasonForm');

    // Create a form with initial values
    newPayerReasonForm?.setValue({
      paymentReason: '2', // My accounts
      currency: 'ILS',
      bankNumber: '',
      bankBranch: '',
      accountNumber: '',
      payerAccount: '',
    });

    // Trigger change detection
    newPayerReasonForm?.get('paymentReason')?.markAsTouched();
    newPayerReasonForm?.get('currency')?.markAsTouched();

    return {
      props: {
        ...args,
        payerForm,
        formStepper: {
          steps: [{}, {}, {}, {}],
          selectedIndex: 0,
          next: () => console.log('Next clicked'),
          previous: () => console.log('Previous clicked'),
        },
        formStepperProgress: {
          value: 0,
        },
        newPayerReasonForm: payerForm.get('newPayerReasonForm'),
      },
    };
  },
};
