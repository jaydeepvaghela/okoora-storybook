import { ActiveProtectionTraderoomComponent } from "./active-protection-traderoom.component";
import { Meta,StoryObj,moduleMetadata  } from "@storybook/angular";
import { MatDialogRef } from "@angular/material/dialog";

const meta: Meta<ActiveProtectionTraderoomComponent> = {
    title: "Components/Risk-Manager/Active Protection Traderoom",
    component: ActiveProtectionTraderoomComponent,
    decorators: [
        moduleMetadata({
          providers: [
            {
              provide: MatDialogRef,
              useValue: {
                close: () => {} // mock implementation
              }
            }
          ]
        })
      ],
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

