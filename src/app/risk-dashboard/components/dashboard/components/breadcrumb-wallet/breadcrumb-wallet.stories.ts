import { Meta, moduleMetadata, StoryObj } from "@storybook/angular";
import { BreadcrumbWalletComponent } from "./breadcrumb-wallet.component"
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

const meta: Meta<BreadcrumbWalletComponent> = {
    title: 'Risk Manager/Risk Manager Dashboard/Breadcrumb Wallet',
    component: BreadcrumbWalletComponent,
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({}),
                        queryParams: of({}),
                        snapshot: {
                            paramMap: {
                                get: () => null,
                            },
                            queryParamMap: {
                                get: () => null,
                            },
                        },
                    },
                },
            ],
        }),
    ],
    argTypes: {
        baseCurrency: { control: { type: 'file', accept: '.png,.jpg,.jpeg,.svg' } },
        fromCurrency: { control: { type: 'file', accept: '.png,.jpg,.jpeg,.svg' } },
        cashFlowName: { control: 'text', defaultValue: 'S.L ROBOTICS' },
        monthRange: { control: 'text', defaultValue: 'Jan 24 - Dec 24' },
    }
};
export default meta;
type Story = StoryObj<BreadcrumbWalletComponent>;

export const Default: Story = {
    args: {
        baseCurrency: 'images/ils-flag.svg',
        fromCurrency: 'flags/us.svg',
        cashFlowName: 'S.L ROBOTICS',
        monthRange: 'Jan 24 - Dec 24'
    }
};
