import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep5Component } from './fx-erp-invoice-step5.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'FX Dashboard/Auto-pilot Functionality/Invoice Rules Steps/Invoice Step 5',
  component: FxErpInvoiceStep5Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FxErpInvoiceStep5Component>;

const mockStepper = {
  selectedIndex: 4,
  next: () => {},
};

export const Default: StoryObj<FxErpInvoiceStep5Component> = {
  args: {
    stepper: mockStepper as any,
  },
};
