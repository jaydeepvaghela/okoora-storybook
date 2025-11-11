import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalCurrencyComponent } from './local-currency.component';
import { DashboardService } from '../../main-dashboard/services/dashboard.service';
import { of } from 'rxjs';

// Mock DashboardService
class MockDashboardService {
  getSlidePosition() {
    return of(0);
  }
}

// Mock MatDialog
class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(null)
    };
  }
}

const meta: Meta<LocalCurrencyComponent> = {
  title: 'Deposit Flow/Deposit Components/Local Currency Tab',
  component: LocalCurrencyComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatDialogModule,
        NgbTooltipModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        provideNativeDateAdapter(),
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    }),
    applicationConfig({
      providers: [
        provideNativeDateAdapter()
      ]
    })
  ],
  tags: ['autodocs'],
  argTypes: {
    addMoneyScreenIndex: {
      control: { type: 'number', min: 0, max: 2 },
      description: 'Current screen index in the add money flow'
    },
    onScreenIndexChange: {
      action: 'screenIndexChanged',
      description: 'Event emitted when screen index changes'
    }
  }
};

export default meta;
type Story = StoryObj<LocalCurrencyComponent>;

// Helper function to create form
const createLocalCurrencyForm = (fb: FormBuilder, values?: any) => {
  return fb.group({
    amount: [values?.amount || ''],
    currency: [values?.currency || 'ILS'],
    depositMethod: [values?.depositMethod || ''],
    bankAccount: [values?.bankAccount || null],
    depositDate: [values?.depositDate || null],
    accountDetails: [values?.accountDetails || null]
  });
};

// Default story - Initial state (Page 1)
export const Default: Story = {
  args: {
    addMoneyScreenIndex: 0
  },
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        localCurrencyForm: createLocalCurrencyForm(fb)
      }
    };
  }
};

// Page 1 with validation errors
export const WithValidationErrors: Story = {
  args: {
    addMoneyScreenIndex: 0
  },
  render: (args) => {
    const fb = new FormBuilder();
    const component = {
      ...args,
      localCurrencyForm: createLocalCurrencyForm(fb),
      showValidationError: true
    };
    return {
      props: component
    };
  }
};

// Page 1 with deposit method selected
export const WithSelectedValue: Story = {
  args: {
    addMoneyScreenIndex: 0
  },
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        localCurrencyForm: createLocalCurrencyForm(fb, {
          amount: '10,000',
          depositMethod: '3'
        })
      }
    };
  }
};

// Page 2 - Bank selection
export const BankSelection: Story = {
  args: {
    addMoneyScreenIndex: 1
  },
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        localCurrencyForm: createLocalCurrencyForm(fb, {
          amount: '10,000',
          depositMethod: '3',
          currency: 'ILS'
        })
      }
    };
  }
};

// Page 2 with Bank Transfer requiring date
export const BankTransferWithDate: Story = {
  args: {
    addMoneyScreenIndex: 1
  },
  render: (args) => {
    const fb = new FormBuilder();
    const mockBank = {
      id: '456',
      bankName: 'Bank Leumi',
      bankNumber: '10',
      accountNumber: '789012',
      bankFlag: '../../../flags/bank-leumi.svg',
      ownAccount: 1,
      bankCountry: 'IL',
      currency: 'ILS'
    };
    return {
      props: {
        ...args,
        localCurrencyForm: createLocalCurrencyForm(fb, {
          amount: '10,000',
          depositMethod: '2', // Bank Transfer requires date
          currency: 'ILS',
          bankAccount: mockBank
        })
      }
    };
  }
};

// Page 2 complete with all fields
export const Page2Complete: Story = {
  args: {
    addMoneyScreenIndex: 1
  },
  render: (args) => {
    const fb = new FormBuilder();
    const mockBank = {
      id: '456',
      bankName: 'Bank Leumi',
      bankNumber: '10',
      accountNumber: '789012',
      bankFlag: '../../../flags/bank-leumi.svg',
      ownAccount: 1,
      bankCountry: 'IL',
      currency: 'ILS'
    };
    return {
      props: {
        ...args,
        localCurrencyForm: createLocalCurrencyForm(fb, {
          amount: '10,000',
          depositMethod: '2',
          currency: 'ILS',
          bankAccount: mockBank,
          depositDate: new Date()
        })
      }
    };
  }
};

// Page 2 with validation errors
export const Page2ValidationErrors: Story = {
  args: {
    addMoneyScreenIndex: 1
  },
  render: (args) => {
    const fb = new FormBuilder();
    const component = {
      ...args,
      localCurrencyForm: createLocalCurrencyForm(fb, {
        amount: '10,000',
        depositMethod: '2',
        currency: 'ILS'
      }),
      showValidationError: true
    };
    return {
      props: component
    };
  }
};