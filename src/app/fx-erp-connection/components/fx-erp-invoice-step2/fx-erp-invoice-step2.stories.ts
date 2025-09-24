import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep2Component } from './fx-erp-invoice-step2.component';
import { CommonModule } from '@angular/common';
// import { FormGroup, FormControl } from '@angular/forms';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Invoice Rules Steps/Invoice Step 2',
  component: FxErpInvoiceStep2Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FxErpInvoiceStep2Component>;

const mockStepper = {
  selectedIndex: 1,
};

// const mockForm = new FormGroup({
//   field: new FormControl(''),
// });

export const Default: StoryObj<FxErpInvoiceStep2Component> = {
  args: {
    stepper: mockStepper as any,
  autoPilotForm: undefined,
    walletList: [{ currency: 'USD' }, { currency: 'ILS' }],
  },
};
