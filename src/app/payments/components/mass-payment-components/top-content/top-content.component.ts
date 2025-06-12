import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SinglePaymentSendComponent } from '../../single-payment-components/single-payment-send/single-payment-send.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
  styleUrls: ['./top-content.component.scss'],
  imports: [MatMenuModule]
})
export class TopContentComponent {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    
  }

  sendSinglePayment() {
    let activeWallet: any = localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(SinglePaymentSendComponent, {
      width: '100vw',
      maxWidth: '100vw',
      data: {
        selectedwalletInfo: currency,
        payment: true
      },
      disableClose: true,
    }).afterClosed()
      .subscribe((shouldReload: any) => {
      });
  }
}
