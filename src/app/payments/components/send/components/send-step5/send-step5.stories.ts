import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CountdownModule } from 'ngx-countdown';
import { of } from 'rxjs';

import { SendStep5Component } from './send-step5.component';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';

// Mock services
class MockWalletsService {
  getAllBalanceList() {
    return of([
      { currency: 'USD', balance: 1000 },
      { currency: 'EUR', balance: 2000 }
    ]);
  }
}

class MockMatDialogRef {
  close() {}
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of('done')
    };
  }
}

const meta: Meta<SendStep5Component> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 4 - Choose Rate',
  component: SendStep5Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        CountdownModule
      ],
      providers: [
        FormBuilder,
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    })
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Step 5 in Lock Rate & Pay Later flow. This component displays the future payment options, confirmation details, and related costs before final submission.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<SendStep5Component>;

// Helper function to mock future payment data
const createFuturePaymentGroup = (fb: FormBuilder) => {
  return fb.group({
    createPaymentResponse: {
      message: 'Create Future Payment Request Successfully',
      requestId: '6ed4afc0-7fc5-44d6-bc8f-ddfe0a9c83c8',
      costList: [
        { key: '1 - regular', value: 7.68 },
        { key: '2 - our', value: 15.36 }
      ],
      futurePayment: [
        {
          strategyId: 134070,
          product: {
            amount: 22,
            currency: {
              wallet_Currency: {
                code: 'AUD',
                sign: '$',
                flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png'
              }
            },
            expiryDate: '26-06-2025',
            beneficiaryId: {
              bankAccountHolderName: 'Goha'
            }
          },
          cost: '0.00 ILS',
          feeCost: 'ILS',
          sellAmount: '73.31 ILS',
          strike: 2.2909
        },
        {
          strategyId: 134071,
          product: {
            amount: 22,
            currency: {
              wallet_Currency: {
                code: 'AUD',
                sign: '$',
                flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png'
              }
            },
            expiryDate: '26-06-2025',
            beneficiaryId: {
              bankAccountHolderName: 'Goha'
            }
          },
          cost: '0.30 ILS',
          feeCost: 'ILS',
          sellAmount: '73.31 ILS',
          strike: 2.2909
        }
      ]
    }
  });
};

export const Default: Story = {
  render: (args) => {
    const fb = new FormBuilder();

    return {
      props: {
        ...args,
        ownRateForm: fb.group({}),
        createPayment: {
          controls: {
            amount: { value: 100 },
            chargeCurrency: { value: 'EUR' }
          }
        },
        currency: 'USD',
        benificiaryId: '12345',
        paymentType: 'future_payment',
        activeWalletCurrency: { transaction: 'Test Transaction' },
        formStepper: {
          selectedIndex: 4,
          steps: [{}, {}, {}, {}, {}, {}, {}]
        },
        formStepperProgress: { value: 0 },
        futurePayment: createFuturePaymentGroup(fb)
      }
    };
  },
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Displays available future payment strategies, related costs, and confirmation details before the final payment submission.'
      }
    }
  }
};
