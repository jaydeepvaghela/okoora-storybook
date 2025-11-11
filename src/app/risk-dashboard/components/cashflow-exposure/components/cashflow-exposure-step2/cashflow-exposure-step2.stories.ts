import { Meta, StoryObj } from "@storybook/angular";
import { CashflowExposureStep2Component } from "./cashflow-exposure-step2.component";

const meta: Meta<CashflowExposureStep2Component> = {
    title: 'Risk Manager/Cashflow Exposure/Cashflow Exposure Step 2',
    component: CashflowExposureStep2Component,
    argTypes: {
        monthlyPeriod: {
            control: {
              type: 'radio',
            },
            options: [6, 12],
            defaultValue: 12,
            description: 'Selected month duration for exposure'
          },
        walletData: {
            control: 'object',
            description: 'Wallet currency details',
            defaultValue: [
                {
                    "code": "GBP",
                    "defaultCurrency": false,
                    "sign": "£",
                    "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/GBP.png",
                    "currencyName": "British Pound Sterling"
                },
                {
                    "code": "JPY",
                    "defaultCurrency": false,
                    "sign": "￥",
                    "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/JPY.png",
                    "currencyName": "Japanese Yen"
                },
                {
                    "code": "USD",
                    "defaultCurrency": false,
                    "sign": "$",
                    "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                    "currencyName": "United States Dollar"
                },
                {
                    "code": "PLN",
                    "defaultCurrency": false,
                    "sign": "zł",
                    "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PLN.png",
                    "currencyName": "Polish Zloty"
                },
                {
                    "code": "ILS",
                    "defaultCurrency": true,
                    "sign": "₪",
                    "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                    "currencyName": "Israeli Shekel"
                }
            ],
        }
    }
};
export default meta;
type Story = StoryObj<CashflowExposureStep2Component>;

export const Default: Story = {
    args: {
        monthlyPeriod: 12,
        walletData: [
            {
                "code": "GBP",
                "defaultCurrency": false,
                "sign": "£",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/GBP.png",
                "currencyName": "British Pound Sterling"
            },
            {
                "code": "JPY",
                "defaultCurrency": false,
                "sign": "￥",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/JPY.png",
                "currencyName": "Japanese Yen"
            },
            {
                "code": "USD",
                "defaultCurrency": false,
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                "currencyName": "United States Dollar"
            },
            {
                "code": "PLN",
                "defaultCurrency": false,
                "sign": "zł",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PLN.png",
                "currencyName": "Polish Zloty"
            },
            {
                "code": "ILS",
                "defaultCurrency": true,
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": "Israeli Shekel"
            }
        ],
    }
};