import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { WalletsService } from '../../services/wallets.service';
import { ActiveCurrencyModel } from '../../models/ActiveCurrencyModel';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { getCurrenciesNotInWallet } from '../../dashboard-data/balanceList-data';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule]
})
export class AddWalletComponent {

  activeCurrencies$!: Observable<ActiveCurrencyModel[]>;
  addWalletForm!: FormGroup;
  currency = new FormControl('', [Validators.required]);
  errorMsg!: string;
  activeCurrency: any;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<AddWalletComponent>) {
    
  }

  ngOnInit(): void {
    this.addWalletForm = this.fb.group({
      currency: ['', [Validators.required]]
    });
   of(getCurrenciesNotInWallet).subscribe(res=>{
      this.activeCurrency = res;
      // let user = JSON.parse(localStorage.getItem('user'));
      // if(user?.afiiliate?.currency != 'ILS'){
      //  let index =  this.activeCurrency.findIndex((item:any) => item.currency.code === "ILS") 
      //  this.activeCurrency.splice(index,1)
      // }
    });
  }

  addWallet() {
    this.dialog.close('WalletList');
    // this._walletService.addNewWallet(this.addWalletForm.value.currency).subscribe((result: any) => {
    //   if (result?.status) {
    //     this.dialog.close('WalletList');
    //   } else {
    //     this.errorMsg = result?.message;
    //   }
    // }, (err: any) => {
    //   this.errorMsg = err.error.message[0];
    // });
  }
}
