import { Meta, StoryObj } from "@storybook/angular";
import { AppComponent } from "./app.component";

const meta: Meta<AppComponent> = {
    title: 'Components/Layout',
    component: AppComponent,
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Default: Story = {};