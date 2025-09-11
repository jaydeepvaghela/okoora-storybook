
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AddNoteComponent } from './add-note.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

const formBuilder = new FormBuilder();

// ✅ Mock parent form data
const mockParentForm = formBuilder.group({
  note: ['Initial note'],
  invoiceNumber: ['INV-1234'],
  product_reference: ['Goha'],
});

// ✅ Meta Configuration
const meta: Meta<AddNoteComponent> = {
  title: 'Payments/Payment Dashboard/Payments/Mass Payment/Recipient Table/Add Notes',
  component: AddNoteComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { formGroup: mockParentForm } },
        { provide: MatDialogRef, useValue: { close: () => console.log('Dialog closed') } },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<AddNoteComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
  }),
};
