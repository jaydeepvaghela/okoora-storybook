import { Meta, StoryObj } from "@storybook/angular";
import { AdvancedPolicyStep2Component } from "./advanced-policy-step2.component";

const meta: Meta<AdvancedPolicyStep2Component> = {
    title: 'Risk Manager/Advanced Policy Steps/Step 2',
    component: AdvancedPolicyStep2Component,
    argTypes: {
        selectedMainStepprIndex: {
            control: {
                type: 'radio',
            },
            options: [0, 1, 2, 3, 4],
            defaultValue: 0,
            description: 'Selected main stepper index'
        },
        advancePolicyData: {
            control: 'object',
            description: 'Advance policy data',
            defaultValue: [
                {
                    "firstheading": "Level of Exposure Certainty",
                    "questions": "How certain are you that your projected cash flow will be realized?",
                    "className": "policy-question-one",
                    "selectAnswer": "Select an answer",
                    "bottomDesc": "For example, if you have signed contracts guaranteeing revenue or expenditure for the next few months, this indicates high certainty.",
                    "Ans": [
                        {
                            // "a1": "Don't Know",
                            "a2": "Low",
                            "a3": "Medium",
                            "a4": "High",
                            "a5": "Very High"
                        }
                    ]
                },
                {
                    "firstheading": "Ability to Impact Customer or Supplier Price",
                    "questions": "To what extent can you influence customer pricing or supplier costs?",
                    "className": "policy-question-two",
                    "selectAnswer": "Select an answer",
                    "bottomDesc": "If exchange rates change, can you raise your prices or renegotiate costs with suppliers?",
                    "Ans": [
                        {
                            // "a1": "Don't Know",
                            "a2": "High",
                            "a3": "Medium",
                            "a4": "Low",
                            "a5": "No Impact"
                        }
                    ]
                },
                {
                    "firstheading": "Business Differentiation from Competitors in the Industry",
                    "questions": "How similar is your exposure to exchange rates compared to that of your main competitors?",
                    "className": "policy-question-three",
                    "selectAnswer": "Select an answer",
                    "bottomDesc": "Consider if your main competitors are also affected by exchange rate fluctuations. Are you able to handle these fluctuations better or differently?",
                    "Ans": [
                        {
                            "a1": "Don't Know",
                            "a2": "High",
                            "a3": "Medium",
                            "a4": "Low",
                            "a5": "Very Low"
                        }
                    ]
                },
                {
                    "firstheading": "Level of Business Competitiveness",
                    "questions": "How competitive is the industry your company operates in?",
                    "className": "policy-question-four",
                    "selectAnswer": "Select an answer",
                    "bottomDesc": "How competitive is the market you operate in? how difficult is it for you to adjust prices in response to currency value changes?",
                    "Ans": [
                        {
                            "a1": "Don't Know",
                            "a2": "Low",
                            "a3": "Medium",
                            "a4": "High",
                            "a5": "Very High"
                        }
                    ]
                },
                {
                    "firstheading": "Sensitivity to Credit Consumption",
                    "questions": "What is the company's ability to consume additional credit lines for possible collateral requirements?",
                    "className": "policy-question-five",
                    "selectAnswer": "Select an answer",
                    "bottomDesc": "If required, can your company easily access additional credit to manage potential currency risks?",
                    "Ans": [
                        {
                            "a1": "Don't Know",
                            "a2": "Very High",
                            "a3": "High",
                            "a4": "Medium",
                            "a5": "Low"
                        }
                    ]
                }
            ],
        }
    }
};
export default meta;
type Story = StoryObj<AdvancedPolicyStep2Component>;
export const Default: Story = {
    args: {
        selectedMainStepprIndex: 0,
        advancePolicyData: [
            {
                "firstheading": "Level of Exposure Certainty",
                "questions": "How certain are you that your projected cash flow will be realized?",
                "className": "policy-question-one",
                "selectAnswer": "Select an answer",
                "bottomDesc": "For example, if you have signed contracts guaranteeing revenue or expenditure for the next few months, this indicates high certainty.",
                "Ans": [
                    {
                        // "a1": "Don't Know",
                        "a2": "Low",
                        "a3": "Medium",
                        "a4": "High",
                        "a5": "Very High"
                    }
                ]
            },
            {
                "firstheading": "Ability to Impact Customer or Supplier Price",
                "questions": "To what extent can you influence customer pricing or supplier costs?",
                "className": "policy-question-two",
                "selectAnswer": "Select an answer",
                "bottomDesc": "If exchange rates change, can you raise your prices or renegotiate costs with suppliers?",
                "Ans": [
                    {
                        // "a1": "Don't Know",
                        "a2": "High",
                        "a3": "Medium",
                        "a4": "Low",
                        "a5": "No Impact"
                    }
                ]
            },
            {
                "firstheading": "Business Differentiation from Competitors in the Industry",
                "questions": "How similar is your exposure to exchange rates compared to that of your main competitors?",
                "className": "policy-question-three",
                "selectAnswer": "Select an answer",
                "bottomDesc": "Consider if your main competitors are also affected by exchange rate fluctuations. Are you able to handle these fluctuations better or differently?",
                "Ans": [
                    {
                        "a1": "Don't Know",
                        "a2": "High",
                        "a3": "Medium",
                        "a4": "Low",
                        "a5": "Very Low"
                    }
                ]
            },
            {
                "firstheading": "Level of Business Competitiveness",
                "questions": "How competitive is the industry your company operates in?",
                "className": "policy-question-four",
                "selectAnswer": "Select an answer",
                "bottomDesc": "How competitive is the market you operate in? how difficult is it for you to adjust prices in response to currency value changes?",
                "Ans": [
                    {
                        "a1": "Don't Know",
                        "a2": "Low",
                        "a3": "Medium",
                        "a4": "High",
                        "a5": "Very High"
                    }
                ]
            },
            {
                "firstheading": "Sensitivity to Credit Consumption",
                "questions": "What is the company's ability to consume additional credit lines for possible collateral requirements?",
                "className": "policy-question-five",
                "selectAnswer": "Select an answer",
                "bottomDesc": "If required, can your company easily access additional credit to manage potential currency risks?",
                "Ans": [
                    {
                        "a1": "Don't Know",
                        "a2": "Very High",
                        "a3": "High",
                        "a4": "Medium",
                        "a5": "Low"
                    }
                ]
            }
        ]
    }
}