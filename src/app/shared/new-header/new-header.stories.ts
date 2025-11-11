import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { NewHeaderComponent } from './new-header.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Components/New Header',
  component: NewHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<NewHeaderComponent>;

type Story = StoryObj<NewHeaderComponent>;

export const Default: Story = {
  argTypes: {
    connectionStatus: {
      control: { type: 'radio' , options: [1,2,3] },
      description: 'ERP connection status: 1=Connected, 2=Disconnected, 3=Unknown'
    }
  },
  args: {
    connectionStatus: 1
  },
  render: (args) => {
    const label = args.connectionStatus === 1 ? 'ERP Connected' : args.connectionStatus === 2 ? 'ERP Disconnected' : 'ERP Connection';
    return {
      props: {
        isERPConnected: args.connectionStatus,
        erpConnectionLabel: label
      },
      template: `
        <div>
          <app-new-header [hideHeaderActions]="false" [isERPConnected]="isERPConnected" [erpConnectionLabel]="erpConnectionLabel"></app-new-header>
        </div>
      `
    };
  }
};