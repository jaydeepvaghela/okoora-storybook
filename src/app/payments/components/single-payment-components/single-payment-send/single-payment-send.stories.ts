import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SinglePaymentSendComponent } from './single-payment-send.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { SinglePaymentSendStep1Component } from '../single-payment-send-step1/single-payment-send-step1.component';
import { SinglePaymentSendStep2Component } from '../single-payment-send-step2/single-payment-send-step2.component';
import { SinglePaymentSendStep3Component } from '../single-payment-send-step3/single-payment-send-step3.component';
import { SinglePaymentSendCompletedComponent } from '../single-payment-send-completed/single-payment-send-completed.component';

const balanceList = [
    {
        "wallet_Id": "d4d6e877-dcec-4ae4-bd87-0599edcd0163",
        "wallet_Currency": {
            "code": "SGD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SGD.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SGD.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "b4ff7e34-c659-422e-ae0e-0eb38ea2adee",
        "wallet_Currency": {
            "code": "THB",
            "sign": "฿",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/THB.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/THB.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "3999ed4f-9683-4778-b94f-177029f48050",
        "wallet_Currency": {
            "code": "INR",
            "sign": "₹",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/INR.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/INR.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": {
            "exposureAmount": 21.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "INR",
            "exposureCurrencySign": "₹",
            "pair": "INRILS",
            "totalHedging": 0.0,
            "percentage": 0.0,
            "direction": 1,
            "buy_Sell": 2
        }
    },
    {
        "wallet_Id": "3bfa539c-5b0c-4f19-9bf6-2cb28398fd3f",
        "wallet_Currency": {
            "code": "HKD",
            "sign": "HK$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HKD.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HKD.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "c2c7d070-35ef-45da-b6b2-3bddf6441a94",
        "wallet_Currency": {
            "code": "SEK",
            "sign": "kr",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SEK.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SEK.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "5010306a-c9ae-44a7-a8b4-411237f5f513",
        "wallet_Currency": {
            "code": "AUD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
            "currencyName": null
        },
        "wallet_Amount": 98045.66,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 98029.79,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 1000.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "AUD",
            "exposureCurrencySign": "$",
            "pair": "AUDILS",
            "totalHedging": 1506023.0000,
            "percentage": 150602.3,
            "direction": 2,
            "buy_Sell": 1
        }
    },
    {
        "wallet_Id": "ed186c13-3d1a-4f6c-9969-43c6dbc09edb",
        "wallet_Currency": {
            "code": "PLN",
            "sign": "zł",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PLN.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PLN.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "e6585f04-c241-4ee2-a5de-542c543248a3",
        "wallet_Currency": {
            "code": "TRY",
            "sign": "₺",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/TRY.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/TRY.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "552bde2e-eb31-4d26-974e-5ffc34fb2b27",
        "wallet_Currency": {
            "code": "JPY",
            "sign": "￥",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/JPY.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/JPY.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 20.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "JPY",
            "exposureCurrencySign": "￥",
            "pair": "JPYILS",
            "totalHedging": 0.0,
            "percentage": 0.0,
            "direction": 2,
            "buy_Sell": 1
        }
    },
    {
        "wallet_Id": "4db54941-76df-4515-97c1-66789c45eb1e",
        "wallet_Currency": {
            "code": "BGN",
            "sign": "лв.",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/BGN.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/BGN.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "4178a689-ba01-466e-b563-84afcd98070e",
        "wallet_Currency": {
            "code": "EUR",
            "sign": "€",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
            "currencyName": null
        },
        "wallet_Amount": 5.82,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 5.82,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 10000.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "EUR",
            "exposureCurrencySign": "€",
            "pair": "EURILS",
            "totalHedging": 0.0,
            "percentage": 0.0,
            "direction": 2,
            "buy_Sell": 1
        }
    },
    {
        "wallet_Id": "87efeeea-3ebf-47bf-a853-8b301c8ee6f1",
        "wallet_Currency": {
            "code": "AED",
            "sign": "د.إ.‏",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AED.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AED.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "09e8964c-720f-44ad-9ebb-95f52a3a2624",
        "wallet_Currency": {
            "code": "GBP",
            "sign": "£",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/GBP.png",
            "currencyName": null
        },
        "wallet_Amount": -2.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": -2.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/GBP.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 32.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "GBP",
            "exposureCurrencySign": "£",
            "pair": "GBPILS",
            "totalHedging": 0.0,
            "percentage": 0.0,
            "direction": 2,
            "buy_Sell": 1
        }
    },
    {
        "wallet_Id": "fffa1ad8-ea6f-44b5-9543-9971226b1ea8",
        "wallet_Currency": {
            "code": "CNY",
            "sign": "¥",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CNY.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CNY.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "1f62e688-2241-4065-ac51-9b7633f6d3ea",
        "wallet_Currency": {
            "code": "ZAR",
            "sign": "R",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ZAR.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ZAR.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "e3528005-2d3a-4446-aca2-a89136f5ec15",
        "wallet_Currency": {
            "code": "RON",
            "sign": "RON",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/RON.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/RON.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "532a297a-a1e5-4140-a33c-aabeead52493",
        "wallet_Currency": {
            "code": "CAD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CAD.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CAD.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 100.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "CAD",
            "exposureCurrencySign": "$",
            "pair": "CADILS",
            "totalHedging": 0.0,
            "percentage": 0.0,
            "direction": 2,
            "buy_Sell": 1
        }
    },
    {
        "wallet_Id": "e792b110-3b79-4eb2-bda6-b1bd90aba448",
        "wallet_Currency": {
            "code": "HUF",
            "sign": "Ft",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HUF.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/HUF.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "2747e468-144f-4647-aac4-c3be4c6d19c0",
        "wallet_Currency": {
            "code": "ILS",
            "sign": "₪",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
            "currencyName": null
        },
        "wallet_Amount": -3125.23,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": true,
        "wallet_Available": -3125.23,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
        "wallet_Collateral": 31093.46,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "71fcbd3c-53cf-4222-b0a0-c9412ea68e1d",
        "wallet_Currency": {
            "code": "DKK",
            "sign": "kr.",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/DKK.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/DKK.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "d937dbfa-0faf-4b5b-89a8-ceb6857a2bd0",
        "wallet_Currency": {
            "code": "CNH",
            "sign": null,
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CNH.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CNH.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "e031fc6e-149d-47af-98eb-d8219740bf42",
        "wallet_Currency": {
            "code": "CHF",
            "sign": "CHF",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CHF.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CHF.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 250.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "CHF",
            "exposureCurrencySign": "CHF",
            "pair": "CHFILS",
            "totalHedging": 0.0,
            "percentage": 0.0,
            "direction": 2,
            "buy_Sell": 1
        }
    },
    {
        "wallet_Id": "eb930efb-87bf-429b-b244-d8694f58cbe4",
        "wallet_Currency": {
            "code": "NOK",
            "sign": "kr",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NOK.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NOK.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "ee4a3c08-eab9-40a3-b1f5-e0c9a96b0936",
        "wallet_Currency": {
            "code": "MXN",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/MXN.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/MXN.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "a1df7806-f06c-4abd-937f-e570fa15bc37",
        "wallet_Currency": {
            "code": "CZK",
            "sign": "Kč",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CZK.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CZK.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "e14f90e5-66cf-405b-b242-f4b1fb7ba83e",
        "wallet_Currency": {
            "code": "NZD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NZD.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NZD.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "f976513a-b5e7-42bf-8d30-fb4610157974",
        "wallet_Currency": {
            "code": "PHP",
            "sign": "₱",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PHP.png",
            "currencyName": null
        },
        "wallet_Amount": 0.0,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 0.0,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/PHP.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": false,
        "wallet_Hedging": null
    },
    {
        "wallet_Id": "5a3fdd54-22df-48bc-9784-fc8197e69903",
        "wallet_Currency": {
            "code": "USD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
            "currencyName": null
        },
        "wallet_Amount": 94125.28,
        "wallet_Credit": null,
        "wallet_IsBaseCurency": false,
        "wallet_Available": 94060.88,
        "wallet_Flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
        "wallet_Collateral": null,
        "wallet_CreditCollateral": null,
        "wallet_SupportBaseHedging": true,
        "wallet_Hedging": {
            "exposureAmount": 10000.0000,
            "exposureBaseCurrency": "ILS",
            "exposureCurrency": "USD",
            "exposureCurrencySign": "$",
            "pair": "USDILS",
            "totalHedging": 411413.0000,
            "percentage": 4114.13,
            "direction": 2,
            "buy_Sell": 1
        }
    }
]

const meta: Meta<SinglePaymentSendComponent> = {
    title: 'Payments/Payment Dashboard/Payments/Single Payment/Single Payment Steps',
    component: SinglePaymentSendComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                MatDialogModule,
                MatStepperModule,
                MatProgressBarModule,
                SinglePaymentSendStep1Component,
                SinglePaymentSendStep2Component,
                SinglePaymentSendStep3Component,
                SinglePaymentSendCompletedComponent,
            ],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        benificiaryFromContacts: [],
                    },
                },
            ],
        }),
    ],
};

export default meta;

const AccountTransactionsData = [
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 34260.03,
            "ilsBalance": 30357.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 115395.69,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73602",
        "mainType": 2,
        "traferStatus": 1,
        "payerName": null,
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 34260.03,
            "exchangeRate": 0.6983,
            "amount": 200.0,
            "currency": {
                "code": "USD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": 115395.69,
            "exchangeRate": 1.0,
            "amount": 286.4,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-09T16:37:39.499",
        "submitedOn": "2025-06-09T16:37:39.499",
        "fee": null,
        "commission": null,
        "cost": null,
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "d23b3af5-2dfdef0a5544",
        "dispatchedFileId": null
    },
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 34460.03,
            "ilsBalance": 30357.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 115109.28,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73601",
        "mainType": 1,
        "traferStatus": 2,
        "payerName": "Goha",
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": "f4297563-061c-4179-9f9d-063d0261dd23",
            "name": "Goha",
            "accountNumber": "1324654654",
            "bankCountry": "IL"
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 115109.28,
            "exchangeRate": 1.0,
            "amount": 45.54,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": 30357.5,
            "exchangeRate": 2.1958,
            "amount": 100.0,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-09T16:37:26.481",
        "submitedOn": "2025-06-09T16:37:26.481",
        "fee": {
            "amount": 0.0,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "commission": null,
        "cost": {
            "amount": 0.0,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "87374452-47195030a3cd",
        "dispatchedFileId": null
    },
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 34460.03,
            "ilsBalance": 30357.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 115154.82,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73600",
        "mainType": 1,
        "traferStatus": 2,
        "payerName": "Goha",
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": "54518c61-69f5-4a21-b28a-22398646998b",
            "name": "Goha",
            "accountNumber": "66666",
            "bankCountry": "IL"
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 115154.82,
            "exchangeRate": 1.0,
            "amount": 45.55,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": 30357.5,
            "exchangeRate": 2.195,
            "amount": 100.0,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-09T16:37:12.577",
        "submitedOn": "2025-06-09T16:37:12.577",
        "fee": {
            "amount": 0.0,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "commission": null,
        "cost": {
            "amount": 0.0,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "eb9a3659-9cd0ad1dd750",
        "dispatchedFileId": null
    },
    {
        "currencyBalance": null,
        "mainId": "2744",
        "mainType": 2,
        "traferStatus": 4,
        "payerName": null,
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": null,
            "exchangeRate": 1.0,
            "amount": 0.94,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": null,
            "exchangeRate": 211.0,
            "amount": 200.0,
            "currency": {
                "code": "CAD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CAD.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-09T16:12:18.5966667",
        "submitedOn": "2025-06-17T00:00:00",
        "fee": null,
        "commission": null,
        "cost": null,
        "savingInterst": null,
        "readyToUse": null,
        "collateral": null,
        "productName": null,
        "ctteeReference": null,
        "dispatchedFileId": null
    },
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 34460.03,
            "ilsBalance": 30357.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 115200.38,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73599",
        "mainType": 2,
        "traferStatus": 1,
        "payerName": null,
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 34460.03,
            "exchangeRate": 0.6982,
            "amount": 20.0,
            "currency": {
                "code": "USD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": 115200.38,
            "exchangeRate": 1.0,
            "amount": 28.64,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-09T16:10:46.878",
        "submitedOn": "2025-06-09T16:10:46.878",
        "fee": null,
        "commission": null,
        "cost": null,
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "9a5dd0bf-7f5684b2ad8f",
        "dispatchedFileId": null
    },
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 34480.03,
            "ilsBalance": 30357.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 115171.73,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73598",
        "mainType": 2,
        "traferStatus": 1,
        "payerName": null,
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 34480.03,
            "exchangeRate": 0.6981,
            "amount": 200.0,
            "currency": {
                "code": "USD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": 115171.73,
            "exchangeRate": 1.0,
            "amount": 286.49,
            "currency": {
                "code": "AUD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-09T16:10:22.454",
        "submitedOn": "2025-06-09T16:10:22.454",
        "fee": null,
        "commission": null,
        "cost": null,
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "abda0261-de3fec6e8238",
        "dispatchedFileId": null
    },
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 34680.03,
            "ilsBalance": 30357.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 114885.24,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73213",
        "mainType": 2,
        "traferStatus": 1,
        "payerName": null,
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 34680.03,
            "exchangeRate": 1.0,
            "amount": 30000.0,
            "currency": {
                "code": "USD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": 30357.5,
            "exchangeRate": 3.3616,
            "amount": 100848.0,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-04T13:08:51.527",
        "submitedOn": "2025-06-04T13:08:51.527",
        "fee": null,
        "commission": null,
        "cost": null,
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "f4069a3d-79b26ca04185",
        "dispatchedFileId": null
    },
    {
        "currencyBalance": {
            "eurBalance": 5.82,
            "usdBalance": 64680.03,
            "ilsBalance": -70490.5,
            "gbpBalance": -2.0,
            "aedBalance": 0.0,
            "audBalance": 114885.24,
            "bgnBalance": 0.0,
            "cadBalance": 0.0,
            "chfBalance": 0.0,
            "cnhBalance": 0.0,
            "cnyBalance": 0.0,
            "czkBalance": 0.0,
            "dkkBalance": 0.0,
            "hkdBalance": 0.0,
            "hufBalance": 0.0,
            "inrBalance": 0.0,
            "jpyBalance": 0.0,
            "mxnBalance": 0.0,
            "nokBalance": 0.0,
            "nzdBalance": 0.0,
            "phpBalance": 0.0,
            "plnBalance": 0.0,
            "ronBalance": 0.0,
            "sekBalance": 0.0,
            "sgdBalance": 0.0,
            "thbBalance": 0.0,
            "tryBalance": 0.0,
            "zarBalance": 0.0
        },
        "mainId": "73212",
        "mainType": 2,
        "traferStatus": 1,
        "payerName": null,
        "from": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "to": {
            "id": null,
            "name": "Wallet",
            "accountNumber": null,
            "bankCountry": null
        },
        "transaction": {
            "amount": null,
            "currency": null
        },
        "moneyTransferred": {
            "readyToUse": 64680.03,
            "exchangeRate": 1.0,
            "amount": 5000.0,
            "currency": {
                "code": "USD",
                "sign": "$",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                "currencyName": null
            }
        },
        "profieLoss": null,
        "moneyReceived": {
            "readyToUse": -70490.5,
            "exchangeRate": 3.3613,
            "amount": 16806.5,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "exeutedOn": "2025-06-04T13:08:21.242",
        "submitedOn": "2025-06-04T13:08:21.242",
        "fee": null,
        "commission": null,
        "cost": null,
        "savingInterst": null,
        "readyToUse": null,
        "collateral": {
            "amount": 31093.45,
            "currency": {
                "code": "ILS",
                "sign": "₪",
                "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
                "currencyName": null
            }
        },
        "productName": null,
        "ctteeReference": "7eea7595-25367f55df62",
        "dispatchedFileId": null
    }
]

const mockPaymentData = {
    "requestId": "f4297563-061c-4179-9f9d-063d0261dd23",
    "status": true,
    "message": "Create Payment Request Successfully",
    "paymentRequst": {
        "quoteId": "f4297563-061c-4179-9f9d-063d0261dd23",
        "spot": 0.4817,
        "exchangeRate": {
            "major": {
                "rate": 1,
                "currency": {
                    "code": "AUD",
                    "sign": "AUD",
                    "flag": null,
                    "currencyName": null
                }
            },
            "minor": {
                "rate": 0.4817,
                "currency": {
                    "code": "ILS",
                    "sign": "₪",
                    "flag": null,
                    "currencyName": null
                }
            }
        },
        "charge": 43.58,
        "chargeCurrency": "AUD",
        "send": "21",
        "sendCurrency": "ILS",
        "paymentType": 1,
        "costType": {
            "key": null,
            "value": 0
        }
    },
    "costList": [
        {
            "key": "1 - regular",
            "value": 0
        },
        {
            "key": "2 - our",
            "value": 21.42
        }
    ],
    "signAndFiles": {
        "needSign": false,
        "needFile": false,
        "needStamp": false
    }
}

const mockSignObject = {
    "selectedWalletSign": "$",
    "beneficiarySign": "₪",
    "bankAccountHolderName": "Goha"
}

const mockTimerSubscription = { unsubscribe: () => { } };

// Story for Step 1
export const Step1: StoryObj<SinglePaymentSendComponent> = {
    args: {
        walletList: balanceList,
        benificiaryFromContacts: AccountTransactionsData,
        openBeneficiaryList: true,
        currentStepIndex: 0,
    },
};

// Story for Step 2
export const Step2: StoryObj<SinglePaymentSendComponent> = {
    args: {
        walletList: balanceList,
        createdPaymentData: mockPaymentData,
        timerSubscription: mockTimerSubscription,
        currentStepIndex: 1,
    },
};

// Story for Step 3
export const Step3: StoryObj<SinglePaymentSendComponent> = {
    args: {
        walletList: balanceList,
        createdPaymentData: mockPaymentData,
        timerSubscription: mockTimerSubscription,
        signObjectForSummery: mockSignObject,
        currentStepIndex: 2,
    },
};

// Story for Completed Step
export const StepCompleted: StoryObj<SinglePaymentSendComponent> = {
    args: {
        walletList: balanceList,
        benificiaryFromContacts: AccountTransactionsData,
        timerSubscription: mockTimerSubscription,
        currentStepIndex: 3,
        signObjectForSummery: mockSignObject,
    },
};
