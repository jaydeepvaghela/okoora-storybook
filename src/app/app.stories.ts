import { Meta, StoryObj } from "@storybook/angular";
import { AppComponent } from "./app.component";

const meta: Meta<AppComponent> = {
    title: 'Components/Layout',
    component: AppComponent,
    argTypes:{
        ShowDashboard: { control: 'boolean' },
        Showhedging: { control: 'boolean' },
        showCashflowExposure: { control: 'boolean' }
    }
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Default: Story = {
    args:{
        ShowDashboard: false,
        Showhedging: false,
        showCashflowExposure: true
    }
};