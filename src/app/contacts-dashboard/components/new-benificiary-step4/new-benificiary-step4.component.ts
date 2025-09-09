import { ChangeDetectorRef, Component, ElementRef, Input, EventEmitter, Output, ViewChild, OnChanges, SimpleChanges, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, Subscription, takeUntil } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
// import { routingCodeTypes } from 'src/app/shared/enum/routingCodeTypes';
// import { ActiveCurrencyModel } from 'src/app/shared/models/ActiveCurrencyModel';
import { NgZone } from '@angular/core';
import { ActiveCurrencyModel } from '../../../main-dashboard/models/ActiveCurrencyModel';
import { routingCodeTypes } from '../../enums/routingCodeTypes';
import { getAllActiveCurrencies } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { cityList } from '../../../main-dashboard/dashboard-data/all-currency-data';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { bicSwiftDetails } from '../contacts-data/userData';

@Component({
  selector: 'app-new-benificiary-step4',
  templateUrl: './new-benificiary-step4.component.html',
  styleUrls: ['./new-benificiary-step4.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatProgressSpinner, NgbTooltipModule, FormsModule]
})
export class NewBenificiaryStep4Component implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('payment') payment?: any;
  @Input('account') account?: any;
  @Input('newBenificiaryStep2') newBenificiaryStep2?: FormGroup;
  @Input('countryList') countryList: any;
  @Input('stepIndex') stepIndex!: number;
  @Input('newBenificiaryBankDetails') newBenificiaryBankDetails?: any;
  @Input('transactions') transactions?: any;
  @Input('iseditBenificiary') iseditBenificiary?: any;
  @Input('editBenificiaryObj') editBenificiaryObj?: any;
  @Input('paymentReasons') paymentReasons?: any;
  @Input('benificiaryForm') benificiaryForm?: any;
  @Input('newBenificiaryStep2Values') newBenificiaryStep2Values?: any;
  @Input('transcationFormStep3Values') transcationFormStep3Values?: any;
  @Input('bankDetailsFormStep4Values') bankDetailsFormStep4Values?: any;

  @Output() stepChanged = new EventEmitter<void>();
  @Output() skipUploadFileStep = new EventEmitter<void>();
  @Output() movePreviousStep = new EventEmitter<void>();
  @Output() bankDetailsFormValues = new EventEmitter<void>();

  @ViewChild('stateProvinceInput') stateProvinceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cityProvinceInput') cityProvinceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchBenBankCountryInput') searchBenBankCountryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('BankNumberDrp') BankNumberDrp!: ElementRef<HTMLInputElement>;
  @ViewChild('branchNumberDrp') branchNumberDrp!: ElementRef<HTMLInputElement>;


  loading!: boolean;
  errorMsg: any;
  changedAccount!: boolean;
  cityList: any
  beneficiaryInvoiceRes: any;
  countryIso: any;
  stateList: any;
  selectedCountryName: any;
  beneficiaryForEdit: any;
  selectedCountryForInvoice: any;
  importedBeneficiary: boolean = false;
  englishName!: boolean;
  activeCurrency$!: Observable<ActiveCurrencyModel[]>;
  editBeneficiary!: boolean;
  stateProvinceSearchControl: FormControl = new FormControl();
  citySearchControl: FormControl = new FormControl();
  globalStateList: any;
  globalCityList: any;
  editBenificiaryId: any;
  beneficiaryBankRequirementsObj: any;
  isSubmitnewBenificiaryBankDetailsForm = false;
  bankAccountHolderHebrewName!: boolean;
  bankDetailsDynamicFieldsObj: any;
  bankDetailsDynamicFieldsPatternsObj: any;
  showLoader = false;
  isLoanAndInvestmentCategory = false;
  ibanRes: any;
  swiftCodeRes: any;
  isIbanSuccessLoader = false;
  isSwiftCodeLoader = false;
  isIbanCodeSpinner = false;
  isDisplayIbanLoader = false;
  isDisplaySwiftLoader = false;
  cachedStateCityRes: any;
  editBeneficiaryState!: '';
  editBeneficiaryCity: any;
  NewglobalCityList: any = [];
  errorArr: any = [];
  bindState: any;
  stateCitySubscription$!: Subscription;
  summaryBankDetailsFields: any = [];
  bankNumberDrpList: any;
  globalbankNumberDrpList: any = [];
  bankNumberDrpSearchControl: FormControl = new FormControl();
  bindBankNumber: any;
  globalbranchNumberDrpList: any = [];
  branchNumberDrpSearchControl: FormControl = new FormControl();
  displayWarningMsg!: string;
  isBeneficiaryExist: boolean = false;

  routingCodeMap: { [key in 'aba' | 'ifsc' | 'clabe' | 'cnaps' | 'bsb' | 'sortCode']: routingCodeTypes } = {
    aba: routingCodeTypes.aba,
    ifsc: routingCodeTypes.ifsc,
    clabe: routingCodeTypes.clabe,
    cnaps: routingCodeTypes.cnaps,
    bsb: routingCodeTypes.bsb_code,
    sortCode: routingCodeTypes.sort_code
  };
  isSwiftCodeSpinner!: boolean;
  IbanerrorMsg: any;
  SwifterrorMsg: any;
  isNotSwiftChk = false;
  BeneficiaryBankAccountCountryName: any;
  bankCountryList: any;
  globalCountryData: any;
  benBankCountrySearchControl: FormControl = new FormControl();
  bindCity: any;
  isSwiftCheckBoxSelected = false;
  dynamicFieldsInbankDetails: string[] = [];
  isIlsScenario!: boolean;
  unSubScribe$ = new Subject<void>();
  branchNumberDrpList: any;
  bindBranchNumber: any;
  isBranchNumberHasError: any;
  isBankNumberDrpError: any;
  isDisplayBankBranchInput = false;
  IbanCodeMismatchMessage: any;
  SwiftCodeMismatchMessage: any;


  constructor(
    private contactsService: ContactsService,
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<NewBenificiaryStep4Component>,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getDynamicBankDetailsObjectFromStep2();
    this.getAddEditBeneficiaryData();
    this.getEditBeneficiaryDataFromInvoice();
    this.filterStateProvinceList();
    this.filterCityProvinceList();
    this.payment.get('invoice') as FormArray;
    this.importedBeneficiary = Boolean(localStorage.getItem('importedBeneficiary'));
    this.activeCurrency$ = of(getAllActiveCurrencies);
    this.filterBankCountryList();
    this.filterBankNumberDrpList();
    this.filterBranchNumberDrpList();
    console.log('newBenificiaryBankDetails', this.newBenificiaryBankDetails);
  }

  getBankNumberList() {
    this.bindBankNumber = this.newBenificiaryBankDetails?.value?.bankNumber ?? '';
    this.showLoader = true;
    // this.contactsService.getBankNumberList().subscribe(bankNumberRes => {
    //   this.isBankNumberDrpError = '';
    //   this.bankNumberDrpList = this.globalbankNumberDrpList = bankNumberRes;
    //   this.showLoader = false;
    //   if (this.globalbankNumberDrpList?.length === 0) {
    //     this.isDisplayBankBranchInput = true;
    //     this.newBenificiaryBankDetails.controls['bankNumber'].patchValue(this.bankDetailsFormStep4Values?.bankNumber);
    //     this.newBenificiaryBankDetails.controls['bankBranch'].patchValue(this.bankDetailsFormStep4Values?.bankBranch);
    //   }

    //   if (this.globalbankNumberDrpList?.length !== 0) {
    //     const ifbankExist = this.globalbankNumberDrpList.filter((data: any) => String(data.bank_Code) === this.newBenificiaryBankDetails?.value?.bankNumber)?.[0];
    //     if (!ifbankExist) {
    //       this.newBenificiaryBankDetails.controls['bankNumber'].patchValue('');
    //       if (this.bankDetailsFormStep4Values) {
    //         this.bankDetailsFormStep4Values.bankNumber = '';
    //       }
    //       this.bindBankNumber = '';
    //     }
    //   }
    //   if (this.globalbranchNumberDrpList?.length !== 0) {
    //     const ifbranchExist = this.globalbranchNumberDrpList.filter((data: any) => String(data.branch_Code) === this.newBenificiaryBankDetails?.value?.bankBranch)?.[0];
    //     if (!ifbranchExist) {
    //       this.newBenificiaryBankDetails.controls['bankBranch'].patchValue('');
    //       if (this.bankDetailsFormStep4Values) {
    //         this.bankDetailsFormStep4Values.bankBranch = '';
    //       }
    //       this.bindBranchNumber = '';
    //     }
    //   }
    //   if (this.bindBankNumber) {
    //     const bankObj = { 'value': this.bindBankNumber }
    //     this.changeBankNumber(bankObj)
    //   }
    // }, error => {
    //   this.showLoader = false;
    //   this.isBankNumberDrpError = error?.error?.apiErrorMessage || error?.error?.message || 'Internal server error';
    //   if (this.isBankNumberDrpError || this.globalbankNumberDrpList?.length === 0) {
    //     this.isDisplayBankBranchInput = true;
    //     this.newBenificiaryBankDetails.controls['bankNumber'].patchValue(this.bankDetailsFormStep4Values?.bankNumber);
    //     this.newBenificiaryBankDetails.controls['bankBranch'].patchValue(this.bankDetailsFormStep4Values?.bankBranch);
    //   }
    // });
  }

  filterBankCountryList() {
    this.benBankCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((countrySearchVal: any) => {
      this.bankCountryList = countrySearchVal ? this.filterBankCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  filterBankCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  getDynamicBankDetailsObjectFromStep2() {
    const step2Details = this.newBenificiaryStep2?.value;
    this.isIlsScenario = step2Details?.beneficiaryCountry == 'il' && step2Details?.bankCountry == 'il' && step2Details?.currency == 'ILS';

    this.contactsService.getBankDetailsDynamicFieldPatternsRes.subscribe((dynamicPattersRes) => {
      this.bankDetailsDynamicFieldsPatternsObj = dynamicPattersRes;
    });

    this.contactsService.getBankDetailsDynamicFieldRes.subscribe((value) => {
      this.bankDetailsDynamicFieldsObj = value;
      if (this.isIlsScenario || this.newBenificiaryStep2Values.bankCountry == 'il') {
        this.getBankNumberList();
        this.summaryBankDetailsFields = [];
        this.summaryBankDetailsFields = ['beneficiaryIdNumber', 'bankNumber', 'bankBranch', 'accountNumber', 'bankAccountHolderHebrewName', 'bankAccountHolderName', 'bankAccountHolderEmail'];
        const bankNumberControl = this.newBenificiaryBankDetails.controls['bankNumber'];
        const bankBranchControl = this.newBenificiaryBankDetails.controls['bankBranch'];
        bankNumberControl.setValidators([
          Validators.required,
          Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.bank_code)
        ]);
        bankBranchControl.setValidators([
          Validators.required,
          Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.branch_code)
        ]);
        bankNumberControl.updateValueAndValidity();
        bankBranchControl.updateValueAndValidity();
        this.cd.detectChanges();
      }
    });


    this.contactsService.getDynamicBankDetailsControls.subscribe((dynamicControlName) => {
      const step2Details = this.newBenificiaryStep2?.value;
      if (!(this.isIlsScenario)) {
        const staticControls = ['beneficiaryHouseNumber', 'beneficiaryZipCode', 'beneficiaryStreet', 'beneficiaryCity', 'bankAccountHolderEmail', 'bankAccountHolderName', 'bankName', 'firstName', 'lastName']
        dynamicControlName.forEach((element: any) => {
          this.summaryBankDetailsFields.push(element)
        });
        staticControls.forEach(statciCont => {
          this.summaryBankDetailsFields.push(statciCont);
        });
        const isIsraelTransaction = this.newBenificiaryStep2?.value?.beneficiaryCountry === 'il'
          && this.newBenificiaryStep2?.value?.bankCountry === 'il'
          && this.newBenificiaryStep2?.value?.currency === 'ILS';
        const loanAndInvestmentReasons = [1, 2, 3, 5, 6, 7, 26];
        this.isLoanAndInvestmentCategory = loanAndInvestmentReasons.includes(this.transactions.get('paymentReason')?.value);
        if ((isIsraelTransaction) || (!(isIsraelTransaction) && this.isLoanAndInvestmentCategory)) {
          this.summaryBankDetailsFields.push('beneficiaryIdNumber');
        }
        if (!isIsraelTransaction && step2Details?.beneficiaryAccountType == '1') {
          this.summaryBankDetailsFields.push('bankAccountHolderNickname');
        }
      }
    });

    this.newBenificiaryBankDetails.controls['iban'].valueChanges.pipe(distinctUntilChanged()).subscribe((res: any) => {
      // this.checkIbanORSwiftValidations();
    });

    this.newBenificiaryBankDetails.controls['swiftCode'].valueChanges.pipe(distinctUntilChanged()).subscribe((res: any) => {
      // this.checkIbanORSwiftValidations();
    });
    this.newBenificiaryBankDetails.controls['accountNumber'].valueChanges.pipe(distinctUntilChanged()).subscribe((res: any) => {
      // this.checkIbanORSwiftValidations();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.newBenificiaryStep2 = this.newBenificiaryStep2;
    this.transactions = this.transactions;
    this.newBenificiaryStep2Values = this.newBenificiaryStep2Values;
    this.transcationFormStep3Values = this.transcationFormStep3Values;
    this.bankDetailsFormStep4Values = this.bankDetailsFormStep4Values;
    this.bankCountryList = this.globalCountryData = this.countryList;
    this.newBenificiaryBankDetails = this.newBenificiaryBankDetails;
    this.bankDetailsDynamicFieldsPatternsObj = this.bankDetailsDynamicFieldsPatternsObj;
    const loanAndInvestmentReasons = [1, 2, 3, 5, 6, 7, 26];
    this.isLoanAndInvestmentCategory = loanAndInvestmentReasons.includes(this.transactions.get('paymentReason')?.value);

    const beneficiaryCountry = this.newBenificiaryStep2?.value?.beneficiaryCountry;
    const bankCountry = this.newBenificiaryStep2?.value?.bankCountry;
    const currency = this.newBenificiaryStep2?.value?.currency;

    if (beneficiaryCountry == 'il' && bankCountry == 'il' && currency == 'ILS') {
      this.setBeneficiartValidation();
    }
    if (this.isLoanAndInvestmentCategory && !(beneficiaryCountry == 'il' && bankCountry == 'il' && currency == 'ILS')) {
      this.setBeneficiartValidation();
    }
  }

  setBeneficiartValidation() {
    const beneficiaryIdNumber = this.newBenificiaryBankDetails.controls['beneficiaryIdNumber'];
    beneficiaryIdNumber.setValidators([
      Validators.required,
      Validators.pattern('^\\d{9}$')
    ]);
  }

  getAddEditBeneficiaryData() {
    this.contactsService.getStateAndCityRes.subscribe((res: any) => {
      if (res) {
        this.stateList = this.globalStateList = res?.stateList || [];
        this.cityList = this.globalCityList = res?.cityList || [];
        this.bindState = this.newBenificiaryBankDetails.value.beneficiaryState;
        this.bindCity = this.newBenificiaryBankDetails.value.beneficiaryCity;
        if (!this.newBenificiaryBankDetails?.value?.beneficiaryCity) {
          this.bindCity = '';
          this.newBenificiaryBankDetails.controls['beneficiaryCity'].setValidators(
            [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
          );
          this.newBenificiaryBankDetails.controls['beneficiaryCity'].updateValueAndValidity();
        }
        this.cd.detectChanges();
      }
    });
    this.getIbanOrSwiftDetailsForEditOrInvoice(this.newBenificiaryBankDetails.value); // add edit form values
  }

  getEditBeneficiaryDataFromInvoice() { // For bind data from upload Invoice
    this.contactsService.getStateAndCityRes.subscribe((res: any) => {
      if (res) {
        this.stateList = this.globalStateList = res?.stateList || [];
        this.cityList = this.globalCityList = res?.cityList || [];
      }
    });
    this.contactsService.currentInvoiceObject.subscribe((data: any) => {
      this.beneficiaryInvoiceRes = data;
      this.editBenificiaryId = data['id'];
      if (this.beneficiaryInvoiceRes && Object.keys(this.beneficiaryInvoiceRes).length > 0) {
        this.newBenificiaryBankDetails.reset();
        this.IbanerrorMsg && delete this.IbanerrorMsg;
        this.IbanCodeMismatchMessage && delete this.IbanCodeMismatchMessage;
        
        this.getIbanOrSwiftDetailsForEditOrInvoice(this.beneficiaryInvoiceRes);
      }
    })
  }

  getIbanOrSwiftDetailsForEditOrInvoice(res: any) {
    const stateCode = this.stateList?.find((st: any) => (st?.name?.toLowerCase() === res.beneficiaryState?.toLowerCase()) || (st?.state_code?.toLowerCase() === res.beneficiaryState?.toLowerCase())) || this.bankDetailsFormStep4Values?.beneficiaryState;
    this.bindState = stateCode?.['name'] ? stateCode?.['name'] : stateCode;
    this.bindCity = this.newBenificiaryBankDetails.value.beneficiaryCity;
    if (Object.keys(res).length != 0) {
      if (res?.iban != "" && res?.iban != null) {
        this.countryIso = res?.bankCountry
        this.newBenificiaryBankDetails.patchValue({
          iban: this.beneficiaryBankRequirementsObj.displayIban ? res?.iban : '',
          currency: res?.currency,
          // routingCodeValue: res?.routingCodeValue,
          bankAccountHolderName: this.newBenificiaryBankDetails?.value?.bankAccountHolderName ? this.newBenificiaryBankDetails?.value?.bankAccountHolderName : res?.bankAccountHolderName,
          firstName: this.newBenificiaryBankDetails?.value?.firstName,
          lastName: this.newBenificiaryBankDetails?.value?.lastName,
          bankAccountHolderEmail: this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail ? this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail : res?.bankAccountHolderEmail,
          beneficiaryCity: res?.beneficiaryCity,
          beneficiaryState: stateCode?.['name'] ? stateCode?.['name'] : stateCode,
          beneficiaryHouseNumber: this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber ? this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber : res?.beneficiaryHouseNumber,
          beneficiaryStreet: this.newBenificiaryBankDetails?.value?.beneficiaryStreet ? this.newBenificiaryBankDetails?.value?.beneficiaryStreet : res?.beneficiaryStreet,
          beneficiaryZipCode: res?.beneficiaryZipCode,
        })
        this.getIBNDetail(res?.iban)
      }
      else if (res?.swiftCode != "" && res.swiftCode != null) {
        this.countryIso = res?.bankCountry
        this.newBenificiaryBankDetails.patchValue({
          swiftCode: res?.swiftCode,
          currency: res?.currency,
          bankNumber: res?.bankNumber,
          accountNumber: this.newBenificiaryBankDetails?.value?.accountNumber ? this.newBenificiaryBankDetails?.value?.accountNumber : res?.accountNumber,
          // routingCodeValue: res?.routingCodeValue,
          bankAccountHolderName: this.newBenificiaryBankDetails?.value?.bankAccountHolderName ? this.newBenificiaryBankDetails?.value?.bankAccountHolderName : res?.bankAccountHolderName,
          firstName: this.newBenificiaryBankDetails?.value?.firstName,
          lastName: this.newBenificiaryBankDetails?.value?.lastName,
          bankAccountHolderEmail: this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail ? this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail : res?.bankAccountHolderEmail,
          beneficiaryCity: res?.beneficiaryCity,
          beneficiaryState: stateCode?.['name'] ? stateCode?.['name'] : stateCode,
          beneficiaryHouseNumber: this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber ? this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber : res?.beneficiaryHouseNumber,
          beneficiaryStreet: this.newBenificiaryBankDetails?.value?.beneficiaryStreet ? this.newBenificiaryBankDetails?.value?.beneficiaryStreet : res?.beneficiaryStreet,
          beneficiaryZipCode: res?.beneficiaryZipCode,
        })
        this.getSwiftDetail(res?.swiftCode)
      }
      else {
        this.newBenificiaryBankDetails.patchValue({
          iban: "",
          swiftCode: "",
          bankAccountHolderName: this.newBenificiaryBankDetails?.value?.bankAccountHolderName ? this.newBenificiaryBankDetails?.value?.bankAccountHolderName : res?.bankAccountHolderName,
          firstName: this.newBenificiaryBankDetails?.value?.firstName,
          lastName: this.newBenificiaryBankDetails?.value?.lastName,
          bankAccountHolderEmail: this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail ? this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail : res?.bankAccountHolderEmail,
          beneficiaryCity: res?.beneficiaryCity,
          beneficiaryState: stateCode?.['name'] ? stateCode?.['name'] : stateCode,
          beneficiaryHouseNumber: this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber ? this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber : res?.beneficiaryHouseNumber,
          beneficiaryStreet: this.newBenificiaryBankDetails?.value?.beneficiaryStreet ? this.newBenificiaryBankDetails?.value?.beneficiaryStreet : res?.beneficiaryStreet,
          beneficiaryZipCode: res?.beneficiaryZipCode,
          // currency: null,
          // bankNumber: null,
          // accountNumber: null,
        });
      }
    }
    this.cd.detectChanges();
  }

  filterStateProvinceList() {
    this.stateProvinceSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(stateProvinceSearch => {
      this.stateList = stateProvinceSearch ? this.filterStateProvince(stateProvinceSearch) : this.globalStateList;
    });
  }

  filterStateProvince(stateProvinceSearch: string) {
    return this.globalStateList.filter((stateObj: any) =>
      stateObj.name.toLowerCase().includes(stateProvinceSearch.toLowerCase())
    );
  }

  filterCityProvinceList() {
    this.citySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(cityProvinceSearch => {
      this.cityList = cityProvinceSearch ? this.filterCityProvince(cityProvinceSearch) : this.globalCityList;
    });
  }

  filterCityProvince(cityProvinceSearch: string) {
    return this.globalCityList.filter((cityName: any) =>
      cityName.toLowerCase().includes(cityProvinceSearch.toLowerCase())
    );
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

  // clearIbanValidators() {
  //   const ibanControl = this.newBenificiaryBankDetails.controls['iban'];
  //   ibanControl.clearValidators();
  //   ibanControl.updateValueAndValidity();
  // }

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
    const isHebrew = /[\u0590-\u05FF]/.test(key);
    const isAllowedCharacter = /^[a-zA-Z0-9- ]$/.test(key) || isHebrew;

    // If the key is not allowed, prevent the default action
    if (!isAllowedCharacter) {
      event.preventDefault();
    }
  }



  // setIbanValidators() {
  //   const ibanControl = this.newBenificiaryBankDetails.controls['iban'];
  //   // Set proper validators based on conditions
  //   if (this.beneficiaryBankRequirementsObj?.iban) {
  //     ibanControl.setValidators([
  //       Validators.required,
  //       Validators.pattern(this.beneficiaryBankRequirementsObj?.iban)
  //     ]);
  //   }
  //   ibanControl.updateValueAndValidity();
  // }

  // clearSwiftCodeValidators() {
  //   const swiftCodeControl = this.newBenificiaryBankDetails.controls['swiftCode'];
  //   swiftCodeControl.clearValidators();
  //   swiftCodeControl.updateValueAndValidity();
  // }

  // updateValidatorsBasedOnSwiftCodeAndIban(res: any) {
  //   const ibanControl = this.newBenificiaryBankDetails.controls['iban'];
  //   const swiftCodeControl = this.newBenificiaryBankDetails.controls['swiftCode'];
  //   if (ibanControl?.value) {
  //     swiftCodeControl.clearValidators();
  //     swiftCodeControl.updateValueAndValidity();
  //   } else {
  //     ibanControl.clearValidators();
  //     ibanControl.updateValueAndValidity();
  //   }
  // }

  onCutTypeValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onCopyTypeValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onPasteTypeValue(event: ClipboardEvent): void {
    event.preventDefault();
  }

  restrictDot(event: any) {
    if (event?.key === ".") {
      event?.preventDefault();
    }
    if ((event.metaKey || event.ctrlKey) && (event.key === 'x' || event.key === 'c' || event.key === 'v')) {
      event.preventDefault();
    }
  }

  getCountryName(countryCode: string) {
    if (this.countryList && this.countryList.length !== 0) {
      return this.countryList.filter((data: any) => data.countryCode == countryCode)[0]?.['countryName'];
    }
  }

  get invoice(): FormArray {
    return this.payment.get('invoice') as FormArray;
  }

  changeBankNumber(event: any) {
    this.showLoader = true;
    this.bindBankNumber = event?.value;
    this.bindBranchNumber = '';
    // this.contactsService.getBranchNumberList(event?.value).pipe(takeUntil(this.unSubScribe$)).subscribe(branchNumberRes => {
    //   this.isBranchNumberHasError = '';
    //   this.branchNumberDrpList = this.globalbranchNumberDrpList = branchNumberRes;
    //   if (this.globalCityList && this.globalCityList.length === 0) {
    //     this.newBenificiaryBankDetails.controls['beneficiaryCity'].patchValue(this.bankDetailsFormStep4Values?.beneficiaryCity);
    //     if (this.bankDetailsFormStep4Values) {
    //       this.bankDetailsFormStep4Values['beneficiaryCity'] = this.bankDetailsFormStep4Values?.beneficiaryCity;
    //     }
    //   }
    //   if (this.globalbranchNumberDrpList?.length !== 0) {
    //     const ifbranchExist = this.globalbranchNumberDrpList.filter((data: any) => String(data.branch_Code) === this.newBenificiaryBankDetails?.value?.bankBranch)?.[0];
    //     if (!ifbranchExist) {
    //       this.newBenificiaryBankDetails.controls['bankBranch'].patchValue('');
    //       if (this.bankDetailsFormStep4Values) {
    //         this.bankDetailsFormStep4Values['bankBranch'] = '';
    //       }
    //       this.bankDetailsFormValues.emit(this.bankDetailsFormStep4Values);
    //       this.bindBranchNumber = '';
    //     }
    //   }
    //   this.showLoader = false;
    //   if (this.newBenificiaryBankDetails?.get('bankNumber')?.value && this.globalbranchNumberDrpList?.length === 0 && this.globalbankNumberDrpList?.length !== 0) {
    //     this.displayWarningMsg = "No active branches found for this bank.";
    //   } else {
    //     this.displayWarningMsg = '';
    //   }
    //   this.bindBranchNumber = this.bankDetailsFormStep4Values?.bankBranch;
    //   if (this.globalbranchNumberDrpList && this.globalbranchNumberDrpList?.length === 0) {
    //     const bankBranchControl = this.newBenificiaryBankDetails.controls['bankBranch'];
    //     bankBranchControl.clearValidators();
    //     bankBranchControl.updateValueAndValidity();
    //   }
    //   if (this.globalbranchNumberDrpList && this.globalbranchNumberDrpList?.length !== 0) {
    //     this.newBenificiaryBankDetails.controls['bankNumber'].setValidators([
    //       Validators.required,
    //       Validators.pattern('')
    //     ]);
    //     this.newBenificiaryBankDetails.controls['bankBranch'].setValidators([
    //       Validators.required,
    //       Validators.pattern('')
    //     ]);
    //   }
    //   this.cd.detectChanges();
    // }, error => {
    //   this.showLoader = false;
    //   this.isBranchNumberHasError = error?.error?.apiErrorMessage;
    // });
    this.bindBranchNumber = this.newBenificiaryBankDetails?.bankBranch?.value ? this.newBenificiaryBankDetails?.bankBranch?.value : this.bankDetailsFormStep4Values?.bankBranch;
  }

  changeBranchNumber(event: any) {
    this.bindBranchNumber = event?.value;
    if (this.bankDetailsFormStep4Values) {
      this.bankDetailsFormStep4Values['bankBranch'] = event?.value;
    }
    this.bankDetailsFormValues.emit(this.bankDetailsFormStep4Values);
    this.newBenificiaryBankDetails?.get('bankBranch')?.patchValue(event?.value);
  }

  changeState(event: any) {
    // this.newBenificiaryBankDetails.get('beneficiaryState')?.patchValue(event?.value);
    this.bindState = event?.value;
    this.bankDetailsFormValues.emit(this.newBenificiaryBankDetails.value);
    const selectedCountry = this.countryList?.find((data: any) => data.countryCode === this.newBenificiaryStep2Values?.beneficiaryCountry);

    of(cityList).subscribe((data: any) => {
      let stateCityObj: any = {
        stateList: [],
        cityList: [],
      }
      if (data.length !== 0) {
        stateCityObj.stateList = this.stateList;
        stateCityObj.cityList = this.globalCityList = Array.from(new Set(data));
      } else {
        stateCityObj.stateList = this.stateList;
        stateCityObj.cityList = this.globalCityList = Array.from(new Set(data));
      }
      this.contactsService.setStateAndCityBankDetailspage(stateCityObj);
    });
    this.newBenificiaryBankDetails.controls['beneficiaryCity'].reset();
  }


  changeCity(event: any) {
    this.bindCity = event?.value;
    this.newBenificiaryBankDetails.get('beneficiaryCity')?.patchValue(event?.value);
  }

  nextStep() {
    let createNewBenificiaryDateObj = {
      "id": "",
      "createdAt": new Date(),
      "updatedAt": new Date(),
    }

    const uniqueFields: any = [];
    for (let field of this.summaryBankDetailsFields) {
      if (!uniqueFields.includes(field)) {
        uniqueFields.push(field);
      }
    }

    const addBlankIFNotExistInBankDetailsPage = Object.keys(this.newBenificiaryBankDetails?.value)
      .reduce((result: any, key: any) => {
        if (uniqueFields.includes(key)) {
          result[key] = this.newBenificiaryBankDetails?.value[key]; // Add the key-value pair if the key is in the array
        } else {
          result[key] = ''; // Add a blank value if the key is not in the array
        }
        return result;
      }, {});

    this.contactsService.setBankDetailsSummaryControls(uniqueFields);

    const formData = { ...this.newBenificiaryStep2Values, ...this.transcationFormStep3Values, ...addBlankIFNotExistInBankDetailsPage, ...createNewBenificiaryDateObj }

    formData["IsBeneficiaryBusinessCategoryLegit"] = this.newBenificiaryStep2?.value?.IsBeneficiaryBusinessCategoryLegit == "true" ? true : false;
    this.saveBeneficiary(formData);
  }

  clearControlValidators(controlName: string): void {
    if (this.newBenificiaryBankDetails?.controls[controlName]) {
      this.newBenificiaryBankDetails.controls[controlName].clearValidators();
      this.newBenificiaryBankDetails.controls[controlName].updateValueAndValidity();
    }
  }

  // checkIbanORSwiftValidations() {
  //   const isIban = this.bankDetailsDynamicFieldsObj?.displayIban;
  //   const isSwiftCode = this.bankDetailsDynamicFieldsObj?.displaySwiftCode;
  //   const isAccountNumber = this.bankDetailsDynamicFieldsObj?.displayAccountNumber;
  //   const isIbanHasValue = this.newBenificiaryBankDetails.controls['iban']?.value;
  //   const isSwiftCodeHasValue = this.newBenificiaryBankDetails.controls['swiftCode']?.value;
  //   const isAccountNumberHasValue = this.newBenificiaryBankDetails.controls['accountNumber']?.value;

  //   if (!isSwiftCode) {
  //     this.newBenificiaryBankDetails.controls['swiftCode'].patchValue('');
  //   }

  //   if (isIban && !isIbanHasValue) {
  //     this.newBenificiaryBankDetails.controls['iban'].setValidators([
  //       Validators.required,
  //       Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.iban)
  //     ]);
  //     if (isSwiftCodeHasValue && isAccountNumberHasValue) {
  //       delete this.IbanerrorMsg;
  //       this.clearControlValidators('iban');
  //     } else {
  //       // this.clearControlValidators('swiftCode');
  //       // this.clearControlValidators('accountNumber');
  //     }
  //     this.newBenificiaryBankDetails.controls['iban'].updateValueAndValidity();
  //   }
  //   if (isSwiftCode && !isSwiftCodeHasValue) {
  //     this.newBenificiaryBankDetails.controls['swiftCode'].setValidators([
  //       Validators.required,
  //       Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.bic_swift)
  //     ]);
  //     this.newBenificiaryBankDetails.controls['swiftCode'].updateValueAndValidity();
  //     this.newBenificiaryBankDetails.controls['accountNumber'].setValidators([
  //       Validators.required,
  //       Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.account_number)
  //     ]);
  //     this.newBenificiaryBankDetails.controls['accountNumber'].updateValueAndValidity();
  //     if (isIbanHasValue) {
  //       delete this.SwifterrorMsg;
  //       this.clearControlValidators('swiftCode');
  //       // this.clearControlValidators('accountNumber');
  //     } else {
  //       // this.clearControlValidators('iban');
  //     }
  //   }
  //   if (isSwiftCode && isSwiftCodeHasValue && isAccountNumberHasValue) {
  //     this.newBenificiaryBankDetails.controls['swiftCode'].setValidators([
  //       Validators.required,
  //       Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.bic_swift)
  //     ]);
  //     this.newBenificiaryBankDetails.controls['accountNumber'].setValidators([
  //       Validators.required,
  //       Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.account_number)
  //     ]);
  //   }
  //   if (!isIban && !isSwiftCode) {
  //     this.newBenificiaryBankDetails.controls['accountNumber'].setValidators([
  //       Validators.required,
  //       Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.account_number)
  //     ]);
  //     this.clearControlValidators('iban');
  //     this.clearControlValidators('swiftCode');
  //     this.newBenificiaryBankDetails.controls['accountNumber'].updateValueAndValidity();
  //   }
  //   if (this.isSwiftCheckBoxSelected) {
  //     const swiftControl = this.newBenificiaryBankDetails.controls['swiftCode'];
  //     swiftControl.clearValidators();
  //     swiftControl.updateValueAndValidity();
  //   }
  // }

  saveBeneficiary(data: any) {
    this.isSubmitnewBenificiaryBankDetailsForm = true;
    delete this.errorMsg

    // this.checkIbanORSwiftValidations();

    const isSwiftCodeHasValue = this.newBenificiaryBankDetails.controls['swiftCode']?.value;
    if (!this.isSwiftCheckBoxSelected && this.bankDetailsDynamicFieldsObj?.displaySwiftCode && !isSwiftCodeHasValue) {
      this.newBenificiaryBankDetails.controls['swiftCode'].setValidators([
        Validators.required,
        Validators.pattern(this.bankDetailsDynamicFieldsPatternsObj?.bic_swift)
      ]);
      this.newBenificiaryBankDetails.controls['swiftCode'].updateValueAndValidity();
    }

    if (this.newBenificiaryStep2Values.bankCountry !== 'il' || (this.newBenificiaryStep2Values.bankCountry == 'il' && this.newBenificiaryStep2Values.beneficiaryCountry !== 'il')) {
      if (!this.bankDetailsDynamicFieldsObj?.displayBankNumber) {
        this.clearControlValidators('bankNumber');
      }
      if (!this.bankDetailsDynamicFieldsObj?.displayBranchCode) {
        this.clearControlValidators('bankBranch');
      }
    }

    if (!this.bankDetailsDynamicFieldsObj?.displaySortCode) {
      this.clearControlValidators('sortCode');
    }

    // Clear specific fields based on beneficiaryAccountType
    const accountType = this.newBenificiaryStep2?.get('beneficiaryAccountType')?.value;

    if (accountType === '1') {
      this.clearControlValidators('beneficiaryStreet');
    }
    let routingCodeFound = false;
    for (const key in this.routingCodeMap) {
      if (data[key as keyof typeof data]) {
        this.newBenificiaryBankDetails.controls['routingCodeType'].setValue(this.routingCodeMap[key as keyof typeof this.routingCodeMap]);
        this.newBenificiaryBankDetails.controls['routingCodeValue'].setValue(data[key as keyof typeof data]);
        routingCodeFound = true;
        break; // Stop once a match is found
      }
    }

    // If no routing code was found, set both values to null
    if (!routingCodeFound) {
      data['routingCodeType'] = null;
      data['routingCodeValue'] = null;
    }

    data['routingCodeType'] = this.newBenificiaryBankDetails.controls['routingCodeType']?.value ? this.newBenificiaryBankDetails.controls['routingCodeType']?.value : null;
    data['routingCodeValue'] = this.newBenificiaryBankDetails.controls['routingCodeValue']?.value ? this.newBenificiaryBankDetails.controls['routingCodeValue']?.value : null;

    let importedBeneficiary = localStorage.getItem('importedBeneficiary')
    if (importedBeneficiary || data?.erpBeneficiaryId) {
      data['ErpBeneficiaryId'] = data?.erpBeneficiaryId
      delete data?.erpBeneficiaryId
    } else {
      delete data['ErpBeneficiaryId']
    }

    if (this.bankDetailsDynamicFieldsObj) {
      const { displayIban, displaySwiftCode } = this.bankDetailsDynamicFieldsObj;
      if (displayIban && displaySwiftCode) {
        this.newBenificiaryBankDetails.controls['bankAccountType'].patchValue(1);
      } else if (!displayIban && displaySwiftCode) {
        this.newBenificiaryBankDetails.controls['bankAccountType'].patchValue(2);
      } else {
        this.newBenificiaryBankDetails.controls['bankAccountType'].patchValue(3);
      }
    } else {
      this.newBenificiaryBankDetails.controls['bankAccountType'].patchValue(3);
    }

    data['bankAccountType'] = this.newBenificiaryBankDetails.controls['bankAccountType']?.value;

    if (this.newBenificiaryStep2?.value?.bankCountry == 'il' && this.newBenificiaryStep2?.value?.currency == 'ILS') { // for bank and branch number dropdown
      let ildBankBranchobjForSummary = {
        'ilsBankNumberExist': this.globalbankNumberDrpList?.filter((data: any) => data.bank_Code == this.newBenificiaryBankDetails?.value?.bankNumber)[0]?.bank_Name,
        'ilsBranchNumberExist': this.globalbranchNumberDrpList && this.globalbranchNumberDrpList.length !== 0 ? this.globalbranchNumberDrpList?.filter((data: any) => data.branch_Code == this.newBenificiaryBankDetails?.value?.bankBranch)[0]?.branch_Name : ''
      }
      this.contactsService.setIlsBankBranchCodeData(ildBankBranchobjForSummary);
    }

    if (this.newBenificiaryStep2?.value?.beneficiaryCountry == 'il'
      && this.newBenificiaryStep2?.value?.bankCountry == 'il'
      && this.newBenificiaryStep2?.value?.currency == 'ILS') {

      let ildBankBranchobjForSummary = {
        'ilsBankNumberExist': this.globalbankNumberDrpList?.filter((data: any) => data.bank_Code == this.newBenificiaryBankDetails?.value?.bankNumber)[0]?.bank_Name,
        'ilsBranchNumberExist': this.globalbranchNumberDrpList && this.globalbranchNumberDrpList.length !== 0 ? this.globalbranchNumberDrpList?.filter((data: any) => data.branch_Code == this.newBenificiaryBankDetails?.value?.bankBranch)[0]?.branch_Name : ''
      }
      this.contactsService.setIlsBankBranchCodeData(ildBankBranchobjForSummary);

      Object.entries(this.newBenificiaryBankDetails.controls).forEach(([controlName, control]: [string, any]) => {
        if (!this.summaryBankDetailsFields.includes(controlName)) {
          control.patchValue('');
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });

      if (this.bankNumberDrpList && this.bankNumberDrpList.length !== 0) {
        this.newBenificiaryBankDetails.controls['bankNumber'].setValidators([
          Validators.required,
          Validators.pattern('')
        ]);
        this.newBenificiaryBankDetails.controls['bankNumber'].updateValueAndValidity();
      }

      Object.values(this.newBenificiaryBankDetails.controls).forEach((control: any) => {
        control.markAsTouched();
        control.updateValueAndValidity(); // Update the validity status of the control, triggering validation (including pattern validation)
      });

      console.log('Form Status after marking as touched:', this.newBenificiaryBankDetails.invalid);
      // Check if the form is still invalid after updating validity
      if (this.newBenificiaryBankDetails.invalid) {
        console.log('Form is invalid:', this.newBenificiaryBankDetails.errors, this.newBenificiaryBankDetails);
        this.showLoader = false;
        this.scrollToInvalidControl(); // Scroll to the first invalid control
        return;
      }
    } else {
      if (this.IbanerrorMsg) {
        this.newBenificiaryBankDetails.controls['iban'].setErrors({ required: true });
        this.errorArr = [];
        this.errorArr.push('iban');
        this.scrollToInvalidControl();
        return
      }
      if (this.SwifterrorMsg) {
        this.newBenificiaryBankDetails.controls['swiftCode'].setErrors({ required: true });
        this.errorArr = [];
        this.errorArr.push('swiftCode');
        this.scrollToInvalidControl();
        return
      }

      if (this.bankDetailsDynamicFieldsObj?.displayBeneficiaryState) {
        if (this.stateList?.length !== 0) {
          if (!this.newBenificiaryBankDetails?.value?.beneficiaryState) {
            this.newBenificiaryBankDetails.controls['beneficiaryState'].setErrors({ required: true });
            this.errorArr = [];
            this.errorArr.push('beneficiaryState');
          }
        } else {
          if (!this.newBenificiaryBankDetails?.value?.beneficiaryState) {
            this.newBenificiaryBankDetails.controls['beneficiaryState'].setErrors({ required: true });
            this.errorArr = [];
            this.errorArr.push('beneficiaryState');
          }
        }
      } else {
        this.newBenificiaryBankDetails.controls['beneficiaryState'].patchValue('');
        this.newBenificiaryBankDetails.controls['beneficiaryState'].clearValidators();
        this.newBenificiaryBankDetails.controls['beneficiaryState'].updateValueAndValidity();
      }

      if (!this.newBenificiaryBankDetails?.value?.bankAccountHolderName) {
        this.newBenificiaryBankDetails.controls['bankAccountHolderName'].setValidators(
          [Validators.required, Validators.pattern('^[A-Za-z\\s]{2,40}$')]
        );
        this.newBenificiaryBankDetails.controls['bankAccountHolderName'].updateValueAndValidity();
      }

      if (this.newBenificiaryStep2Values?.beneficiaryAccountType == 2 && !this.newBenificiaryBankDetails?.value?.firstName) {
        this.newBenificiaryBankDetails.controls['firstName'].setValidators(
          [Validators.required, Validators.pattern('^[A-Za-z\\s]{2,40}$')]
        );
        this.newBenificiaryBankDetails.controls['firstName'].updateValueAndValidity();
      }

      if (this.newBenificiaryStep2Values?.beneficiaryAccountType == 2 && !this.newBenificiaryBankDetails?.value?.lastName) {
        this.newBenificiaryBankDetails.controls['lastName'].setValidators(
          [Validators.required, Validators.pattern('^[A-Za-z\\s]{2,40}$')]
        );
        this.newBenificiaryBankDetails.controls['lastName'].updateValueAndValidity();
      }

      if (!this.newBenificiaryBankDetails?.value?.bankAccountHolderEmail) {
        this.newBenificiaryBankDetails.controls['bankAccountHolderEmail'].setValidators(
          [Validators.required, Validators.pattern('^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$')]
        );
        this.newBenificiaryBankDetails.controls['bankAccountHolderEmail'].updateValueAndValidity();
      }

      if (!this.newBenificiaryBankDetails?.value?.beneficiaryCity) {
        this.bindCity = '';
        this.newBenificiaryBankDetails.controls['beneficiaryCity'].setValidators(
          [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
        );
        this.newBenificiaryBankDetails.controls['beneficiaryCity'].updateValueAndValidity();
      }
      if (!this.newBenificiaryBankDetails?.value?.beneficiaryStreet) {
        this.newBenificiaryBankDetails.controls['beneficiaryStreet'].setValidators(
          [Validators.required, Validators.pattern('^.{1,255}')]
        );
        this.newBenificiaryBankDetails.controls['beneficiaryStreet'].updateValueAndValidity();
      }
      if (!this.newBenificiaryBankDetails?.value?.beneficiaryHouseNumber) {
        this.newBenificiaryBankDetails.controls['beneficiaryHouseNumber'].setValidators(
          [Validators.required, Validators.maxLength(50), Validators.minLength(1)]
        );
        this.newBenificiaryBankDetails.controls['beneficiaryHouseNumber'].updateValueAndValidity();
      }
      if (!this.newBenificiaryBankDetails?.value?.beneficiaryZipCode) {
        this.newBenificiaryBankDetails.controls['beneficiaryZipCode'].setValidators(
          [Validators.required]
        );
        this.newBenificiaryBankDetails.controls['beneficiaryZipCode'].updateValueAndValidity();
      }

      if (this.bankDetailsFormStep4Values?.beneficiaryHouseNumber) {
        this.bankDetailsFormStep4Values.beneficiaryHouseNumber = this.bankDetailsFormStep4Values?.beneficiaryHouseNumber;
      }
      if (this.bankDetailsFormStep4Values?.beneficiaryStreet) {
        this.bankDetailsFormStep4Values.beneficiaryStreet = this.bankDetailsFormStep4Values?.beneficiaryStreet;
      }
      this.newBenificiaryBankDetails.controls['bankAccountHolderHebrewName'].clearValidators();
      this.newBenificiaryBankDetails.controls['bankAccountHolderHebrewName'].updateValueAndValidity();
      if (!this.isLoanAndInvestmentCategory) {
        this.newBenificiaryBankDetails.controls['beneficiaryIdNumber'].patchValue('');
        this.newBenificiaryBankDetails.controls['beneficiaryIdNumber'].clearValidators();
        this.newBenificiaryBankDetails.controls['beneficiaryIdNumber'].updateValueAndValidity();
        data['beneficiaryIdNumber'] = '';
      }
      Object.values(this.newBenificiaryBankDetails.controls).forEach((control: any) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      if (this.newBenificiaryBankDetails.invalid) {
        this.showLoader = false;
        this.scrollToInvalidControl();
        return;
      }
    }

    this.showLoader = true;
    let newPaymentReasonArray: any = [];
    newPaymentReasonArray = Object.values(this.paymentReasons).reduce((acc: any, curr: any) => acc.concat(curr), []);
    const selectedPaymentObj = newPaymentReasonArray.filter((paymentObj: any) => paymentObj.paymentReason === this.transactions.value.paymentReason)[0];
    const originalDocumentTypes = selectedPaymentObj.documentTypes;
    this.newBenificiaryBankDetails.patchValue(this.newBenificiaryBankDetails.value);
    this.bankDetailsFormValues.emit(this.newBenificiaryBankDetails.value);
    this.cd.detectChanges();
    data['id'] = this.editBenificiaryObj && Object.keys(this.editBenificiaryObj).length > 0 ? this.editBenificiaryObj?.id : '';

    if (this.globalbranchNumberDrpList?.length == 0 && this.isIlsScenario && !this.isBankNumberDrpError && this.globalbankNumberDrpList?.length !== 0) {
      data['bankBranch'] = '';
      this.newBenificiaryBankDetails.get('bankBranch')?.patchValue('');
    } else {
      data['bankBranch'] = data['bankBranch'] ? data['bankBranch'] : '';
    }

    if (!this.bankDetailsDynamicFieldsObj?.displaySwiftCode) {
      delete data['isSwiftSelected'];
    }

    for (const key in data) {
      if (key !== 'routingCodeType' && key !== 'routingCodeValue') {
        if (data[key] == null) { // checks for null or undefined
          data[key] = '';
        }
      }
      if (key == 'beneficiaryIdNumber' && !data[key]) {
        data[key] = null;
      }

    }

    if (this.beneficiaryInvoiceRes && Object.keys(this.beneficiaryInvoiceRes).length > 0) {
      this.contactsService.setBeneficiaryObject({}); // for clear invoice data
    }

    // to filter and pass the value of bank_Name_En from the selected bank number
    data['bankName'] = this.globalbankNumberDrpList.filter((data: any) => data.bank_Code == this.newBenificiaryBankDetails?.value?.bankNumber)[0]?.bank_Name_En;
    of({ body: this.isBeneficiaryExist }).subscribe({
      next: (saveBeneficiaryRes: any) => {
        saveBeneficiaryRes.body = true;
        this.loading = false;
        this.showLoader = false;
        this.contactsService.setBeneficiaryFileObject({
          "id": "",
          "saveBeneficiaryRes": data,
          "type": originalDocumentTypes
        });
        const moveUserDirectalyToSummaryPage = [18, 25, 19, 21, 999];
        const paymentReason = Number(data['paymentReason']);
        if (moveUserDirectalyToSummaryPage.includes(paymentReason)) {
          this.skipUploadFileStep.emit();
        } else {
          this.stepChanged.emit();
        }
      },
      error: (err: any) => {
        if (err?.status === 400) {
          this.showLoader = false;
          if (err?.error?.apiErrorMessage) {
            this.errorMsg = err.error.apiErrorMessage[0]; // Use this if it's present
          }
        } else if (err?.status === 409) {
          this.showLoader = false;
          if (err?.error?.apiErrorMessage) {
            this.errorMsg = err?.error?.apiErrorMessage[0]; // Use this if it's present
          } else if (err?.error?.message) {
            this.errorMsg = err.error.message; // Fallback to a general error message
          } else {
            this.errorMsg = ''; // Default error message if nothing is available
          }
          this.cd.detectChanges();
        } else {
          this.showLoader = false;
          if (err?.error?.apiErrorMessage) {
            this.errorMsg = err.error.apiErrorMessage[0]; // Use this if it's present
          } else if (err?.error?.message) {
            this.errorMsg = err.error.message; // Fallback to a general error message
          } else {
            this.errorMsg = ''; // Default error message if nothing is available
          }
          this.cd.detectChanges();
        }
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  previousStep(stepper: any, progress: any) {
    if (Object.keys(this.beneficiaryForEdit).length != 0) {
      this.dialogRef.close();
    }
    else {
      let totalSteps = stepper.steps.length;
      let currentStep = stepper.selectedIndex + 1;
      progress.value = (currentStep * 100) / totalSteps;
      const scrollToTopPrev = document.querySelector<HTMLElement>('mat-dialog-content');

      if (scrollToTopPrev) {
        scrollToTopPrev.scrollTop = 0;
      }
    }
  }

  checkBankAccountHolderName(event: any) {
    const englishRegex = /^(?=.*\s)[a-zA-Z0-9\s'-]*$/;
    this.englishName = englishRegex.test(event.target.value);
  }

  restrickWhiteSpace(event: any) {
    if (event?.keyCode == 32) {
      event?.preventDefault();
    }
  }

  onBankCountryDropdownOpen(event: any) {
    if (this.searchBenBankCountryInput) {
      this.searchBenBankCountryInput.nativeElement.focus();
    }
    if (event) {
      this.bankCountryList = this.globalCountryData = this.countryList;
      this.benBankCountrySearchControl.setValue('');
    } else {
      if (this.bankCountryList && this.bankCountryList.length === 0) {
        this.bankCountryList = this.globalCountryData = this.countryList;
      }
    }
  }

  getBankCountryCode() {
    return this.newBenificiaryBankDetails.controls['bankCountry'].value;
  }

  ibanCheckClicked(ibanValue: any) {
    this.getIBNAccountDetails(ibanValue)
  }

  getIBNAccountDetails(ibanValue: any) {
    if (!ibanValue) {
      this.newBenificiaryBankDetails.controls['iban'].setErrors({ required: true });
      this.loading = false;
      return;
    }

    // Clear previous error messages immediately when input changes
    this.IbanerrorMsg = '';
    this.IbanCodeMismatchMessage = '';
    
    this.isIbanCodeSpinner = true;
    this.loading = true;
    this.changedAccount = false;

    let number = ibanValue;

    if (number === '') {
      this.loading = false;
      return;
    }

    this.getIBNDetail(number);
  }

  removeSwiftCodeValue(event: any) {
    this.SwifterrorMsg && delete this.SwifterrorMsg;
    this.SwiftCodeMismatchMessage && delete this.SwiftCodeMismatchMessage; 
    this.newBenificiaryBankDetails.get('swiftCode').setValue('');
    // this.checkIbanORSwiftValidations();
    this.changedAccount = true;
    if (event?.target?.checked) {
      this.isSwiftCheckBoxSelected = true;
      const swiftControl = this.newBenificiaryBankDetails.controls['swiftCode'];
      swiftControl.clearValidators();
      swiftControl.updateValueAndValidity();
    } else {
      this.isSwiftCheckBoxSelected = false;
    }
  }

  getIBNDetail(data: any) {
    this.isDisplayIbanLoader = true;
    // this.contactsService.ibanDetails(data).subscribe((data: any) => {
    //   this.ibanRes = data;
    //   this.loading = false
    //   this.countryIso = data.country
    //   console.log(
    //     `Beneficiary IBAN check >>> Bank country: ${this.newBenificiaryStep2Values?.bankCountry}, `
    //     + `IBAN country: ${data?.countryIso?.toLowerCase()} `
    //     + `=> Match: ${this.newBenificiaryStep2Values?.bankCountry === data?.countryIso?.toLowerCase()}`
    //   );
    //   if (this.newBenificiaryStep2Values?.bankCountry === data?.countryIso?.toLowerCase()) {
    //     this.newBenificiaryBankDetails.patchValue({
    //       accountNumber: data?.account != null ? data?.account : "",
    //       city: "",
    //       swiftCode: data?.bic != null ? data?.bic : "",
    //       // bankCountry: data?.countryIso,
    //       bankName: data?.bank != null ? data?.bank : "",
    //       // bankCity: data?.city != null ? data?.city : "",
    //       // bankBranch: data?.branch != null ? data?.branch : "",
    //       bankNumber: data?.bankCode != null ? data?.bankCode : "",
    //       // sortCode: data?.sortCode != null ? data?.sortCode : "",
    //       bankBranch: data?.branchCode != null ? data?.branchCode : "",
    //     })
    //     // else {
    //     //   this.newBenificiaryBankDetails.get('beneficiaryZipCode')?.patchValue(data.zip);
    //     // }

    //     this.isIbanSuccessLoader = true;
    //     this.isIbanCodeSpinner = false;
    //     this.isNotSwiftChk = data?.bic ? false : false;
    //     delete this.IbanerrorMsg;
    //     delete this.IbanCodeMismatchMessage;
    //     this.SwifterrorMsg && delete this.SwifterrorMsg;
    //     this.SwiftCodeMismatchMessage && delete this.SwiftCodeMismatchMessage; 
    //     this.cd.detectChanges();
    //     this.isDisplayIbanLoader = false;
    //   } else {
    //     this.newBenificiaryBankDetails.patchValue({
    //       accountNumber: "",
    //       swiftCode: "",
    //       bankName: "",
    //       // bankCity: "",
    //       bankNumber: "",
    //       // sortCode: "",
    //       // beneficiaryZipCode: "",
    //       bankBranch: "",
    //     })
    //     this.isIbanSuccessLoader = false;
    //     this.isIbanCodeSpinner = false;
    //     this.IbanCodeMismatchMessage = 'The IBAN you entered belongs to a country or bank that does not match your initial selection. Please check the number or update the beneficiary details.';
    //     this.loading = false;
    //     this.isDisplayIbanLoader = false;
    //     this.cd.detectChanges();
    //   }
    // }, err => {
    //   this.newBenificiaryBankDetails.patchValue({
    //     // accountNumber: "",
    //     // swiftCode: "",
    //     bankName: "",
    //     // bankCity: "",
    //     bankNumber: "",
    //     // sortCode: "",
    //     // beneficiaryZipCode: "",
    //     bankBranch: "",
    //   })
    //   this.isIbanSuccessLoader = false;
    //   this.isIbanCodeSpinner = false;
    //   this.IbanerrorMsg = err?.error?.apiErrorMessage[0];
    //   this.loading = false;
    //   this.isDisplayIbanLoader = false;
    //   this.cd.detectChanges();
    // })
  }

  swiftCheckClicked(swiftCode: any) {
    this.getSwiftAccountDetails(swiftCode);
  }

  getSwiftAccountDetails(swiftCode: any) {
    if (!swiftCode) {
      this.newBenificiaryBankDetails.controls['swiftCode'].setErrors({ required: true });
      this.loading = false;
      return;
    }
    this.SwifterrorMsg = '';
    this.SwiftCodeMismatchMessage = '';

    this.isSwiftCodeSpinner = true;
    this.loading = true;
    this.changedAccount = false;

    let number = swiftCode;
    if (number == '') {
      this.loading = false
    }
    if (this.newBenificiaryBankDetails?.value?.swiftCode || this.SwifterrorMsg !== '') {
      this.isNotSwiftChk = false;
    }
    this.getSwiftDetail(number);
  }

  getSwiftDetail(data: any) {
    this.isDisplaySwiftLoader = true;
    of(bicSwiftDetails).subscribe((data: any) => {
      this.loading = false
      this.swiftCodeRes = data;
      this.countryIso = data.countryName;
      console.log(
        `Bank country: ${this.newBenificiaryStep2Values?.bankCountry}, `
        + `isoCountryCode: ${data?.isoCountryCode?.toLowerCase()} `
        + `=> Match: ${this.newBenificiaryStep2Values?.bankCountry === data?.isoCountryCode?.toLowerCase()}`
      );
      if (this.newBenificiaryStep2Values?.bankCountry === data?.isoCountryCode.toLowerCase()) {
        this.newBenificiaryBankDetails.patchValue({
          // bankCountry: data?.isoCountryCode != null ? data?.isoCountryCode : "",
          bankName: data?.name != null ? data?.name : "",
          // bankCity: data?.city != null ? data?.city : "",
          sortCode: data?.sortCode != null ? data?.sortCode : "",
          // bankBranch: data?.branch != null ? data?.branch : "",
          bankBranch: data?.bicBranch != null ? data?.bicBranch : "",
        })
        this.cd.detectChanges();
        this.isSwiftCodeLoader = true;
        this.isSwiftCodeSpinner = false;
        delete this.SwifterrorMsg
        this.isDisplaySwiftLoader = false;
        this.newBenificiaryBankDetails.controls['accountNumber'].enable()
      } else {
        this.newBenificiaryBankDetails.patchValue({
          bankName: "",
          // bankCity: "",
          sortCode: "",
          bankBranch: "",
        })
        if (this.ibanRes) {
          this.ibanRes['bic'] = '';
        }
        this.isSwiftCodeLoader = false;
        this.isSwiftCodeSpinner = false;
        this.isDisplaySwiftLoader = false;
        this.SwiftCodeMismatchMessage = 'The SWIFT code you entered belongs to a bank or country that does not match your initial selection. Please check the code or update the beneficiary details.'
        this.loading = false;
        this.cd.detectChanges();
      }
    }, err => {
      if (this.ibanRes) {
        this.ibanRes['bic'] = '';
      }
      this.newBenificiaryBankDetails.patchValue({
        bankName: "",
        // bankCity: "",
        sortCode: "",
        bankBranch: "",
      })
      this.isSwiftCodeLoader = false;
      this.isSwiftCodeSpinner = false;
      this.isDisplaySwiftLoader = false;
      this.SwifterrorMsg = err.error.apiErrorMessage?.[0]
      this.loading = false;
      this.cd.detectChanges();
    })
  }

  changeAccount(event: any) {
    delete this.errorMsg
    this.changedAccount = true;
  }

  getStateControlValue() {
    return this.newBenificiaryBankDetails.controls['beneficiaryState'].value;
  }

  getCityControlValue() {
    return this.newBenificiaryBankDetails.controls['beneficiaryCity'].value;
  }

  getSelectedCountryFlag(countryCode: any) {
    if (this.countryList && this.countryList.length !== 0) {
      const selectedCountryFlag = this.countryList.filter((data: any) => data.countryCode === countryCode)[0]?.['flag'];
      return selectedCountryFlag;
    }
  }
  getSelectedBankAccCountryFlag(countryCode: any) {
    if (this.countryList && this.countryList.length !== 0) {
      const selectedCountryFlag = this.countryList.filter((data: any) => data.countryCode === countryCode)[0]?.['flag'];
      this.BeneficiaryBankAccountCountryName = this.countryList.filter((data: any) => data.countryCode == countryCode)[0]?.['countryName'];
      return selectedCountryFlag;
    }
  }

  hasError(controlName: string): boolean {
    const control = this.newBenificiaryBankDetails.get(controlName);
    if (control && this.isSubmitnewBenificiaryBankDetailsForm && control.invalid && (control.hasError('pattern') || control.hasError('required') || control.hasError('email'))) {
      return true;
    }
    return false;
  }

  clearBankNumberSearch() {
    if (this.bankNumberDrpSearchControl != null) {
      this.bankNumberDrpSearchControl.setValue('');
    }
  }

  clearBranchNumberSearch() {
    if (this.branchNumberDrpSearchControl != null) {
      this.branchNumberDrpSearchControl.setValue('');
    }
  }

  clearSearch() {
    if (this.stateProvinceSearchControl != null) {
      this.stateProvinceSearchControl.setValue('');
    }
    if (this.citySearchControl != null) {
      this.citySearchControl.setValue('');
    }
    if (this.benBankCountrySearchControl != null) {
      this.benBankCountrySearchControl.setValue('');
    }
  }

  onstateProvinceDropdownOpen(event: any) {
    if (this.stateProvinceInput) {
      this.stateProvinceInput.nativeElement.focus();
    }
    if (event) {
      this.stateList = this.globalStateList;
      this.stateProvinceSearchControl.setValue('');
    } else {
      if (this.stateList && this.stateList.length === 0) {
        this.stateList = this.globalStateList
      }
    }
  }

  onCityProvinceDropdownOpen(event: any) {
    if (this.cityProvinceInput) {
      this.cityProvinceInput.nativeElement.focus();
    }
    if (event) {
      this.cityList = this.globalCityList;
      this.citySearchControl.setValue('');
    } else {
      if (this.cityList && this.cityList.length === 0) {
        this.cityList = this.globalCityList;
      }
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


  scrollToInvalidControl(): void {
    for (const controlName of Object.keys(this.newBenificiaryBankDetails.controls)) {
      if (this.hasError(controlName)) {
        this.errorArr.push(controlName);
      }
    }

    for (const controlName of this.errorArr) {
      if (this.hasError(controlName)) {
        const controlElement = document.querySelector(`[formControlName="${controlName}"]`) as HTMLElement;
        if (controlElement) {
          controlElement.focus();
          controlElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          break;
        }
      }
    }
  }

  onInputCity(event: Event): void {
    this.ngZone.run(() => {
      const inputElement = event.target as HTMLInputElement;
      let inputValue: string = inputElement.value;

      // Allow only letters (a-z, A-Z) and a single space between words
      // Step 1: Replace any character that is not a letter or space
      inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

      // Step 2: Replace multiple spaces with a single space
      inputValue = inputValue.replace(/\s{2,}/g, ' ');

      // Step 3: If the value does not match the desired pattern, return early
      // Only letters and spaces are allowed (single spaces between words)
      if (!/^[a-zA-Z\s]*$/.test(inputValue)) {
        return; // Early exit if the pattern doesn't match
      }

      // Step 4: Update the input element and form control
      inputElement.value = inputValue;
      this.citySearchControl.setValue(inputValue, { emitEvent: false });
      this.cd.detectChanges();
    });
  }

  restrictNameOnPaste(event: ClipboardEvent, type: string, formGroup: FormGroup, formControlName?: any) {
    this.ngZone.run(() => {
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      const pastedText = clipboardData.getData('text');
      // Declare sanitizedText outside the blocks
      let sanitizedText = '';

      if (type === 'letters') {
        sanitizedText = pastedText
          .replace(/^\s+/, '') // Remove leading spaces
          .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
          .replace(/[^a-zA-Z\s]/g, '') // Allow only letters and spaces
          .trim(); // Remove trailing spaces
      } else {
        sanitizedText = pastedText
          .replace(/^\s+/, '') // Remove leading spaces
          .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
          .replace(/[^a-zA-Z0-9\s]/g, '') // Allow only letters, numbers, and spaces
          .trim(); // Remove trailing spaces
      }

      // Prevent the default paste behavior
      event.preventDefault();

      // Insert the sanitized text into the input
      const inputElement = event.target as HTMLInputElement;
      const currentValue = inputElement.value;

      // Combine current value and sanitized pasted text
      let combinedValue =
        currentValue.substring(0, inputElement.selectionStart || 0) +
        sanitizedText +
        currentValue.substring(inputElement.selectionEnd || 0);

      // Apply sanitization again on the combined value to handle multiple pastes
      combinedValue = combinedValue
        .replace(/^\s+/, '') // Remove leading spaces
        .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
        .replace(/[^a-zA-Z0-9\s]/g, '') // Ensure only valid characters remain
        .trim(); // Remove trailing spaces

      // Update the input's value
      inputElement.value = combinedValue;

      // Move the cursor to the correct position
      const newCursorPosition =
        (inputElement.selectionStart || 0) + sanitizedText.length;
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
      // Further restrictions can be applied here
      // Update the form control with the new value
      const formControl = formGroup.get(formControlName); // Use your form's name here
      if (formControl) {
        formControl.setValue(combinedValue); // Set the sanitized value to the form control
      }
    });
  }

  restrictNameWhiteSpace(event: any) {
    const inputValue = event.target.value;

    // Prevent the first space if input is empty or starts with a space
    if (event.keyCode === 32 && inputValue.length === 0) {
      event.preventDefault();
      return;
    }

    // Prevent consecutive spaces
    if (event.keyCode === 32 && inputValue.endsWith(' ')) {
      event.preventDefault();
      return;
    }

    // Prevent two spaces after a word
    if (event.keyCode === 32 && /\s$/.test(inputValue)) {
      event.preventDefault();
      return;
    }

    // Allow only letters (uppercase and lowercase) and spaces
    if (event.keyCode !== 32 && !/[a-zA-Z]/.test(event.key) && event.keyCode !== 8) {
      event.preventDefault();
      return;
    }
  }

  restrictWhiteSpaceWithAlphnumeric(event: any) {
    const inputValue = event.target.value;

    if (event.keyCode === 32 && inputValue.length === 0) {
      event.preventDefault();
      return;
    }

    // Prevent consecutive spaces
    if (event.keyCode === 32 && inputValue.endsWith(' ')) {
      event.preventDefault();
      return;
    }

    // Prevent two spaces after a word
    if (event.keyCode === 32 && /\s$/.test(inputValue)) {
      event.preventDefault();
      return;
    }

    // Allow only letters (both upper and lower case), numbers, and spaces inside the text
    if (event.keyCode !== 32 && !/[a-zA-Z0-9]/.test(event.key) && event.keyCode !== 8) {
      event.preventDefault(); // Prevent non-alphanumeric characters (except backspace)
    }
  }

  revalidateIbanAndSwift() {
    const code = this.newBenificiaryBankDetails.value;
    code.iban && this.getIBNDetail(code.iban);
    code.swiftCode && this.getSwiftDetail(code.swiftCode);
  }
 
  ngAfterViewInit(): void {
    this.revalidateIbanAndSwift();
    this.contactsService.getStateAndCityRes.subscribe((res: any) => {
      if (res) {
        this.stateList = this.globalStateList = res?.stateList || [];
        this.cityList = this.globalCityList = res?.cityList || [];
      }
    });

    this.contactsService.beneficiaryCountryChange.subscribe(res => {
      if (res) {
        this.bankDetailsFormValues.emit(this.newBenificiaryBankDetails.value);
        this.contactsService.beneficiaryCountryChange.next(false);
      } else {
        // this.editBeneficiaryState = this.bankDetailsFormStep4Values?.beneficiaryState;
      }
    })
    if (!this.bankDetailsDynamicFieldsObj?.displayBeneficiaryState) {
      this.globalCityList = [];
    } else {
      if (this.newBenificiaryBankDetails?.value?.beneficiaryState) {
        const isStateExistInStateData = this.globalStateList?.filter((data: any) => data.name == this.newBenificiaryBankDetails?.value?.beneficiaryState);
        if (isStateExistInStateData && isStateExistInStateData?.length !== 0) {
          this.globalStateList = this.globalStateList;
        } else {
          this.globalStateList = [];
        }
      } else {
        this.globalStateList = this.globalStateList;
      }
    }
  }

  allowOnlyEnglishLetters(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode || event.which);
    const englishRegex = /^[a-zA-Z\s]*$/;

    if (!englishRegex.test(inputChar)) {
      event.preventDefault();
    }
  }

  preventNonEnglishPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData?.getData('text') || '';
    const englishRegex = /^[a-zA-Z\s]*$/;

    if (!englishRegex.test(clipboardData)) {
      event.preventDefault();
    }
  }


  allowOnlyHebrew(event: KeyboardEvent): void {
    const hebrewRegex = /^[\u0590-\u05FF0-9 \s]+$/;
    const key = event.key;

    if (!hebrewRegex.test(key)) {
      event.preventDefault();
    }
  }

  preventPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';
    const hebrewRegex = /^[\u0590-\u05FF0-9 \s]+$/;

    if (!hebrewRegex.test(pastedText)) {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    if (this.stateCitySubscription$) {
      this.stateCitySubscription$.unsubscribe();
    }
  }

}
