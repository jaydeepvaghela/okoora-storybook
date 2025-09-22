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
  title: 'FX ERP Connection/Invoice Step 10',
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

export const Default: StoryObj<FxErpInvoiceStep10Component> = {
  args: {
    stepper: mockStepper as any,
    autoPilotForm: undefined,
    erpCustomerSuppliersList: customerSupplierList,
    walletList: [],
  },
};
