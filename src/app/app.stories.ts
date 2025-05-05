import { applicationConfig, Meta, StoryObj } from "@storybook/angular";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { provideRouter, withHashLocation } from "@angular/router";
import { importProvidersFrom } from "@angular/core";
import { routes } from "./app.routes";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'i18n/', '.json');
  }
const meta: Meta<AppComponent> = {
    title: 'Components/Layout',
    component: AppComponent,
    decorators: [
        applicationConfig({
            providers: [
                provideRouter(routes, withHashLocation()),
                provideHttpClient(),
                importProvidersFrom(CommonModule, TranslateModule.forRoot({
                    loader: {
                      provide: TranslateLoader,
                      useFactory: (createTranslateLoader),
                      deps: [HttpClient]
                    },
                    defaultLanguage: 'en',
                  }),)
            ],
        }),
    ],
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Default: Story = {
};