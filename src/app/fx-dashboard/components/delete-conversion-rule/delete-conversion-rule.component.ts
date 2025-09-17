import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-conversion-rule',
  templateUrl: './delete-conversion-rule.component.html',
  styleUrls: ['./delete-conversion-rule.component.scss'],
  imports: [MatDialogModule],
})
export class DeleteConversionRuleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DeleteConversionRuleComponent>) {
    this.data = data;
  }
  confirm(result: boolean) {
    this.dialogRef.close({ confirmed: result });
  }
}
