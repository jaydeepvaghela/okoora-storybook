import { Meta, StoryObj } from '@storybook/angular';
import { CfEndpointDocComponent } from './cf-endpoint-doc.component';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'Automation/Cashflow Endpoint Documentation',
  component: CfEndpointDocComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatSelectModule,
        MatStepperModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        // Mock MatStepper if needed for navigation
        {
          provide: MatStepper,
          useValue: {
            previous: () => console.log('Navigate to previous step'),
            next: () => console.log('Navigate to next step'),
          },
        },
      ],
    }),
  ],
  argTypes: {
    fromAutoPilotCashflowComplete: {
      control: 'boolean',
      description: 'Whether component is accessed from auto-pilot cashflow completion flow',
    },
    showClientsId: {
      control: 'boolean',
      description: 'Toggle to show/hide Client ID',
    },
    showClientSecret: {
      control: 'boolean',
      description: 'Toggle to show/hide Client Secret',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'API documentation component for Cash Flow Integration endpoints, including authentication and cashflow creation.',
      },
    },
  },
} as Meta<CfEndpointDocComponent>;

type Story = StoryObj<CfEndpointDocComponent>;

// Default state showing the documentation
export const Default: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
};

// State showing credentials revealed
export const CredentialsVisible: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  play: async ({ canvasElement }) => {
    // Simulate clicking to reveal credentials
    const canvas = canvasElement;
    setTimeout(() => {
      const showButtons = canvas.querySelectorAll('.hide-show-btn');
      showButtons.forEach((btn: any) => btn.click());
    }, 500);
  },
};