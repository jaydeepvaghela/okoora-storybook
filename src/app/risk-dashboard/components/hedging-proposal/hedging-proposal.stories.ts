import { Meta, StoryObj } from "@storybook/angular";
import { HedgingProposalComponent } from "./hedging-proposal.component";

const meta: Meta<HedgingProposalComponent> = {
    title: 'Components/Risk-Manager/Hedging-Proposal',
    component: HedgingProposalComponent,
    argTypes: {
        hedgeDetails: {
            control: 'object',
            description: 'Hedge details data',
            defaultValue: {
                totalHedgeAmount: 161.10,
                hedgeCurrency: { code: 'CHF', sign: 'CHF' },
                totalHedgePercent: 33.5625,
                avgHedgeRate: 4.3747,
                liabilityRate: 4.3747,
                requiredCollateral: 67.637,
                price: 0.0,
                collateralAndPriceCur: { code: 'ILS', sign: '₪' },
                direction: 2,
                currencyPair: 'CHF/ILS',
                hedgingType: 1,
                monthlyHedge: [
                    {
                        status: { type: 1, descriprion: 'Created' },
                        maxHedgeAmount: 25.0,
                        recomendedHedgeAmount: 10.5,
                        hedge: {
                            strategyId: 132575,
                            hedgeRate: 4.3121,
                            expiryDate: '17/11/2025',
                            price: 0.0,
                            collateral: 4.408,
                            productName: 'LOCK & UP',
                            productType: 1,
                            notionalCurrency: 'CHF',
                            notionalCurrencySign: 'CHF',
                            secondCurrency: 'ILS',
                            secondCurrencySign: '₪',
                            collateralCurrency: 'ILS',
                            liabilityRate: 4.3121,
                            protectAmount: 10.5
                        },
                        totalExposure: 25.0,
                        alreadyHedge: 0.0,
                        date: '17/11/2025',
                        hedgeError:false
                    },
                ]
            }
        }
    }
};
export default meta;
type Story = StoryObj<HedgingProposalComponent>;

export const Default: Story = {
    args: {
        hedgeDetails: {
            totalHedgeAmount: 161.10,
            hedgeCurrency: { code: 'CHF', sign: 'CHF', flag: null, currencyName: null },
            totalHedgePercent: 33.5625,
            avgHedgeRate: 4.3747526315789473684210526316,
            liabilityRate: 4.3747526315789473684210526316,
            requiredCollateral: 67.637,
            price: 0.0,
            collateralAndPriceCur: { code: 'ILS', sign: '₪', flag: null, currencyName: null },
            direction: 2,
            currencyPair: 'CHF/ILS',
            hedgingType: 1,
            monthlyHedge: [
                {
                    "status": {
                      "type": 3,
                      "descriprion": "Don't need to create hedge for zero reccomended hedge"
                    },
                    "maxHedgeAmount": 5.00,
                    "recomendedHedgeAmount": 0.00,
                    "hedge": null,
                    "totalExposure": 5.00,
                    "alreadyHedge": 0.0,
                    "date": "15/06/2025",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 10.50,
                    "hedge": {
                      "strategyId": 132575,
                      "hedgeRate": 4.3121,
                      "expiryDate": "17/11/2025",
                      "price": 0.0,
                      "collateral": 4.408,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3121,
                      "protectAmount": 10.50
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "17/11/2025",
                    "hedgeError":true
                  },
                  {
                    "status": {
                      "type": 5,
                      "descriprion": "Already purchased the entire protection deal for the month"
                    },
                    "maxHedgeAmount": 0.0,
                    "recomendedHedgeAmount": 0.0,
                    "hedge": null,
                    "totalExposure": 0.0,
                    "alreadyHedge": 0.0,
                    "date": "15/07/2025",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 50.00,
                    "recomendedHedgeAmount": 17.10,
                    "hedge": {
                      "strategyId": 132567,
                      "hedgeRate": 4.2749,
                      "expiryDate": "15/08/2025",
                      "price": 0.0,
                      "collateral": 7.179,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.2749,
                      "protectAmount": 17.10
                    },
                    "totalExposure": 50.00,
                    "alreadyHedge": 0.0,
                    "date": "15/08/2025",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 14.25,
                    "hedge": {
                      "strategyId": 132573,
                      "hedgeRate": 4.2872,
                      "expiryDate": "15/09/2025",
                      "price": 0.0,
                      "collateral": 5.983,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.2872,
                      "protectAmount": 14.25
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "15/09/2025",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 14.25,
                    "hedge": {
                      "strategyId": 132566,
                      "hedgeRate": 4.2996,
                      "expiryDate": "15/10/2025",
                      "price": 0.0,
                      "collateral": 5.983,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.2996,
                      "protectAmount": 14.25
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "15/10/2025",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 6.75,
                    "hedge": {
                      "strategyId": 132570,
                      "hedgeRate": 4.3491,
                      "expiryDate": "16/02/2026",
                      "price": 0.0,
                      "collateral": 2.834,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3491,
                      "protectAmount": 6.75
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "16/02/2026",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 10.50,
                    "hedge": {
                      "strategyId": 132577,
                      "hedgeRate": 4.3373,
                      "expiryDate": "15/01/2026",
                      "price": 0.0,
                      "collateral": 4.408,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3373,
                      "protectAmount": 10.50
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "15/01/2026",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 6.75,
                    "hedge": {
                      "strategyId": 132564,
                      "hedgeRate": 4.3609,
                      "expiryDate": "16/03/2026",
                      "price": 0.0,
                      "collateral": 2.834,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3609,
                      "protectAmount": 6.75
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "16/03/2026",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 6.75,
                    "hedge": {
                      "strategyId": 132569,
                      "hedgeRate": 4.3728,
                      "expiryDate": "15/04/2026",
                      "price": 0.0,
                      "collateral": 2.834,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3728,
                      "protectAmount": 6.75
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "15/04/2026",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 6.75,
                    "hedge": {
                      "strategyId": 132565,
                      "hedgeRate": 4.3728,
                      "expiryDate": "15/05/2026",
                      "price": 0.0,
                      "collateral": 2.834,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3728,
                      "protectAmount": 6.75
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "15/05/2026",
                    "hedgeError":false
                  },
                  {
                    "status": {
                      "type": 1,
                      "descriprion": "Created"
                    },
                    "maxHedgeAmount": 25.00,
                    "recomendedHedgeAmount": 6.75,
                    "hedge": {
                      "strategyId": 132571,
                      "hedgeRate": 4.3728,
                      "expiryDate": "15/06/2026",
                      "price": 0.0,
                      "collateral": 2.834,
                      "productName": "LOCK & UP",
                      "productType": 1,
                      "notionalCurrency": "CHF",
                      "notionalCurrencySign": "CHF",
                      "secondCurrency": "ILS",
                      "secondCurrencySign": "₪",
                      "collateralCurrency": "ILS",
                      "liabilityRate": 4.3728,
                      "protectAmount": 6.75
                    },
                    "totalExposure": 25.00,
                    "alreadyHedge": 0.0,
                    "date": "15/06/2026",
                    "hedgeError":false
                  },
            ]
        }
    }
};
