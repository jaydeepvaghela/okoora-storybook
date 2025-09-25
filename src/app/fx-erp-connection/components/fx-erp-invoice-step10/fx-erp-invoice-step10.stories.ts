import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep10Component } from './fx-erp-invoice-step10.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectSearchComponent } from '../../../shared/components/mat-select-search/mat-select-search.component';
import { LottieComponent } from 'ngx-lottie';
import { customerSupplierList } from '../../../fx-dashboard/components/fx-dashboard-data/customer-supplier-list';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Invoice Rules Steps/Invoice Step 10',
  component: FxErpInvoiceStep10Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatChipsModule, MatSelectSearchComponent, LottieComponent],
    }),
  ],
} as Meta<FxErpInvoiceStep10Component>;

const mockStepper = {
  selectedIndex: 10,
};

import { FormGroup, FormControl } from '@angular/forms';
import { getActiveHedgingCurrency } from '../../../fx-dashboard/components/fx-dashboard-data/active-hedging-currency';

const mockAutoPilotForm = new FormGroup({
  InvoiceBillBlacklist: new FormControl(''),
});

export const Default: StoryObj<FxErpInvoiceStep10Component> = {
  render: (args) => ({
    props: {
      ...args,
      stepper: mockStepper as any,
      autoPilotForm: mockAutoPilotForm,
      erpCustomerSuppliersList: customerSupplierList,
      walletList: getActiveHedgingCurrency,
    },
  }),
  parameters: {
    controls: {
      exclude: ['autoPilotForm'],
    },
  },
};
