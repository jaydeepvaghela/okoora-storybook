import { Component, EventEmitter, Output } from '@angular/core';
// import { DashboardService } from '../dashboard/services/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { OtherCurrencyComponent } from './other-currency/other-currency.component';
import { LocalCurrencyComponent } from './local-currency/local-currency.component';
import { DepositSummaryComponent } from './local-currency/deposit-summary/deposit-summary.component';
import { FinalDepositComponent } from './local-currency/final-deposit/final-deposit.component';
import { CommonModule } from '@angular/common';
// import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-add-wallet-money',
  templateUrl: './add-wallet-money.component.html',
  styleUrls: ['./add-wallet-money.component.scss'],
  imports:[MatTabsModule,OtherCurrencyComponent,LocalCurrencyComponent,DepositSummaryComponent,FinalDepositComponent,CommonModule]
})
export class AddWalletMoneyComponent {
  @Output() onCloseClick = new EventEmitter<any>();
  addMoneyScreenIndex = 0;
  localCurrencyForm!: FormGroup;
  
  isEuAccount = false;

  constructor(
    public fb: FormBuilder,
    // private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.localCurrencyForm = this.fb.group({
    amount: [''],
    currency: ['ILS'],
    depositMethod: [''],
    bankAccount: [null],
    depositDate: [null],
    accountDetails: [null]
  });
    // this._authService.currentUserProfile.subscribe(res => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.isEuAccount = user?.afiiliate?.currency == 'EUR';
    // })
  }

  eventDrawerClose() {
    this.onCloseClick.emit();
  }
}
