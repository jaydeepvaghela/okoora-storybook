import { Meta, StoryObj } from "@storybook/angular";
import { HedgeAllDrawerComponent } from "./hedge-all-drawer.component";

const meta: Meta<HedgeAllDrawerComponent> = {
    title: 'Components/Risk-Manager/Hedge-All-Drawer',
    component: HedgeAllDrawerComponent,
    argTypes: {
        multipleHedgeData:{
            control: 'object',
            description: 'Hedge All data',
            defaultValue:[
                {
                    expiryDate: '17/11/2025',
                    hedgeRate: 4.4568,
                    protectAmount: 8,
                    recommendedHedgeAmount: 8,
                    maxHedge_amount: 25,
                    collateral: 3.475,
                    totalExposureAmount: 25,
                    openEditForSelling: false,
                    status: {
                        type: 1,
                        descriprion: 'Created'
                    },
                    maxHedgeAmount: 25,
                    recomendedHedgeAmount: 8,
                    hedge: {
                        strategyId: 132866,
                        hedgeRate: 4.4568,
                        expiryDate: '17/11/2025',
                        price: 0,
                        collateral: 3.475,
                        productName: 'LOCK & UP',
                        productType: 1,
                        notionalCurrency: 'CHF',
                        notionalCurrencySign: 'CHF',
                        secondCurrency: 'ILS',
                        secondCurrencySign: '₪',
                        collateralCurrency: 'ILS',
                        liabilityRate: 4.4568,
                        protectAmount: 8
                    },
                    totalExposure: 25,
                    alreadyHedge: 0,
                    date: '17/11/2025'
                },
            ]
        },
        initialHedgeInfo: {
            control: 'object',
            description: 'Initial Hedge Info',
            defaultValue: {
            price: 0,
            requiredCollateral: 48.832,
            totalHedgeAmount: 100.35,
            totalHedgePercent: 23.5625,
            avgHedgeRate: 4.4971,
            liabilityRate: 4.4971
          }
        }
    }
};
export default meta;
type Story = StoryObj<HedgeAllDrawerComponent>;

