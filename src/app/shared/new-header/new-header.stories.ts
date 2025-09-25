import { getActiveHedgingCurrency } from '../../fx-dashboard/components/fx-dashboard-data/active-hedging-currency';

export const WalletDropdown: StoryObj<NewHeaderComponent> = {
  args: {
    selectedWallet: {
      wallet_Id: 1,
      wallet_Currency: { code: 'USD', sign: '$', flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png' },
      wallet_Amount: 12345.67,
      wallet_Available: 10000,
      wallet_Flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png',
      wallet_Hedging: null,
    },
    walletList: getActiveHedgingCurrency.supportedHedge.map((item, idx) => ({
      wallet_Id: idx + 1,
      wallet_Currency: item.currency,
      wallet_Amount: 10000 * (idx + 1),
      wallet_Available: 8000 * (idx + 1),
      wallet_Flag: item.flag,
      wallet_Hedging: null,
    })),
    selectedWalletIndex: 0,
    searchTerm: '',
    hideHeaderActions: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<!-- Only the wallet dropdown/menu section is shown in this story -->\n<div class='wallet-balance' [matMenuTriggerFor]="walletListMenu" *ngIf="selectedWallet">...` 
      },
      story: {
        inline: false,
      },
    },
    angular: {
      template: `
        <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
          <div class='wallet-balance' style="cursor:pointer;" *ngIf="selectedWallet">
            <div class='currency-icon'>
              <img [src]="selectedWallet?.wallet_Currency?.flag" alt="{{ selectedWallet?.wallet_Currency?.code }} icon">
            </div>
            <div class='wallet-value'>
              <div class='wallet-amount'>
                {{selectedWallet?.wallet_Currency?.sign}}{{selectedWallet?.wallet_Amount | number:'1.0-2'}}
              </div>
            </div>
            <img src='images/fx-dashboard/wallet-drop-icn.svg' class='wallet-arrow' alt='Wallet dropdown'>
          </div>
        </div>
      `,
    },
  },
};
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { NewHeaderComponent } from './new-header.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Shared/New Header',
  component: NewHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<NewHeaderComponent>;

export const Default: StoryObj<NewHeaderComponent> = {
  args: {
    // Add any required @Input() properties here for testing
  },
};
