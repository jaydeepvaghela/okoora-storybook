import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ContactsService } from '../../services/contacts.service';
import { NewBenificiaryUploadFileComponent } from '../new-benificiary-upload-file/new-benificiary-upload-file.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-benificiary-step2',
  templateUrl: './new-benificiary-step2.component.html',
  styleUrls: ['./new-benificiary-step2.component.scss'],
  imports: [CommonModule, MatProgressBarModule, ReactiveFormsModule, MatSelectModule]
})
export class NewBenificiaryStep2Component implements OnInit, OnChanges, OnDestroy {
  @Input() stepIndex!: number;
  @Output() stepChanged = new EventEmitter<void>();
  @Output() step2ChangedValues = new EventEmitter<void>();
  @Input() newBenificiaryStep2!: FormGroup;
  @Input('countryList') parentCountryList: any;
  @Input('currencyData') parentCurrencyData: any;
  @Input('newBenificiaryBankDetails') newBenificiaryBankDetails?: any;
  @ViewChild('searchBeneficiaryCountryInput') searchBeneficiaryCountryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchBenBankCountryInput') searchBenBankCountryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchCurrencyInput') searchCurrencyInput!: ElementRef<HTMLInputElement>;
  @Input('iseditBenificiary') iseditBenificiary: any;
  @Input('editBenificiaryObj') editBenificiaryObj: any;
  @Input('newBenificiaryStep2Values') newBenificiaryStep2Values: any;
  @Input('benificiaryForm') benificiaryForm: any;
  @Input('isNonIsraeliUser') isNonIsraeliUser: any;
  @Input('awFormSchemaErrors') awFormSchemaErrors: any;
  @Input('awBeneficiaryDetailsObj') awBeneficiaryDetailsObj: any;

  searchControl: FormControl = new FormControl();
  benCountrySearchControl: FormControl = new FormControl();
  benBankCountrySearchControl: FormControl = new FormControl();
  searchCurrencyControl: FormControl = new FormControl();
  globalCurrencyData: any;
  bankCountryList: any;
  countryList: any;
  globalCountryData: any;
  currencyData: any;
  newBenificiaryStep2Form = false;
  dataFromUploadInvoice: any;
  currentInvoiceRes: any;
  selectedCountryForInvoice: any;
  showLoader = false;
  uploadFileFromGeneralDetails$!: Subscription;
  currentInvoiceObject$!: Subscription;
  isBankRequireMentExist = false;
  isBeneficiaryAccNotExist = false;
  awBankDetailsFields: any = [];
  awSchemaError = '';
  awAccDetailsObj = {
    country: '',
    bankCountry: '',
    currency: '',
    beneficiaryAccountType: '',
  }

  IsBankDetailObj: any = {
    displayIban: false,
    displaySwiftCode: false,
    displayAccountNumber: false,
    displayBeneficiaryZipCode: false,
    displayBeneficiaryState: false,
    displayABA: false,
    displayBankNumber: false,
    bankAccountHolderHebrewName: false,
    displayBranchCode: false,
    displayIfscNumber: false,
    displayCNAPS: false,
    displayBSB: false,
    displaySortCode: false,
    displayCLABE: false,
    displayBankAccountHolderEmail: false,
    displayBankAccountHolderNameInEnglish: false,
    displayFirstname: false,
    displayLastName: false,
  };

  beneficiaryBankRequirementsObj: any;
  bankDetailsControls$!: Subscription;
  dynamicControls: string[] = [];
  ibanRes: any;
  countryIso: any;
  selectedBeneficiaryBankCountry: any;
  swiftRes: any;

  constructor(
    private dialog: MatDialog, private contactService: ContactsService, private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkUploadButtonClick();
    this.filterCountryList();
    this.filterBankCountryList();
    this.filterCurrencyList();
    this.allSubscriptions()
    this.newBenificiaryStep2?.patchValue({
      beneficiaryCountry: this.newBenificiaryStep2Values?.beneficiaryCountry,
      bankCountry: this.newBenificiaryStep2Values?.bankCountry?.toLowerCase(),
      currency: this.newBenificiaryStep2Values?.currency,
      IsBeneficiaryBusinessCategoryLegit: this.newBenificiaryStep2Values?.IsBeneficiaryBusinessCategoryLegit == 'true' ? 'true' : 'false',
      beneficiaryAccountType: this.newBenificiaryStep2Values?.beneficiaryAccountType ? this.newBenificiaryStep2Values?.beneficiaryAccountType.toString() : '',
    });

    const resetNewBeneficiaryForm = JSON.parse(localStorage.getItem('resetNewBeneficiaryForm')!);
    if (resetNewBeneficiaryForm) {
      Object.keys(this.benificiaryForm.controls).forEach(key => {
        const control = this.benificiaryForm.get(key);
        if (control instanceof FormGroup || control instanceof FormArray) {
          control.reset();
        } else {
          control?.setValue('');
        }
      });
      localStorage.removeItem('resetNewBeneficiaryForm');
    }

    if (this.iseditBenificiary) { // redable account Type in edit beneficiary
      const accountType = [1, 2];
      const isAccountExist = accountType.includes(parseInt(this.newBenificiaryStep2?.value?.beneficiaryAccountType, 10));
      this.isBeneficiaryAccNotExist = isAccountExist ? true : false;
    }

  }

  checkUploadButtonClick() {
    const isUploadBtnClicked = JSON.parse(localStorage.getItem('isUploadClicked')!);
    if (isUploadBtnClicked) {
      this.showLoader = true;
      this.newBenificiaryStep2.reset();
      setTimeout(() => {
        localStorage.removeItem('invoiceDataStored');
        localStorage.removeItem('isUploadClicked');
        this.showLoader = false;
      }, 8000);
    }
  }

  allSubscriptions() {
    this.currentInvoiceObject$ = this.contactService.currentInvoiceObject.pipe(debounceTime(500),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe((data: any) => {
      this.currentInvoiceRes = data;
      this.countryList = this.parentCountryList;
      if (this.currentInvoiceRes && Object.keys(this.currentInvoiceRes)?.length !== 0) {
        this.selectedCountryForInvoice = this.countryList?.find(
          (selectedCountry: any) => (selectedCountry?.countryName?.toLowerCase() === this.currentInvoiceRes?.beneficiaryCountry?.toLowerCase()) || (selectedCountry?.countryCode3Letters?.toLowerCase() === this.currentInvoiceRes?.beneficiaryCountry?.toLowerCase())
        );

        if (this.currentInvoiceRes.iban && (!this.currentInvoiceRes?.swiftCode)) {
          this.showLoader = true;
          this.getIBANDetail(this.currentInvoiceRes.iban);
        } else if (this.currentInvoiceRes?.swiftCode && (!this.currentInvoiceRes.iban)) {
          this.showLoader = true;
          this.getSwiftDetail(this.currentInvoiceRes.swiftCode);
        } else if (this.currentInvoiceRes.iban && this.currentInvoiceRes?.swiftCode) {
          this.showLoader = true;
          this.getIBANDetail(this.currentInvoiceRes.iban);
        }

        if (this.selectedCountryForInvoice) {
          this.newBenificiaryStep2?.patchValue({
            beneficiaryCountry: this.selectedCountryForInvoice?.countryCode?.toLowerCase() ?? '',
            bankCountry: this.currentInvoiceRes.bankCountry?.toLowerCase() ?? '',
            currency: this.currentInvoiceRes.currency ?? '',
            IsBeneficiaryBusinessCategoryLegit: this.currentInvoiceRes.IsBeneficiaryBusinessCategoryLegit == 'true' ? 'true' : 'false',
            beneficiaryAccountType: this.currentInvoiceRes.beneficiaryAccountType ? this.currentInvoiceRes.beneficiaryAccountType.toString() : '',
          });
          // this._commonService.geStateList(this.selectedCountryForInvoice?.countryCode?.toLowerCase()).subscribe((stateData: any) => {
          //   // this._commonService.getCityWithIso2(event?.value).subscribe((cityData: any) => {
          //   const stateCode = stateData?.find((st: any) => (st?.name?.toLowerCase() === this.currentInvoiceRes.beneficiaryState?.toLowerCase()) || (st?.state_code?.toLowerCase() === this.currentInvoiceRes.beneficiaryState?.toLowerCase()));
          //   this._commonService.getCityList(this.selectedCountryForInvoice?.countryName, stateCode?.['name']).subscribe((data: any) => {
          //     let stateCityObj: any = {
          //       stateList: stateData,
          //       cityList: data,
          //     }
          //     this.contactService.setStateAndCityBankDetailspage(stateCityObj);
          //   });
          // });
          if (this.newBenificiaryStep2?.value?.beneficiaryCountry) {
            localStorage.setItem('invoiceDataStored', JSON.stringify(true));
            // this.checkInvoiceDataStored();
          }
        }
      }
      this.cd.markForCheck();
    });

    this.contactService.getnewBenificiarySelectedStepperIndex.subscribe(res => {
      if (res) {
        this.stepIndex = res;
      }
    });
  }

  getIBANDetail(data: any) {
    // this.contactService.ibanDetails(data).subscribe((data: any) => {
    //   this.ibanRes = data;
    //   if (this.bankCountryList && this.bankCountryList.length > 0) {
    //     this.selectedBeneficiaryBankCountry = this.bankCountryList?.find((banCountry: any) =>
    //       banCountry.countryName.toLowerCase() == this.ibanRes.country.toLowerCase()
    //     );
    //     if (this.selectedBeneficiaryBankCountry) {
    //       this.newBenificiaryStep2.controls['bankCountry'].patchValue(this.selectedBeneficiaryBankCountry?.countryCode);
    //       this.cd.detectChanges();
    //       this.showLoader = false;
    //     }
    //   }
    //   this.cd.detectChanges();
    // }, (err: any) => {
    //   this.showLoader = false;
    //   this.cd.detectChanges();
    // })
  }

  getSwiftDetail(data: any) {
    // this.contactService.bicSwiftDetails(data).subscribe((data: any) => {
    //   this.swiftRes = data;
    //   if (this.bankCountryList && this.bankCountryList.length > 0) {
    //     this.selectedBeneficiaryBankCountry = this.bankCountryList?.find((banCountry: any) =>
    //       banCountry.countryName.toLowerCase() == this.swiftRes.countryName.toLowerCase()
    //     );
    //     if (this.selectedBeneficiaryBankCountry) {
    //       this.newBenificiaryStep2.controls['bankCountry'].patchValue(this.selectedBeneficiaryBankCountry?.countryCode);
    //       this.cd.detectChanges();
    //       this.showLoader = false;
    //     }
    //   }
    //   this.cd.detectChanges();
    // }, (err: any) => {
    //   this.showLoader = false;
    //   this.cd.detectChanges();
    // })
  }


  filterCountryList() {
    this.benCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.countryList = countrySearchVal ? this.filterCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  filterCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  filterBankCountryList() {
    this.benBankCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.bankCountryList = countrySearchVal ? this.filterBankCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  filterBankCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  changeCountry(event: any) {
    this.clearDisablePaymentReason();
    this.clearBankDetailsOnlyILSControls();
    // this._commonService.geStateList(event?.value).subscribe((stateData: any) => {
    //   let stateCityObj: any = {
    //     stateList: stateData,
    //     cityList: [],
    //   }
    //   this.contactService.beneficiaryCountryChange.next(true);
    //   this.contactService.setStateAndCityBankDetailspage(stateCityObj);
    // });
    this.newBenificiaryBankDetails.controls['beneficiaryState'].clearValidators();
    this.newBenificiaryBankDetails.controls['beneficiaryState'].updateValueAndValidity();
    this.newBenificiaryBankDetails.controls['beneficiaryCity'].clearValidators();
    this.newBenificiaryBankDetails.controls['beneficiaryCity'].updateValueAndValidity();
  }

  changeBankCountry() {
    this.clearDisablePaymentReason();
    this.clearBankDetailsOnlyILSControls();
  }

  changeCurrency() {
    this.clearDisablePaymentReason();
    this.clearBankDetailsOnlyILSControls();
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

  onCountryDropdownOpen(event: any) {
    this.contactService.clearPaymentReason.next(true);
    if (this.searchBeneficiaryCountryInput) {
      this.searchBeneficiaryCountryInput.nativeElement.focus();
    }
    if (event) {
      this.countryList = this.globalCountryData;
      this.benCountrySearchControl.setValue('');
    } else {
      if (this.countryList && this.countryList.length === 0) {
        this.countryList = this.globalCountryData
      }
    }
  }

  onBankCountryDropdownOpen(event: any) {
    this.contactService.clearPaymentReason.next(true);
    if (this.searchBenBankCountryInput) {
      this.searchBenBankCountryInput.nativeElement.focus();
    }
    if (event) {
      this.bankCountryList = this.globalCountryData;
      this.benBankCountrySearchControl.setValue('');
    } else {
      if (this.bankCountryList && this.bankCountryList.length === 0) {
        this.bankCountryList = this.globalCountryData
      }
    }
  }

  onCurrencyDropdownOpen(event: any) {
    this.contactService.clearPaymentReason.next(true);
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
  }

  clearBankDetailsOnlyILSControls() {
    const bankmkDetailsForm = this.benificiaryForm.get('newBenificiaryBankDetails');
    Object.keys(bankmkDetailsForm.controls).forEach((key) => {
      if (key !== 'routingCodeType' && key !== 'routingCodeValue') {
        const formControl = bankmkDetailsForm.get(key);
        if (formControl) {
          formControl.patchValue('');  // Set value to an empty string
        }
      }
    });
    bankmkDetailsForm.reset();
  }

  clearDisablePaymentReason() {
    this.contactService.clearPaymentReason.next(true);
    localStorage.removeItem('selectedInvestmentType');
    localStorage.removeItem('selectedPayment');
  }

  hasError(controlName: string): boolean {
    const control = this.newBenificiaryStep2.get(controlName);
    return !!(control && control.invalid && this.newBenificiaryStep2Form);
  }

  getCountryCode() {
    return this.newBenificiaryStep2.controls['beneficiaryCountry'].value;
  }

  getBankCountryCode() {
    return this.newBenificiaryStep2.controls['bankCountry'].value;
  }

  gettoCurrencyvalue() {
    return this.newBenificiaryStep2.controls['currency'].value;
  }

  nextStep() {
    this.newBenificiaryStep2Form = true;
    if (!this.isNonIsraeliUser) { // for Israeli flow based on user affilliate country
      const beneficiaryAccountType = this.newBenificiaryStep2.get('beneficiaryAccountType')?.value;
      if (beneficiaryAccountType == '2') { // 2 for indivisual
        this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.patchValue('');
        this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.clearValidators();
        this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.updateValueAndValidity();
      }
      if (!beneficiaryAccountType) {
        this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.clearValidators();
        this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.updateValueAndValidity();
      } else {
        if (beneficiaryAccountType == '1' && !this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.value) {
          this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.setErrors({ require: true })
        }
      }
      if (beneficiaryAccountType !== '1' && beneficiaryAccountType !== '2') {
        this.newBenificiaryStep2.get('beneficiaryAccountType')?.patchValue('');
      }
      if (this.newBenificiaryStep2.valid) {
        this.step2ChangedValues.emit(this.newBenificiaryStep2.value);
        this.newBenificiaryStep2.patchValue(this.newBenificiaryStep2.value);
        this.getBenificiaryBankRequirement();
      } else {
        this.newBenificiaryStep2.markAllAsTouched();
      }
    }

    // for non israli user
    if (this.isNonIsraeliUser) {
      const legitControl = this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit');
      legitControl?.clearValidators();
      legitControl?.updateValueAndValidity();
      if (this.newBenificiaryStep2.valid) {
        this.step2ChangedValues.emit(this.newBenificiaryStep2.value);
        this.newBenificiaryStep2.patchValue(this.newBenificiaryStep2.value);
        const beneficiaryCountry = this.benificiaryForm.get('newBenificiaryStep2')?.value.beneficiaryCountry;
        const bankCountry = this.benificiaryForm.get('newBenificiaryStep2')?.value.bankCountry;
        const currency = this.benificiaryForm.get('newBenificiaryStep2')?.value.currency;
        const beneficiaryAccountType = this.benificiaryForm.get('newBenificiaryStep2')?.value.beneficiaryAccountType;
        if (this.awBeneficiaryDetailsObj.country !== beneficiaryCountry
          || this.awBeneficiaryDetailsObj.bankCountry !== bankCountry
          || this.awBeneficiaryDetailsObj.currency !== currency
          || this.awBeneficiaryDetailsObj.beneficiaryAccountType !== beneficiaryAccountType ||
          this.awSchemaError !== ''
        ) {
          this.getAwBeneficiarySchema();
        } else {
          this.stepChanged.emit();
        }
      } else {
        this.newBenificiaryStep2.markAllAsTouched();
      }
    }
  }

  getAwBeneficiarySchema() {
    this.showLoader = true;
    const BeneficiaryAccountType = parseInt(this.newBenificiaryStep2?.value?.beneficiaryAccountType, 10);
    const BeneficiaryBankAccountDetails = {
      "country_code" : this.newBenificiaryStep2?.value?.beneficiaryCountry.toUpperCase(),
      "bank_country_code": this.newBenificiaryStep2?.value?.bankCountry.toUpperCase(),
      "account_currency": this.newBenificiaryStep2?.value?.currency.toUpperCase(),
      "entity_type": BeneficiaryAccountType == 1 ? "COMPANY" : "PERSONAL"
    }
    // this.bankDetailsControls$ = this.awBeneficiaryService.getAWBeneficiaryFormSchema(BeneficiaryBankAccountDetails).subscribe((awFormSchemaRes: any) => {
    //   this.awSchemaError = '';
    //   this.showLoader = false;
    //   this.awBankDetailsFields = awFormSchemaRes['body']['fields'];
    //   this.awBeneficiaryService.awBeneficiaryFormSchema.next(this.awBankDetailsFields);
    //   this.stepChanged.emit();
    // }, (error: any) => {
    //   this.showLoader = false;
    //   this.displayAWSchemaErrorMessage(error?.error?.apiErrorMessages);
    // })
  }

  displayAWSchemaErrorMessage(errorDetails: any) {
    const errorCode = errorDetails['code'];
    switch (errorCode) {
      case 'SCHEMA_DEFINITION_NOT_FOUND':
        this.awSchemaError = `${this.newBenificiaryStep2Values.currency} transfers to recipients in ${this.newBenificiaryStep2Values.bankCountry} are not available. Select another currency or another country/region that you transfer to.`;
        break;
      default:
        this.awSchemaError = errorDetails?.message;
        break;
    }
  }

  handleBeneficiaryChange() {
    if (this.newBenificiaryStep2.get('beneficiaryAccountType')?.value == '1') {
      this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.patchValue('');
      this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.clearValidators();
      this.newBenificiaryStep2.get('IsBeneficiaryBusinessCategoryLegit')?.updateValueAndValidity();
    }
  }

   getBenificiaryBankRequirement() {
    this.contactService.setBeneficiaryBankRequirementData(this.newBenificiaryStep2?.value);
    setTimeout(() => {
      this.cd.detectChanges();
      this.stepChanged.emit();
    }, 1000);
  }

  openAccountDetailUploadFile() {
    const dialogRef = this.dialog.open(NewBenificiaryUploadFileComponent, {
      height: "auto",
      panelClass: "account-detail-open-file"
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.checkUploadButtonClick();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.countryList = this.bankCountryList = this.globalCountryData = this.parentCountryList;
    this.currencyData = this.globalCurrencyData = this.parentCurrencyData;
  }

  clearSearch() {
    if (this.benCountrySearchControl != null) {
      this.benCountrySearchControl.setValue('');
    }
    if (this.benBankCountrySearchControl != null) {
      this.benBankCountrySearchControl.setValue('');
    }
    if (this.searchCurrencyControl != null) {
      this.searchCurrencyControl.setValue('');
    }
  }

  ngOnDestroy(): void {
    if (this.bankDetailsControls$) {
      this.bankDetailsControls$.unsubscribe();
    }
    if (this.uploadFileFromGeneralDetails$) {
      this.uploadFileFromGeneralDetails$.unsubscribe();
    }
    if (this.currentInvoiceObject$) {
      this.currentInvoiceObject$.unsubscribe();
    }
    this.contactService.setBeneficiaryBankRequirementData({});
  }

}
