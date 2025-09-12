import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ContactSelectionComponent } from './contact-selection.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { ContactsService } from '../../services/contacts.service';

export default {
  title: 'Contacts/Contact Selection',
  component: ContactSelectionComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatStepperModule,
      ],
      providers: [
        ContactsService 
      ],
    }),
  ],
} as Meta<ContactSelectionComponent>;

type Story = StoryObj<ContactSelectionComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      type: new FormGroup({
        ContactType: new FormControl('beniciary')
      }),
      formStepper: {
        steps: [{}, {}, {}],
        selectedIndex: 0,
        next: () => console.log('Stepper next called'),
      },
      formStepperProgress: {
        value: 0
      }
    },
  }),
  args: {
    addNewAccount: false,
    isUserHasCCAccount: false,
  },
};
