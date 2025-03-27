import { Meta, StoryObj } from '@storybook/angular';
import { SidebarComponent } from './sidebar.component';

const meta: Meta<SidebarComponent> = {
  title: 'Components/Sidebar',
  component: SidebarComponent,
};

export default meta;

type Story = StoryObj<SidebarComponent>;

export const Default: Story = {};
