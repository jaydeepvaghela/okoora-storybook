import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent implements OnInit {
  formGroup!: FormGroup;
  loading: boolean = false;
  error: string = '';
  isInvoiceNumberHasSpecialChar!: boolean;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddNoteComponent>, private _walletService: WalletsService) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      note: [this.data.formGroup.get('note').value || ''],
      invoiceNumber: [this.data.formGroup.get('invoiceNumber').value || ''],
    });
  }

  updatePaymentRequest() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000); 
  }

  saveandcancel() {
    this.dialogRef.close();
  }

  checkForSpecialCharacters(event: any) {
    var specialChars = /[<>();]/g;
    if (specialChars.test(event.target.value)) {
      this.isInvoiceNumberHasSpecialChar = true;
    } else {
      this.isInvoiceNumberHasSpecialChar = false;
    }
  }

  onPasteTypeValue(event: ClipboardEvent) {
    let res = false;
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      res =  this.containsSpecialCharacter(pastedText);
      if(res)
        return false;
    }
    return true;
  }
  restrictSpecialCharacters(event: any) {
    const invalidChars = ['<', '>', ';', '=', '+' , '(', ')'];
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    } else {
      const dotOccurrences = (event?.target?.value.match(/\./g) || []).length;
      if (event?.key === "." && dotOccurrences >= 3) {
        event?.preventDefault();
      }
      if (invalidChars.includes(event.key)) {
        event.preventDefault();
      }
    }
  }
  containsSpecialCharacter(text: string): boolean {
    var specialChars = /[<>();+=]/g;
    return text.split('').some(character => specialChars.test(character));
  }
}
