import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { SetAutoPilotDialogComponent } from './set-auto-pilot-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'FX Dashboard/ERP Integration/ERP Completion Dialog',
  component: SetAutoPilotDialogComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatDialogModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<SetAutoPilotDialogComponent>;

export const Default: StoryObj<SetAutoPilotDialogComponent> = {
  args: {},
};
