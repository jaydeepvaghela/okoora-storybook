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
        }
    }
};
export default meta;
type Story = StoryObj<HedgeAllDrawerComponent>;

export const Default: Story = {
    args: {
        
    }
};
