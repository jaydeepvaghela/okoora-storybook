import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ManageHedgeDealsFilterComponent } from './manage-hedge-deals-filter.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

export default {
  title: 'FX Dashboard/Manage Hedge Deals Filter',
  component: ManageHedgeDealsFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatDialogModule,
        CommonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule
      ],
      providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        FormBuilder
      ]
    })
  ]
} as Meta<ManageHedgeDealsFilterComponent>;

export const Default: StoryObj<ManageHedgeDealsFilterComponent> = {
  args: {
    data: {
      filterPayload: {
        dealTypes: [1, 2],
        tradeDateFrom: '2025-09-01',
        tradeDateTo: '2025-09-18',
        expiryDateFrom: '2025-09-01',
        expiryDateTo: '2025-09-18',
        currencies: ['USD', 'EUR'],
        hedgeStatus: [2]
      }
    }
  }
};
