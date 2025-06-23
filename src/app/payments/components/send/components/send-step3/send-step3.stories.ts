import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { SendStep3Component } from './send-step3.component';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';

const mockActiveCurrency: any = [
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

const mockBeneficiaryName = {
  bankDetails: {
    bankAccountHolderName: 'John Doe',
    currency: 'EUR',
    currencyISO: {
      sign: '€',
      code: 'EUR'
    }
  }
};

// Mock services
class MockWalletsService {
  getAllBalanceList() {
    return of(mockActiveCurrency);
  }

  getApiObs() {
    return of('amount');
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of('yes')
    };
  }
}

class MockRouter {
  navigate() {}
}

class MockMatDialogRef {
  close() {}
}

const meta: Meta<SendStep3Component> = {
  title: 'Payments/Payment Dashboard/Lock Rate & Pay Later/Lock Rate Steps/Step 2 - Payment Info',
  component: SendStep3Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatListModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: WalletsService, useClass: MockWalletsService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: Router, useClass: MockRouter },
        { provide: MatDialogRef, useClass: MockMatDialogRef }
      ]
    })
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Payment step 3 component for Lock Rate & Pay Later functionality. This component allows users to set payment details, select transfer types, and configure future payment options.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<SendStep3Component>;

// Helper function to create form groups
const createMockFormGroup = (fb: FormBuilder) => {
  return fb.group({
    amount: [100, [Validators.required, Validators.min(1)]],
    currency: ['EUR', Validators.required],
    buyCurrency: [null],
    beneficiaryId: ['12345', Validators.required],
    expiryDate: [new Date(2025, 11, 31), Validators.required],
    costType: ['1 - regular'],
    createPaymentResponse: [null]
  });
};

const createPaymentFormGroup = (fb: FormBuilder) => {
  return fb.group({
    amount: [100, Validators.required],
    spotRate: [''],
    currentRate: [2.2968],
    isApproved: [false],
    expiryDate: ['']
  });
};

const createTypeFormGroup = (fb: FormBuilder) => {
  return fb.group({
    paymentType: ['future_payment']
  });
};

export const Default: Story = {
  render: (args) => {
    const fb = new FormBuilder();
    return {
      props: {
        ...args,
        futurePayment: createMockFormGroup(fb),
        createPayment: createPaymentFormGroup(fb),
        type: createTypeFormGroup(fb),
        formStepper: { 
          next: () => console.log('Next step'),
          selectedIndex: 2,
          steps: { length: 5 }
        },
        formStepperProgress: { value: 40 }
      }
    };
  },
  args: {
    senderName: 'Jane Smith',
    currency: 'EUR',
    benificiaryId: '12345',
    beneficiaryName: mockBeneficiaryName,
    paymentTypeValue: { paymentType: 'future_payment' },
    activeWalletCurrency: {
      selectedwalletInfo: {
        wallet_Currency: {
          code: 'USD',
          sign: '$'
        }
      }
    },
    getBeneficiary: mockBeneficiaryName
  }
};

export const PaymentWithCostOptions: Story = {
  ...Default,
  render: (args) => {
    const fb = new FormBuilder();
    const futurePaymentForm = createMockFormGroup(fb);
    
    return {
      props: {
        ...args,
        futurePayment: futurePaymentForm,
        createPayment: createPaymentFormGroup(fb),
        type: createTypeFormGroup(fb),
        createFuturePaymentResponse: {
          message: "Create Future Payment Request Successfully",
          requestId: "test-request-123",
          costList: [
            { key: "1 - regular", value: 7.68 },
            { key: "2 - our", value: 15.36 }
          ],
          futurePayment: []
        },
        requestID: 'test-request-123',
        costList: [
          { key: "1 - regular", value: 7.68 },
          { key: "2 - our", value: 15.36 }
        ],
        updateCostDisabledNext: false,
        transferTypeSelected: true,
        formStepper: { 
          next: () => console.log('Next step'),
          selectedIndex: 2,
          steps: { length: 5 }
        },
        formStepperProgress: { value: 40 }
      }
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment form showing cost options and transfer type selection after successful payment request creation.'
      }
    }
  }
};