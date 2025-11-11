import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ConnectorMissingComponentComponent } from './connector-missing-component.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConnectorService } from '../../connector.service';

// Mock services
class MockCommonService {
  triggerHeaderMethod() {
    console.log('Header method triggered');
  }
}

class MockConnectorService {
  setFromConnector(value: boolean) {
    console.log('setFromConnector called with:', value);
  }
  
  passCollateraltoAddMoney(amount: number) {
    console.log('passCollateraltoAddMoney called with amount:', amount);
  }
}

class MockMatDialog {
  closeAll() {
    console.log('All dialogs closed');
  }
}

export default {
  title: 'FX DASHBOARD/Auto-pilot Functionality/Invoice Rules Steps/Missing Funds',
  component: ConnectorMissingComponentComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatDialogModule,
        CommonModule
      ],
      providers: [
       
        { provide: ConnectorService, useClass: MockConnectorService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    }),
  ],
  parameters: {
    layout: 'centered',
  }
} as Meta<ConnectorMissingComponentComponent>;

// Mock data for different scenarios
const defaultMissingFundsData = {
  missingCollateralAmount: 4940.00,
  collateralCurrencySign: '$'
};


// Default Story
export const Default: StoryObj<ConnectorMissingComponentComponent> = {
  decorators: [
    moduleMetadata({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: defaultMissingFundsData }
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 450px; min-height: 400px;">
        <app-connector-missing-component></app-connector-missing-component>
      </div>
    `
  })
};









