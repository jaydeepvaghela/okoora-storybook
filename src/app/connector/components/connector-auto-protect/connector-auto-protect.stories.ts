import { Meta, StoryObj } from '@storybook/angular';
import { ConnectorAutoProtectComponent } from './connector-auto-protect.component';
import { moduleMetadata } from '@storybook/angular';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export default {
  title: 'FX Dashboard/AutoPilotList/AutoProtect',
  component: ConnectorAutoProtectComponent,
  decorators: [
    moduleMetadata({
      imports: [MatDialogModule, CommonModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }),
  ],
} as Meta<ConnectorAutoProtectComponent>;


export const AutoProtectActivated: StoryObj<ConnectorAutoProtectComponent> = {
  args: {
    data: { isAutoProtectEnabled: true },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the modal for enabling auto-protect (blue button, "Auto-Protect Activated" content).',
      },
    },
  },
};

export const AutoProtectDeactivated: StoryObj<ConnectorAutoProtectComponent> = {
  args: {
    data: { isAutoProtectEnabled: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the modal for disabling auto-protect (red button, "Turn Off Auto-Protect?" content).',
      },
    },
  },
};