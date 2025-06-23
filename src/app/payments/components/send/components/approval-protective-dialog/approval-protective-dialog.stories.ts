import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ApprovalProtectiveDialogComponent } from './approval-protective-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountdownModule } from 'ngx-countdown';
import { CommonModule } from '@angular/common';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';

class MockWalletsService {
}

const meta: Meta<ApprovalProtectiveDialogComponent> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 4 - Choose Rate/Approval Protection Popup',
  component: ApprovalProtectiveDialogComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatDialogModule,
        MatCheckboxModule,
        CountdownModule
      ],
      providers: [
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: MatDialogRef, useValue: { close: (val?: any) => console.log('Dialog closed with:', val) } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            time: 60,
            strategyId: 101,
            futurePaymentCreateResponse: {
              requestId: 'abc-123',
              futurePayment: [
                {
                  strategyId: 101,
                  product: {
                    expiryDate: '21/07/2025',
                    amount: 500,
                    currency: { code: 'USD' }
                  },
                  sellAmount: 1200,
                  strike: 3.8,
                  cost: 45
                }
              ]
            },
            transaction: {
              id: 987,
              amount: 500
            }
          }
        }
      ]
    })
  ],
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<ApprovalProtectiveDialogComponent>;

export const Default: Story = {
  name: 'Default Dialog View'
};
