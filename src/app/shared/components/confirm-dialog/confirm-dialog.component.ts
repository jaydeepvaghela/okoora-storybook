import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContactsService } from '../../../contacts-dashboard/services/contacts.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule]
})
export class ConfirmDialogComponent implements OnInit {
  constructor(private readonly contactsService: ContactsService, private readonly dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public confirmDialogComponentdata: any
  ) { }

  isClickedSkipUploadFileStep5!: boolean;

  onCancel(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.contactsService.isBeneficiarySummaryInit.next(false);
    if (this.confirmDialogComponentdata?.uploadFileSaveAndExist) {
      this.isClickedSkipUploadFileStep5 = true;
    } else {
      this.isClickedSkipUploadFileStep5 = false;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
    localStorage.removeItem('newPayerId');
    this.contactsService.isNewPayerSummaryPage.next(false);
    this.contactsService.isNewPayerconfirmClicked.next(false);
    const iseditBenificiary = JSON.parse(localStorage.getItem('editBenificiary')!);
    if (iseditBenificiary) {
      this.contactsService.closeAllDialog();
    }
    this.contactsService.setNewPayerStepperIndexFromSummary(0);
    // this.payerService.setPayerDetailForEdit({});
  }

  OnSkipUploadFile() {
    this.dialogRef.close('skipUpload');
  }
}
