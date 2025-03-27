import { Meta, StoryObj } from "@storybook/angular";
import { BreadcrumbWalletComponent } from "./breadcrumb-wallet.component"

const meta: Meta<BreadcrumbWalletComponent> = {
    title: 'Components/Risk-Manager/Breadcrumb-wallet',
    component:BreadcrumbWalletComponent,
    argTypes:{
        baseCurrency: { control: { type: 'file', accept: '.png,.jpg,.jpeg,.svg' } },
        fromCurrency: { control: { type: 'file', accept: '.png,.jpg,.jpeg,.svg' } },
        cashFlowName: { control: 'text', defaultValue: 'S.L ROBOTICS' },
        monthRange: { control: 'text', defaultValue: 'Jan 24 - Dec 24' },
    }
};
export default meta;
type Story = StoryObj<BreadcrumbWalletComponent>;

export const Default: Story = {
    args:{
        baseCurrency:'images/ils-flag.svg',
        fromCurrency:'flags/us.svg',
        cashFlowName:'S.L ROBOTICS',
        monthRange:'Jan 24 - Dec 24'
    }
};
