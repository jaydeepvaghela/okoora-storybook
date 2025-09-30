import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Component, Injectable } from '@angular/core';
import { FxConversionStep3Component } from './fx-conversion-step3.component';

// Mock enums (you'll need to adjust these based on your actual enum values)
enum RateConditionValue {
  AboveTargetRate = 'ABOVE_TARGET_RATE',
  BelowTargetRate = 'BELOW_TARGET_RATE'
}

enum RateConditionLabel {
  AboveTargetRate = 'Above Target Rate',
  BelowTargetRate = 'Below Target Rate'
}

// Mock FxDashboardService
@Injectable()
class MockFxDashboardService {
  spotRate$ = of({
    'USD': 1.2345,
    'EUR': 0.8567,
    'GBP': 0.7654,
    'JPY': 110.25
  });
}

// Mock MatStepper for the stories
@Injectable()
class MockMatStepper {
  selectedIndex = 2; // Step 3 (0-indexed)
  
  next() {
    console.log('Stepper: Moving to next step');
    this.selectedIndex++;
  }
  
  previous() {
    console.log('Stepper: Moving to previous step');
    this.selectedIndex--;
  }
}

// Wrapper component to provide proper context
@Component({
  selector: 'storybook-wrapper',
  template: `
    <div>
      <app-fx-conversion-step3 
        [stepper]="mockStepper" 
        [fxConversionForm]="fxForm"
        (currencyPairValue)="onCurrencyPairChange($event)"
        (currentSpotRateValue)="onSpotRateChange($event)">
      </app-fx-conversion-step3>
    </div>
  `,
  imports: [FxConversionStep3Component, CommonModule]
})
class StorybookWrapperComponent {
  mockStepper = new MockMatStepper();
  fxForm: FormGroup;
  currencyPair = '';
  currentSpotRate = '';

  constructor() {
    this.fxForm = new FormGroup({
      sellCurrency: new FormControl('EUR'),
      buyCurrency: new FormControl('USD'),
      hasCondition: new FormControl('', [Validators.required]),
      targetRate: new FormControl('', [Validators.required])
    });
  }

  onCurrencyPairChange(value: string) {
    this.currencyPair = value;
  }

  onSpotRateChange(value: string) {
    this.currentSpotRate = value;
  }
}

const meta: Meta<StorybookWrapperComponent> = {
  title: 'FX Dashboard/Auto-pilot Functionality/Conversion Steps/Conversion Step 3',
  component: StorybookWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatStepperModule,
        BrowserAnimationsModule,
        FxConversionStep3Component
      ],
      providers: [
        { provide: 'FxDashboardService', useClass: MockFxDashboardService }
      ]
    }),
    applicationConfig({
      providers: []
    })
  ],
  argTypes: {
    // You can add controls here if needed
  }
};

export default meta;
type Story = StoryObj<StorybookWrapperComponent>;

// Default story
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default state of the FX Conversion Step 3 component with EUR/USD currency pair.'
      }
    }
  }
};