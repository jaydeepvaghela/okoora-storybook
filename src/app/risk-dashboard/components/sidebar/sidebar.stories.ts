import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SidebarComponent } from './sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const meta: Meta<SidebarComponent> = {
  title: 'Components/Sidebar',
  component: SidebarComponent,
  decorators: [
    moduleMetadata({
      declarations: [SidebarComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: () => null,
              },
              queryParamMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<SidebarComponent>;

export const Default: Story = {};
