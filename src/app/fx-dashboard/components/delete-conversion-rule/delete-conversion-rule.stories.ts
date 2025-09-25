import { Meta, StoryObj } from '@storybook/angular';
import { DeleteConversionRuleComponent } from './delete-conversion-rule.component';
import { moduleMetadata } from '@storybook/angular';
import { MatDialogModule } from '@angular/material/dialog';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export default {
  title: 'FX Dashboard/Auto-pilot functionality/Conversion Rules/Delete Conversion Rule',
  component: DeleteConversionRuleComponent,
  decorators: [
    moduleMetadata({
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ruleName: 'Convert USD to EUR' } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }),
  ],
} as Meta<DeleteConversionRuleComponent>;

export const Default: StoryObj<DeleteConversionRuleComponent> = {
  args: {
    data: {
      ruleName: 'Convert USD to EUR',
    },
  },
};
