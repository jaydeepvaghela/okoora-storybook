import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { FinalDepositComponent } from './final-deposit.component';
import { ConnectorService } from '../../../connector/connector.service';

// Mock ConnectorService
class MockConnectorService {
  private fromConnector = false;
  private fromAutoPilot = false;

  setFromConnector(value: boolean) {
    this.fromConnector = value;
  }

  setFromAutoPilot(value: boolean) {
    this.fromAutoPilot = value;
  }

  consumeFromConnector(): boolean {
    const value = this.fromConnector;
    this.fromConnector = false;
    return value;
  }

  consumeFromAutoPilot(): boolean {
    const value = this.fromAutoPilot;
    this.fromAutoPilot = false;
    return value;
  }
}

// Mock Router
class MockRouter {
  navigate(commands: any[]) {
    action('Router Navigate')(commands);
    console.log('Navigation triggered to:', commands);
  }
}

const meta: Meta<FinalDepositComponent> = {
  title: 'Deposit Flow/Deposit Components/Final Deposit',
  component: FinalDepositComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      providers: [
        { provide: ConnectorService, useClass: MockConnectorService },
        { provide: Router, useClass: MockRouter }
      ]
    }),
    applicationConfig({
      providers: [provideAnimations()]
    })
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A success confirmation component displayed after a deposit request is completed. Shows important reminders about balance update timings and transfer processing.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<FinalDepositComponent>;

// Default story - Standard Success
export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      onCloseClick: action('Close Clicked')
    }
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default success screen after deposit request is sent.'
      }
    }
  }
};


