import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime, distinctUntilChanged, of, Subject, takeUntil } from 'rxjs';
import { ContactsService } from '../../services/contacts.service';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { paymentReason } from '../contacts-data/payments-reason.data';
import { newBeneficiaryPaymentReason } from '../../enums/newBeneficiaryPaymentReason.enum';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-benificiary-step3',
  templateUrl: './new-benificiary-step3.component.html',
  styleUrls: ['./new-benificiary-step3.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule]
})
export class NewBenificiaryStep3Component implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() stepIndex!: number;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('transactions') transactions?: any;
  @Input('benificiaryForm') benificiaryForm?: any;
  @Input('countryList') parentCountryList: any;
  @Input('paymentReasons') paymentReasons: any;
  @Input('editBenificiaryObj') editBenificiaryObj: any;
  @Input('iseditBenificiary') iseditBenificiary: any;
  @Input('uploadFile') uploadFile!: FormGroup;
  @Input('isNonIsraeliUser') isNonIsraeliUser!: boolean;


  @Output() stepChanged = new EventEmitter<void>();
  @Output() transcationFormValues = new EventEmitter<void>();


  benCountryTaxResidenceSearchControl: FormControl = new FormControl();
  beneficiaryObjectForFile: any;
  selectedPayment: any;
  loading!: boolean;
  errMsg: any;
  countryList: any;
  newPaymentReasonArray: any = [];
  sortedPaymentReasons: { id: number; name: string; translatedName?: string }[] = [];
  benCountryTaxResidenceGlobalCountrys: any;
  selectedSortedPayment: any;
  selectedInvestmentType: any;
  isSubmitTransactionForm = false;
  beneficiaryDataObject: any;
  paymentReasonsToFilter: any = [];
  isPaymentReasonExistInDrp!: boolean;
  isDisableReason = false;
  unSubscribe$ = new Subject<void>();
  isDisplayPaymentReasonIsOther!: boolean;

  constructor(
    private contactsService: ContactsService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.countryList = this.benCountryTaxResidenceGlobalCountrys = this.parentCountryList;
    this.contactsService.currentObjectForFile.subscribe((data) => {
      this.beneficiaryObjectForFile = data
    })
    this.filterbeneficiaryStateResidenceCurrencyList();
    this.contactsService.getBeneficiaryDataForEdit.subscribe(async (data) => {
      this.beneficiaryDataObject = data;
    });
    this.getSelectedInvestmentType();
    if (this.iseditBenificiary) {
      localStorage.setItem('editPaymentReason', this.editBenificiaryObj?.paymentReason);
      localStorage.setItem('changedPaymentReason', JSON.stringify(this.editBenificiaryObj?.paymentReason));
    }
    of(paymentReason).subscribe(paymentReasonsRes => {
      this.paymentReasons = paymentReasonsRes;
    });
    
    if(this.editBenificiaryObj?.paymentReason == 999) {
      this.isDisplayPaymentReasonIsOther = true;
    }else {
       this.isDisplayPaymentReasonIsOther = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.transactions = this.transactions;
  }

  clearPaymentReason() {
    this.selectedInvestmentType = '';
    this.transactions.get('investmentType').setValue('');
    this.selectedSortedPayment = '';
    this.transactions.get('paymentReason').setValue('');
    
  }

  filterbeneficiaryStateResidenceCurrencyList() {
    this.benCountryTaxResidenceSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(countrySearchVal => {
      this.countryList = countrySearchVal ? this.filterBankCountries(countrySearchVal) : this.benCountryTaxResidenceGlobalCountrys;
    });
  }

  filterBankCountries(countrySearchVal: string) {
    return this.benCountryTaxResidenceGlobalCountrys.filter((countryObj: any) =>
      countryObj.countryName.toLowerCase().includes(countrySearchVal.toLowerCase())
    );
  }

  prepareSortedReasons(filterIds: any) {
    this.sortedPaymentReasons = Object.entries(newBeneficiaryPaymentReason)
      .filter(([key, value]) =>
        typeof value === 'number' && filterIds.includes(value)
      )

      .map(([key, value]) => ({
        id: value as number,
        name: key,
        translatedName: this.translateService.instant(`NEW_BENEFICIARY_PAYMENT_REASONS.${key}`) || key
      }))
      .sort((a, b) => a.translatedName.localeCompare(b.translatedName));

    const otherIndex = this.sortedPaymentReasons.findIndex(item => item.name === "Other");
    if (otherIndex !== -1) {
      const otherItem = this.sortedPaymentReasons.splice(otherIndex, 1)[0]; // Remove and store "Other"
      this.sortedPaymentReasons.push(otherItem); // Push it to the end
    }
    this.sortedPaymentReasons = this.sortedPaymentReasons;
    if (this.isNonIsraeliUser) { // for non israeli users
      this.sortedPaymentReasons = this.sortedPaymentReasons.filter((item: any) => item.id !== 18 && item.id !== 25);
    }
  }

  getReason(event: any) {
    delete this.selectedPayment
    this.contactsService.clearPaymentReason.next(false);
    this.selectedSortedPayment = '';
    this.transactions.get('paymentReason').patchValue('');
    this.bindPaymentReasons(event);
     if(this.editBenificiaryObj?.paymentReason == 999) {
      this.isDisplayPaymentReasonIsOther = true;
      this.transactions?.get('reasonDesc').patchValue('');
    }else {
       this.isDisplayPaymentReasonIsOther = false;

    }
  }



  bindPaymentReasons(event: any) {
    this.selectedSortedPayment = this.transactions?.value?.paymentReason;
    let selectedCategory = event?.target?.value || event;
    const benContry = this.benificiaryForm.controls.newBenificiaryStep2.controls['beneficiaryCountry'].value;
    const benBankContry = this.benificiaryForm.controls.newBenificiaryStep2.controls['bankCountry'].value;
    const benCurrency = this.benificiaryForm.controls.newBenificiaryStep2.controls['currency'].value;
    setTimeout(() => {
      this.newPaymentReasonArray = Object.values(this.paymentReasons).reduce((acc: any, curr: any) => acc.concat(curr), []);
    }, 1200);
    this.paymentReasonsToFilter = [];
    switch (selectedCategory) {
      case 'goods':
        this.paymentReasonsToFilter = [11];
        this.transactions.get('investmentType').patchValue('goods');
        localStorage.setItem('selectedInvestmentType', 'goods');
        break;
      case 'Services':
        this.paymentReasonsToFilter = [9, 10, 20, 22, 23];
        this.transactions.get('investmentType').patchValue('Services');
        localStorage.setItem('selectedInvestmentType', 'Services');
        break;
      case 'Loan':
        this.paymentReasonsToFilter = [1, 2, 3, 5, 6, 7, 26];
        this.transactions.get('investmentType').patchValue('Loan');
        localStorage.setItem('selectedInvestmentType', 'Loan');
        break;
      case 'transactions':
        this.transactions.get('investmentType').patchValue('transactions');
        localStorage.setItem('selectedInvestmentType', 'transactions');
        if (this.isNonIsraeliUser) { // Remove all conditions for non-israeli users
          this.paymentReasonsToFilter = [14, 17, 18, 19, 24, 25, 999];
        } else { // This conditions is applyed only for israeli users only
          if (benContry === 'il' && benBankContry === 'il' && benCurrency === 'ILS') {
            this.paymentReasonsToFilter = [18, 25];
          } else if (benContry && benBankContry !== 'il' && benCurrency === 'ILS') {
            this.paymentReasonsToFilter = [14, 17, 19, 24, 999];
          } else if (benContry === 'il' && benBankContry === 'il' && benCurrency !== 'ILS') {
            this.paymentReasonsToFilter = [18];
          } else if (benContry !== 'il' && benBankContry === 'il' && benCurrency !== 'ILS') {
            this.paymentReasonsToFilter = [14, 17, 19, 24, 999];
          } else if (benContry === 'il' && benBankContry !== 'il' && benCurrency !== 'ILS') {
            this.paymentReasonsToFilter = [14, 17, 19, 24, 999];
          } else if (benContry !== 'il' && benBankContry !== 'il' && benCurrency !== 'ILS') {
            this.paymentReasonsToFilter = [14, 17, 19, 24, 999];
          } else {
            this.paymentReasonsToFilter = [14, 17, 18, 19, 24, 999];
            if (benContry !== 'il' && benBankContry === 'il' && benCurrency == 'ILS') {
              this.paymentReasonsToFilter.push(25);
            }
          }
        }
        break;
      default:
        return;
    }
    this.prepareSortedReasons(this.paymentReasonsToFilter);
  }

  getSelectedPayment(event: any) {
    const selectedPaymentObj = this.newPaymentReasonArray.filter((paymentObj: any) => paymentObj.paymentReason === event)[0];
    this.selectedPayment = selectedPaymentObj
    this.selectedSortedPayment = event
    localStorage.setItem("selectedPayment", JSON.stringify(this.selectedPayment))
    localStorage.setItem('changedPaymentReason', JSON.stringify(this.selectedPayment?.paymentReason));
    const goodsReasons = [11];
    const servicesReasons = [9, 10, 20, 22, 23];
    const loanReasons = [1, 2, 3, 5, 6, 7, 26];
    const selectedInvestmentType = goodsReasons.includes(event) ? 'goods' :
      servicesReasons.includes(event) ? 'Services' :
        loanReasons.includes(event) ? 'Loan' : 'transactions'
    this.transactions.get('investmentType').setValue(selectedInvestmentType);
    this.selectedInvestmentType = selectedInvestmentType;
    this.transactions.controls['paymentReason'].patchValue(event);
   
    if(this.transactions.get('paymentReason').value  == 999)  {
      this.isDisplayPaymentReasonIsOther = true;
    }else {
      this.isDisplayPaymentReasonIsOther = false
    }
    const fileArrayControl = this.uploadFile.get('file') as FormArray;
    fileArrayControl.clear();
  }

  isPaymentReasonNotExist() {
    if (this.transactions?.value?.paymentReason && this.isDisableReason) { // ils scenari
      // 18: Transfer to an Israeli resident, to an Israeli bank only
      // 25: Salaries ILS only
      const isReasonExist = [18, 25].includes(this.transactions.value.paymentReason);
      if (!isReasonExist) {
        this.selectedInvestmentType = '';
        this.transactions.get('investmentType').setValue('');
        this.selectedSortedPayment = '';
        this.transactions.get('paymentReason').setValue('');
      }
    } else { // for non ILS
      const isReasonExist = this.paymentReasonsToFilter.includes(this.transactions.value.paymentReason);
      if (!isReasonExist) {
        if (this.transactions.get('investmentType')?.value) {
          if (!(this.paymentReasonsToFilter.includes(this.transactions.value.paymentReason))) {
            this.transactions.get('paymentReason').setValue('');
          }
        } else {
          this.selectedInvestmentType = '';
          this.transactions.get('investmentType').setValue('');
          this.selectedSortedPayment = '';
          this.transactions.get('paymentReason').setValue('');
        }
      }
    }
  }

  nextStep() {
    this.isSubmitTransactionForm = true;
    if (this.isDisplayPaymentReasonIsOther && !this.isNonIsraeliUser) {
      this.transactions.controls['reasonDesc'].setValidators([Validators.required, Validators.maxLength(100), Validators.minLength(2)])
    } else {
      this.transactions.controls['reasonDesc'].clearValidators();
      
    }
    this.transactions.controls['reasonDesc'].updateValueAndValidity();
    this.isPaymentReasonNotExist();
    if (this.transactions.valid) {
      const reasonDescControl = this.transactions.get('reasonDesc');
      if (reasonDescControl && reasonDescControl.invalid) {
        reasonDescControl.markAsTouched();
        return;

      }
      this.transactions.patchValue(this.transactions.value);
      this.transcationFormValues.emit(this.transactions.value);
      const selectedPaymentReasonName = this.sortedPaymentReasons.filter(data => data.id === this.transactions.value.paymentReason)?.[0]?.['translatedName'] || '';
      this.contactsService.selectedPaymentReasonName.next(selectedPaymentReasonName);
      this.stepChanged.emit();
    } else {
      this.transactions.markAllAsTouched();
    }
  }
  previousStep(stepper: any, progress: any) {
    this.loading = false;
    delete this.errMsg;
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
    const scrollToTopPrev = document.querySelector<HTMLElement>('mat-dialog-content');

    if (scrollToTopPrev) {
      scrollToTopPrev.scrollTop = 0;
    }
  }

  BeneficiaryTaxResidenceDrpOpen(event: any) {
    if (event) {
      this.countryList = this.benCountryTaxResidenceGlobalCountrys;
      this.benCountryTaxResidenceSearchControl.setValue('');
    } else {
      if (this.countryList && this.countryList.length === 0) {
        this.countryList = this.benCountryTaxResidenceGlobalCountrys
      }
    }
  }

  getBeneficiaryTaxResidenceCountryCode() {
    return this.transactions.controls['beneficiaryStateResidenceRecipient'].value;
  }

  ngAfterViewInit(): void {
    this.contactsService.clearPaymentReason.pipe(takeUntil(this.unSubscribe$)).subscribe(res => {
      if (res) {
        this.transactions.get('paymentReason').patchValue(this.transactions.value.paymentReason);
        this.selectedInvestmentType = '';
        this.selectedSortedPayment = '';
        this.transactions.get('paymentReason').setValue('')
        this.transactions.get('investmentType').setValue('');
        this.transactions.get('reasonDesc').setValue('');
        localStorage.removeItem('selectedInvestmentType');
        localStorage.removeItem('selectedPayment');
      } else {
        this.transactions.get('paymentReason').patchValue(this.transactions.value.paymentReason);
      }
    })
  
    if(this.transactions.get('paymentReason').value  == 999) {
      this.isDisplayPaymentReasonIsOther = true;
    }else {
      this.isDisplayPaymentReasonIsOther = false;
    }
    const selectedInvestmentType = this.getSelectedInvestmentType();
    this.selectedInvestmentType = selectedInvestmentType;
    this.bindPaymentReasons(selectedInvestmentType);
    if (this.iseditBenificiary) {
      this.handleEditBeneficiary();
    } else {
      this.handleNewBeneficiary();
    }
    const benContry = this.benificiaryForm.controls.newBenificiaryStep2.controls['beneficiaryCountry'].value;
    const benBankContry = this.benificiaryForm.controls.newBenificiaryStep2.controls['bankCountry'].value;
    const benCurrency = this.benificiaryForm.controls.newBenificiaryStep2.controls['currency'].value;
    if (!this.isNonIsraeliUser) {
      if ((benContry === 'il' && benBankContry === 'il' && benCurrency === 'ILS') || (benContry === 'il' && benBankContry === 'il' && benCurrency !== 'ILS')) {
        this.isDisableReason = true;
      } else {
        this.isDisableReason = false;
      }
    }

    this.isPaymentReasonNotExist();
  }

  // Function to determine selected investment type based on payment reason
  private getSelectedInvestmentType(): string {
    const goodsReasons = [11];
    const servicesReasons = [9, 10, 20, 22, 23];
    const loanReasons = [1, 2, 3, 5, 6, 7, 26];

    if (this.transactions?.value?.paymentReason) {
      if (goodsReasons.includes(this.transactions?.value?.paymentReason)) return 'goods';
      if (servicesReasons.includes(this.transactions?.value?.paymentReason)) return 'Services';
      if (loanReasons.includes(this.transactions?.value?.paymentReason)) return 'Loan';
      return 'transactions';
    }
    return '';
  }

  private handleEditBeneficiary(): void {
    const paymentReasonObj = this.newPaymentReasonArray.find((paymentObj: any) => paymentObj.paymentReason === this.transactions?.paymentReason?.value);
    if (paymentReasonObj) {
      this.selectedPayment = paymentReasonObj;
      this.selectedPayment.paymentReason = this.transactions?.paymentReason?.value;
      this.selectedSortedPayment = this.transactions?.paymentReason?.value;
      const isPaymentReasonExist = this.paymentReasonsToFilter.includes(this.selectedSortedPayment);
      if (!isPaymentReasonExist) {
        this.selectedInvestmentType = '';
        this.selectedSortedPayment = '';
      }
    }
    // Update form values
    this.transactions?.patchValue({
      reasonDesc: this.editBenificiaryObj?.reasonDesc,
    });
    // Update form values
    // this.transactions?.patchValue({
    //   beneficiaryStateResidenceRecipient: this.editBenificiaryObj?.beneficiaryCountry,
    //   deductionNum: this.editBenificiaryObj?.deductionNum,
    //   reasonDesc: this.editBenificiaryObj?.reasonDesc,
    // });
  }

  private handleNewBeneficiary(): void {
    const selectedInvestmentType = localStorage.getItem('selectedInvestmentType')!;
    this.selectedInvestmentType = selectedInvestmentType;
    this.bindPaymentReasons(this.selectedInvestmentType);

    const selectedPayment = localStorage.getItem('selectedPayment');
    if (selectedPayment) {
      this.setSelectedPaymentFromLocalStorage(selectedPayment);
    } else {
      this.selectedPayment = {};
    }
  }

  // Set selected payment and bind it to the form values
  private setSelectedPaymentFromLocalStorage(selectedPayment: string): void {
    try {
      const parsedPayment = JSON.parse(selectedPayment);
      this.selectedPayment = parsedPayment;
      this.selectedPayment.paymentReason = parsedPayment?.paymentReason;
      this.selectedSortedPayment = parsedPayment?.paymentReason;
      // Update form with values from localStorage
      this.transactions.patchValue({
        investmentType: this.transactions?.value?.investmentType,
        paymentReason: this.selectedPayment?.paymentReason,
        reasonDesc: this.transactions?.value?.reasonDesc,
        deductionNum: this.transactions?.value?.deductionNum,
        beneficiaryStateResidenceRecipient: this.transactions?.value?.beneficiaryStateResidenceRecipient,
      });
    } catch (error) {
      console.error('Error parsing selectedPayment from localStorage:', error);
    }
  }

  hasError(controlName: string): boolean {
    const control = this.transactions.get(controlName);
    return !!(control && control.invalid && this.isSubmitTransactionForm);
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
