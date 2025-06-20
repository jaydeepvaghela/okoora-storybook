// signature.component.stories.ts

import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { SignatureComponent } from './signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';

class MockWalletsService {
}

const meta: Meta<SignatureComponent> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 3 - Lock Rate/Signature Popup',
  component: SignatureComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CommonModule,
        SignaturePadModule,
        MatDialogModule
      ],
      providers: [
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: MatDialogRef, useValue: { close: (data?: any) => console.log('Dialog closed with', data) } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
  ]
};

export default meta;

type Story = StoryObj<SignatureComponent>;

export const Default: Story = {
  name: 'Default Signature Pad',
  args: {
    data: {
      drawCompleteFn: (dataUrl: string) => {
        console.log('Signature captured (base64):', dataUrl);
      }
    }
  }
};
