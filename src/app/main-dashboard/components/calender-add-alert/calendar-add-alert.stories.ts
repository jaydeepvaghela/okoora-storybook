import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { CalenderAddAlertComponent } from './calender-add-alert.component';
import { AlertExchangeRateFormComponent } from '../alert-exchange-rate-form/alert-exchange-rate-form.component';

import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { of } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

const mockWalletService = {
  AlertExposure: of({ show: false }),
  activeCurrentWallet: of({
    wallet_Currency: {
      code: 'AUD',
      flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png'
    },
    wallet_Hedging: {
      exposureBaseCurrency: 'ILS'
    },
    wallet_Flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png'
  }),
  availableWalletsData: of([
    {
      wallet_Currency: {
        code: 'ILS',
        flag: 'https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png'
      },
      wallet_Hedging: {
        exposureBaseCurrency: 'ILS'
      }
    }
  ])
};

const mockDashboardService = {
  // Stub methods if needed
};

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export default {
  title: 'Main Dashboard/Third Row Sections/Calender Add Alert',
  component: CalenderAddAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatSidenavModule,
        AlertExchangeRateFormComponent
      ],
      providers: [
        { provide: WalletsService, useValue: mockWalletService },
        { provide: DashboardService, useValue: mockDashboardService },
        // providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    //   ],
      ]
    })
  ]
} as Meta<CalenderAddAlertComponent>;

type Story = StoryObj<CalenderAddAlertComponent>;

export const Default: Story = {
  args: {
    selectedCalendarDate: '2024-06-01',
    isMenu: false,
    drawer: {
      toggle: () => {},
      open: () => {},
      close: () => {},
      opened: false
    } as unknown as MatDrawer
  }
};
