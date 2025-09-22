import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep7Component } from './fx-erp-invoice-step7.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

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

const mockForm = { InvoiceBillCurrencies: [] } as any;

export const Default: StoryObj<FxErpInvoiceStep7Component> = {
  args: {
    stepper: mockStepper as any,
    autoPilotForm: mockForm,
    walletList: [
      { wallet_Currency: { code: 'USD', flag: 'images/flags/us.svg' } },
      { wallet_Currency: { code: 'ILS', flag: 'images/flags/il.svg' } },
      { wallet_Currency: { code: 'EUR', flag: 'images/flags/eu.svg' } },
      { wallet_Currency: { code: 'GBP', flag: 'images/flags/gb.svg' } }
    ],
  },
};
