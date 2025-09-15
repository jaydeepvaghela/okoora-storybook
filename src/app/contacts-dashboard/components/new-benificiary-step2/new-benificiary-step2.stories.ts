import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NewBenificiaryStep2Component } from './new-benificiary-step2.component';
import { Countries, GetAllCurrenciesForPayment } from '../../../main-dashboard/dashboard-data/all-currency-data';

export default {
  title: 'Contacts/Beneficiary/Step 2: Beneficiary Bank Details',
  component: NewBenificiaryStep2Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDialogModule,
        MatProgressBarModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => console.log('Dialog closed') },
        },
      ],
    }),
  ],
  // Exclude the form from Storybook's args table to prevent serialization
  argTypes: {
    newBenificiaryStep2: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<NewBenificiaryStep2Component>;

type Story = StoryObj<NewBenificiaryStep2Component>;

export const Default: Story = {
  render: (args) => {
    // Create the form inside the render function
    const form = new FormGroup({
      beneficiaryCountry: new FormControl('us', Validators.required),
      bankCountry: new FormControl('us', Validators.required),
      currency: new FormControl('USD', Validators.required),
      beneficiaryAccountType: new FormControl('1', Validators.required),
      IsBeneficiaryBusinessCategoryLegit: new FormControl('true'),
      bicSwift: new FormControl('SULCUS62', Validators.required),
      bankName: new FormControl('INCAPITAL LLC', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      accountHolderName: new FormControl('', Validators.required),
      aba: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      houseNumber: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required),
    });

    return {
      props: {
        ...args,
        newBenificiaryStep2: form,
        countryList: Countries,
        currencyData: GetAllCurrenciesForPayment,
        isNonIsraeliUser: false,
      },
    };
  },
  // Only include serializable args
  args: {
    isNonIsraeliUser: false,
  },
};