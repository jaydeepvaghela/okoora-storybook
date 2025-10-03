import { Meta, StoryObj } from "@storybook/angular";
import { MonthlyExposureDetailsComponent } from "./monthly-exposure-details.component";

const defaultMonthlyExposureObject = {
    pair: "USD/ILS",
    sign: "$",
    toCurrency: "USD",
    selectedExposure: "Selling",
    monthlyAmount: 100000,
    monthlyPeriod: 12,
    flag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
    code: "USD",
    baseCurrencyFlag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
    baseCurrency: "ILS",
    baseCurrencySign: "₪"
};

const meta: Meta<MonthlyExposureDetailsComponent> = {
    title: 'Risk Manager/Cashflow Exposure/Monthly Exposure Details',
    component: MonthlyExposureDetailsComponent,
    argTypes: {
        monthlyExposureObject: {
            control: 'object',
            description: 'Monthly exposure details',
            defaultValue: defaultMonthlyExposureObject
        },
        monthlyPeriod: {
            control: 'number',
            defaultValue: 12
        }
    }
};
export default meta;
type Story = StoryObj<MonthlyExposureDetailsComponent>;

export const Default: Story = {
    args: {
        monthlyExposureObject: defaultMonthlyExposureObject,
        monthlyPeriod: 12
    }
};
