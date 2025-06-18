import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-type',
  templateUrl: './transfer-type.component.html',
  styleUrls: ['./transfer-type.component.scss'],
  imports: [CommonModule]
})
export class TransferTypeComponent implements OnInit {
  @Input('options') options: any[] = [];
  @Input('form') form!: FormGroup;
  @Input('selectedWallet') selectedWallet: any;

  showDropdown = true;
  selectedOptionText = 'Select';
  selectedOptionDescription = '';
  selectedKey: string | null = null;
  private subscriptions: Subscription[] = [];
  isRowLoading: boolean = false;
  loaderTopPosition: string = '0px';

  constructor(private eRef: ElementRef, private _walletService: WalletsService) { }

  ngOnInit() {
    this.initializeSelectedOption();
    if(this.options?.length === 0) this.selectedKey = null;
  }

  private callApiForCostTypeChange(costType: any) {
    let body = {
      requestId: this.form.get('requestId')?.value,
      costType: costType.key.charAt(0),
    };
    // this._walletService.updateCostType(body).subscribe();
  }
  initializeSelectedOption() {
    if (this.form) {
      const costTypeControl = this.form.get('costType');
      if (costTypeControl && costTypeControl.value) {
        this.selectedKey = costTypeControl.value.key;
        // this.updateOptionTexts(this.selectedKey);
      }
    }
  }
  selectOption(option: any): void {
    this.callApiForCostTypeChange(option);
    this.onRadioChange(option);
  }
  toggleDropdown() { 
    this.isRowLoading = true;    
    // this.showDropdown = false;
    // this._walletService.refreshCostList(this.form.get('requestId').value).subscribe((data) => {
    //   if (Array.isArray(data) && data.length > 0) {
    //     this.options = data.map((item, index) => ({
    //       ...(this.options[index] || {}),
    //       key: item.key === 1 ? '1 - regular' : item.key === 2 ? '2 - our' :item.key === 4 ? '4 - PaymentOnBehalf' :item.key === 5 ? '5 - FastPayment' : '',
    //       value: item.value       
    //     }));
    //     this.selectedKey = null;
    //     // this.form.get('costType').setValue('');
    //   }
    //   this.isRowLoading = false;
    this.showDropdown = !this.showDropdown;
    //   },
    //   (err) => {
    //     this.isRowLoading = false;
    //   }
    // );
  }

  onRadioChange(selectedOption: any) {
    this.selectedKey = selectedOption.key;
    // this.updateOptionTexts(this.selectedKey);
    this.closeDropdown();
    if (this.form) {
      this.form.patchValue({ costType: selectedOption });
    }
  }

  updateOptionTexts(key: string) {
    this.selectedOptionText = this.getDisplayText(key);
    this.selectedOptionDescription = this.getDescription(key);
  }
  getTitleText(): string {
    switch (this.selectedKey) {
      case '1 - regular':
        return `Regular -  ${this.form.get('costType')?.value?.value} ${this.selectedWallet.wallet_Currency.sign}`;
      case '2 - our':
        return `Our Transfer -  ${this.form.get('costType')?.value?.value} ${this.selectedWallet.wallet_Currency.sign}`;
        case '4 - PaymentOnBehalf':
          return `Payment on behalf your company -  ${this.form.get('costType')?.value?.value} ${this.selectedWallet.wallet_Currency.sign}`;
          case '5 - FastPayment':
            return `Fast payment -  ${this.form.get('costType')?.value?.value} ${this.selectedWallet.wallet_Currency.sign}`;
        
        default:
        return 'Select';
    }
  }
  getDisplayText(key: string): string {
    switch (key) {
      case '1 - regular':
        return `Regular Transfer`;
      case '2 - our':
        return 'Our Transfer';
      case '4 - PaymentOnBehalf':
        return 'Payment on behalf your company';
      case '5 - FastPayment':
        return 'Fast payment';
      default:
        return 'Select';
    }
  }

  getDescription(key: string): string {
    switch (key) {
      case '1 - regular':
        return 'Receiving bank may charge extra fees.';
      case '2 - our':
        return 'No third party fees.';
        case '4 - PaymentOnBehalf':
          return 'Payment on behalf your company';
        case '5 - FastPayment':
          return 'Fast payment';
      default:
        return '';
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  private closeDropdown() {
    this.showDropdown = false;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
