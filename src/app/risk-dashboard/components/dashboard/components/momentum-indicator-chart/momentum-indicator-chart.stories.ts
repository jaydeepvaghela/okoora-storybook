import { Meta, StoryObj } from "@storybook/angular";
import { MomentumIndicatorChartComponent } from "./momentum-indicator-chart.component";

const meta: Meta<MomentumIndicatorChartComponent> = {
    title: 'Components/Risk-Manager/Momentum-indicator-chart',
    component: MomentumIndicatorChartComponent,
    argTypes:{
        currencyPair:{
            control:'text',
            description:'Currency Pair Value',
            defaultValue:'USD/ILS',
        },
        riskdirection:{
            control:'select',
            options:[1,2],
            description:'Select risk direction',
            defaultValue:1,
        },
        momentumRankScore:{
            control:'select',
            options:[0,1,2,3],
            description:'Select momentum score',
            defaultValue:2,
        },
    },
};
export default meta;
type Story =  StoryObj<MomentumIndicatorChartComponent>;

export const Default: Story = {
    args:{
        currencyPair:'USD/ILS',
        riskdirection:1,
        momentumRankScore:2,
    }
}