// fx-conversion-step4.stories.ts

import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FxConversionStep4Component } from './fx-conversion-step4.component';
import { MatStepper } from '@angular/material/stepper';

// 👇 Storybook metadata
const meta: Meta<FxConversionStep4Component> = {
  title: 'FX Dashboard/Auto-pilot Functionality/Conversion Steps/Conversion Step 4',
  component: FxConversionStep4Component,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<FxConversionStep4Component>;

// Utility function to build a mock FormGroup
const createForm = (fb: FormBuilder): FormGroup => {
  return fb.group({
    executionFrequency: [[]],
    StartDate: [null],
    Expiry: [null],
    SetEndDate: [false],
  });
};

// Default story
export const Default: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    const form = createForm(fb);

    // Mock MatStepper object
    const mockStepper: Partial<MatStepper> = {
      next: () => console.log('Stepper next() called'),
      previous: () => console.log('Stepper previous() called'),
    };

    return {
      props: {
        ...args,
        fxConversionForm: form,
        stepper: mockStepper as MatStepper,
      },
    };
  },
};
