import { Meta, StoryObj } from '@storybook/angular';
import { TransferTypeComponent } from './transfer-type.component';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

const mockOptions = [
  { key: '1 - regular', value: 2.5 },
  { key: '2 - our', value: 5.0 },
  { key: '4 - PaymentOnBehalf', value: 3.75 },
  { key: '5 - FastPayment', value: 6.99 },
];

const createForm = () =>
  new FormGroup({
    costType: new FormControl(mockOptions[0])
  });

const meta: Meta<TransferTypeComponent> = {
  title: 'Payments/Payment Dashboard/Payments/Mass Payment/Recipient Table/Transfer Types',
  component: TransferTypeComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, ReactiveFormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<TransferTypeComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      form: createForm(),
      options: mockOptions,
      selectedWallet: {
        wallet_Currency: {
          sign: '$',
          code: 'USD'
        }
      }
    },
  }),
};
