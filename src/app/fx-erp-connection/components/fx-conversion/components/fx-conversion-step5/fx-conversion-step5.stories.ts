// fx-conversion-step5.stories.ts

import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FxConversionStep5Component } from './fx-conversion-step5.component';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';

// 🔹 Mock ConnectorService
class MockConnectorService {
  setRoleSummaryData(data: any) {
    alert('MockConnectorService.setRoleSummaryData called with: ' + JSON.stringify(data));
  }
}

// 🔹 Storybook metadata
const meta: Meta<FxConversionStep5Component> = {
  title: 'FX Dashboard/Auto-pilot Functionality/Conversion Steps/Conversion Step 5',
  component: FxConversionStep5Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule],
      providers: [{ provide: 'ConnectorService', useClass: MockConnectorService }],
    }),
  ],
};

export default meta;
type Story = StoryObj<FxConversionStep5Component>;

// Utility: create form
const createForm = (fb: FormBuilder): FormGroup => {
  return fb.group({
    ruleName: [''], // initially empty
  });
};

// Default story
export const Default: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    const form = createForm(fb);

    // Mock stepper with simple alerts
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
