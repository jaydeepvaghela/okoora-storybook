import { Meta, moduleMetadata, StoryObj } from "@storybook/angular";
import { DashboardComponent } from "./dashboard.component";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

const meta: Meta<DashboardComponent> = {
    title: 'Risk Manager/Risk Manager Dashboard',
    component: DashboardComponent,
    decorators: [
        moduleMetadata({
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
type Story = StoryObj<DashboardComponent>;

export const Default: Story = {};