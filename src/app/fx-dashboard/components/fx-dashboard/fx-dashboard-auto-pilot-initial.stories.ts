import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxDashboardComponent } from './fx-dashboard.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export default {
  title: 'FX Dashboard/Auto-pilot Functionality/Auto-pilot setup',
  component: FxDashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatButtonModule,
      ],
      providers: [
        {
          provide: 'ConnectorService',
          useValue: {
            openFxErp: () => {
              alert('Enable Auto pilot clicked!');
            },
          },
        },
      ],
    }),
  ],
} as Meta<FxDashboardComponent>;

export const Default: StoryObj<FxDashboardComponent> = {
  args: {
    isPayableProtectFilled: false,
    conversionData: [],
    hideProtectedRisk: true,
  },
};
