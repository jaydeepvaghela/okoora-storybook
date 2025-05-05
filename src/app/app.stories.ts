import { applicationConfig, Meta, StoryObj } from "@storybook/angular";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { provideRouter, withHashLocation } from "@angular/router";
import { importProvidersFrom } from "@angular/core";
import { routes } from "./app.routes";

const meta: Meta<AppComponent> = {
    title: 'Components/Layout',
    component: AppComponent,
    decorators: [
        applicationConfig({
            providers: [
                provideRouter(routes, withHashLocation()),
                importProvidersFrom(CommonModule)
            ],
        }),
    ],
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Default: Story = {
};