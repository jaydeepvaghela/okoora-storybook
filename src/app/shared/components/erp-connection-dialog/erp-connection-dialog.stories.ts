
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ErpConnectionDialogComponent } from './erp-connection-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Components/New Header/APIdeck Connection Dialog',
  component: ErpConnectionDialogComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatDialogModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<ErpConnectionDialogComponent>;

export const Default: StoryObj<ErpConnectionDialogComponent> = {
  args: {},
};




