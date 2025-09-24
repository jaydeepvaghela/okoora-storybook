import '@angular/localize/init';
import type { Preview } from '@storybook/angular';
import { setCompodocJson } from "@storybook/addon-docs/angular";
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import docJson from "../documentation.json";
setCompodocJson(docJson);

const preview: Preview = {
  decorators: [
    moduleMetadata({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'en'
        })
      ]
    })
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;