import { Meta, StoryFn } from '@storybook/angular';
import { ButtonLinkComponent } from './button-link.component';

export default {
  title: 'Components/Button',
  component: ButtonLinkComponent,
} as Meta;

const Template: StoryFn<ButtonLinkComponent> = (args) => ({
    props: args,
  });

export const Primary = Template.bind({});
Primary.args = {
  label: 'BUTTON',
};
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Klm6pxIZSaJFiOMX5FpTul9F/@storybook/addon-designs-sample',
  },
};

