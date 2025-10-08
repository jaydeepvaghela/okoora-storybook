import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OtherCurrencyComponent } from './other-currency.component';
import { BankAccountConfirmationComponent } from '../bank-account-confirmation/bank-account-confirmation.component';
import { FooterComponent } from '../../main-dashboard/components/footer/footer.component';
import { WalletsService } from '../../main-dashboard/services/wallets.service';

// Mock WalletsService
class MockWalletsService {
  getGlobalAccount() {
    return { subscribe: () => {} };
  }
  getAllBalanceList() {
    return { subscribe: () => {} };
  }
}

class MockMatDrawer {
  close() {
    return Promise.resolve();
  }
  open() {
    return Promise.resolve();
  }
}

const meta: Meta<OtherCurrencyComponent> = {
  title: 'Deposit Flow/Deposit Components/Other Currency Tab',
  component: OtherCurrencyComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatSelectModule,
        MatListModule,
        MatDialogModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        BankAccountConfirmationComponent,
        FooterComponent
      ],
      providers: [
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: MatDrawer, useClass: MockMatDrawer }
      ]
    })
  ],
  tags: ['autodocs'],
  argTypes: {
    onCloseClick: { action: 'closeClicked' }
  }
};

export default meta;
type Story = StoryObj<OtherCurrencyComponent>;

// Mock data for testing
const mockCcBankAccountDetails = [
  {
    id: '123',
    accountName: 'John Doe Business Account',
    accountNumber: '1234567890',
    country: 'United Kingdom',
    institutionName: 'HSBC Bank',
    institutionAddress: '123 Banking Street, London',
    institutionCity: 'London',
    iban: 'GB29NWBK60161331926819',
    swiftCode: 'HSBCGB2L',
    paymentType: 'SWIFT',
    accountRoutingType: ['SORT_CODE'],
    accountRoutingValue: ['12-34-56']
  },
  {
    id: '124',
    accountName: 'John Doe Business Account',
    accountNumber: '0987654321',
    country: 'United Kingdom',
    institutionName: 'Barclays Bank',
    institutionAddress: '456 Finance Avenue, London',
    institutionCity: 'London',
    paymentType: 'LOCAL',
    accountRoutingType: ['SORT_CODE', 'IBAN'],
    accountRoutingValue: ['98-76-54', 'GB29BUKB20201555555555']
  }
];

const mockActiveCurrency = {
  currency: {
    code: 'GBP',
    flag: 'https://flagcdn.com/w40/gb.png',
    sign: '£'
  },
  currency_Flag: 'https://flagcdn.com/w80/gb.png'
};

const mockCcBankAccountCostDetails = {
  amount: 50,
  currency: {
    sign: '$',
    code: 'USD'
  },
  depositFees: [
    {
      transferFeeType: 0,
      percentage: 1.5,
      dpositCost: 5
    },
    {
      transferFeeType: 1,
      dpositCost: 2
    }
  ]
};

// Default story with bank account details
export const WithBankAccount: Story = {
  args: {
    ccBankAccountDetails: mockCcBankAccountDetails,
    switchedCurrency: mockActiveCurrency,
    isNonIsraeliUser: true,
    showLoader: false
  }
};

// Story showing wallet limit reached
export const WalletLimitReached: Story = {
  args: {
    ccBankAccountDetails: null,
    switchedCurrency: mockActiveCurrency,
    hasFreeBankAccount: false,
    showWalletType: false,
    isNonIsraeliUser: true,
    showLoader: false
  }
};

// Story showing free bank account option
export const FreeBankAccountAvailable: Story = {
  args: {
    ccBankAccountDetails: null,
    switchedCurrency: mockActiveCurrency,
    hasFreeBankAccount: true,
    isNonIsraeliUser: true,
    showLoader: false
  }
};

// Story showing wallet type selection
export const WalletTypeSelection: Story = {
  args: {
    ccBankAccountDetails: null,
    switchedCurrency: mockActiveCurrency,
    showWalletType: true,
    hasFreeBankAccount: false,
    ccBankAccountCostDetails: mockCcBankAccountCostDetails,
    isNonIsraeliUser: true,
    showLoader: false
  }
};