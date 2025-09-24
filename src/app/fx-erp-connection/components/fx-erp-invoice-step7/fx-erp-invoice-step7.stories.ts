import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep7Component } from './fx-erp-invoice-step7.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { getActiveHedgingCurrency } from '../../../fx-dashboard/components/fx-dashboard-data/active-hedging-currency';

export default {
  title: 'FX ERP Connection/Invoice Step 7',
  component: FxErpInvoiceStep7Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatChipsModule, FormsModule],
    }),
  ],
} as Meta<FxErpInvoiceStep7Component>;

const mockStepper = {
  selectedIndex: 6,
};


const mockForm = new FormGroup({
  InvoiceBillCurrencies: new FormControl([]),
});

export const Default: StoryObj<FxErpInvoiceStep7Component> = {
  render: (args: any) => ({
    props: {
      ...args,
      stepper: mockStepper as any,
      autoPilotForm: mockForm,
    walletList: getActiveHedgingCurrency.supportedHedge,
    },
  }),
  parameters: {
    controls: {
      exclude: ['autoPilotForm'],
    },
  },
};
