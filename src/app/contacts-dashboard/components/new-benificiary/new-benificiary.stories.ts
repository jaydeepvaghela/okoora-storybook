import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { NewBenificiaryComponent } from './new-benificiary.component';
import { ContactSelectionComponent } from '../contact-selection/contact-selection.component';

export default {
  title: 'Contacts/Beneficiary/Header and Stepper',
  component: NewBenificiaryComponent,
  decorators: [
    moduleMetadata({
      declarations: [NewBenificiaryComponent, ContactSelectionComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatProgressBarModule,
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
