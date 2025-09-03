import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, of, startWith, tap } from 'rxjs';
import { AddWalletComponent } from '../../../main-dashboard/components/add-wallet/add-wallet.component';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-list-dialog',
  templateUrl: './wallet-list-dialog.component.html',
  styleUrls: ['./wallet-list-dialog.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatListModule],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class WalletListDialogComponent {
  @Output() onAddWalletClose = new EventEmitter<boolean>();
  filterControl = new FormControl('');
  walletCurrencies: any[] = [];
  currencyData$!: Observable<any[]>;
  filteredCurrency$!: Observable<any[]>;
  selectedCurrency: any;
  selectedIndex!: number;
  subSite!: string | null;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WalletListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedWallet: string, walletList: any[] }
  ) { }

  ngOnInit(): void {
    this.walletCurrencies = this.data?.walletList;
    this.subSite = localStorage.getItem('subSite');
    this.changeSearch();
  }

  private _filter(value: string): any[] {
    return this.walletCurrencies.filter((currency) =>
      currency.wallet_Currency.code.toLowerCase().includes(value.toLowerCase())
    );
  }

  changeSearch() {
    this.filteredCurrency$ = this.filterControl.valueChanges.pipe(
      startWith(''),
      map((val) => {
        return this._filter(val || '');
      })
    );
  }

  onSelectionChange(wallet: any, i: number) {
    this.selectedCurrency = wallet;
    this.selectedIndex = i;
  }

  switchWallet() {
    // this._walletService.setwalletwalletDataForLock(this.selectedCurrency)
    this.dialogRef.close({ wallet: this.selectedCurrency, index: this.selectedIndex });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addWalletModal() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(AddWalletComponent, {
      width: '520px',
      height: '200',
      panelClass: 'add-wallet'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onAddWalletClose.emit(true);
      }
    });
  }
}
