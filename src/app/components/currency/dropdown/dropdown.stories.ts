import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropdownComponent } from './dropdown.component';
import { FormsModule } from '@angular/forms';

export default {
  title: 'Components/Dropdown',
  component: DropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [MatSelectModule, MatFormFieldModule,FormsModule],
    }),
  ],
  argTypes: {
    selectedValue: { control: 'text' },
    disabled: { control: 'boolean' },
    options: { control: 'object' },
  },
} as Meta<DropdownComponent>;

export const Default: StoryObj<DropdownComponent> = {
  args: {
    selectedValue: "",
    disabled: false,
    options: [
      { flag: 'flags/us.svg', label: 'USD', description: 'United States Dollar', value: 'USD' },
      { flag: 'flags/gb.svg', label: 'GBP', description: 'British Pound Sterling', value: 'GBP' },
      { flag: 'flags/ch.svg', label: 'CHF', description: 'Swiss Franc', value: 'CHF' },
      { flag: 'flags/jp.svg', label: 'JPY', description: 'Japanese Yen', value: 'JPY' },
    ],
  },
};
