import { Meta, StoryObj } from "@storybook/angular";
import { MonthlyExposureDetailsComponent } from "./monthly-exposure-details.component";

const meta: Meta<MonthlyExposureDetailsComponent> = {
    title: 'Components/Risk-Manager/Cashflow-Exposure/Monthly-Exposure-Details',
    component: MonthlyExposureDetailsComponent,
    argTypes: {
        monthlyExposureObject: {
            control: 'object',
            description: 'Monthly exposure details',
            defaultValue: {
                pair: "EUR/USD",
                sign: "$",
                toCurrency: "USD",
                selectedExposure: "Selling",
                monthlyAmount: 100000,
                monthlyPeriod: "12",
                flag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
                code: "USD",
                baseCurrencyFlag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
                baseCurrency: "EUR",
                baseCurrencySign: "€"
            }
        }
    }
};
export default meta;
type Story = StoryObj<MonthlyExposureDetailsComponent>;

export const Default: Story = {
    args: {
        monthlyExposureObject: {
            pair: "EUR/USD",
            sign: "$",
            toCurrency: "USD",
            selectedExposure: "Selling",
            monthlyAmount: 100000,
            monthlyPeriod: "12",
            flag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
            code: "USD",
            baseCurrencyFlag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
            baseCurrency: "EUR",
            baseCurrencySign: "€"
        }
    }
};