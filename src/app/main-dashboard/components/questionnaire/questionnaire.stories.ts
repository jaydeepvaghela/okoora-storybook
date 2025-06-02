import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionnaireStep1Component } from '../questionnaire-step1/questionnaire-step1.component';
import { QuestionnaireStep2Component } from '../questionnaire-step2/questionnaire-step2.component';
import { QuestionnaireStep3Component } from '../questionnaire-step3/questionnaire-step3.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

const mockCurrencies = [
    {
        "id": 1,
        "name": "USD",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": true,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
        "currency": {
            "code": "USD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
            "currencyName": null
        }
    },
    {
        "id": 2,
        "name": "EUR",
        "active": 1,
        "markUpId": 2,
        "symbol": null,
        "otherMarkUp": null,
        "major": true,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
        "currency": {
            "code": "EUR",
            "sign": "€",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
            "currencyName": null
        }
    },
    {
        "id": 3,
        "name": "GBP",
        "active": 1,
        "markUpId": 999,
        "symbol": null,
        "otherMarkUp": 3.20,
        "major": true,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/GBP.png",
        "currency": {
            "code": "GBP",
            "sign": "£",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/GBP.png",
            "currencyName": null
        }
    },
    {
        "id": 4,
        "name": "AUD",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": true,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
        "currency": {
            "code": "AUD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
            "currencyName": null
        }
    },
    {
        "id": 5,
        "name": "CHF",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": true,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CHF.png",
        "currency": {
            "code": "CHF",
            "sign": "CHF",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CHF.png",
            "currencyName": null
        }
    },
    {
        "id": 6,
        "name": "CAD",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": true,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CAD.png",
        "currency": {
            "code": "CAD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/CAD.png",
            "currencyName": null
        }
    },
    {
        "id": 7,
        "name": "NZD",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": true,
        "activeHedge": null,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NZD.png",
        "currency": {
            "code": "NZD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NZD.png",
            "currencyName": null
        }
    },
    {
        "id": 8,
        "name": "ZAR",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ZAR.png",
        "currency": {
            "code": "ZAR",
            "sign": "R",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ZAR.png",
            "currencyName": null
        }
    },
    {
        "id": 9,
        "name": "INR",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": null,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/INR.png",
        "currency": {
            "code": "INR",
            "sign": "₹",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/INR.png",
            "currencyName": null
        }
    },
    {
        "id": 10,
        "name": "TRY",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": null,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/TRY.png",
        "currency": {
            "code": "TRY",
            "sign": "₺",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/TRY.png",
            "currencyName": null
        }
    },
    {
        "id": 12,
        "name": "MXN",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": null,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/MXN.png",
        "currency": {
            "code": "MXN",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/MXN.png",
            "currencyName": null
        }
    },
    {
        "id": 13,
        "name": "BRL",
        "active": 0,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": null,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/BRL.png",
        "currency": {
            "code": "BRL",
            "sign": "R$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/BRL.png",
            "currencyName": null
        }
    },
    {
        "id": 14,
        "name": "NOK",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": null,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NOK.png",
        "currency": {
            "code": "NOK",
            "sign": "kr",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/NOK.png",
            "currencyName": null
        }
    },
    {
        "id": 15,
        "name": "SEK",
        "active": 1,
        "markUpId": null,
        "symbol": null,
        "otherMarkUp": null,
        "major": null,
        "activeHedge": true,
        "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SEK.png",
        "currency": {
            "code": "SEK",
            "sign": "kr",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/SEK.png",
            "currencyName": null
        }
    }
]

export default {
  title: 'Main dashboard/First Row Sections/Questionnaire Popups',
  component: QuestionnaireComponent,
  decorators: [
    moduleMetadata({
      imports: [
        QuestionnaireComponent,
        QuestionnaireStep1Component,
        QuestionnaireStep2Component,
        QuestionnaireStep3Component,
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatStepperModule,
        BrowserAnimationsModule,
        MatDialogModule
      ],
      providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          // Provide mock data expected in your component
          mockKey: 'mockValue'
        }
      },
      {
        provide: MatDialogRef,
        useValue: {
          close: () => console.log('Dialog closed')
        }
      }
    ]
    })
  ],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    currentStep: {
      control: 'number',
      description: 'The step number (0-based index)'
    }
  }
} as Meta<QuestionnaireComponent>;

type Story = StoryObj<QuestionnaireComponent>;

export const Step1: Story = {
  args: {
    currentStep: 0,
    currencyList: mockCurrencies,
    defaultCurrency: 'ILS'
  }
};

export const Step2: Story = {
  args: {
    currentStep: 1,
    currencyList: mockCurrencies,
    defaultCurrency: 'ILS'
  }
};

export const Step3: Story = {
  args: {
    currentStep: 2,
    currencyList: mockCurrencies,
    defaultCurrency: 'ILS'
  }
};
