import { Meta, StoryObj } from "@storybook/angular";
import { AnnualExposureDetailsComponent } from "./annual-exposure-details.component";

const meta: Meta<AnnualExposureDetailsComponent> = {
    title: 'Risk Manager/Risk Manager Dashboard/Annual Exposure Details',
    component: AnnualExposureDetailsComponent,
    argTypes: {
        annualExposure: { control: 'number', defaultValue: 1200001.2 },
        recommendedHedge: { control: 'number', defaultValue: 720001 },
        recommendedHedgePercent: { control: 'number', defaultValue: 60 },
        currentHedge: { control: 'number', defaultValue: 0 },
        currentHedgePercent: { control: 'number', defaultValue: 0 },
        avgHedgeRate: { control: 'text', defaultValue: '--' }
      }
};
export default meta;
type Story = StoryObj<AnnualExposureDetailsComponent>;

export const Default: Story = {
    args: {
        annualExposure: 1200001.2,
        recommendedHedge: 720001,
        recommendedHedgePercent: 60,
        currentHedge: 0,
        currentHedgePercent: 0,
        avgHedgeRate: '--'
      }
};
