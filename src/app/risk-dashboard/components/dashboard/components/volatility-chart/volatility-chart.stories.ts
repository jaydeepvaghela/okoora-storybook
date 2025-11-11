import { Meta, StoryObj } from "@storybook/angular";
import { VolatilityChartComponent } from "./volatility-chart.component";

const meta: Meta<VolatilityChartComponent> = {
    title: 'Risk Manager/Risk Manager Dashboard/Volatility Chart',
    component: VolatilityChartComponent,
    argTypes:{
        currentIndicatorValue:{
            control:'number',
            description:'Current Indicator Value',
            defaultValue:11,
        },
        minVolatility:{
            control:'number',
            description:'Minimum Volatility Value',
            defaultValue:7,
        },
        maxVolatility:{
            control:'number',
            description:'Maximum Volatility Value',
            defaultValue:15,
        },
        volatilityRank:{
            control:'text',
            description:'Market Volatility Status',
            defaultValue:'volatile',
        },
    }
};
export default meta;
type Story =  StoryObj<VolatilityChartComponent>;

export const Default: Story = {
    args:{
        currentIndicatorValue:11,
        minVolatility:7,
        maxVolatility:15,
        volatilityRank:'volatile'
    }
}