import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatestWith, debounceTime, distinctUntilChanged, forkJoin, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { ContactsService } from '../../services/contacts.service';
import { PayerService } from '../../services/payer.service';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getAllActiveCurrencies } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { bicSwiftDetailsObject, ibanDetailsObject } from '../contacts-data/payers-data';
import { Countries } from '../../../main-dashboard/dashboard-data/all-currency-data';

@Component({
  selector: 'app-new-payer-step-two',
  templateUrl: './new-payer-step-two.component.html',
  styleUrls: ['./new-payer-step-two.component.scss'],
  imports: [CommonModule, NgbTooltipModule, MatSelectModule, ReactiveFormsModule, MatProgressSpinnerModule]
})
export class NewPayerStepTwoComponent implements OnInit, OnChanges, OnDestroy {
  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() backStep: EventEmitter<void> = new EventEmitter();
  @Input() stepIndex!: number;
  @Output() stepChanged = new EventEmitter<void>();
  parentCountryList = Countries;

  @ViewChild('searchCurrencyInput') searchCurrencyInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchBenBankCountryInput') searchBenBankCountryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchIncorportionCountryInput') searchIncorportionCountryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchResidenceCountryInput') searchResidenceCountryInput!: ElementRef<HTMLInputElement>;

  @Input('formStepper') formStepper?: any;
  @Input('payerForm') payerForm!: FormGroup;
  @Input('payerAccountDetail') payerAccountDetail: FormGroup | any;
  @Input() editPayer!: boolean;
  @Input() editPayerObj: any;
  @Input('uploadFileForm') uploadFileForm: any;

  searchCurrencyControl: FormControl = new FormControl();
  currencyData: any[] = [];
  globalCurrencyData: any;
  payerFormWithBankDetails = false;
  bankCountryList: any;
  bankCountrySearchControl: FormControl = new FormControl();
  incoporationCountrySearchControl: FormControl = new FormControl();
  residenceCountrySearchControl: FormControl = new FormControl();
  globalCountryData: any;
  countryList: any;
  incorporationCList: any;
  residenceCList: any;
  showLoading!: boolean;
  isValidIban!: boolean;
  errorMessage = false;
  ibanDetails: any;
  isCCAccountHolder: any;
  errorMsg: any;
  unSubcribe = new Subject<void>();
  BusinessAndIndividualClearControls = ['bankAccountHolderName', 'payerCountry', 'unionCountry', 'bankCountry', 'currency']
  selectedPaymentReason: any;
  goodsArr: any = [];
  ibanError: any;
  swiftError: any;
  availablePayerId: any;
  errorArr: any = [];
  choosenPaymentReason: any;
  isDisabled = false;
  isAccNumber = false;
  isSubmitForm = false;

  constructor(private contactService: ContactsService,
    private payerService: PayerService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.countryList = this.bankCountryList = this.incorporationCList = this.residenceCList = this.globalCountryData = this.parentCountryList;
    of(getAllActiveCurrencies).subscribe(res => {
      this.currencyData = res;
      this.globalCurrencyData = this.currencyData;
    });
    this.payerAccountDetail = this.payerAccountDetail;
  }

  ngOnInit() {
    if (this.choosenPaymentReason == 2) {
      this.isDisabled = true;
    }
    of(getAllActiveCurrencies).subscribe(res => {
      this.currencyData = res;
      this.globalCurrencyData = this.currencyData;

    });
    this.filterResidenceCountryList();
    this.filterIncorporationCountryList();
    this.filterBankCountryList();
    this.filterCurrencyList();
    this.getPartialPayerDetails();
    if (this.editPayer) {
      this.checkForValidIBANorSwift();
    }

    this.payerService.getPaymentReason().subscribe((data) => {
      this.choosenPaymentReason = data;
    })
    this.payerAccountDetail.get('entityType').valueChanges
      .subscribe((res: any) => {
        if (res) {
          delete this.errorMsg;
          if (!this.editPayer && this.payerForm.get('newPayerReasonForm')?.get('paymentReason')?.value !== 2) {
            this.payerFormWithBankDetails = false;
            this.payerAccountDetail.get('currency').patchValue('');
          }
          if (this.payerForm.get('newPayerReasonForm')?.get('paymentReason')?.value !== 2) {
            this.payerService.isPopulatePayerProfileCurrency.next('');
            // this.payerAccountDetail.get('currency').patchValue('');
          } else {
            const myAccCurrencyValue = this.payerForm.get('newPayerReasonForm')?.get('currency')?.value
            if (myAccCurrencyValue) {
              this.payerService.isPopulatePayerProfileCurrency.next(myAccCurrencyValue);
            }
          }
          let controlsToClear = Object.keys(this.payerAccountDetail.controls)
            .filter(controlName => controlName !== 'entityType' && controlName !== 'currency');
          if (this.payerForm.get('newPayerReasonForm')?.get('paymentReason')?.value == 4) {
            if (this.payerAccountDetail?.get('foundsSourceDetails')?.value) {
              controlsToClear = controlsToClear.filter(control => control !== 'foundsSourceDetails');
              this.payerAccountDetail?.get('foundsSourceDetails')?.patchValue(this.payerAccountDetail?.get('foundsSourceDetails')?.value);
            }
          }
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, controlsToClear);
        }
      });

    this.payerAccountDetail.get('accountType').valueChanges
      .subscribe((res: any) => {
        delete this.ibanError;
        delete this.swiftError;
        delete this.errorMsg
        this.isValidIban = false;
        this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['iban', 'bicSwift']);

      });

    if (this.payerAccountDetail?.get('accountType')?.value) {
      this.checkForValidIBANorSwift();
    }

    this.payerService.isPopulatePayerProfileCurrency.pipe(takeUntil(this.unSubcribe)).subscribe(autoPopulateCurrency => {
      if (autoPopulateCurrency) {
        this.payerAccountDetail.get('currency').patchValue(autoPopulateCurrency);
      }
    })

    this.payerAccountDetail.get('bankCountry')!.valueChanges
      .pipe(
        startWith(this.payerAccountDetail.get('bankCountry')!.value),
        combineLatestWith(
          this.payerAccountDetail.get('currency')!.valueChanges.pipe(
            startWith(this.payerAccountDetail.get('currency')!.value)
          )
        )
      )
      .subscribe(([bankCountry, currency]: [string, string]) => {
        if (bankCountry === 'il' && currency === 'ILS' && this.ibanDetails?.account == this.payerAccountDetail.get('accountNumber')?.value) {
          this.payerAccountDetail.get('accountNumber')?.patchValue('');
        }
      });

    this.contactService.isPaymentReasonChanged.pipe(takeUntil(this.unSubcribe)).subscribe(res => {
      if (res) {
        this.payerAccountDetail.reset();
        this.contactService.isPaymentReasonChanged.next(false);
      }
    })
    this.formControlValueChanges();
  }

  changeCurrency() {
    delete this.errorMsg;
    delete this.ibanError;
    delete this.swiftError;
    if (this.editPayer && this.editPayerObj.currency !== this.payerAccountDetail.get('currency').value) {
      this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['accountType', 'iban', 'bicSwift', 'accountNumber', 'bankBranch', 'bankNumber']);
    }
    if (!this.editPayer) {
      // if (this.isCCAccountHolder) {
        this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['accountType', 'iban', 'bicSwift', 'accountNumber', 'bankBranch', 'bankNumber']);
      // }
    }
  }

  setPayerIdForEdit() {
    this.payerService.setPayerID({ "id": this.editPayerObj?.id })
  }

  formControlValueChanges() {
    const isCCAccountHolder = this.isCCAccountHolder;
    const entityType = this.payerAccountDetail.controls['entityType']?.value;
    const accountType = this.payerAccountDetail.controls['accountType']?.value;
    const payerAccountCurrency = this.payerAccountDetail.controls['currency']?.value;
    const businessValidators = ['unionCountry'];
    const individualValidators = ['payerCountry'];

    if (!isCCAccountHolder) {
      if (entityType === 1) {
        // this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', ]);
        if (payerAccountCurrency !== 'ILS' || (this.getBankCountryCode() != 'il')) {
          const applyIbanOrSwift = accountType === 1 ? ['iban'] : ['bicSwift'];
          if (accountType === 1) {
            this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['bankNumber']);
          }
          if (accountType === 2) {
            this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['bankNumber']);
          }
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['accountType', 'bankAccountHolderName', 'accountNumber', 'unionCountry', 'bankCountry', 'currency', ...applyIbanOrSwift, 'bankName']);
        }
        else {
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['accountType', 'bankAccountHolderName', 'unionCountry', 'bankCountry', 'currency', 'accountNumber']);
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['accountType', 'iban', 'bicSwift', 'bankName', 'bankNumber', 'bankBranch', ...individualValidators]);
        }
      }
      if (entityType === 2) {
        // this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', ]);
        if (payerAccountCurrency !== 'ILS' || (this.getBankCountryCode() != 'il')) {
          const applyIbanOrSwift = accountType === 1 ? ['iban'] : ['bicSwift'];
          if (accountType === 1) {
            this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['bankNumber']);
          }
          if (accountType === 2) {
            this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['bankNumber']);
          }
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['accountType', 'bankAccountHolderName', 'accountNumber', 'payerCountry', 'bankCountry', 'currency', ...applyIbanOrSwift, 'bankName']);
        }
        else {
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['accountType', 'bankAccountHolderName', 'payerCountry', 'bankCountry', 'currency', 'accountNumber']);
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['accountType', 'iban', 'bicSwift', 'bankName', 'bankNumber', 'bankBranch', ...businessValidators]);
        }
      }
    }
    if (isCCAccountHolder) {
      if (entityType === 1) {
        // this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', 'bankAccountHolderName', 'unionCountry', 'bankCountry', 'currency','bankNumber']);
        if (payerAccountCurrency !== 'ILS') {
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', 'bankAccountHolderName', 'unionCountry', 'bankCountry', 'currency']);
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['bicSwift', 'bankName', 'accountNumber', 'accountType', 'bankNumber', ...individualValidators]);
        } else {
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', 'bankAccountHolderName', 'unionCountry', 'bankCountry', 'currency', 'accountNumber']);
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['accountType', 'iban', 'bicSwift', 'bankName', 'bankNumber', 'bankBranch', ...individualValidators]);

        }
      }
      if (entityType === 2) {
        // this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', 'bankAccountHolderName', 'payerCountry', 'bankCountry', 'currency','bankNumber']);
        if (payerAccountCurrency !== 'ILS') {
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', 'bankAccountHolderName', 'payerCountry', 'bankCountry', 'currency']);
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['bicSwift', 'bankName', 'accountNumber', 'accountType', 'bankNumber', ...businessValidators]);
        } else {
          this.payerService.applyValidatorsIfEmpty(this.payerAccountDetail, ['entityType', 'bankAccountHolderName', 'payerCountry', 'bankCountry', 'currency', 'accountNumber']);
          this.payerService.clearValidatorsForControls(this.payerAccountDetail, ['accountType', 'iban', 'bicSwift', 'bankName', 'bankNumber', 'bankBranch', ...businessValidators]);
        }
      }
    }

  }

  restrictNameWhiteSpace(event: any) {
    this.contactService.restrictNameWhiteSpace(event);
  }



  restrictNameOnPaste(event: ClipboardEvent, type: string) {
    this.contactService.restrictNameOnPaste(event, type);
  }

  restrictWhiteSpaceWithAlphnumeric(event: any) {
    this.contactService.restrictWhiteSpaceWithAlphnumeric(event);
  }
  getPartialPayerDetails() {
    this.isCCAccountHolder = false; // This is the flag for need of CC Account holder details (needsPartialPayerDetails)
  }

  filterIncorporationCountryList() {
    this.incoporationCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.incorporationCList = countrySearchVal ? this.filterIncorporationCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  filterResidenceCountryList() {
    this.residenceCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.residenceCList = countrySearchVal ? this.filterResidenceCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  filterResidenceCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  filterIncorporationCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  filterBankCountryList() {
    this.bankCountrySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.bankCountryList = countrySearchVal ? this.filterBankCountries(countrySearchVal) : this.globalCountryData;
    });
  }

  checkForValidIBANorSwift() {
    if (!this.payerAccountDetail.controls['iban'].value && !this.payerAccountDetail.controls['bicSwift'].value) {
      return;
    } else {
      this.showLoading = true;

      if (this.payerAccountDetail.controls['accountType'].value == 1) {
        const ibanNumber = this.payerAccountDetail.controls['iban'].value;
        of(ibanDetailsObject).pipe(takeUntil(this.unSubcribe)).subscribe({
          next: (result) => {
            this.errorMessage = false;
            this.ibanDetails = result;
            this.isAccNumber = true;
            this.payerAccountDetail.patchValue({
              bankName: this.ibanDetails?.bank,
              bankNumber: this.ibanDetails?.bankCode,
              accountNumber: this.ibanDetails?.account
            })
            this.showLoading = false;
            this.isValidIban = true;
            delete this.ibanError;
          },
          error: (err) => {
            this.errorMessage = true;
            this.ibanError = err?.error?.apiErrorMessage[0];
            this.payerAccountDetail.get('iban').setErrors({ 'invalid': true });
            this.isValidIban = false;
            this.showLoading = false;
          },
        });
      } else {
        const swiftCode = this.payerAccountDetail.controls['bicSwift'].value;
        let isAccountNumber: any;
        if (this.isAccNumber) {
          isAccountNumber = '';
        } else {
          isAccountNumber = this.payerAccountDetail.controls['accountNumber']?.value;
        }
        of(bicSwiftDetailsObject).pipe(takeUntil(this.unSubcribe)).subscribe({
          next: (result) => {
            this.ibanDetails = result;
            this.payerAccountDetail.patchValue({
              bankName: this.ibanDetails?.name,
              bankNumber: this.ibanDetails?.bankCode,
              accountNumber: isAccountNumber
            })
            this.showLoading = false;
            this.isValidIban = true;
            delete this.swiftError;
          },
          error: (err) => {
            this.swiftError = err?.error?.apiErrorMessage[0];
            this.payerAccountDetail.get('bicSwift').setErrors({ 'invalid': true });
            this.errorMessage = true;
            this.isValidIban = false;
            this.showLoading = false;
          },
        });
      }

    }
  }

  filterBankCountries(countrySearchVal: string) {
    return this.globalCountryData.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  Back() {
    this.stepChanged.emit();
  }

  NextFromPayerSecondStep() {
    this.formControlValueChanges();
    this.payerFormWithBankDetails = true;
    if (this.payerAccountDetail.invalid) {
      this.isSubmitForm = false;
      Object.values(this.payerAccountDetail.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      this.scrollToInvalidControl()
      return;
    } else {
      this.isSubmitForm = true;
    }
    this.savePayerInformation();
  }

  scrollToInvalidControl(): void {
    for (const controlName of Object.keys(this.payerAccountDetail.controls)) {
      if (this.payerAccountDetail.controls[controlName].status === 'INVALID' && this.hasError(controlName)) {
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

  savePayerInformation() {
    const paymentReason = this.payerService.getPaymentReasonValue();
    const savePayerObj = {
      ...this.payerAccountDetail.value,
      paymentReason: paymentReason,
      ...(this.availablePayerId ? { id: this.availablePayerId } : {})
    };
    Object.keys(savePayerObj).forEach(key => {
      if ((key == 'bankName' && savePayerObj[key] === null) || (key == 'foundsSourceDetails' && savePayerObj[key] === null)) {
        savePayerObj[key] = ''; // Set null values to an empty string
      }
    });
    this.payerService.currentpayerIDForFile.pipe(takeUntil(this.unSubcribe)).subscribe((result) => {
      this.availablePayerId = result?.id;
    })
    this.payerService.setpayerObjectFinalSave(savePayerObj);
    savePayerObj['foundsSourceDetails'] = this.payerAccountDetail.value?.foundsSourceDetails ?? '';
    // if (this.editPayer) {
    //   savePayerObj['id'] = this.editPayerObj?.id;
    // }
    const newPayerId = localStorage.getItem('newPayerId')!; // store payer id on payer=false Api
    if (newPayerId && typeof newPayerId === 'string') {
      savePayerObj['id'] = newPayerId;
    }
    // this.payerService.addPayer(false, savePayerObj).subscribe({
    //   next: (result) => {
        savePayerObj.id = "96df3eb8-1b35-4f58-94a2-33aa9a0c75c9";
        this.payerService.setpayerObjectFinalSave(savePayerObj);
        localStorage.setItem('newPayerId', savePayerObj.id);
        this.payerService.setPayerID({ "id": savePayerObj.id });
        delete this.errorMsg
        this.identifyTaxHavenCountry(savePayerObj.id, savePayerObj);
      // },
      // error: (err) => {
      //   this.errorMsg = err.error.apiErrorMessage[0];
      //   this.isSubmitForm = false;
      // }
    // });
  }

  identifyTaxHavenCountry(result: any, savePayerObj: any) {
    const payerReasonMyAccount = this.payerForm.get('newPayerReasonForm')?.get('paymentReason')?.value == '2';
    const isIsrael = this.payerForm.get('newPayerReasonForm')?.get('currency')?.value == 'ILS';
    let isOverseasAcc = this.payerForm.get('newPayerReasonForm')?.get('currency')?.value != 'ILS';
    if (isIsrael && payerReasonMyAccount) {
      this.handleUploadScreenNavigation();
    } else {
      const paymentReasonControl = this.payerForm.get(['newPayerReasonForm', 'paymentReason']);
      const accountDetails = this.payerForm.get('payerAccountDetail');
      const unionCountry = accountDetails?.get('unionCountry')?.value;
      const bankCountry = accountDetails?.get('bankCountry')?.value;
      const payerCountry = accountDetails?.get('payerCountry')?.value;
      this.selectedPaymentReason = paymentReasonControl?.value;
      if ((unionCountry || payerCountry) && this.selectedPaymentReason !== 4) {
        forkJoin([
          this.payerService.identifyTaxHavenCountry(unionCountry || payerCountry),
          this.payerService.identifyTaxHavenCountry(bankCountry)
        ]).subscribe({
          next: ([isPayerTaxHaven, isBankTaxHaven]) => {
            this.goodsArr = [1]; // Initialize goodsArr with default value
            // Determine type based on conditions
            let type: any;
            if ((isPayerTaxHaven || isBankTaxHaven)) {
              this.goodsArr.push(4);
              type = isOverseasAcc && this.selectedPaymentReason === 2 ? [4] :
                this.selectedPaymentReason === 1 ? this.goodsArr :
                  this.displayFilesInUploadFileSection(this.selectedPaymentReason);
            } else {
              if (((unionCountry || payerCountry) !== bankCountry)) {
                this.goodsArr.push(4);
              }
              if (this.selectedPaymentReason === 1) {
                type = this.goodsArr;
              } else if (isOverseasAcc && this.selectedPaymentReason === 2) {
                if (((unionCountry || payerCountry) !== bankCountry)) {
                  type = this.displayFilesInUploadFileSection(this.selectedPaymentReason);
                } else {
                  this.handleUploadScreenNavigation();
                  return; // Exit the method early
                }
              } else if (this.selectedPaymentReason === 3) {
                type = this.displayFilesInUploadFileSection(this.selectedPaymentReason);
              } else {
                type = [1]; // Default invoice
              }
            }
            this.setPayerObjectAndLocalStorage(result.body, savePayerObj, type);
          },
          error: (error: any) => {
            console.error('Error identifying tax haven countries:', error);
          }
        });
      } else {
        // If same country
        if (this.selectedPaymentReason === 4) {
          this.setPayerObjectAndLocalStorage(result.body, savePayerObj, []);
        } else {
          this.handleUploadScreenNavigation();
        }
      }
    }
  }

  private setPayerObjectAndLocalStorage(resultBody: any, savePayerObj: any, type: any): void {
    this.payerService.setpayerObjectForFile({
      id: resultBody,
      savePayerRes: savePayerObj,
      type: type
    });
    localStorage.setItem('payerDocType', JSON.stringify(type));
    this.stepChanged.emit();
  }

  private handleUploadScreenNavigation(): void {
    this.formStepper.selectedIndex = 3;
    localStorage.setItem('skipPayerDocumentPage', 'true');
    this.payerService.setPayerIndex(3);
    localStorage.removeItem('payerDocType');
  }

  displayFilesInUploadFileSection(selectedReason: any) {
    switch (selectedReason) {
      case 1:
        return [1, 4] // Goods
      case 2:
        return [4]  // My Accounts
      case 3:
        return [2, 4] // Labor/R
      default:
        return '';
    }
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

  getAccountDetail() {
    let calculateIban = {
      "bankCode": this.payerAccountDetail.value.bankNumber,
      "bankBranch": this.payerAccountDetail.value.bankBranch,
      "bankAccountNumber": this.payerAccountDetail.value.accountNumber
    }
    if (this.payerAccountDetail.value.bankNumber && this.payerAccountDetail.value.bankBranch && this.payerAccountDetail.value.accountNumber) {
      // this.payerService.calculateIban(calculateIban).pipe(takeUntil(this.unSubcribe)).subscribe((data) => {
      //   localStorage.setItem("CalculateIban", JSON.stringify(data?.body))
      //   delete this.errorMsg;
      // }, err => {
      //   this.errorMsg = err.error.apiErrorMessage[0];
      // })
    }
  }

  clearSearch() {
    if (this.residenceCountrySearchControl != null) {
      this.residenceCountrySearchControl.setValue('');
    }
    if (this.incoporationCountrySearchControl != null) {
      this.incoporationCountrySearchControl.setValue('');
    }
    if (this.searchCurrencyControl != null) {
      this.searchCurrencyControl.setValue('');
    }
    if (this.bankCountrySearchControl != null) {
      this.bankCountrySearchControl.setValue('');
    }
  }

  onCurrencyDropdownOpen(event: any) {
    if (this.searchCurrencyInput) {
      this.searchCurrencyInput.nativeElement.focus();
    }
    if (event) {
      // this.currencyData = this.globalCurrencyData;
      this.searchCurrencyControl.setValue('');
    } else {
      if (this.currencyData && this.currencyData.length === 0) {
        this.currencyData = this.globalCurrencyData
      }
    }
  }

  gettoCurrencyvalue() {
    return this.payerAccountDetail.controls['currency'].value;
  }

  hasError(controlName: string): boolean {
    const control = this.payerAccountDetail.get(controlName);
    return !!(control && control.invalid && this.payerFormWithBankDetails);
  }

  onBankCountryDropdownOpen(event: any) {
    if (this.searchBenBankCountryInput) {
      this.searchBenBankCountryInput.nativeElement.focus();
    }
    if (event) {
      this.bankCountryList = this.globalCountryData;
      this.bankCountrySearchControl.setValue('');
    } else {
      if (this.bankCountryList && this.bankCountryList.length === 0) {
        this.bankCountryList = this.globalCountryData
      }
    }
  }

  onIncorporationCountryDropdownOpen(event: any) {
    if (this.searchIncorportionCountryInput) {
      this.searchIncorportionCountryInput.nativeElement.focus();
    }
    if (event) {
      this.incorporationCList = this.globalCountryData;
      this.incoporationCountrySearchControl.setValue('');
    } else {
      if (this.incorporationCList && this.incorporationCList.length === 0) {
        this.incorporationCList = this.globalCountryData
      }
    }
  }

  onResidenceCountryDropdownOpen(event: any) {
    if (this.searchResidenceCountryInput) {
      this.searchResidenceCountryInput.nativeElement.focus();
    }
    if (event) {
      this.residenceCList = this.globalCountryData;
      this.residenceCountrySearchControl.setValue('');
    } else {
      if (this.residenceCList && this.incorporationCList.length === 0) {
        this.residenceCList = this.globalCountryData
      }
    }
  }

  getBankCountryCode() {
    return this.payerAccountDetail.controls['bankCountry'].value;
  }

  getIncorporationCountryCode() {
    return this.payerAccountDetail.controls['unionCountry'].value;
  }

  getResidenceCountryCode() {
    return this.payerAccountDetail.controls['payerCountry'].value;
  }

  restrictZeroAndDot(event: any) {
    if (event?.target?.value?.length === 0 && event?.key === ".") {
      event?.preventDefault();
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

  ngOnDestroy() {
    this.unSubcribe.next();
    this.unSubcribe.complete();
  };

}
