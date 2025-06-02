import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AddWalletComponent } from './add-wallet.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Mock currency data
const mockCurrencies = [
    {
        "currency_Id": 15,
        "currency": {
            "code": "SEK",
            "sign": "kr",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SEK.png",
            "currencyName": "Swedish Krona"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SEK.png"
    },
    {
        "currency_Id": 19,
        "currency": {
            "code": "HUF",
            "sign": "Ft",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HUF.png",
            "currencyName": "Hungarian Forint"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HUF.png"
    },
    {
        "currency_Id": 21,
        "currency": {
            "code": "THB",
            "sign": "฿",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/THB.png",
            "currencyName": "Thai Baht"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/THB.png"
    },
    {
        "currency_Id": 23,
        "currency": {
            "code": "HKD",
            "sign": "HK$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HKD.png",
            "currencyName": "Hong Kong Dollar"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HKD.png"
    },
    {
        "currency_Id": 24,
        "currency": {
            "code": "BGN",
            "sign": "лв.",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/BGN.png",
            "currencyName": "Bulgarian Lev"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/BGN.png"
    },
    {
        "currency_Id": 25,
        "currency": {
            "code": "DKK",
            "sign": "kr.",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/DKK.png",
            "currencyName": "Danish Krone"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/DKK.png"
    },
    {
        "currency_Id": 26,
        "currency": {
            "code": "SGD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SGD.png",
            "currencyName": "Singapore Dollar"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SGD.png"
    },
    {
        "currency_Id": 33,
        "currency": {
            "code": "CNY",
            "sign": "¥",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CNY.png",
            "currencyName": "Chinese Yuan"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CNY.png"
    },
    {
        "currency_Id": 44,
        "currency": {
            "code": "PHP",
            "sign": "₱",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PHP.png",
            "currencyName": "Philippine Peso"
        },
        "currency_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PHP.png"
    }
];

export default {
  title: 'Main dashboard/First Row Sections/Add Wallet Popup',
  component: AddWalletComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        }
      ]
    })
  ],
  argTypes: {
    errorMsg: { control: 'text' }
  }
} as Meta<AddWalletComponent>;

type Story = StoryObj<AddWalletComponent>;

export const Default: Story = {
  render: (args) => ({
    component: AddWalletComponent,
    props: {
      ...args,
      activeCurrency: mockCurrencies
    }
  })
};
