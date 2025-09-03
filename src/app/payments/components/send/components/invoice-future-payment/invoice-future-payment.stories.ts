import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InvoiceFuturePayment } from './invoice-future-payment.component';

const meta: Meta<InvoiceFuturePayment> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 2 - Payment Info/Invoice Modal',
  component: InvoiceFuturePayment,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (result?: string) => {
              console.log('Dialog closed with result:', result);
            }
          }
        }
      ]
    })
  ]
};

export default meta;

type Story = StoryObj<InvoiceFuturePayment>;

export const Default: Story = {
  name: 'Invoice Confirmation Modal',
  render: (args) => ({
    props: {
      ...args
    }
  })
};
