import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NewBenificiaryComponent } from './new-benificiary.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Import other modules or services if needed

export default {
  title: 'Contacts/Beneficiary/Header and Stepper',
  component: NewBenificiaryComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatProgressBarModule,
      ],
      providers: [
        // Add any services if necessary
      ],
    }),
  ],
} as Meta<NewBenificiaryComponent>;

type Story = StoryObj<NewBenificiaryComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      formStepper: {
        steps: [{}, {}, {}, {}, {}, {}],
        selectedIndex: 0,
        next: () => console.log('Stepper next called'),
        previous: () => console.log('Stepper previous called'),
      },
      formStepperProgress: {
        value: 0,
      },
    },
  }),
  args: {
    iseditBenificiary: false,
    showProgressAndCurrencyTitle: true,
    summaryPageInit: false,
    isNonIsraeliUser: false,
    countryList: [],
    currencyData: [],
    paymentReasons: [],
  },
};
