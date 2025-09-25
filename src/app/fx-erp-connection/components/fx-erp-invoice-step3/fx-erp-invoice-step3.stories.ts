import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep3Component } from './fx-erp-invoice-step3.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Invoice Rules Steps/Invoice Step 3',
  component: FxErpInvoiceStep3Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FxErpInvoiceStep3Component>;

const mockStepper = {
  selectedIndex: 2,
};

export const Default: StoryObj<FxErpInvoiceStep3Component> = {
  args: {
    stepper: mockStepper as any,
  },
};
