import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep6Component } from './fx-erp-invoice-step6.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

export default {
  title: 'FX Dashboard/Auto-pilot Functionality/Invoice Rules Steps/Invoice Step 6',
  component: FxErpInvoiceStep6Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, MatRadioModule],
    }),
  ],
} as Meta<FxErpInvoiceStep6Component>;

const mockStepper = {
  selectedIndex: 5,
};

// const mockForm = new FormGroup({
//   invoiceType: new FormControl('Both'),
// });

export const Default: StoryObj<FxErpInvoiceStep6Component> = {
  args: {
    stepper: mockStepper as any,
    autoPilotForm: { invoiceType: 'Both' } as any,
  },
};
