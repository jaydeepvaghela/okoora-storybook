import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-future-payment',
  templateUrl: './invoice-future-payment.component.html',
  styleUrls: ['./invoice-future-payment.component.scss']
})
export class InvoiceFuturePayment {
  constructor(private dialogRef: MatDialogRef<InvoiceFuturePayment>) {}

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
