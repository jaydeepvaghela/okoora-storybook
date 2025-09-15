import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NewBenificiaryUploadFileComponent } from '../new-benificiary-upload-file/new-benificiary-upload-file.component';

@Component({
  selector: 'app-new-benificiary-step1',
  templateUrl: './new-benificiary-step1.component.html',
  styleUrls: ['./new-benificiary-step1.component.scss'],
  imports: [CommonModule, NewBenificiaryUploadFileComponent]
})
export class NewBenificiaryStep1Component implements OnDestroy {
  @Input('newBenificiaryBankDetails') newBenificiaryBankDetails:any;
  @Input('iseditBenificiary') iseditBenificiary:any;
  @Input('newBenificiaryStepper') newBenificiaryStepper:any;

  @Input() stepIndex!: number;
  @Output() stepChanged = new EventEmitter<void>();

  isUploadDoucment = false;

  unscribe$ = new Subject<void>();

  constructor(public contactsService: ContactsService) {
    this.allSubscriptions();
  }

  allSubscriptions() {
    this.contactsService.isUploadDocClickedFromNewBeniStep1.pipe(takeUntil(this.unscribe$)).subscribe(res => {
      if (res) {
        this.isUploadDoucment = false;
      }
    });
    this.contactsService.isUploadDocNewBenFileExist.pipe(takeUntil(this.unscribe$)).subscribe(res => {
      if (res) {
        this.isUploadDoucment = true;
      }
    });
    this.contactsService.isUploadFileScreenNotExist.pipe(takeUntil(this.unscribe$)).subscribe(res => {
      if (res) {
        this.isUploadDoucment = false;
      }
    });
    this.contactsService.isInvoiceUploadedFromFirstStep.pipe(takeUntil(this.unscribe$)).subscribe(res => {
      if (res) {
        this.skipUpload();
      }
    });
  }

  skipUpload() {
    this.contactsService.usUploadFileFromGeneralDetails.next(false);
    this.contactsService.setBeneficiaryObject({})
    this.stepChanged.emit();
  }

  uploadDoucment() {
    this.isUploadDoucment = true;
    localStorage.setItem('newBenificiaryUploadFile', JSON.stringify(1));
  }

  ngOnDestroy(): void {
    this.unscribe$.next();
    this.unscribe$.complete();
  }
}
