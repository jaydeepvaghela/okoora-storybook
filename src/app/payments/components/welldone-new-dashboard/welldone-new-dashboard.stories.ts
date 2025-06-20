import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { WelldoneNewDashboardComponent } from './welldone-new-dashboard.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const meta: Meta<WelldoneNewDashboardComponent> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 4 - Your Own Rate/Approval Protection Popup/Completion',
  component: WelldoneNewDashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatDialogModule],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/main-dashboard',
            navigate: (commands: any[]) => {
              console.log('Mock router.navigate called with:', commands);
            }
          }
        },
        {
          provide: MatDialog,
          useValue: {
            closeAll: () => console.log('Mock dialog closed')
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            message: true,
            transaction: {
              id: 123,
              amount: 450
            }
          }
        }
      ]
    })
  ],
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<WelldoneNewDashboardComponent>;

export const Completion: Story = {
  name: 'Lock & Rate Completion'
};
