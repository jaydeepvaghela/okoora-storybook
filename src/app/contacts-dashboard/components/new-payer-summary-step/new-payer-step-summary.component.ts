import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { FormGroup } from '@angular/forms';
import { PayerPaymentReason } from '../../enums/PayerPaymentReason';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PayerService } from '../../services/payer.service';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-payer-summary-step',
  templateUrl: './new-payer-step-summary.component.html',
  styleUrls: ['./new-payer-step-summary.component.scss'],
  imports: [CommonModule, NgbTooltipModule]
})
export class NewPayerSummaryStepComponent {
  @Input('formStepper') formStepper?: any;
  @Input() payerForm!: FormGroup;
  isSummaryConfirmed: boolean = false;
  progressWidth!: number;
  PayerPaymentReason = PayerPaymentReason;
  payerObjectFinalSave: any;
  @Input() countryList: any;
  @Input() stepIndex!: number;
  @Output() stepChanged = new EventEmitter<void>();
  @ViewChild('copytooltip', { static: false }) copytooltip!: NgbTooltip;
  @Input('uploadFileForm') uploadFileForm: any;
  @Input('payerAccountDetail') payerAccountDetail: any;
  isSubmitForm = false;

  constructor(private contactService: ContactsService, private payerService: PayerService, private dialog: MatDialog, private router : Router) { }
  
  ngOnInit(): void {
    this.copytooltip?.close();
    this.contactService.isNewPayerSummaryPage.next(true);
  }

  ngAfterViewInit(): void {
    this.payerService?.getPayerObjectFinalSave.subscribe((data) => {
      this.payerObjectFinalSave = data;
    })
  }

  confirmSummary() {
    this.isSubmitForm = true;
    const isILSACC = JSON.parse(localStorage.getItem('isIlsAcc')!);
    localStorage.removeItem('payerDocType');
    if (isILSACC) {
      this.isSummaryConfirmed = true;
      this.contactService.isNewPayerconfirmClicked.next(true);
      localStorage.removeItem('isIlsAcc');
      this.stepChanged.emit();
    } else {
      this.payerObjectFinalSave['foundsSourceDetails'] = this.payerAccountDetail.value?.foundsSourceDetails ?? '';
      // this.payerService.addPayer(true, this.payerObjectFinalSave).subscribe({
      //   next: (result) => {
      //     result ? this.isSummaryConfirmed = true : this.isSummaryConfirmed = false;
          this.contactService.isNewPayerconfirmClicked.next(true);
          this.stepChanged.emit();
      //   },
      //   error: (err) => {
      //     this.isSubmitForm = false;
      //   }
      // });
    }
  }

  navigateToContactPage() {
    if(!this.router?.url.includes('/contacts')) {
      this.router.navigate(['contacts']);
    }
    this.contactService.isRedirectToPayerList.next(true);
    // this.commonService.closeDrawer();
    this.contactService.closeAllDialog();
    this.contactService.isNewPayerSummaryPage.next(false);
    this.payerService.setPayerDetailForEdit({});
  }



  copyDetailsToClipboard() {
    const SelectedPayerType = this.payerForm.get('newPayerReasonForm')?.get('currency')?.value === 'ILS' ? '--' : this.payerForm.get('payerAccountDetail')?.get('entityType')?.value == '1' ? 'Business' : this.payerForm.get('payerAccountDetail')?.get('entityType')?.value == '2' ? 'Individual' : '--';
    const SelectedPayerBankCountry = this.payerForm.get('newPayerReasonForm')?.get('currency')?.value === 'ILS' ? 'Israel' : this.displayCountryName(this.payerForm.get('payerAccountDetail')?.get('bankCountry')?.value) ?? '--';
    const SelectedPayerCountry = this.payerForm.get('newPayerReasonForm')?.get('currency')?.value === 'ILS' ? 'Israel' : this.displayCountryName(this.payerForm.get('payerAccountDetail')?.get('payerCountry')?.value) || this.displayCountryName(this.payerForm.get('payerAccountDetail')?.get('unionCountry')?.value) || '--';
    const SelectedCurrency = (this.payerForm.get('newPayerReasonForm')?.get('currency')?.value || this.payerForm.get('payerAccountDetail')?.get('currency')?.value) ?? '--'
    const selectedPaymentReason = this.PayerPaymentReason[this.payerForm.get('newPayerReasonForm')?.get('paymentReason')?.value];
    const data = [
      ['Payer type', SelectedPayerType],
      ['Payer Bank Country', SelectedPayerBankCountry],
      ['Payer Country', SelectedPayerCountry],
      ['Currency', SelectedCurrency],
      ['Transfer Reason', selectedPaymentReason],
    ];
    // Add bold formatting for keys and extra tab space for values in HTML
    const htmlData = data
      .map(([key, value]) => `<b>${key}:</b>&emsp;&emsp;${value}`) // &emsp; adds a tab-like space
      .join('<br>');

    // Add an extra tab space for plain text
    const plainTextData = data
      .map(([key, value]) => `${key}:\t\t${value}`) // \t\t adds an extra tab space
      .join('\n');

    // Use Clipboard API to copy formatted data
    navigator.clipboard
      .write([
        new ClipboardItem({
          'text/html': new Blob([htmlData], { type: 'text/html' }),
          'text/plain': new Blob([plainTextData], { type: 'text/plain' }),
        }),
      ])
      .then(() => {
        this.copytooltip?.open(); // Show tooltip on success
        setTimeout(() => this.copytooltip?.close(), 3000); // Hide after 2 seconds
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }


  displayCountryName(countryCode: any) {
    if (this.countryList && this.countryList.length !== 0) {
      const countryNameObj = this.countryList?.filter((data: any) => data.countryCode == countryCode);
      return countryNameObj?.[0]?.['countryName'];
    }
  }

  navigateToScreen(stepperIndex: number): void {
    if (typeof stepperIndex === 'number') {
      // if (this.payerForm.get('newPayerReasonForm')?.get('currency')?.value === 'ILS') {
      //   this.payerForm.get('payerAccountDetail')?.get('payerCountry')?.patchValue('');
      //   this.payerForm.get('payerAccountDetail')?.get('unionCountry')?.patchValue('');
      // }
      if (this.payerForm.get('newPayerReasonForm')?.get('currency')?.value === 'ILS' &&
        !(this.payerForm.get('payerAccountDetail')?.get('payerCountry')?.value ||
          this.payerForm.get('payerAccountDetail')?.get('unionCountry')?.value)) {
        this.formStepper.selectedIndex = 0;
        this.contactService.setNewPayerStepperIndexFromSummary(0); // For my account ILS Only
      } else {
        this.formStepper.selectedIndex = stepperIndex;
        this.contactService.setNewPayerStepperIndexFromSummary(stepperIndex);
      }
    }
  }

  createBeneficiaryDialog() {
    this.contactService.closeAllDialog();
    this.contactService.setNewPayerStepperIndexFromSummary(0);
    const dialogRef = this.dialog.open(AddContactsComponent, {
      width: '100vw',
      maxWidth: '100vw',
      disableClose: true,
      data: {
        fromWallet: true,
        createContact: 'addPayer'
      },
    });
  }
  ngOnDestroy(): void {
    this.contactService.isNewPayerSummaryPage.next(false);
  }
}
