import { Meta, StoryObj } from "@storybook/angular";
import { QuickHedgeDrawerComponent } from "./quick-hedge-drawer.component";

const meta: Meta<QuickHedgeDrawerComponent> = {
    title: 'Components/Risk-Manager/Quick-Hedge-Drawer',
    component: QuickHedgeDrawerComponent,
    argTypes: {
        selectedQuickHedgeData: {
            control: 'object',
            description: 'Quick Hedge data',
            defaultValue: {
                expiryDate: '17/11/2025',
                hedgeRate: 4.4532,
                protectAmount: 84345.43,
                recommendedHedgeAmount: 8,
                maxHedge_amount: 25,
                collateral: 3.472,
                totalExposureAmount: 25,
                openEditForSelling: false,
                status: {
                    type: 1,
                    descriprion: 'Created'
                },
                maxHedgeAmount: 25,
                recomendedHedgeAmount: 8,
                hedge: {
                    strategyId: 132772,
                    hedgeRate: 4.4532,
                    expiryDate: '17/11/2025',
                    price: 0,
                    collateral: 3.472,
                    productName: 'LOCK & UP',
                    productType: 1,
                    notionalCurrency: 'CHF',
                    notionalCurrencySign: 'CHF',
                    secondCurrency: 'ILS',
                    secondCurrencySign: '₪',
                    collateralCurrency: 'ILS',
                    liabilityRate: 4.4532,
                    protectAmount: 8
                },
                totalExposure: 25,
                alreadyHedge: 0,
                date: '17/11/2025',
                saveActivate: false
            }
        }
    }
};
export default meta;
type Story = StoryObj<QuickHedgeDrawerComponent>;

export const Default: Story = {
    args: {
        selectedQuickHedgeData: {
            expiryDate: '17/11/2025',
            hedgeRate: 4.4532,
            protectAmount: 84345.43,
            recommendedHedgeAmount: 8,
            maxHedge_amount: 25,
            collateral: 3.472,
            totalExposureAmount: 25,
            openEditForSelling: false,
            status: {
                type: 1,
                descriprion: 'Created'
            },
            maxHedgeAmount: 25,
            recomendedHedgeAmount: 8,
            hedge: {
                strategyId: 132772,
                hedgeRate: 4.4532,
                expiryDate: '17/11/2025',
                price: 0,
                collateral: 3.472,
                productName: 'LOCK & UP',
                productType: 1,
                notionalCurrency: 'CHF',
                notionalCurrencySign: 'CHF',
                secondCurrency: 'ILS',
                secondCurrencySign: '₪',
                collateralCurrency: 'ILS',
                liabilityRate: 4.4532,
                protectAmount: 8
            },
            totalExposure: 25,
            alreadyHedge: 0,
            date: '17/11/2025',
            saveActivate: false
        }
    }
};
