import { ActiveProtectionTraderoomComponent } from "./active-protection-traderoom.component";
import { Meta,StoryObj } from "@storybook/angular";

const meta: Meta<ActiveProtectionTraderoomComponent> = {
    title: "Components/Risk-Manager/Active Protection Traderoom",
    component: ActiveProtectionTraderoomComponent,
    argTypes: {
        protectedAmount:{control:'number'},
        primaryFlag:{control:'file'},
        secondaryFlag:{control:'file'},
        primaryCurrencySign:{control:'text'},
        secondaryCurrencySign:{control:'text'},
        collateralAmount:{control:'number'},
        price:{control:'number'},
        expiryDate:{control:'text'},
        hedgeStatus: {
            control:'select',
            options: [
                2,
                3,
                4,
                6,
                7,
            ],
        },
    },
};
export default meta;
type Story = StoryObj<ActiveProtectionTraderoomComponent>;

export const Default: Story = {
    args: {
        protectedAmount: 10000.00,
        primaryFlag: '/flags/ils-flag.svg',
        secondaryFlag: '/flags/usd-flag.svg',
        primaryCurrencySign: '₪',
        secondaryCurrencySign: '$',
        collateralAmount: 1200.00,
        price: 300,
        expiryDate: "Jan 15, 2026",
        hedgeStatus: 6,
    },
};

