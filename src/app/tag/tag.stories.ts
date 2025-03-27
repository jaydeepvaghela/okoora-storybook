import { Meta, StoryObj } from '@storybook/angular';
import { TagComponent } from './tag.component';

const meta: Meta<TagComponent> = {
  title: 'Components/Tag',
  component: TagComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    state: { control: 'radio', options: ['inactive', 'active', 'removable', 'deactivated'] },
    removable: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<TagComponent>;

export const Default: Story = {
  args: {
    size: "small",
    state: "inactive",
    removable: true,
    label: "Label"
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    state: "active",
    removable: true,
    label: "Label"
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    state: "removable",
    removable: true
  },
};

export const Large: Story = {
  args: { size: 'large', state: 'removable', removable: true },
};

export const Deactivated: Story = {
  args: {
    size: 'medium',
    state: 'deactivated',
    removable: true
  },
};
