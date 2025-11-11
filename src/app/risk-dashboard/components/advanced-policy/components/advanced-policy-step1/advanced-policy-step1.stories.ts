import { Meta, StoryObj } from "@storybook/angular";
import { AdvancedPolicyStep1Component } from "./advanced-policy-step1.component";

const meta: Meta<AdvancedPolicyStep1Component> = {
    title: 'Risk Manager/Advanced Policy Steps/Step 1',
    component: AdvancedPolicyStep1Component,
    argTypes: {
        midSpotRate: { control: 'number' },
    }
};
export default meta;
type Story = StoryObj<AdvancedPolicyStep1Component>;

export const Default: Story = {
    args: {
        midSpotRate: 5.555,
    }
};