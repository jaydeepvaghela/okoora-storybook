import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ConvertNowComponent } from './convert-now.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';
import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

const mockActiveCurrency = {
  wallet_Currency: {
    code: 'AUD',
  },
  wallet_Flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png',
  wallet_Hedging: {
    buy_Sell: 0, // Assuming Buy
    exposureBaseCurrency: 'ILS',
    direction: 2,
    pair: 'AUDILS',
    exposureAmount: 75000,
  },
};

const mockWalletList = [
  {
    wallet_Currency: {
      code: 'ILS',
      flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png',
    },
  },
];

const walletsServiceMock = {
  activeCurrentWallet: of(mockActiveCurrency),
  availableWalletsData: of(mockWalletList),
};

export default {
  title: 'Main Dashboard/Third Row Sections/Convert Now (Side Tab-2)',
  component: ConvertNowComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        HtmlTooltipDirective
      ],
      providers: [
        { provide: WalletsService, useValue: walletsServiceMock },
        { provide: DashboardService, useValue: {} }, // Mock as needed
      ],
    }),
  ],
  args: {},
} as Meta<ConvertNowComponent>;

type Story = StoryObj<ConvertNowComponent>;

export const Default: Story = {};
