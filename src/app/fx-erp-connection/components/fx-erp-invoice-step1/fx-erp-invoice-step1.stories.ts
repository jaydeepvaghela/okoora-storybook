import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep1Component } from './fx-erp-invoice-step1.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Invoice Rules Steps/Invoice Step 1',
  component: FxErpInvoiceStep1Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FxErpInvoiceStep1Component>;

const mockStepper = {
  selectedIndex: 0,
};

export const Default: StoryObj<FxErpInvoiceStep1Component> = {
  args: {
    stepper: mockStepper as any,
  },
};