export const Default: Story = {
    args: {
        multipleHedgeData: [
            {
                "expiryDate": "17/11/2025",
                "hedgeRate": 4.4568,
                "protectAmount": 8,
                "recommendedHedgeAmount": 8,
                "maxHedge_amount": 25,
                "collateral": 3.475,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 8,
                "hedge": {
                    "strategyId": 132866,
                    "hedgeRate": 4.4568,
                    "expiryDate": "17/11/2025",
                    "price": 0,
                    "collateral": 3.475,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.4568,
                    "protectAmount": 8
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "17/11/2025"
            },
            {
                "expiryDate": "15/08/2025",
                "hedgeRate": 4.4202,
                "protectAmount": 14.1,
                "recommendedHedgeAmount": 14.1,
                "maxHedge_amount": 50,
                "collateral": 6.125,
                "totalExposureAmount": 50,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 50,
                "recomendedHedgeAmount": 14.1,
                "hedge": {
                    "strategyId": 132867,
                    "hedgeRate": 4.4202,
                    "expiryDate": "15/08/2025",
                    "price": 0,
                    "collateral": 6.125,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.4202,
                    "protectAmount": 14.1
                },
                "totalExposure": 50,
                "alreadyHedge": 0,
                "date": "15/08/2025"
            },
            {
                "expiryDate": "15/09/2025",
                "hedgeRate": 4.4324,
                "protectAmount": 11.75,
                "recommendedHedgeAmount": 11.75,
                "maxHedge_amount": 25,
                "collateral": 5.104,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 11.75,
                "hedge": {
                    "strategyId": 132869,
                    "hedgeRate": 4.4324,
                    "expiryDate": "15/09/2025",
                    "price": 0,
                    "collateral": 5.104,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.4324,
                    "protectAmount": 11.75
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/09/2025"
            },
            {
                "expiryDate": "15/10/2025",
                "hedgeRate": 4.4446,
                "protectAmount": 11.75,
                "recommendedHedgeAmount": 11.75,
                "maxHedge_amount": 25,
                "collateral": 5.104,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 11.75,
                "hedge": {
                    "strategyId": 132854,
                    "hedgeRate": 4.4446,
                    "expiryDate": "15/10/2025",
                    "price": 0,
                    "collateral": 5.104,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.4446,
                    "protectAmount": 11.75
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/10/2025"
            },
            {
                "expiryDate": "16/02/2026",
                "hedgeRate": 4.4926,
                "protectAmount": 4.25,
                "recommendedHedgeAmount": 4.25,
                "maxHedge_amount": 25,
                "collateral": 1.846,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 4.25,
                "hedge": {
                    "strategyId": 132858,
                    "hedgeRate": 4.4926,
                    "expiryDate": "16/02/2026",
                    "price": 0,
                    "collateral": 1.846,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.4926,
                    "protectAmount": 4.25
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "16/02/2026"
            },
            {
                "expiryDate": "15/01/2026",
                "hedgeRate": 4.4813,
                "protectAmount": 8,
                "recommendedHedgeAmount": 8,
                "maxHedge_amount": 25,
                "collateral": 3.475,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 8,
                "hedge": {
                    "strategyId": 132856,
                    "hedgeRate": 4.4813,
                    "expiryDate": "15/01/2026",
                    "price": 0,
                    "collateral": 3.475,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.4813,
                    "protectAmount": 8
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/01/2026"
            },
            {
                "expiryDate": "16/03/2026",
                "hedgeRate": 4.5039,
                "protectAmount": 4.25,
                "recommendedHedgeAmount": 4.25,
                "maxHedge_amount": 25,
                "collateral": 1.846,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 4.25,
                "hedge": {
                    "strategyId": 132868,
                    "hedgeRate": 4.5039,
                    "expiryDate": "16/03/2026",
                    "price": 0,
                    "collateral": 1.846,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.5039,
                    "protectAmount": 4.25
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "16/03/2026"
            },
            {
                "expiryDate": "15/04/2026",
                "hedgeRate": 4.5152,
                "protectAmount": 4.25,
                "recommendedHedgeAmount": 4.25,
                "maxHedge_amount": 25,
                "collateral": 1.846,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 4.25,
                "hedge": {
                    "strategyId": 132862,
                    "hedgeRate": 4.5152,
                    "expiryDate": "15/04/2026",
                    "price": 0,
                    "collateral": 1.846,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.5152,
                    "protectAmount": 4.25
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/04/2026"
            },
            {
                "expiryDate": "15/05/2026",
                "hedgeRate": 4.5152,
                "protectAmount": 4.25,
                "recommendedHedgeAmount": 4.25,
                "maxHedge_amount": 25,
                "collateral": 1.846,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 4.25,
                "hedge": {
                    "strategyId": 132853,
                    "hedgeRate": 4.5152,
                    "expiryDate": "15/05/2026",
                    "price": 0,
                    "collateral": 1.846,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.5152,
                    "protectAmount": 4.25
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/05/2026"
            },
            {
                "expiryDate": "15/06/2026",
                "hedgeRate": 4.5152,
                "protectAmount": 4.25,
                "recommendedHedgeAmount": 4.25,
                "maxHedge_amount": 25,
                "collateral": 1.846,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 4.25,
                "hedge": {
                    "strategyId": 132871,
                    "hedgeRate": 4.5152,
                    "expiryDate": "15/06/2026",
                    "price": 0,
                    "collateral": 1.846,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.5152,
                    "protectAmount": 4.25
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/06/2026"
            },
            {
                "expiryDate": "15/07/2026",
                "hedgeRate": 4.5152,
                "protectAmount": 4.25,
                "recommendedHedgeAmount": 4.25,
                "maxHedge_amount": 25,
                "collateral": 1.846,
                "totalExposureAmount": 25,
                "openEditForSelling": false,
                "status": {
                    "type": 1,
                    "descriprion": "Created"
                },
                "maxHedgeAmount": 25,
                "recomendedHedgeAmount": 4.25,
                "hedge": {
                    "strategyId": 132855,
                    "hedgeRate": 4.5152,
                    "expiryDate": "15/07/2026",
                    "price": 0,
                    "collateral": 1.846,
                    "productName": "LOCK & UP",
                    "productType": 1,
                    "notionalCurrency": "CHF",
                    "notionalCurrencySign": "CHF",
                    "secondCurrency": "ILS",
                    "secondCurrencySign": "₪",
                    "collateralCurrency": "ILS",
                    "liabilityRate": 4.5152,
                    "protectAmount": 4.25
                },
                "totalExposure": 25,
                "alreadyHedge": 0,
                "date": "15/07/2026"
            }
        ],
        initialHedgeInfo: {
            price: 0,
            requiredCollateral: 48.832,
            totalHedgeAmount: 100.35,
            totalHedgePercent: 23.5625,
            avgHedgeRate: 4.4971,
            liabilityRate: 4.4971
        }
    }
};
