import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep8Component } from './fx-erp-invoice-step8.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Invoice Rules Steps/Invoice Step 8',
  component: FxErpInvoiceStep8Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, MatSliderModule, MatInputModule],
    }),
  ],
} as Meta<FxErpInvoiceStep8Component>;

const mockStepper = {
  selectedIndex: 7,
};

const mockForm = new FormGroup({
  InvoiceBillMinExposureAmount: new FormControl(1),
  InvoiceBillMaxExposureAmount: new FormControl(100000),
});

export const Default: StoryObj<FxErpInvoiceStep8Component> = {
  args: {
    stepper: mockStepper as any,
    autoPilotForm: mockForm,
  },
  parameters: {
    controls: {
      exclude: ['autoPilotForm'],
    },
  },
};
