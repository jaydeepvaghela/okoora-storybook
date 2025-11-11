import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MassPaymentComponent } from '../mass-payment/mass-payment.component';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { WalletListDialogComponent } from '../../wallet-list-dialog/wallet-list-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-currency',
  templateUrl: './wallet-currency.component.html',
  styleUrls: ['./wallet-currency.component.scss'],
  imports: [CommonModule]
})
export class WalletCurrencyComponent {
  @Input() selectedWallet: any;
  @Input()
  walletList!: any[];
  @Input() isUpdateCurrency: boolean = false;
  @Input() beneficiaryForms!: any[];
  @Output() beneficiaryFormsChange = new EventEmitter<FormGroup[]>();
  @Output() changeCurrencyWallet: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeIsLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private cd: ChangeDetectorRef, private _walletService: WalletsService, public dialog: MatDialog, public dialogRef: MatDialogRef<MassPaymentComponent>) {}

  ngOnInit(): void { 
    console.log('selectedWallet', this.selectedWallet?.wallet_Currency?.code);
  }
  
  openWalletListDialog() {
    const dialogRef = this.dialog.open(WalletListDialogComponent, {
      width: '562px',
      height: '544px',
      panelClass: 'wallet-list-dialog',
      disableClose: true,
      data: {
        walletList: this.walletList,
        selectedWallet: this.selectedWallet?.wallet_Currency?.code,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeCurrencyWallet.emit(result.wallet);
        this.selectedWallet = result.wallet;
        this.updateSelectedWalletInForms();
        this.updateMultiPaymentRequests();

        this.cd.detectChanges();
      }
    });
  }
  appendFormData(formData: any, keyPrefix: any, formGroup: any, fields: string[]) {
    fields.forEach((field) => {
      let control = formGroup.get(field);
      if (control) {
        formData.append(`${keyPrefix}.${field}`, control.value);
      } else {
        console.error(`Form control '${field}' is missing in form group.`);
      }
    });
  }

  processResponseBody(body: any, formGroups: any) {
    if (!Array.isArray(body)) {
      console.error('Response body is not an array:', body);
      return;
    }

    body.forEach((item, index) => {
      if (index < formGroups.length && formGroups[index]) {
        this.updateFormGroupWithResponse(item, formGroups[index]);
      }
    });
  }
  formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  updateFormGroupWithResponse(item: any, formGroup: FormGroup) {
    if (!item) {
      console.error('Invalid item structure:', item);
      return;
    }
    const amountValue = item.paymentRequst ? item.paymentRequst.send : item.send;
    const chargeValue = item.paymentRequst ? item.paymentRequst.charge : item.charge;
    const costTypeArray = item.costList;
    const costType = item.paymentRequst.costType;
    formGroup.patchValue({
      amount: this.formatNumberWithCommas(amountValue),
      charge: chargeValue,
      costType: costType,
      costList: costTypeArray,
    });
  }

  updateMultiPaymentRequests() {
    if (!this.beneficiaryForms.length) return;

    const formData = new FormData();
    formData.append('currency', this.selectedWallet?.wallet_Currency?.code);

    this.beneficiaryForms.forEach((formGroup, i) => {
      const requestIdControl = formGroup.get('requestId');
      if (requestIdControl) {
        formData.append(`multiRequestId[${i}]`, requestIdControl.value);
      } else {
        console.error('Form control "requestId" is missing in form group:', i);
      }
    });
    this.changeIsLoading.emit(true);
    // this._walletService.updateMultiPaymentRequest(formData).subscribe(({ body }) => {
    //   this.processResponseBody(body, this.beneficiaryForms);
    //   this.changeIsLoading.emit(false);
    //   this.beneficiaryFormsChange.emit(this.beneficiaryForms);
    // },err =>{
      
    //   this.changeIsLoading.emit(false);
    // });
  }

  updateSelectedWalletInForms() {
    if (this.beneficiaryForms && this.beneficiaryForms.length > 0) {
      this.beneficiaryForms.forEach((formGroup: FormGroup) => {
        formGroup.patchValue({ selectedWallet: this.selectedWallet });
      });
      this.beneficiaryFormsChange.emit(this.beneficiaryForms);
    }
  }
}
