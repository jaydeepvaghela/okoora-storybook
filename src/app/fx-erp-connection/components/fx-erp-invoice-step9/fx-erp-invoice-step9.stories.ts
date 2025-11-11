import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxErpInvoiceStep9Component } from './fx-erp-invoice-step9.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

export default {
  title: 'FX Dashboard/Auto-pilot Functionality/Invoice Rules Steps/Invoice Step 9',
  component: FxErpInvoiceStep9Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, MatRadioModule, NgbTooltipModule],
    }),
  ],
} as Meta<FxErpInvoiceStep9Component>;

const mockStepper = {
  selectedIndex: 8,
};

export const Default: StoryObj<FxErpInvoiceStep9Component> = {
  args: {
    stepper: mockStepper as any,
    autoPilotForm: undefined,
  },
};
