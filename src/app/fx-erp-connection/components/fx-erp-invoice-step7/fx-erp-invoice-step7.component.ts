import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { of, Subject, take, takeUntil } from 'rxjs';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { InvoiceSteps } from '../../../connector/enums/status';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { balanceList } from '../../../main-dashboard/dashboard-data/balanceList-data';
@Component({
  selector: 'app-fx-erp-invoice-step7',
  templateUrl: './fx-erp-invoice-step7.component.html',
  styleUrls: ['./fx-erp-invoice-step7.component.scss'],
  imports:[CommonModule,ReactiveFormsModule,MatInputModule,MatSelectModule,MatChipsModule,FormsModule]
})
export class FxErpInvoiceStep7Component {
  @Input() autoPilotForm!: FormGroup; // form group for the auto pilot
  @Input() stepper!: MatStepper;
  @Input() walletList: any = [];
  InvoiceBillCurrencies = new FormControl([]); // form control for the invoice currencies
  mainCurrencyWallet: any;
  unSubScribe$ = new Subject<void>();
  constructor(private cd: ChangeDetectorRef, private _walletService: WalletsService) { }

  ngOnInit() {
    this.loadBalanceList(); // Load the wallet list on initialization  
  }

  loadBalanceList() {
    of(balanceList).pipe(takeUntil(this.unSubScribe$)).subscribe({
      next: (res) => {
        this.mainCurrencyWallet = res.find((wallet: any) => wallet.wallet_IsBaseCurency == true);
        console.log('Main Currency Wallet:', this.mainCurrencyWallet);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading wallets:', err);
      }
    });
  }


  removeCurrency(currencyToRemove: any) {
    const current = this.autoPilotForm.get('InvoiceBillCurrencies')?.value || [];
    this.autoPilotForm.get('InvoiceBillCurrencies')?.setValue(
      current.filter((c: any) => c.currency.code !== currencyToRemove.currency.code)
    );
  }

  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexFour;
  }

  onNext() {
    this.stepper.selectedIndex = InvoiceSteps.IndexSix;
  }
}
