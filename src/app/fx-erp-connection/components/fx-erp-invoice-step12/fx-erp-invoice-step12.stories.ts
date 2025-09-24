import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep12Component } from './fx-erp-invoice-step12.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'FX ERP Connection/Invoice Step 12',
  component: FxErpInvoiceStep12Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FxErpInvoiceStep12Component>;

export const Default: StoryObj<FxErpInvoiceStep12Component> = {
  args: {},
};
