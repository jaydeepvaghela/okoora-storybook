// fx-conversion-step6.stories.ts

import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FxConversionStep6Component } from './fx-conversion-step6.component';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConnectorService } from '../../../../../connector/connector.service';
import { FxDashboardService } from '../../../../../fx-dashboard/services/fx-dashboard.service';

// 🔹 Mock services
class MockConnectorService {
  roleSummaryData$ = of({
    ruleName: 'Test Rule',
    buyCurrency: 'USD',
    sellCurrency: 'EUR',
    BuyAmount: 1000,
    executionFrequency: 2,
    StartDate: new Date(),
    targetRate: 1.2,
  });
  selectedTabIndexSubject = { next: (val: any) => console.log('Tab index set to', val) };
}

class MockFxDashboardService {
  currencySignForBuySell$ = of('$');
}

// 🔹 Mock MatDialog + MatDialogRef
class MockMatDialog {
  closeAll() {
    console.log('MockMatDialog.closeAll() called');
  }
}
class MockMatDialogRef {
  close(result?: any) {
    console.log('MockMatDialogRef.close() called with:', result);
  }
}

// 🔹 Metadata
const meta: Meta<FxConversionStep6Component> = {
  title: 'FX Dashboard/Auto-pilot Functionality/Conversion Steps/Conversion Step 6',
  component: FxConversionStep6Component,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule],
      providers: [
        { provide: ConnectorService, useClass: MockConnectorService },
        { provide: FxDashboardService, useClass: MockFxDashboardService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatDialogRef, useClass: MockMatDialogRef },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<FxConversionStep6Component>;

// Utility: build form
const createForm = (fb: FormBuilder): FormGroup => {
  return fb.group({
    ruleName: ['My Test Rule'],
    buyCurrency: ['USD'],
    sellCurrency: ['EUR'],
    BuyAmount: [1000],
    SellAmount: [null],
    executionFrequency: [1],
    hasCondition: [0],
    targetRate: [1.2],
    Expiry: [null],
    StartDate: [new Date()],
    SetEndDate: [false],
  });
};

// Default story
export const Default: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    const form = createForm(fb);

    const mockStepper: Partial<MatStepper> = {
      next: () => console.log('Stepper next() called'),
      previous: () => console.log('Stepper previous() called'),
    };

    return {
      props: {
        ...args,
        fxConversionForm: form,
        stepper: mockStepper as MatStepper,
        currencyPair: 'USD/EUR',
        currentRate: '1.10',
      },
    };
  },
};
