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
    searchTerm: ''
  },
  parameters: {
    docs: {
      source: {
        code: `<!-- Only the wallet dropdown/menu section is shown in this story -->\n<div class='wallet-balance' [matMenuTriggerFor]="walletListMenu" *ngIf="selectedWallet">\n  <div class='currency-icon'>\n    <img [src]="selectedWallet?.wallet_Currency?.flag" alt="{{ selectedWallet?.wallet_Currency?.code }} icon">\n  </div>\n  <div class='wallet-value'>\n    <div class='wallet-amount'>\n      {{selectedWallet?.wallet_Currency?.sign}}{{selectedWallet?.wallet_Amount | number:'1.0-2'}}\n    </div>\n  </div>\n  <img src='images/fx-dashboard/wallet-drop-icn.svg' class='wallet-arrow' alt='Wallet dropdown'>\n</div>\n<mat-menu #walletListMenu='matMenu' class='wallet-header-list-menu'>\n  <div class='wallet-list-inner' matMenuContent>\n    <div class='search-bar' (click)="$event.stopPropagation()">\n      <input type='text' placeholder='Search' class='search-input' [(ngModel)]='searchTerm'>\n      <img src='images/fx-dashboard/search-wallet.svg' alt='Search'>\n    </div>\n    <div class='wallet-list'>\n      <div class='wallet-item' *ngFor='let wallet of filteredWalletList; let i = index'\n        [class.selected]="i === selectedWalletIndex" (click)="onWalletClick($event, i, wallet)">\n        <div class='wallet-inner-item'>\n          <div class='wallet-icon'>\n            <img [src]="wallet.wallet_Currency.flag" alt="{{ wallet.wallet_Currency.code }} icon">\n            <span class='wallet-name'>{{ wallet.wallet_Currency.code }}</span>\n          </div>\n          <span class='wallet-balance'>{{ wallet.wallet_Currency.sign }}\n            <strong>{{ wallet.wallet_Amount | number:'1.0-2' }}</strong>\n          </span>\n        </div>\n        <div class='border-line'></div>\n      </div>\n    </div>\n    <button class='btn-add-wallet' (click)='addWalletModal()'>Add new wallet</button>\n  </div>\n</mat-menu>`
      },
      story: {
        inline: false,
      },
    },
    // Template override to show only the currency dropdown (wallet selector)
    angular: {
      template: `
        <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
          <!-- Only the wallet dropdown trigger is rendered. All other header elements are hidden. -->
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
        <!-- All highlighted header elements (actions, ERP, icons, avatar) are hidden in this story. -->
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
    hideElements: true,
    // Add any required @Input() properties here for testing
  },
};
