import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connector-auto-protect',
  templateUrl: './connector-auto-protect.component.html',
  styleUrls: ['./connector-auto-protect.component.scss'],
  imports:[MatDialogModule,CommonModule]
})
export class ConnectorAutoProtectComponent {
  autoProtect: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<ConnectorAutoProtectComponent>) {
    this.data = data;
  }
  ngOnInit() {
    this.autoProtect = this.data?.isAutoProtectEnabled;
  }
  confirm(result: boolean) {
    this.dialogRef.close({ confirmed: result });
  }
}
