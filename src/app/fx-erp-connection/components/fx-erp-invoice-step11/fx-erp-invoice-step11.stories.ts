import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep11Component } from './fx-erp-invoice-step11.component';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

export default {
  title: 'FX ERP Connection/Invoice Step 11',
  component: FxErpInvoiceStep11Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NgbTooltipModule, FormsModule, MatCheckboxModule],
    }),
  ],
} as Meta<FxErpInvoiceStep11Component>;

const mockStepper = {
  selectedIndex: 11,
};

export const Default: StoryObj<FxErpInvoiceStep11Component> = {
  args: {
    stepper: mockStepper as any,
    walletList: [{ currency: { code: 'USD' } }, { currency: { code: 'ILS' } }],
  },
};
