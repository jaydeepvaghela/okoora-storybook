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

// State when accessed from auto-pilot flow (hides back button)
export const FromAutoPilotFlow: Story = {
  args: {
    fromAutoPilotCashflowComplete: true,
  },
};

// Story focusing on Authentication section
export const AuthenticationSection: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused view of the Authentication API documentation section.',
      },
    },
  },
};

// Story focusing on Cashflow section
export const CashflowSection: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused view of the Create Cashflow API documentation section.',
      },
    },
  },
};

// Story showing interaction states
export const InteractiveDemo: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing copy functionality and credential visibility toggles.',
      },
    },
  },
};

// Story with custom client credentials
export const CustomCredentials: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  render: (args) => ({
    props: {
      ...args,
      clientsId: 'custom-client-id-12345',
      clientSecret: 'custom-secret-67890',
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Example with custom client credentials for testing different ID lengths.',
      },
    },
  },
};

// Mobile viewport story

// Tablet viewport story

// Story showing all possible cashflow types



// Story showing error states (if applicable)
export const WithErrorStates: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the various error response codes and messages that can be returned by the APIs.',
      },
    },
  },
};

// Story showing successful responses
export const SuccessfulResponses: Story = {
  args: {
    fromAutoPilotCashflowComplete: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Highlights the successful response formats for both Authentication and Cashflow APIs.',
      },
    },
  },
};

// Dark mode variant (if supported)


// Accessibility focused story
