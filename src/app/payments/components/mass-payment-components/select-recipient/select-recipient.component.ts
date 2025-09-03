import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';

@Component({
  selector: 'app-select-recipient',
  templateUrl: './select-recipient.component.html',
  styleUrls: ['./select-recipient.component.scss'],
  imports: [CommonModule, MatDialogModule]
})
export class SelectRecipientComponent {
  selectedBeneficiaries: any = [];
  public searchTerm: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SelectRecipientComponent>, public dialog: MatDialog, 
  private walletService: WalletsService) {}
  
  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  // Disable copy on the input field
  @HostListener('document:copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  // Disable cut on the input field
  @HostListener('document:cut', ['$event'])
  onCut(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }
  ngOnInit() {
    if (this.data.selectedBeneficiaries?.length) {
      this.selectedBeneficiaries = this.data?.selectedBeneficiaries;
    }
  }

  setTheFunctionalValue() {
    this.walletService.setLengthValue(this.selectedBeneficiaries.length);
  }

  onFormSubmission() {
    this.dialogRef.close(this.selectedBeneficiaries);
  }
  isSelectedBeneficiary(beneficiary: any): boolean {
    return this.selectedBeneficiaries.some((b: any) => b.id === beneficiary.id);
  }
  addBeneficiary(beneficiary: any): void {
    const index = this.selectedBeneficiaries.findIndex((b: any) => b.id === beneficiary.id);
    if (index === -1) {
      this.selectedBeneficiaries.push(beneficiary);
    } else {
      this.selectedBeneficiaries.splice(index, 1);
    }
  }

  addRecipient(): void {
    // const dialogRef = this.dialog.open(AddContactsComponent, {
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   disableClose: true,
    // });
  }
  updateSearchTerm(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value || ''; // Ensure searchTerm is always a string
  }
  
  get filteredBeneficiaries() {
    if (!this.searchTerm) {
      return this.data.approvedBeneficiaries;
    }
  
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
  
    return this.data.approvedBeneficiaries.filter((beneficiary: any) => {
      return (
        (beneficiary.bankAccountHolderName?.toLowerCase().includes(lowerCaseSearchTerm) || false) ||
        (beneficiary.currency?.toLowerCase().includes(lowerCaseSearchTerm) || false) ||
        (beneficiary.beneficiaryIdNumber?.toLowerCase().includes(lowerCaseSearchTerm) || false) ||
        (beneficiary.accountNumber?.toString().toLowerCase().includes(lowerCaseSearchTerm) || false)
      );
    });
  }
  
  getInitials(name: string): string {
    let initials = name.charAt(0);
    let spaceIndex = name.indexOf(' ');

    if (spaceIndex !== -1 && spaceIndex + 1 < name.length) {
      initials += name.charAt(spaceIndex + 1);
    }

    return initials.toUpperCase();
  }
}
