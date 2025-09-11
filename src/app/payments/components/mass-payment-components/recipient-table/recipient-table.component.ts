import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import * as ExcelJS from 'exceljs';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InitialRenderComponent } from '../initial-render/initial-render.component';
import { SelectRecipientComponent } from '../select-recipient/select-recipient.component';
import { TransferTypeComponent } from '../transfer-type/transfer-type.component';
import { of } from 'rxjs';
import { AddNoteComponent } from '../add-note/add-note.component';
@Component({
  selector: 'app-recipient-table',
  templateUrl: './recipient-table.component.html',
  styleUrls: ['./recipient-table.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatTooltipModule, MatProgressBarModule, InitialRenderComponent, TransferTypeComponent],
  encapsulation: ViewEncapsulation.None,
})
export class RecipientTableComponent implements OnChanges {
  @ViewChildren('amountInput')
  amountInputs!: QueryList<ElementRef>;

  @ViewChild('table', { static: false })
  table!: ElementRef;
  @Output() beneficiaryFormsChange = new EventEmitter<FormGroup[]>();
  @Output() addMoreRecipientsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('approvedBeneficiaries')
  approvedBeneficiaries!: any[];
  @Input('isAddRecipient')
  isAddRecipient!: boolean;
  @Input('selectedWallet') selectedWallet: any;
  @Input('beneficiaryForms') beneficiaryForms: any;
  @Input('addMoreRecipients') addMoreRecipients: any;
  paymentRequests: any[] = [];
  selectedBeneficiaries: any[] = [];
  isRowLoading: boolean = false;
  loaderTopPosition: string = '0px';
  loadingState: boolean = false;
  private previousValues: any = [];
  bensAndRequest: any = [];
  error!: string;
  showLoader!: boolean;
  userData: any;
  isEur!: boolean;
  setAmountErrorMessage: any = [];
  componentVisible = true;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private cdr: ChangeDetectorRef, private _walletService: WalletsService) { }

  ngOnInit() {
    // Try to load from localStorage first
    const storedForms = this.loadBeneficiaryFormsFromLocalStorage();

    if (storedForms && storedForms.length > 0) {
      this.beneficiaryForms = storedForms;
      this.selectedBeneficiaries = storedForms.map((form: FormGroup) => {
        const beneficiaryId = form.get('beneficiaryId')?.value;
        return this.approvedBeneficiaries.find(b => b.id === beneficiaryId) || null;
      });
      this.cdr.detectChanges();
      return;
    }

    this.selectedBeneficiaries = this.beneficiaryForms.map((form: FormGroup) => {
      const beneficiaryId = form.get('beneficiaryId')?.value;
      return this.approvedBeneficiaries.find(b => b.id === beneficiaryId) || null;
    });

    const updatedFormGroups: FormGroup[] = [];

    of([]).subscribe((result: any) => {
      result.forEach((beneficiary: any) => {
        const matchingBeneficiary = this.approvedBeneficiaries.find(
          b => b.id === beneficiary?.beneficiary.id
        );

        this.selectedBeneficiaries.push(matchingBeneficiary);

        const newFormGroup = this.fb.group({
          beneficiaryId: [beneficiary?.beneficiary.id || null],
          product_reference: [beneficiary?.beneficiary.bankAccountHolderName, Validators.required],
          beneficiarySign: [beneficiary?.beneficiary.currencyISO.sign],
          currency: [beneficiary?.beneficiary.currency],
          costType: [beneficiary?.paymentRequst?.costType, Validators.required],
          costList: [beneficiary?.costList],
          charge: [beneficiary?.paymentRequst?.charge],
          note: [''],
          spot: [beneficiary?.paymentRequst?.spot],
          invoiceNumber: [''],
          signAndFiles: [beneficiary?.signAndFiles],
          amount: [this.commaseprate(beneficiary?.paymentRequst?.send, 2)],
          files: this.fb.array(beneficiary?.files),
          previewFiles: this.fb.array(beneficiary?.previweFiles),
          stamp: [null],
          previewStamp: this.fb.array([]),
          requestId: [beneficiary?.requestId],
        });

        this.bensAndRequest.push({
          beneficiaryId: beneficiary?.beneficiary.id,
          requestId: beneficiary?.requestId
        });

        updatedFormGroups.push(newFormGroup);
      });

      this.beneficiaryForms = updatedFormGroups;
      this.beneficiaryFormsChange.emit(updatedFormGroups);
      this.cdr.detectChanges();
    });

    this._walletService?.currentImportMassPaymentFile.subscribe((data: any) => {
      if (data && Object.keys(data).length > 0) {
        this.ImportTemplate(data);
      }
    });
  }

  loadBeneficiaryFormsFromLocalStorage(): FormGroup[] {
    const stored = localStorage.getItem('beneficiaryForms');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((form: any) =>
          this.fb.group({
            beneficiaryId: [form.beneficiaryId],
            product_reference: [form.product_reference, Validators.required],
            beneficiarySign: [form.beneficiarySign],
            currency: [form.currency],
            costType: [form.costType, Validators.required],
            costList: [form.costList],
            charge: [form.charge],
            note: [form.note],
            spot: [form.spot],
            invoiceNumber: [form.invoiceNumber],
            signAndFiles: [form.signAndFiles],
            amount: [form.amount],
            files: this.fb.array(form.files || []),
            previewFiles: this.fb.array(form.previewFiles || []),
            stamp: [form.stamp],
            previewStamp: this.fb.array(form.previewStamp || []),
            requestId: [form.requestId],
          })
        );
      } catch (e) {
        console.error('Failed to load beneficiaryForms from localStorage', e);
        return [];
      }
    }
    return [];
  }

  saveBeneficiaryFormsToLocalStorage(forms: FormGroup[]) {
    const formData = forms.map(form => form.getRawValue());
    localStorage.setItem('beneficiaryForms', JSON.stringify(formData));
  }

  ImportTemplate(event: any) {
    const file = event.target?.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      this.readExcel(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  }

  readExcel(buffer: ArrayBuffer) {
    var beneficiaries: any[] = []
    this.selectedBeneficiaries = []
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(buffer).then(wb => {
      const worksheet = wb.getWorksheet(1);
      if (worksheet) {
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          const cellValue = row.getCell(1).value as string;
          const bankAccountHolderName = cellValue.substring(0, cellValue.length - 6);
          const currency = cellValue.substring(cellValue.length - 4, cellValue.length - 1);
          if (this.approvedBeneficiaries.some(x => x.bankAccountHolderName === bankAccountHolderName && x.currency === currency)) {

            const filteredBeneficiaries = this.approvedBeneficiaries.filter(x => x.bankAccountHolderName === bankAccountHolderName && x.currency === currency);
            filteredBeneficiaries.forEach(filteredBeneficiary => {
              const exists = this.selectedBeneficiaries.some(selectedBeneficiary => selectedBeneficiary.id === filteredBeneficiary.id);
              if (!exists) {
                this.selectedBeneficiaries.push(filteredBeneficiary);
                const amount = row.getCell(2).value
                const benAmdAmount = {
                  amount: amount,
                  ben: filteredBeneficiaries
                }
                beneficiaries.push(benAmdAmount);
              }
            });
          }
        });
      }
      this.selectedBeneficiaries = beneficiaries.map((ben: any) => {
        const beneficiaryId = ben.ben[0].id;
        const matchingBeneficiary = this.approvedBeneficiaries.find((approvedBeneficiary) => approvedBeneficiary.id === beneficiaryId);
        return matchingBeneficiary || null;
      });
      const updatedFormGroups: FormGroup[] = [];
      beneficiaries.forEach((data) => {
        if (!updatedFormGroups.some((fg) => fg.value.beneficiaryId === data.ben[0].id)) {
          const newFormGroup = this.fb.group({
            beneficiaryId: [data.ben[0].id || null],
            product_reference: [data.ben[0].bankAccountHolderName, Validators.required],
            beneficiarySign: [data.ben[0].currencyISO.sign],
            currency: [data.ben[0].currency],
            costType: ['', Validators.required],
            costList: [],
            charge: [''],
            note: [''],
            spot: [''],
            invoiceNumber: [''],
            signAndFiles: [null],
            amount: [data.amount, Validators.required],
            files: !this.isEur ? this.fb.array([], Validators.required) : this.fb.array([]),
            previewFiles: this.fb.array([]),
            stamp: this.isEur ? [null, Validators.required] : [null],
            previewStamp: this.fb.array([]),
            requestId: [''],
          });
          updatedFormGroups.push(newFormGroup);
        }

      });

      this.beneficiaryFormsChange.emit(updatedFormGroups);
      this.beneficiaryForms = updatedFormGroups;

      this.cdr.detectChanges()

      for (let i = 0; i < updatedFormGroups.length; i++) {
        this.onInputBlur(i)
      }
    });
  }

  commaseprate(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      return false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.addMoreRecipients) {
      this.selectRecipient();
    }
  }

  showLoaderOnRow(rowIndex: number) {
    if (this.table && this.table.nativeElement) {
      const tableElement = this.table.nativeElement;
      const rowElement = tableElement.rows[rowIndex + 1];
      if (rowElement) {
        const tableRect = tableElement.getBoundingClientRect();
        const rowRect = rowElement.getBoundingClientRect();
        const rowTop = rowRect.top - tableRect.top + window.scrollY;
        this.loaderTopPosition = `${rowTop}px`;
        this.isRowLoading = true;
      }
    }
  }

  hideLoader() {
    this.isRowLoading = false;
  }
  getSelectedCostText(form: any): string {
    const cost = form.get('costType')?.value;
    if (cost && cost.key) {
      return cost.key.split(' - ')[1];
    }
    return '';
  }

  selectRecipient() {
    const dialogRef = this.dialog.open(SelectRecipientComponent, {
      width: '650px',
      data: { approvedBeneficiaries: this.approvedBeneficiaries, selectedBeneficiaries: this.selectedBeneficiaries },
    });
    dialogRef.afterClosed().subscribe((result) => {
      const lengthToSet = result?.length ? result?.length : this.selectedBeneficiaries?.length;
      if (result && Array.isArray(result)) {
        result.forEach((selectedBeneficiary) => {
          const existingIndex = this.selectedBeneficiaries.findIndex((b) => b.id === selectedBeneficiary.id);
          if (existingIndex > -1) {
            this.selectedBeneficiaries[existingIndex] = selectedBeneficiary;
          } else {
            this.selectedBeneficiaries.push(selectedBeneficiary);
          }
          this.bensAndRequest = this.bensAndRequest.filter((x: { beneficiaryId: any; }) => x.beneficiaryId !== selectedBeneficiary.id);
        });
        this.initializeForms();
      }
      this.addMoreRecipientsChanged.emit(false);
    });
  }
  private initializeForms() {
    const updatedFormGroups: FormGroup[] = [];

    this.beneficiaryForms.forEach((formGroup: FormGroup) => {
      const beneficiaryId = formGroup.get('beneficiaryId')?.value;
      const beneficiary = this.selectedBeneficiaries.find((b) => b.id === beneficiaryId);

      if (beneficiary) {
        formGroup.patchValue({
          product_reference: beneficiary.bankAccountHolderName,
          currency: beneficiary.currency,
        });
        updatedFormGroups.push(formGroup);
      } else {
        if (formGroup) {
          formGroup.reset();
        }
      }
    });
    this.selectedBeneficiaries.forEach((beneficiary) => {
      if (!updatedFormGroups.some((fg) => fg.value.beneficiaryId === beneficiary.id)) {
        const newFormGroup = this.fb.group({
          beneficiaryId: [beneficiary.id || null],
          product_reference: [beneficiary.bankAccountHolderName, Validators.required],
          beneficiarySign: [beneficiary.currencyISO.sign],
          currency: [beneficiary.currency],
          costType: ['', Validators.required],
          costList: [],
          charge: [''],
          note: [''],
          spot: [''],
          invoiceNumber: [''],
          signAndFiles: [null],
          amount: ['', Validators.required],
          files: !this.isEur ? this.fb.array([], Validators.required) : this.fb.array([]),
          previewFiles: this.fb.array([]),
          stamp: !this.isEur ? [null, Validators.required] : [null],
          previewStamp: this.fb.array([]),
          requestId: [''],
        });
        updatedFormGroups.push(newFormGroup);
      }
    });
    this.beneficiaryFormsChange.emit(updatedFormGroups);
    this.beneficiaryForms = updatedFormGroups;
    this.cdr.detectChanges()
  }

  getErrorTooltip(control: AbstractControl, index: number): string {
    if (!control.errors) return '';

    if (control.errors['invalidAmount']) {
      return this.getInvalidAmountError(index);
    }

    return '';
  }
  onInputBlur(index: number): void {
    const currentAmount = this.beneficiaryForms[index].get('amount').value;
    const numericCurrentAmount = typeof currentAmount === 'string' ? +currentAmount.replace(/,/g, '') : currentAmount;
    if (this.previousValues[index] !== numericCurrentAmount || numericCurrentAmount > 0) {
      this.createPaymentRequest(index);
    } 
  }
  formatInput(event: any): void {
    let input = event.target.value;
    if (input) {
      input = input.replace(/,/g, '');
      input = input.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      event.target.value = input;
    }
  }

  restrictSpecialCharacters(event: any) {
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    }
    else {
      if (event?.key == "." && event?.target?.value.includes(".")) {
        event?.preventDefault();
      }
      if (event.ctrlKey && event.key === 'a' || event.ctrlKey && event.key === 'c') {
        return;
      }
      const allowedKeys = /^[0-9.]$/;
      if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  private getInvalidAmountError(index: number): string {
    return this.setAmountErrorMessage[index];
  }

  formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  createPaymentRequest(index: number) {
    console.log(this.beneficiaryForms,'lol')
    this.previousValues[index] = + this.beneficiaryForms[index].get('amount').value;
    this.showLoaderOnRow(index);
    let body: any = {
      amount: this.beneficiaryForms[index]?.get('amount')?.value,
      beneficiaryId: this.beneficiaryForms[index].value.beneficiaryId,
      currency: this.selectedWallet.wallet_Currency?.code,
      isMass: true
    };
    this._walletService.mockCreatePaymentRequest(body).subscribe(
      (res) => {
        this.hideLoader();
        if (this.beneficiaryForms[index]) {
          const formattedAmount = this.formatNumberWithCommas(res.paymentRequst.send);

          var prevReq = this.beneficiaryForms[index].get('requestId');
          if (prevReq.value != "") {
            var data = {
              prevRequst: prevReq.value,
              newRequest: res.requestId
            };
          }
          let found = false;
          for (let item of this.bensAndRequest) {
            if (item.beneficiaryId === this.beneficiaryForms[index].get('beneficiaryId').value) {
              item.requestId = res.requestId;
              found = true;
              break;
            }
          }
          if (!found) {
            this.bensAndRequest.push({
              beneficiaryId: this.beneficiaryForms[index].get('beneficiaryId').value,
              requestId: res.requestId
            });
          }

          this.beneficiaryForms[index].get('amount').setValue(formattedAmount);
          this.beneficiaryForms[index].get('charge').setValue(res.paymentRequst.charge.toString());
          this.beneficiaryForms[index].get('requestId').setValue(res.requestId);
          this.beneficiaryForms[index].get('costList').setValue(res.costList);
          this.beneficiaryForms[index].get('signAndFiles').setValue(res.signAndFiles);
          this.beneficiaryForms[index].get('spot').setValue(res.paymentRequst.spot);
        }
        if (!res.signAndFiles?.needStamp) {
          this.beneficiaryForms[index].get('stamp').setValidators(null);
        }
        if (!res.signAndFiles?.needFile) {
          this.beneficiaryForms[index].get('files').setValidators(null);
        }

        this.beneficiaryForms[index].get('stamp').updateValueAndValidity();
        this.beneficiaryForms[index].get('files').updateValueAndValidity();
        this.cdr.detectChanges();
      },
      (error) => {
        const amountControl = this.beneficiaryForms[index].get('amount');
        amountControl.setErrors({ invalidAmount: true });
        this.error = error.error.apiErrorMessage[0];
        for (let i = 0; i < this.beneficiaryForms.length; i++) {
          this.setAmountErrorMessage.push('')
        }
        this.setAmountErrorMessage[index] = this.error
        this.beneficiaryForms[index].get('charge').setValue('');
        this.hideLoader();
      }
    );
    this.saveBeneficiaryFormsToLocalStorage(this.beneficiaryForms);

  }
  openDeleteBeneficiary(index: number) {
    const requestId = this.beneficiaryForms[index].get('requestId').value;
    for (let i = 0; i < this.beneficiaryForms.length; i++) {
      this.beneficiaryForms[i].get('costList').setValue([]);
      this.beneficiaryForms[i].get('costType').setValue('');
      this.componentVisible = false;
      setTimeout(() => {
        this.componentVisible = true;
      }, 0);
    }
    this.beneficiaryForms.splice(index, 1);
    this.paymentRequests.splice(index, 1);
    this.selectedBeneficiaries.splice(index, 1);
    if (this.beneficiaryForms.length == 0) {
    }
    this.cdr.detectChanges();
  }
  deleteBeneficiary(index: number): void {
    this.setAmountErrorMessage.splice(index, 1)
  }
  addNote(index: number) {
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: '600px',
      data: {
        formGroup: this.beneficiaryForms[index],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.beneficiaryForms[index].patchValue(result);
      }
    });
  }

  uploadFiles(index: number) {

  }
  calculateProgress(index: number): number {
    const request = this.beneficiaryForms[index];

    if (!request) {
      console.error('Request form not found at index:', index);
      return 0;
    }

    const stampValue = request.get('stamp').value;
    const filesValue = request.get('files').value;
    const signAndFiles = request.get('signAndFiles').value;
    const isNeedStamp = signAndFiles?.needStamp;
    const isNeedFiles = signAndFiles?.needFile;

    const hasStamp = isNeedStamp ? this.isStampUploaded(stampValue) : true;
    const hasFiles = isNeedFiles ? this.areFilesUploaded(filesValue) : true;

    if (isNeedStamp && isNeedFiles) {
      if (hasStamp && hasFiles) return 100;
      if (hasStamp || hasFiles) return 50;
      return 0;
    } else if (isNeedStamp) {
      return hasStamp ? 100 : 0;
    } else if (isNeedFiles) {
      return hasFiles ? 100 : 0;
    } else {
      return 0;
    }
  }
  isStampUploaded(stampValue: any): boolean {
    return !!stampValue;
  }

  areFilesUploaded(filesValue: any[]): boolean {
    return Array.isArray(filesValue) && filesValue.length > 0;
  }
}
