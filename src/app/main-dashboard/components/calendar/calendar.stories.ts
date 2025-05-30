import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CalendarComponent } from './calendar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MbscModule } from '@mobiscroll/angular';

import { CalenderAddAlertComponent } from '../calender-add-alert/calender-add-alert.component';
import { TableMenuComponent } from '../table-menu/table-menu.component';
import { DashboardTableViewComponent } from '../dashboard-table-view/dashboard-table-view.component';

export default {
  title: 'Main dashboard/Calendar',
  component: CalendarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        MatMenuModule,
        MatSelectModule,
        MatIconModule,
        MbscModule,
        CalenderAddAlertComponent,
        TableMenuComponent,
        DashboardTableViewComponent,
      ],
    }),
  ],
} as Meta<CalendarComponent>;

type Story = StoryObj<CalendarComponent>;

export const Default: Story = {
  args: {
    showTable: true,
    resourceId: 0,
  },
};
