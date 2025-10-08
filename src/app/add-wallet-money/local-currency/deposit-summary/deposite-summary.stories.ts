import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DepositSummaryComponent } from './deposit-summary.component';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { of } from 'rxjs';

// Mock WalletsService
class MockWalletsService {
  depositRegular(params: any) {
    return of({ success: true });
  }
}

const meta: Meta<DepositSummaryComponent> = {
  title: 'Deposit Flow/Deposit Components/Deposit Summary',
  component: DepositSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: WalletsService, useClass: MockWalletsService }
      ]
    }),
    applicationConfig({
      providers: [provideAnimations()]
    })
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DepositSummaryComponent>;

// Helper function to create form data
const createFormGroup = (fb: FormBuilder, overrides = {}) => {
  const defaults = {
    amount: '5,000.00',
    currency: 'ILS',
    depositMethod: '1',
    depositDate: new Date('2025-10-15'),
    bankAccount: {
      id: 1,
      bankName: 'Bank Hapoalim',
      bankNumber: '12',
      accountNumber: '123456'
    },
    accountDetails: {
      id: '1',
      bankNickName: 'Test Account',
      fullName: 'XYZ Technologies Ltd.',
      name: 'Bank Leumi',
      code: '10',
      branch: '900',
      accountNumber: '7891234',
      iban: 'IL620108900000007891234'
    }
  };

  const data = { ...defaults, ...overrides };
  
  return fb.group({
    amount: [data.amount],
    currency: [data.currency],
    depositMethod: [data.depositMethod],
    depositDate: [data.depositDate],
    bankAccount: [data.bankAccount],
    accountDetails: [data.accountDetails]
  });
};

// Gold Transfer story
export const GoldTransfer: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        localCurrencyForm: createFormGroup(fb, {
          depositMethod: '3',
          amount: '10,000.00',
          depositDate: null // Add this to override depositDate for gold transfer
        }),
        addMoneyScreenIndex: 2,
        onScreenIndexChange: (index: number) => console.log('Screen index changed to:', index)
      }
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Deposit summary showing a gold transfer (no deposit date required).'
      }
    }
  }
};


// Default story - Bank Transfer
export const BankTransfer: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        localCurrencyForm: createFormGroup(fb),
        addMoneyScreenIndex: 2,
        onScreenIndexChange: (index: number) => console.log('Screen index changed to:', index)
      }
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Default deposit summary showing a bank transfer in ILS currency.'
      }
    }
  }
};


// With Error Message story
export const WithErrorMessage: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    const component = {
      ...args,
      localCurrencyForm: createFormGroup(fb),
      addMoneyScreenIndex: 2,
      errorMessage: 'Unable to process deposit. Please try again later.',
      onScreenIndexChange: (index: number) => console.log('Screen index changed to:', index)
    };
    return {
      props: component
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Deposit summary showing an error message after failed submission.'
      }
    }
  }
};



