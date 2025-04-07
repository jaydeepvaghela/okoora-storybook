import { ActiveProtectionTraderoomComponent } from "./active-protection-traderoom.component";
import { Meta,StoryObj } from "@storybook/angular";

const meta: Meta<ActiveProtectionTraderoomComponent> = {
    title: "Components/Risk-Manager/Active Protection Traderoom",
    component: ActiveProtectionTraderoomComponent,
    argTypes: {
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
        hedgeStatus: 6,
    },
};

