import { Meta, StoryObj } from '@storybook/angular';
import { OpenInvoicesBoxComponent } from './open-invoices-box.component';

const meta: Meta<OpenInvoicesBoxComponent> = {
  title: 'Main Dashboard/Second Row Cards/2. Open Invoice Box',
  component: OpenInvoicesBoxComponent,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<OpenInvoicesBoxComponent>;

export const Default: Story = {
  args: {
    dashboardpanelData: {
      openInvoices: 7,
      invoicesAtRisk: 2,
      invoicesAtOpportunity: 3,
    },
  },
};

export const NoInvoices: Story = {
  args: {
    dashboardpanelData: {
      openInvoices: 0,
      invoicesAtRisk: 0,
      invoicesAtOpportunity: 0,
    },
  },
};
