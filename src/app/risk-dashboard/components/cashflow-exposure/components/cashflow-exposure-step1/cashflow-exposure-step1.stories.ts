import { Meta, StoryObj } from "@storybook/angular";
import { CashflowExposureStep1Component } from "./cashflow-exposure-step1.component";

const meta: Meta<CashflowExposureStep1Component> = {
    title: 'Components/Risk-Manager/Cashflow-Exposure/Cashflow-Exposure-Step1',
    component: CashflowExposureStep1Component,
    argTypes: {
        heading: { control: 'text' },
        subHeading: { control: 'text' },
        actionWords: { control: 'object' },
        introText: { control: 'text' },
    }
};
export default meta;
type Story = StoryObj<CashflowExposureStep1Component>;

export const Default: Story = {
    args: {
        heading: 'Introducing risk manager',
        subHeading: 'Your cash flow is at',
        actionWords: ["Buy", "Sell", "Pay", "Convert"],
        introText: 'Introducing ABCM™ risk manager, the tool that can protect your cash flow from market volatility',
    }
};