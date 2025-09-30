import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FxConversionStep1Component } from './fx-conversion-step1.component';

export default {
  title: 'FX Dashboard/Auto-pilot Functionality/Conversion Steps/Conversion Step 1',
  component: FxConversionStep1Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<FxConversionStep1Component>;

export const Default: StoryObj<FxConversionStep1Component> = {
  args: {},
};