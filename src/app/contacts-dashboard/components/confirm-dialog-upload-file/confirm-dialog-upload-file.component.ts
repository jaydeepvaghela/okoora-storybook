import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-upload-file',
  templateUrl: './confirm-dialog-upload-file.component.html',
  styleUrls: ['./confirm-dialog-upload-file.component.scss']
})
export class ConfirmDialogUploadFileComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDialogUploadFileComponent>) {}

  stopfileUpload() {
    this.dialogRef.close(true);
  }

}
