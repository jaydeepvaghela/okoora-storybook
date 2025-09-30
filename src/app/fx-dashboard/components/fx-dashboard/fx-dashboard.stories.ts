import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FxDashboardComponent } from './fx-dashboard.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AutoPilotListComponent } from '../auto-pilot-list/auto-pilot-list.component';
import { FxProtectedRiskComponent } from '../fx-protected-risk/fx-protected-risk.component';

export default {
  title: 'FX Dashboard/Auto-pilot Functionality/Listing',
  component: FxDashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatExpansionModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        AutoPilotListComponent,
        FxProtectedRiskComponent,
      ],
    }),
  ],
} as Meta<FxDashboardComponent>;

export const Default: StoryObj<FxDashboardComponent> = {
  args: {
    // Add any required mock inputs here
    hideProtectedRisk: true,
  },
};
