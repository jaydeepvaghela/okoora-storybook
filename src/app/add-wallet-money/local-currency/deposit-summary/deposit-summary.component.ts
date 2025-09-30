import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { DepositRegularRequestModel } from '../../../wallets/models/DepositRegularRequestModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deposit-summary',
  templateUrl: './deposit-summary.component.html',
  styleUrls: ['./deposit-summary.component.scss'],
  imports:[CommonModule]
})
export class DepositSummaryComponent {
  @Input() addMoneyScreenIndex!: number;
  @Input() localCurrencyForm: any;
  @Output() onScreenIndexChange = new EventEmitter<number>();
  showLoader = false;
  errorMessage = '';
  bankDetailToCopy = '';
  isSnackbarVisible = false;
  coppiedItem!: string;

  constructor(
    private _walletService: WalletsService
  ) { }

  ngOnInit() {
    let accountDetails = this.localCurrencyForm?.get('accountDetails').value;
    this.bankDetailToCopy = `Bank Account Name: ${accountDetails?.bankNickName || '-'}\nBank Full Name: ${accountDetails?.fullName || '-'}\nBank Name: ${accountDetails?.name || '-'}\nBank Code: ${accountDetails?.code || '-'}\nAccount Number: ${accountDetails?.accountNumber || '-'}\nIBAN: ${accountDetails?.iban || '-'}\n`;
  }

  onNextClick() {
    this.showLoader = true;
    let params: DepositRegularRequestModel = {
      Currency: this.localCurrencyForm?.get('currency').value,
      Amount: this.localCurrencyForm?.get('amount').value,
      OkooraBankId: parseInt(this.localCurrencyForm?.get('accountDetails')?.value?.id),
      BeneficiaryId: this.localCurrencyForm?.get('bankAccount').value.id,
      TransferType: parseInt(this.localCurrencyForm?.get('depositMethod').value),
      TransferAt: moment(this.localCurrencyForm?.get('depositDate').value).format('DD-MM-YYYY')
    }
    if (this.localCurrencyForm?.get('depositMethod').value == 3) {
      params.TransferAt = '';
    }
    this.showLoader = false;
    this.addMoneyScreenIndex++;
    this.onScreenIndexChange.emit(this.addMoneyScreenIndex);
    // this._walletService.depositRegular(params).subscribe({
    //   next: (result: any) => {
    //     this.showLoader = false;
    //     if (result) {
    //       this.addMoneyScreenIndex++;
    //       this.onScreenIndexChange.emit(this.addMoneyScreenIndex);
    //     }
    //   },
    //   error: (err: any) => {
    //     this.showLoader = false;
    //     this.errorMessage = err.error.apiErrorMessage[0];
    //   }
    // })
  }

  getCleanAmount(amount: string) {
    let pureNumber = Number(amount?.replace(/,/g, ''));
    return pureNumber;
  }

  contentCopied(coppiedItem: string) {
    this.coppiedItem = coppiedItem;
    this.isSnackbarVisible = true;
    setTimeout(() => {
      this.isSnackbarVisible = false;
    }, 3000);
  }
}
