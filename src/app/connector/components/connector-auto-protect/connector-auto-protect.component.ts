import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connector-auto-protect',
  templateUrl: './connector-auto-protect.component.html',
  styleUrls: ['./connector-auto-protect.component.scss'],
  imports:[MatDialogModule,CommonModule]
})
export class ConnectorAutoProtectComponent implements OnInit, OnChanges {
  @Input() data: any;
  autoProtect: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public injectedData: any, private dialogRef: MatDialogRef<ConnectorAutoProtectComponent>) {
    // Prefer Storybook args (data input) if present, else fallback to injectedData
    this.data = this.data || injectedData;
  }
  ngOnInit() {
    this.autoProtect = this.data?.isAutoProtectEnabled ?? false;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.autoProtect = changes['data'].currentValue.isAutoProtectEnabled ?? false;
    }
  }
  confirm(result: boolean) {
    this.dialogRef.close({ confirmed: result });
  }
}
