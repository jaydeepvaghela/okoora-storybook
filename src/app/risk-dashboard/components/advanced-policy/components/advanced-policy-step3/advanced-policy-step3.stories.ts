import { Meta, StoryObj } from "@storybook/angular";
import { AdvancedPolicyStep3Component } from "./advanced-policy-step3.component";

const meta: Meta<AdvancedPolicyStep3Component> = {
    title: 'Risk Manager/Advanced Policy Steps/Step 3',
    component: AdvancedPolicyStep3Component,
    argTypes: {
        step2Res: {
            control: 'object',
            description: 'Question Response',
            defaultValue: [
                {
                    "index": 0,
                    "answer": "5.0955"
                },
                {
                    "index": 1,
                    "answer": "High"
                },
                {
                    "index": 2,
                    "answer": "Medium"
                },
                {
                    "index": 3,
                    "answer": "Low"
                },
                {
                    "index": 4,
                    "answer": "Very High"
                },
                {
                    "index": 5,
                    "answer": "High"
                }
            ]
        }
    }
};
export default meta;
type Story = StoryObj<AdvancedPolicyStep3Component>;
export const Default: Story = {
    args: {
        step2Res: [
            {
                "index": 0,
                "answer": "5.0955"
            },
            {
                "index": 1,
                "answer": "High"
            },
            {
                "index": 2,
                "answer": "Medium"
            },
            {
                "index": 3,
                "answer": "Low"
            },
            {
                "index": 4,
                "answer": "Very High"
            },
            {
                "index": 5,
                "answer": "High"
            }
        ]
    }
}