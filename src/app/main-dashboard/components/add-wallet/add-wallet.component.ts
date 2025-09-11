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
    });
  }

  addWallet() {
    this.dialog.close('WalletList');
  }
}
