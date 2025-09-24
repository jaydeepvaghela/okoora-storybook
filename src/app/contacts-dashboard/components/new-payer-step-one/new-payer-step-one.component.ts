import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, Subject, takeUntil } from 'rxjs';
import { PayerService } from '../../services/payer.service';
import { ContactsService } from '../../services/contacts.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { getAllActiveCurrencies } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { getBankNumberList } from '../contacts-data/userData';
import { calculatedIbanObject } from '../contacts-data/payers-data';

@Component({
  selector: 'app-new-payer-step-one',
  templateUrl: './new-payer-step-one.component.html',
  styleUrls: ['./new-payer-step-one.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, NgbTooltipModule]
})
export class NewPayerStepOneComponent implements OnInit, OnChanges, OnDestroy {
  @Input() editPayer!: boolean;
  @Input() editPayerObj: any;

  @Input('newPayerReasonForm') newPayerReasonForm?: any;
  parentCurrencyData = getAllActiveCurrencies;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('formStepper') formStepper?: any;
  @Input() payerForm!: FormGroup;

  @Output() nextStep: EventEmitter<void> = new EventEmitter();

  @ViewChild('searchCurrencyInput') searchCurrencyInput!: ElementRef<HTMLInputElement>;
  @ViewChild('BankNumberDrp') BankNumberDrp!: ElementRef<HTMLInputElement>;
  @ViewChild('branchNumberDrp') branchNumberDrp!: ElementRef<HTMLInputElement>;

  @Output() stepChanged = new EventEmitter<void>();
  @Input() stepIndex!: number;

  searchCurrencyControl: FormControl = new FormControl();
  globalCurrencyData: any;
  currencyData: any;
  newPayerReasonFormInvalid: boolean = false;
  errorMsg: any;
  unSubcribe = new Subject<void>();

  bankNumberDrpList: any = [];
  globalbankNumberDrpList: any = [];
  branchNumberDrpList: any = [];
  globalbranchNumberDrpList: any = []
  bindBankNumber: any;
  showLoader!: boolean;
  isBankNumberDrpError!: string;
  isDisplayBankBranchInput!: boolean;
  bankDetailsFormStep4Values: any;
  bindBranchNumber!: string;
  bankNumberDrpSearchControl: FormControl = new FormControl();
  branchNumberDrpSearchControl: FormControl = new FormControl();
  displayWarningMsg: any;
  isBranchNumberHasError: any;

  constructor(private payerService: PayerService, private cd: ChangeDetectorRef, public contactService: ContactsService) { }

  ngOnInit(): void {
    this.filterCurrencyList();
    this.currencyvalueChanges();
    this.getBankNumberList();
    this.filterBankNumberDrpList();
    this.filterBranchNumberDrpList();

    if (this.editPayerObj) {
      if (this.editPayerObj?.unionCountry !== 'il' || this.editPayerObj?.payerCountry !== 'il') {
        this.payerForm?.get('newPayerReasonForm')?.get('payerAccount')?.patchValue(2);
      }
      if (this.editPayerObj?.unionCountry == 'il' || this.editPayerObj?.payerCountry == 'il') {
        this.payerForm?.get('newPayerReasonForm')?.get('payerAccount')?.patchValue(1);
      }
    }

    if (this.newPayerReasonForm.get('paymentReason').value !== 2) {
      // this.newPayerReasonForm.get('currency')?.patchValue('');
      this.newPayerReasonForm.get('payerAccount')?.patchValue('');
    }

  }

  filterBankNumberDrpList() {
    this.bankNumberDrpSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(bankNumberSearch => {
      this.bankNumberDrpList = bankNumberSearch ? this.filterBankNumberList(bankNumberSearch) : this.globalbankNumberDrpList;
    });
  }

  filterBankNumberList(bankNumberSearch: string) {
    return this.globalbankNumberDrpList.filter((bank: any) => {
      const searchLower = bankNumberSearch.toLowerCase();
      return bank.bank_Name.toLowerCase().includes(searchLower) ||
        bank.bank_Code.toString().includes(searchLower); // Ensures code is treated as a string
    });
  }

  filterBranchNumberDrpList() {
    this.branchNumberDrpSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(branchNumberSearch => {
      this.branchNumberDrpList = branchNumberSearch ? this.filterBranchNumberList(branchNumberSearch) : this.globalbranchNumberDrpList;
    });
  }

  filterBranchNumberList(branchNumberSearch: string) {
    return this.globalbranchNumberDrpList.filter((bank: any) => {
      const searchBranchLower = branchNumberSearch.toLowerCase();
      return bank.branch_Name.toLowerCase().includes(searchBranchLower) ||
        bank.branch_Code.toString().includes(searchBranchLower); // Ensures code is treated as a string
    });
  }

  clearBranchNumberSearch() {
    if (this.branchNumberDrpSearchControl != null) {
      this.branchNumberDrpSearchControl.setValue('');
    }
  }

  clearBankNumberSearch() {
    if (this.bankNumberDrpSearchControl != null) {
      this.bankNumberDrpSearchControl.setValue('');
    }
  }

  onbankNumberDropdownOpen(event: any) {
    if (this.BankNumberDrp) {
      this.BankNumberDrp.nativeElement.focus();
    }
    if (event) {
      this.bankNumberDrpList = this.globalbankNumberDrpList;
      this.bankNumberDrpSearchControl.setValue('');
    } else {
      if (this.bankNumberDrpList && this.bankNumberDrpList.length === 0) {
        this.bankNumberDrpList = this.globalbankNumberDrpList;
      }
    }
  }

  onbranchNumberDropdownOpen(event: any) {
    if (this.branchNumberDrp) {
      this.branchNumberDrp.nativeElement.focus();
    }
    if (event) {
      this.branchNumberDrpList = this.globalbranchNumberDrpList;
      this.branchNumberDrpSearchControl.setValue('');
    } else {
      if (this.branchNumberDrpList && this.branchNumberDrpList.length === 0) {
        this.branchNumberDrpList = this.globalbranchNumberDrpList;
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Allow Backspace and Delete keys
    if (key === 'Backspace' || key === 'Delete') {
      return;
    }

    // If the user presses space and there is already one space in the value, prevent it
    if (key === ' ' && value.includes(' ')) {
      event.preventDefault();  // Prevent additional spaces if one already exists
      return;
    }

    // Allow alphanumeric characters, hyphen, Hebrew characters, and one space
    const isHebrew = /[\u0590-\u05FF]/.test(key)
      ;
    const isAllowedCharacter = /^[a-zA-Z0-9- ]$/.test(key)
      || isHebrew;

    // If the key is not allowed, prevent the default action
    if (!isAllowedCharacter) {
      event.preventDefault();
    }
  }

  getBankNumberList() {
    this.bindBankNumber = this.newPayerReasonForm?.value?.bankNumber ?? '';
    this.showLoader = true;
    of(getBankNumberList).subscribe(bankNumberRes => {
      this.isBankNumberDrpError = '';
      this.bankNumberDrpList = this.globalbankNumberDrpList = bankNumberRes;
      this.showLoader = false;
      if (this.globalbankNumberDrpList?.length === 0) {
        this.isDisplayBankBranchInput = true;
        this.newPayerReasonForm.controls['bankNumber'].patchValue(this.newPayerReasonForm.value?.bankNumber);
        this.newPayerReasonForm.controls['bankBranch'].patchValue(this.newPayerReasonForm.value?.bankBranch);
      }

      if (this.globalbankNumberDrpList?.length !== 0) {
        const ifbankExist = this.globalbankNumberDrpList.filter((data: any) => String(data.bank_Code) === this.newPayerReasonForm?.value?.bankNumber)?.[0];
        if (!ifbankExist) {
          this.newPayerReasonForm.controls['bankNumber'].patchValue('');
          this.bindBankNumber = '';
        }
      }
      if (this.bindBankNumber) {
        const bankObj = { 'value': this.bindBankNumber }
        this.changeBankNumber(bankObj)
      }
    }, error => {
      this.showLoader = false;
      this.isBankNumberDrpError = error?.error?.apiErrorMessage || error?.error?.message || 'Internal server error';
      if (this.isBankNumberDrpError || this.globalbankNumberDrpList?.length === 0) {
        this.isDisplayBankBranchInput = true;
        this.newPayerReasonForm.controls['bankNumber'].patchValue(this.newPayerReasonForm?.value?.bankNumber);
        this.newPayerReasonForm.controls['bankBranch'].patchValue(this.newPayerReasonForm?.value?.bankBranch);
      }
    })
  }

  changeBankNumber(event: any) {
    this.showLoader = true;
    this.bindBankNumber = event?.value;
    this.bindBranchNumber = '';
    this.contactService.getBranchNumberList(event?.value).subscribe(branchNumberRes => {
      this.isBranchNumberHasError = '';
      this.branchNumberDrpList = this.globalbranchNumberDrpList = branchNumberRes;
      if (this.globalbranchNumberDrpList?.length !== 0) {
        const ifbranchExist = this.globalbranchNumberDrpList.filter((data: any) => String(data.branch_Code) === this.newPayerReasonForm?.value?.bankBranch)?.[0];
        if (!ifbranchExist) {
          this.newPayerReasonForm.controls['bankBranch'].patchValue('');
          this.bindBranchNumber = '';
        }
      }
      this.showLoader = false;
      if (this.newPayerReasonForm?.get('bankNumber')?.value && this.globalbranchNumberDrpList?.length === 0 && this.globalbankNumberDrpList?.length !== 0) {
        this.displayWarningMsg = "No active branches found for this bank.";
      } else {
        this.displayWarningMsg = '';
      }
      this.bindBranchNumber = this.newPayerReasonForm?.value.bankBranch;
      if (this.globalbranchNumberDrpList && this.globalbranchNumberDrpList?.length === 0) {
        const bankBranchControl = this.newPayerReasonForm.controls['bankBranch'];
        bankBranchControl.clearValidators();
        bankBranchControl.updateValueAndValidity();
      }
      if (this.globalbranchNumberDrpList && this.globalbranchNumberDrpList?.length !== 0) {
        this.newPayerReasonForm.controls['bankNumber'].setValidators([
          Validators.required,
          Validators.pattern('')
        ]);
        this.newPayerReasonForm.controls['bankBranch'].setValidators([
          Validators.required,
          Validators.pattern('')
        ]);
      }
      this.cd.detectChanges();
    }, error => {
      this.showLoader = false;
      this.isBranchNumberHasError = error?.error?.apiErrorMessage;
    });
    this.bindBranchNumber = this.newPayerReasonForm?.value?.bankBranch ?? '';
  }

  changeBranchNumber(event: any) {
    this.bindBranchNumber = event?.value;
    // this.bankDetailsFormStep4Values['bankBranch'] = event?.value;
    // this.bankDetailsFormValues.emit(this.bankDetailsFormStep4Values);
    this.newPayerReasonForm?.get('bankBranch')?.patchValue(event?.value);
  }

  currencyvalueChanges() {
    this.newPayerReasonForm.controls['currency'].valueChanges.subscribe((res: any) => {
      if (this.errorMsg) {
        delete this.errorMsg;
      }
      if (res === 'ILS') {
        this.payerService.addControls(this.newPayerReasonForm, ['bankNumber', 'bankBranch', 'accountNumber']);
        this.payerService.clearValidatorsForControls(this.newPayerReasonForm, ['bankNumber', 'bankBranch', 'accountNumber']);
      } else {
        this.payerService.addControls(this.newPayerReasonForm, ['payerAccount']);
        this.payerService.clearValidatorsForControls(this.newPayerReasonForm, ['payerAccount']);
      }
    });
  }

  filterCurrencyList() {
    this.searchCurrencyControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(currencySearchVal => {
      this.currencyData = currencySearchVal ? this.filterCurrencyData(currencySearchVal) : this.globalCurrencyData;
    });
  }

  filterCurrencyData(currencySearchVal: string) {
    return this.globalCurrencyData.filter((currencyObj: any) =>
      currencyObj.currency?.code.toLowerCase().includes(currencySearchVal.toLowerCase())
    );
  }

  ngOnChanges() {
    // this.currencyData = this.globalCurrencyData = this.parentCurrencyData;
    // this.cd.detectChanges();
    if (Array.isArray(this.parentCurrencyData)) {
      // Sort the countries before updating the variables
      const sortedCountries = this.parentCurrencyData.sort((a: any, b: any) => {
        if (a.currency.code === 'ILS') return -1; // 'il' should come first
        if (b.currency.code === 'ILS') return 1; // 'il' should come first
        return 0; // keep the rest in the same order
      });

      // Update the data after sorting
      this.currencyData = this.globalCurrencyData = sortedCountries;
    } else {
      console.error('parentCurrencyData is not an array:', this.parentCurrencyData);
    }

    // Detect changes to update the view
    this.cd.detectChanges();
  }

  onCurrencyDropdownOpen(event: any) {
    if (this.searchCurrencyInput) {
      this.searchCurrencyInput.nativeElement.focus();
    }
    if (event) {
      this.currencyData = this.globalCurrencyData;
      this.searchCurrencyControl.setValue('');
    } else {
      if (this.currencyData && this.currencyData.length === 0) {
        this.currencyData = this.globalCurrencyData
      }
    }

    if (this.newPayerReasonForm.get('paymentReason').value == 2 && this.newPayerReasonForm.get('currency')?.value == 'ILS') {
      this.setIlsFlowBankAndBranchValidation();
    }
  }

  hasError(controlName: string): boolean {
    const control = this.newPayerReasonForm.get(controlName);
    if (control && this.newPayerReasonFormInvalid && control.invalid && (control.hasError('pattern') || control.hasError('required'))) {
      return true;
    }
    return false;
  }

  // hasError(controlName: string): boolean {
  //   const control = this.newPayerReasonForm.get(controlName);
  //   return !!(control && control.invalid && this.newPayerReasonFormInvalid);
  // }

  // hasError(controlName: string): boolean {
  //   const control = this.newPayerReasonForm.get(controlName);
  //   if (control && control.invalid && this.newPayerReasonFormInvalid) {
  //     if (control.hasError('pattern')) {
  //       return true;
  //     }
  //     return true;
  //   }
  //   return false;
  // }

  gettoCurrencyvalue() {
    return this.newPayerReasonForm.controls['currency'].value;
  }

  clearSearch() {
    if (this.searchCurrencyControl != null) {
      this.searchCurrencyControl.setValue('');
    }
  }

  restrickWhiteSpace(event: any) {
    if (event?.keyCode == 32) {
      event?.preventDefault();
    }
  }

  restrictWhiteSpaceWithAlphnumeric(event: any) {
    this.contactService.restrictWhiteSpaceWithAlphnumeric(event);
  }

  getAccountDetail(event: any) {
    let calculateIban = {
      "bankCode": this.newPayerReasonForm.value.bankNumber,
      "bankBranch": this.newPayerReasonForm.value.bankBranch,
      "bankAccountNumber": this.newPayerReasonForm.value.accountNumber
    }
    if (this.newPayerReasonForm.value.bankNumber && this.newPayerReasonForm.value.bankBranch && this.newPayerReasonForm.value.accountNumber) {
      of(calculatedIbanObject).pipe(takeUntil(this.unSubcribe)).subscribe((data) => {
        localStorage.setItem("CalculateIban", JSON.stringify(data))
        delete this.errorMsg;
      }, err => {
        // this.newPayerReasonForm.controls['ibanNumber'].reset()
        this.errorMsg = err.error.apiErrorMessage[0]
      })
    }
  }

  setPaymentReason() {
    this.payerService.setPaymentReason(this.newPayerReasonForm.get('paymentReason').value);
  }

  changePayerPaymentReason() {
    this.contactService.isPaymentReasonChanged.next(true);
    if (this.errorMsg) {
      delete this.errorMsg;
    }
    this.payerForm?.get('uploadFile')?.get('file')?.reset();
    localStorage.setItem('changedPayerPaymentReason', JSON.stringify(this.newPayerReasonForm?.value.paymentReason));
    if (this.newPayerReasonForm.get('paymentReason').value !== 2) {
      this.payerService.clearValidatorsForControls(this.newPayerReasonForm, ['currency']);
      this.payerService.isPopulatePayerProfileCurrency.next('');
    }
  }

  submitPayerProfile(stepper: any) {
    if (this.newPayerReasonForm.get('paymentReason').value === 2) {
      this.payerService.isPopulatePayerProfileCurrency.next(this.newPayerReasonForm.get('currency').value);
    } else {
      // this.newPayerReasonForm.get('currency').patchValue('');
      // this.payerService.isPopulatePayerProfileCurrency.next('');
    }
    const { currency, paymentReason } = this.newPayerReasonForm.value;
    if (paymentReason === 2) {
      currency === 'ILS' ? this.onNextForILS(stepper) : this.onNextForNonILS(stepper);
    } else {
      this.stepChanged.emit();
    }
    this.setPaymentReason();
  }

  setIlsFlowBankAndBranchValidation() {
    const bankNumberControl = this.newPayerReasonForm.controls['bankNumber'];
    const bankBranchControl = this.newPayerReasonForm.controls['bankBranch'];
    bankNumberControl.setValidators([
      Validators.required,
      Validators.pattern('^\\d{1,3}$') // Pattern for 1 to 3 digits
    ]);

    bankBranchControl.setValidators([
      Validators.required,
      Validators.pattern('^\\d{1,3}$') // Pattern for 1 to 3 digits
    ]);

  }

  onNextForILS(stepper: any): void {
    this.newPayerReasonFormInvalid = true;
    const calculateIban: string | null = localStorage.getItem('CalculateIban');
    const calculateIbanObject = calculateIban ? JSON.parse(calculateIban) : null;
    this.payerService.applyValidatorsIfEmpty(this.newPayerReasonForm, ['accountNumber', 'bankNumber', 'bankBranch']);
    this.addMyAccountCurrencyValidator();
    if (this.newPayerReasonForm.get('paymentReason').value == 2 && this.newPayerReasonForm.get('currency')?.value == 'ILS') {
      this.setIlsFlowBankAndBranchValidation();
    }

    if (calculateIbanObject) {
      calculateIbanObject.currency = this.newPayerReasonForm?.value.currency;
      this.payerService.removeControls(this.newPayerReasonForm, ['payerAccount']);
      if (this.newPayerReasonForm.invalid) {
        Object.values(this.newPayerReasonForm.controls).forEach((control: any) => {
          control.markAsTouched();
        });
        return;
      }
      // this.payerService.saveBeneficiaryAsMyAccount(calculateIbanObject).subscribe(
        // (data) => {  
          localStorage.setItem('isIlsAcc', 'true');
          this.payerService.isMoveToSummaryPage.next(true);
          this.contactService.isNewPayerSummaryPage.next(true);
          stepper.selectedIndex = 3;
          this.stepChanged.emit();
          this.cd.detectChanges();
          // this.nextStep.emit();
        // },
        // (err) => {
          // console.error('Error saving beneficiary:', err);
        // }
      // );
    } else {
      console.warn('No data found in localStorage for "CalculateIban".');
    }
  }

  onNextForNonILS(stepper: any) {
    this.payerService.applyValidatorsIfEmpty(this.newPayerReasonForm, ['payerAccount']);
    this.newPayerReasonFormInvalid = true;
    this.payerService.removeControls(this.newPayerReasonForm, ['bankNumber', 'bankBranch', 'accountNumber']);
    this.addMyAccountCurrencyValidator();
    if (!this.newPayerReasonForm.get('currency').value) {
      this.newPayerReasonForm.get('currency').setValidators([Validators.required]);
      this.newPayerReasonForm.get('currency').updateValueAndValidity();
    }
    if (this.newPayerReasonForm.invalid) {
      Object.values(this.newPayerReasonForm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    } else {
      this.stepChanged.emit();
    }
  }

  addMyAccountCurrencyValidator() {
    if (!this.newPayerReasonForm.get('currency').value) {
      this.newPayerReasonForm.get('currency').setValidators([Validators.required]);
      this.newPayerReasonForm.get('currency').updateValueAndValidity();
    }
  }

  onCutTypeValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onCopyTypeValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onPasteTypeValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  restrictZeroAndDot(event: any) {
    if (event?.target?.value?.length === 0 && event?.key === ".") {
      event?.preventDefault();
    }
  }

  ngOnDestroy() {
    this.unSubcribe.next();
    this.unSubcribe.complete();
  };
}
