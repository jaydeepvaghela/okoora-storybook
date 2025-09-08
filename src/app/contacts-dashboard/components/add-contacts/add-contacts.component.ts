import { Component, Output, ChangeDetectorRef, Inject, ViewChild, Input, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { ContactsService } from '../../services/contacts.service';
// import { PayerService } from '../../services/payer.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { of, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContactSelectionComponent } from '../contact-selection/contact-selection.component';
import { NewBenificiaryComponent } from '../new-benificiary/new-benificiary.component';
import { GetBeneficiaryBankRequirements } from '../contacts-data/userData';
// import { CommonService } from 'src/app/common/services/common.service';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
// import { AirwallexbeneficiaryService } from '../../services/airwallexbeneficiary.service';


@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss'],
  imports: [CommonModule, MatDialogContent, ReactiveFormsModule, MatProgressBarModule, MatStepperModule, ContactSelectionComponent, NewBenificiaryComponent]
})
export class AddContactsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('formStepper') formStepper!: MatStepper;
  @Input('awBeneficiaryDetailsObj') awBeneficiaryDetailsObj: any

  isLastStepConfirmClicked = false;
  editBeneficiary = false;
  beneficiaryForEdit: any;
  benificiaryForm!: FormGroup;
  payerForm!: FormGroup;
  flag: boolean = true;
  editPayer: boolean = false;
  payerDataForEdit: any = {};
  payerDataForEditenable: boolean = false;
  errorMsgForSave: any;
  isLastStep!: boolean;
  fromWallet!: boolean;
  wellDoneMsg!: string;
  fromSend!: boolean;
  showNewBenificiaryPage = false;
  isUploadDoucment!: boolean;
  isUserHasCCAccount = true;
  newBenificiaryStep2Values: any;
  getBeneficiaryDataForEdit$!: Subscription;
  bankDetailsFormStep4Values: any;
  uploadFileFormStep5Values: any;
  transcationFormStep3Values: any;
  countryList: any;
  isNonIsraeliUser = false;
  awBeneficiaryForm!: FormGroup;
  awBeneficiaryEditData: any = [];
  awFormSchemaErrors: any;
  isNonIsraeliUserFlag = false;
  awCounter = 0;
  awObj = {
    country: '',
    bankCountry: '',
    currency: '',
    beneficiaryAccountType: '',
  }
  unsubscribe$ = new Subject<void>();
  isCreateBeneficiaryFromSummary: boolean = false;
  beneficiaryBankRequirementsObjForEdit: any;
  dynamicControlsForEdit: string[] = [];

  IsBankDetailObjForEdit: any = {
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
  isBankRequireMentErrorForEdit!: string;
  displayAWFooter = true;
  bankRequirementFromStep2: any;



  constructor(
    private readonly fb: FormBuilder,
    private readonly contactsService: ContactsService,
    // private payerService: PayerService,
    private readonly cdf: ChangeDetectorRef,
    // private _commonService: CommonService,
    // private authService: AuthenticationService,
    // private awBeneficiaryService: AirwallexbeneficiaryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<AddContactsComponent>,
  ) {
    this.isNonIsraeliUser = this.contactsService.isNonIsraelUser();
    if (this.data?.createContact == 'editBenificiary') {
      localStorage.setItem('editBenificiary', JSON.stringify(true)!);
    }


    if (!this.isNonIsraeliUser) {
      this.contactsService.backFromNewBenificiary.subscribe((res: any) => {
        const isPayerSelected = JSON.parse(localStorage.getItem('payerselected')!);
        if (res) {
          if (isPayerSelected) {
            this.showNewBenificiaryPage = false;
          } else {
            this.showNewBenificiaryPage = true;
          }
        } else {
          if (isPayerSelected) {
            this.showNewBenificiaryPage = false;
          } else {
            if (this.data && this.data?.createContact) {
              this.showNewBenificiaryPage = this.data.createContact == 'editBenificiary' ? true : false;
            } else {
              this.editBeneficiary = false;
              this.showNewBenificiaryPage = false;
            }
          }
        }
      })
    } else {
      this.showNewBenificiaryPage = this.data?.createContact == 'non-israel' ? true : false;
      // this.contactsService.setNewBeniStepperIndexFromSummary(1);
      // if (this.editBeneficiary) {
      //   this.contactsService.setNewBeniStepperIndexFromSummary(2);
      // }
      // this.contactsService.isNewBenificiaryconfirmClicked.next(false);
    }
  }

  ngOnInit() {
    this.isCreateBeneficiaryFromSummary = false;

    this.contactsService.setBeneficiaryObject({});
    if (this.isNonIsraeliUser && !this.editBeneficiary) {
      this.contactsService.setNewBeniStepperIndexFromSummary(1);
    } else if (this.isNonIsraeliUser && this.editBeneficiary) {
      this.contactsService.setNewBeniStepperIndexFromSummary(2);
    } else {
      this.contactsService.setNewBeniStepperIndexFromSummary(0);
    }

    this.contactsService.isNewBenificiaryconfirmClicked.pipe(takeUntil(this.unsubscribe$)).subscribe(Res=> {
      if(Res){
        this.displayAWFooter = false;
      }
    });

    this.contactsService.isCreateBeneficiaryFromLastStep.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res) {
        this.isCreateBeneficiaryFromSummary = true
        this.displayAWFooter = true;
      } else {
        this.isCreateBeneficiaryFromSummary = false;
      }
    })
    this.contactsService.isBeneficiarySummaryInit.subscribe(res => {
      if (res) {
        this.isLastStepConfirmClicked = true;
      } else {
        this.isLastStepConfirmClicked = false;
      }
    });
    this.contactsService.isNewPayerSummaryPage.subscribe(res => {
      if (res) {
        this.isLastStepConfirmClicked = true;
      } else {
        this.isLastStepConfirmClicked = false;
      }
    });

    this.contactsService.isUploadDocClickedFromNewBeniStep1.subscribe(res => {
      if (res) {
        this.isUploadDoucment = false;
      }
    })
    this.wellDoneMsg = "Payer saved"
    this.benificiaryForm = this.fb.group({
      newBenificiaryStep2: this.fb.group({
        beneficiaryCountry: ['', [Validators.required, Validators.pattern('^[A-z]{2}$')]], //==
        bankCountry: ['', Validators.required],
        currency: ['', Validators.required],
        IsBeneficiaryBusinessCategoryLegit: ['', Validators.required],
        beneficiaryAccountType: ['', Validators.required],
      }),
      newBenificiaryBankDetails: this.fb.group({
        iban: [''], //==
        // bankCountry: [''],
        bankAccountType: [''],
        swiftCode: ['', Validators.required],  //==
        beneficiaryIdNumber: ['', Validators.required],
        bankNumber: ['', Validators.required],
        // branchNumber: [''],
        accountNumber: ['', Validators.required],
        bankAccountHolderHebrewName: ['', Validators.required],
        bankAccountHolderName: ['', [Validators.required, Validators.pattern('^.{1,255}$')]], //==
        bankAccountHolderNickname: [''],
        bankAccountHolderEmail: ['', [Validators.required]],
        beneficiaryState: ['', Validators.required], // ==
        beneficiaryCity: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]], //==
        beneficiaryStreet: ['', [Validators.required, Validators.pattern('^.{1,255}')]], // ==
        beneficiaryHouseNumber: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]], // ==
        beneficiaryZipCode: ['', [Validators.required]],
        aba: ['', [Validators.pattern('^[0-9]{9}$')]],
        ifsc: ['', [Validators.pattern('^[0-9]{9}$')]],
        clabe: ['', [Validators.pattern('^[0-9]{9}$')]],
        cnaps: ['', [Validators.pattern('^[0-9]{9}$')]],
        bsb: ['', [Validators.pattern('^[0-9]{9}$')]],
        sortCode: [''],
        firstName: [''],
        lastName: [''],
        // achRoutinNumber: [''],
        bankName: [''],
        // bankCity: [''],
        bankBranch: [''],
        routingCodeType: [''],
        routingCodeValue: [''],
        erpBeneficiaryId: ['']
      }),
      type: this.fb.group({
        ContactType: ['', Validators.required]
      }),
      payment: this.fb.group({
        beneficiaryAccountHoldername: ['', [Validators.maxLength(30), Validators.minLength(2)]],
        beneficiaryAccountType: ['', Validators.required],
      }, { validator: this.hebrewNameValidator }),
      transactions: this.fb.group({
        investmentType: ['', Validators.required],
        paymentReason: ['', Validators.required],
        reasonDesc: [''],
      }),
      uploadFile: this.fb.group({
        file: this.fb.array([]),
        beneficiaryStateResidenceRecipient: ['', Validators.required],
        // reasonDesc: ['', [Validators.required, Validators.maxLength(100)]],
        deductionNum: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
      })
    })
    this.payerForm = this.fb.group({
      payerProfileType: this.fb.group({
        paymentReason: ['', Validators.required]
      }),
      payerProfileDetail: this.fb.group({
        payerAccount: ['', Validators.required],
        bankCode: ['', Validators.required],
        bankBranch: ['', Validators.required],
        bankAccountNumber: ['', Validators.required],
        currency: ['', Validators.required],
        ibanNumber: ['', Validators.required],
        paymentExportingFile: this.fb.array([]),
        paymentlaborFile: this.fb.array([])
      }),
      payerAccountDetail: this.fb.group({
        accountType: ['', Validators.required],
        iban: ['', Validators.required],
        bicSwift: ['', Validators.required],
        accountNumber: ['', Validators.required],
        achRoutingNumber: ['', Validators.required],
        bankCountry: ['', Validators.required],
        bankName: ['', Validators.required],
        bankCity: ['', Validators.required],
        bankBranch: ['', Validators.required],
        bankNumber: ['', Validators.required],
        bankAccountHolderName: ['', Validators.required],
        bankAccountHolderInHebrew: ['', Validators.required],
        entityType: ['', Validators.required],
        unionCountry: ['', Validators.required],
        payerCountry: ['', Validators.required],
        FoundsSourceDetails: ['', Validators.required],
        averageAmount: ['', Validators.required],
        frequency: ['', Validators.required],
        currency: ['', Validators.required]
      })
    })

    if (this.data?.createContact == 'editBenificiary') {
      this.getEditBeneficiaryData();
    }


    // this.payerService.currentPayerdetailForEdit.subscribe(async (data) => {
    //   this.payerDataForEdit = {};
    //   this.payerDataForEdit = data
    //   this.payerDataForEditenable = Object.keys(this.payerDataForEdit).length != 0
    //   if (Object.keys(data).length != 0) {
    //     this.editPayer = true;
    //     await this.benificiaryForm.patchValue({
    //       type: {
    //         ContactType: "payer"
    //       },
    //     })
    //     this.cdf.detectChanges();
    //   }
    // })

    if (this.data?.fromWallet == true) {
      this.fromWallet = true;
      this.fromSend = this.data?.fromSend
      this.wellDoneMsg = "Your local account is waiting for compliance approval"
      this.benificiaryForm.patchValue({
        type: {
          ContactType: 'payer'
        }
      })
      this.payerForm.patchValue({
        payerProfileType: {
          paymentReason: 2
        }
      })
    }

    this.benificiaryForm.get('type.ContactType')?.valueChanges.subscribe((value) => {
      if (value == 'payer' && this.isUserHasCCAccount) {
        this.isUserHasCCAccount = true;
      } else if (value == 'payer' && !this.isUserHasCCAccount) {
        this.isUserHasCCAccount = false;
      }
      // Perform your logic here based on the value of ContactType
    });


    this.contactsService.backFromNewBenificiary.subscribe((res: any) => {
      const isPayerSelected = JSON.parse(localStorage.getItem('payerselected')!);
      if (res) {
        if (isPayerSelected) {
          this.showNewBenificiaryPage = false;
        } else {
          this.showNewBenificiaryPage = true;
        }
      } else {
        if (isPayerSelected) {
          this.showNewBenificiaryPage = false;
        } else {
          this.showNewBenificiaryPage = (this.data?.createContact == 'editBenificiary' || this.data?.createContact == 'editPayer' || this.data?.createContact == 'addPayer' || this.data?.createContact == 'non-israel') ? true : false;
          if (this.data?.createContact == 'addPayer') {
            this.editPayer = false;
            if (this.payerForm) {
              this.payerDataForEdit = {};
              this.payerForm.reset();
            }
          }
        }
      }
    })

    // this.awBeneficiaryService.resetawCounter.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
    //   if (res) {
    //     this.awCounter = 0;
    //     }
    // });

    this.contactsService.getBeneficiaryBankRequirementFromStep2.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if(Object.keys(res)?.length > 0)  {
          this.bankRequirementFromStep2 = res;
          this.getBenificiaryBankRequirement(this.bankRequirementFromStep2);
      }else {
        this.bankRequirementFromStep2 = null;
      }
    })
  }

  isAWStep2NextClicked(event: any) {
    if (event == true) {
      this.awCounter = this.awCounter + 1;
      if (this.awCounter === 1) {
        this.storeAWSelectedBeneficiaryAccDetails();
        // this.getAWFormSchemaFields();
      }
    }
  }

  // getAWFormSchemaFields() {
  //   this.awBeneficiaryService.awBeneficiaryFormSchemaRes.pipe(takeUntil(this.unsubscribe$)).subscribe((awFieldRes: any) => {
  //     console.log("Schema", awFieldRes);
  //     if (awFieldRes && awFieldRes.length !== 0) {
  //       if (this.awCounter > 1) {
  //         if (this.awObj.country !== this.benificiaryForm.get('newBenificiaryStep2')?.value.beneficiaryCountry
  //           || this.awObj.bankCountry !== this.benificiaryForm.get('newBenificiaryStep2')?.value.bankCountry
  //           || this.awObj.currency !== this.benificiaryForm.get('newBenificiaryStep2')?.value.currency
  //           || this.awObj.beneficiaryAccountType !== this.benificiaryForm.get('newBenificiaryStep2')?.value.beneficiaryAccountType) {
  //           this.storeAWSelectedBeneficiaryAccDetails();
  //           this.createAWBeneficiaryForm(awFieldRes);
  //         }
  //       } else {
  //         this.createAWBeneficiaryForm(awFieldRes);
  //       }
  //     }
  //   }, error => {
  //     this.displayAWSchemaErrorMessage(error?.error?.apiErrorMessages);
  //   });
  // }

  storeAWSelectedBeneficiaryAccDetails() {
    this.awObj = {
      country: this.benificiaryForm.get('newBenificiaryStep2')?.value.beneficiaryCountry,
      bankCountry: this.benificiaryForm.get('newBenificiaryStep2')?.value.bankCountry,
      currency: this.benificiaryForm.get('newBenificiaryStep2')?.value.currency,
      beneficiaryAccountType: this.benificiaryForm.get('newBenificiaryStep2')?.value.beneficiaryAccountType,
    }
  }

  displayAWSchemaErrorMessage(errorDetails: any) {
    const errorCode = errorDetails['code'];
    switch (errorCode) {
      case 'SCHEMA_DEFINITION_NOT_FOUND':
        this.awFormSchemaErrors = `${this.newBenificiaryStep2Values.currency} transfers to recipients in ${this.newBenificiaryStep2Values.bankCountry} are not available. Select another currency or another country/region that you transfer to.`;
        break;
      default:
        this.awFormSchemaErrors = errorDetails?.message;
        break;
    }
  }



  createAWBeneficiaryForm(awBeneficiaryFields: any) {
    const group: any = {};
    let routingValuePattern = '';
    const routingValueField = awBeneficiaryFields.find(
      (field: any) => (field.field.key === "account_routing_value1")
    );
    if (routingValueField) {
      routingValuePattern = routingValueField?.rule?.pattern || '';
    }

    let routingValuePattern2 = '';
    const routingValueField2 = awBeneficiaryFields.find(
      (field: any) => (field.field.key === "account_routing_value2")
    );
    if (routingValueField2) {
      routingValuePattern2 = routingValueField2?.rule?.pattern || '';
    }

    awBeneficiaryFields.forEach((fieldObj: any) => {
      if (fieldObj.field.key !== 'entity_type' && fieldObj.field.key !== 'date_of_birth' && fieldObj.field.key !== 'account_routing_value1' && fieldObj.field.key !== 'account_routing_value2') {
        let validators = [];

        if (fieldObj.required) {
          validators.push(Validators.required);
        }

        let patternToUse = fieldObj?.rule?.pattern;
        if (routingValueField || routingValueField2) {
          if ((fieldObj.field.key === "account_routing_type1" && routingValueField)) {
            patternToUse = routingValuePattern;
          }
          if ((fieldObj.field.key === "account_routing_type2" && routingValueField2)) {
            patternToUse = routingValuePattern2;
          }
        }
        validators.push(Validators.pattern(patternToUse));

        const initialValue = fieldObj?.field?.default ?? '';
        if ((fieldObj.field.key === "account_routing_type1" && routingValueField)) {
          group[fieldObj.field.key] = [routingValueField?.rule?.default, validators];
        } else if ((fieldObj.field.key === "account_routing_type2" && routingValueField2)) {
          group[fieldObj.field.key] = [routingValueField2?.rule?.default, validators];
        } else {
          group[fieldObj.field.key] = [initialValue, validators];
        }
      }
    });

    this.awBeneficiaryForm = this.fb.group(group);
    if (this.beneficiaryForEdit?.id) {
      this.editAWBeneficiaryById(this.beneficiaryForEdit?.id);
    }
  }

  editAWBeneficiaryById(awBeneficiaryId: any) {
    // this.awBeneficiaryService.getAWBeneficiaryByID(awBeneficiaryId).subscribe((awEditData: any) => {
    //   const flattenedObject = this.getLastInnerObjects(awEditData['body']);
    //   this.awBeneficiaryForm?.patchValue(flattenedObject);
    //   if (this.awBeneficiaryForm && flattenedObject?.account_routing_value1) {
    //     const routingControl = this.awBeneficiaryForm.get('account_routing_type1');
    //     if (routingControl) {
    //       routingControl.patchValue(flattenedObject.account_routing_value1);
    //     }
    //   }
    //   if (this.awBeneficiaryForm && flattenedObject?.account_routing_value2) {
    //     const routingControl2 = this.awBeneficiaryForm.get('account_routing_type2');
    //     if (routingControl2) {
    //       routingControl2.patchValue(flattenedObject.account_routing_value2);
    //     }
    //   }
    //   this.awBeneficiaryService.hideAWBankDetailsLoader.next(true);
    // }, (error: any) => {
    //   this.awBeneficiaryService.hideAWBankDetailsLoader.next(true);
    // });
  }


  getLastInnerObjects(obj: any, result: any = {}): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          this.getLastInnerObjects(obj[key], result);
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }



  getCountries() {
    // this._commonService.getCountries().subscribe((data: any) => {
    //   this.countryList = data;
    //   this.changeCountry(this.newBenificiaryStep2Values?.beneficiaryCountry); // set state and country in step4
    // })
  }


  getEditBeneficiaryData() {
    this.contactsService.clearPaymentReason.next(false);
    this.getBeneficiaryDataForEdit$ = this.contactsService.getBeneficiaryDataForEdit.subscribe((data: any) => {
      this.beneficiaryForEdit = data;
      // console.log("Edit Beneficiary Obj=>", this.beneficiaryForEdit);
      if (Object.keys(this.beneficiaryForEdit).length != 0) {
        this.editBeneficiary = true;
        this.benificiaryForm.get('newBenificiaryStep2')?.patchValue({
          beneficiaryCountry: this.beneficiaryForEdit?.beneficiaryCountry?.toLowerCase(),
          bankCountry: this.beneficiaryForEdit?.bankCountry?.toLowerCase(),
          currency: this.beneficiaryForEdit?.currency,
          IsBeneficiaryBusinessCategoryLegit: this.beneficiaryForEdit?.isBeneficiaryBusinessCategoryLegit == true ? 'true' : 'false',
          beneficiaryAccountType: this.beneficiaryForEdit?.beneficiaryAccountType ? this.beneficiaryForEdit?.beneficiaryAccountType.toString() : '',
        });
        this.newBenificiaryStep2Values = this.benificiaryForm.get('newBenificiaryStep2')?.value;
        const formGroup = this.benificiaryForm.get('newBenificiaryBankDetails') as FormGroup;
        if (this.beneficiaryForEdit) {
          const newBenificiaryBankDetails = this.benificiaryForm.get('newBenificiaryBankDetails') as FormGroup;

          Object.keys(newBenificiaryBankDetails.controls).forEach((key) => {
            const formControl = newBenificiaryBankDetails.get(key) as FormControl;
            if (this.beneficiaryForEdit.hasOwnProperty(key)) {
              formControl.patchValue(this.beneficiaryForEdit[key]);
            }
          });
          // formGroup.patchValue(this.beneficiaryForEdit);
          // formGroup.get('bankAccountHolderEmail')?.patchValue(this.beneficiaryForEdit?.bankAccountHolderEmail);
          // formGroup.get('bankAccountHolderName')?.patchValue(this.beneficiaryForEdit?.bankAccountHolderName);
          // formGroup.get('bankAccountHolderName')?.patchValue(this.beneficiaryForEdit?.bankAccountHolderName);
          // // formGroup.get('bankCity')?.patchValue(this.beneficiaryForEdit?.bankCity);
          // formGroup.get('accountNumber')?.patchValue(this.beneficiaryForEdit?.accountNumber);
          // formGroup.get('beneficiaryState')?.patchValue(this.beneficiaryForEdit?.beneficiaryState);
          // formGroup.get('beneficiaryCity')?.patchValue(this.beneficiaryForEdit?.beneficiaryCity);
          // bsb_code = 1, ==
          // cnaps = 2, ==
          // ifcs = 3, ==
          // clabe = 4, ==
          // sort_code = 5,
          // aba = 6 ==
          if (this.beneficiaryForEdit?.routingCodeType === 1) {
            formGroup.get('bsb')?.patchValue(this.beneficiaryForEdit?.routingCodeValue);
          } else if (this.beneficiaryForEdit?.routingCodeType === 2) {
            formGroup.get('cnaps')?.patchValue(this.beneficiaryForEdit?.routingCodeValue);
          } else if (this.beneficiaryForEdit?.routingCodeType === 3) {
            formGroup.get('ifsc')?.patchValue(this.beneficiaryForEdit?.routingCodeValue);
          } else if (this.beneficiaryForEdit?.routingCodeType === 4) {
            formGroup.get('clabe')?.patchValue(this.beneficiaryForEdit?.routingCodeValue);
          } else if (this.beneficiaryForEdit?.routingCodeType === 5) {
            formGroup.get('sortCode')?.patchValue(this.beneficiaryForEdit?.routingCodeValue);
          } else if (this.beneficiaryForEdit?.routingCodeType === 6) {
            formGroup.get('aba')?.patchValue(this.beneficiaryForEdit?.routingCodeValue);
          } else {
            formGroup.get('routingCodeType')?.patchValue(null);
            formGroup.get('routingCodeValue')?.patchValue(null);
          }
        }
        this.bankDetailsFormStep4Values = this.benificiaryForm.get('newBenificiaryBankDetails')?.value;

        const uploadFileformGroup = this.benificiaryForm.get('uploadFile') as FormGroup;
        if (this.beneficiaryForEdit) {
          uploadFileformGroup.get('beneficiaryStateResidenceRecipient')?.patchValue(this.beneficiaryForEdit?.beneficiaryStateResidenceRecipient);
          uploadFileformGroup.get('deductionNum')?.patchValue(this.beneficiaryForEdit?.deductionNum);
          uploadFileformGroup.get('reasonDesc')?.patchValue(this.beneficiaryForEdit?.reasonDesc);
        }
        this.uploadFileFormStep5Values = this.benificiaryForm.get('uploadFile')?.value;

        const transcationsFormGroup = this.benificiaryForm.get('transactions') as FormGroup;
        if (this.beneficiaryForEdit) {
          transcationsFormGroup.get('paymentReason')?.patchValue(this.beneficiaryForEdit?.paymentReason);
        }
        // if (this.isNonIsraeliUser) {
        //   this.awBeneficiaryService.hideAWBankDetailsLoader.next(false);
        //   const BeneficiaryAccountType = parseInt(this.newBenificiaryStep2Values?.beneficiaryAccountType, 10);
        //   const awSchemaPayloadEditTime = {
        //     "coutry_code" : this.newBenificiaryStep2Values?.beneficiaryCountry.toUpperCase(),
        //     "bank_country_code": this.newBenificiaryStep2Values?.bankCountry.toUpperCase(),
        //     "account_currency": this.newBenificiaryStep2Values?.currency.toUpperCase(),
        //     "entity_type": BeneficiaryAccountType == 1 ? "COMPANY" : "PERSONAL"
        //   }
        //   this.getAWBeneficiaryFormSchemaEditTime(awSchemaPayloadEditTime)
        // } 
        else {
          this.getBenificiaryBankRequirement(this.beneficiaryForEdit); // get pattern for israeli users
        }
        this.cdf.detectChanges();
        this.cdf.markForCheck();
      }
    })
    this.getCountries();
  }

  getAWBeneficiaryFormSchemaEditTime(awSchemaPayloadEditTime: any) {
    // this.awBeneficiaryService.getAWBeneficiaryFormSchema(awSchemaPayloadEditTime).subscribe((awFormSchemaRes: any) => {
    //   if(awFormSchemaRes) {
    //       this.awBeneficiaryService.awBeneficiaryFormSchema.next(awFormSchemaRes['body']['fields']);
    //       this.getAWFormSchemaFields();
    //   }     
    // })
  }

  changeCountry(event: any) {
    const sselectedCountry = this.countryList?.find((data: any) => data.countryCode === event);
    // if (this.editBeneficiary) {
    //   this._commonService.geStateList(event).subscribe((stateData: any) => {
    //     this._commonService.getCityList(sselectedCountry?.countryName, this.beneficiaryForEdit?.beneficiaryState).subscribe((cityData: any) => {
    //       let stateCityObj: any = {
    //         stateList: stateData,
    //         cityList: Array.from(new Set(cityData)),
    //       }
    //       if (cityData.length) {
    //         this.contactsService.setStateAndCityBankDetailspage(stateCityObj);
    //       } else {
    //         this.contactsService.setStateAndCityBankDetailspage(stateCityObj);
    //       }
    //     }, error => {
    //       const stateCityObj: any = {
    //         stateList: stateData,
    //         cityList: [],
    //       }
    //       this.contactsService.setStateAndCityBankDetailspage(stateCityObj);
    //     });
    //   });
    // }
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.benificiaryForm.value);
  }

  hebrewNameValidator(control: FormGroup): ValidationErrors | null {
    const country = control.get('beneficiaryCountry')?.value;
    const hebrewName = control.get('bankAccountHolderHebrewName')?.value;
    if (country === 'il' && !hebrewName) {
      return { hebrewNameRequired: true };
    }
    return null;
  }
  stateRequiredValidator(control: FormControl): ValidationErrors | null {
    const country = control.parent?.get('beneficiaryCountry')?.value;
    if (country === 'us') {
      return Validators.required(control);
    }
    return null;
  }

  closeDialog() {
    let beneficiaryId = localStorage.getItem('newBeneficiaryId');
    if (beneficiaryId) {
    }
  }
  closeModel() {
    this.dialogRef.close('close')
    
    let beneficiaryId = localStorage.getItem('newBeneficiaryId');
    if (beneficiaryId) {
      localStorage.removeItem('newBeneficiaryId');
      // this.contactsService.deleteBenificiary(beneficiaryId).subscribe(result => {
      // });
    }
    if (this.payerDataForEditenable == true) {
      let payerObject: any = localStorage.getItem('payerObject')
      if (payerObject) {
        let data = JSON.parse(payerObject)
        let isComplete = true
        // this.payerService.addPayer(isComplete, data).subscribe((data) => {
        //   localStorage.setItem("newPayerId", data.body)
        //   this.payerService.setPayerID({ "id": data.body })
        //   delete this.errorMsgForSave
        // }, err => { this.errorMsgForSave = err.error.apiErrorMessage })
      }
    }
  }

  stepChange(stepper: any) {
    this.isLastStep = stepper.selectedIndex == stepper.steps.length - 1;
    if (stepper.selectedIndex == 0) {
      this.isLastStep = false;
      this.contactsService.backFromNewBenificiary.next(false);
    } else {
      this.contactsService.backFromNewBenificiary.next(true);
    }
  }

  moveToMainContactPage() {
    this.formStepper.previous();
    this.contactsService.backFromNewBenificiary.next(false);
  }

  step2ChangedValues(formData: any): void {
    this.newBenificiaryStep2Values = formData;
  }

  ngOnDestroy(): void {
    if (this.getBeneficiaryDataForEdit$) {
      this.getBeneficiaryDataForEdit$.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
    // if (this.isNonIsraeliUser) {
    //   if (this.formStepper) {
    //     this.benificiaryForm.get('type')?.get('ContactType')?.patchValue('beniciary');
    //     this.editBeneficiary = true;
    //   }
    // }
  }

  getBenificiaryBankRequirement(beneficiaryForEdit: any) {
    let BeneficiaryAccountType : any;
    let BeneficiaryBankAccountDetails : any;
    if(this.editBeneficiary) {
      BeneficiaryAccountType = parseInt(beneficiaryForEdit?.beneficiaryAccountType, 10);
      BeneficiaryBankAccountDetails = {
       "BankAccountCountry": beneficiaryForEdit?.bankCountry,
       "Currency": beneficiaryForEdit?.currency,
       "BeneficiaryAccountType": BeneficiaryAccountType,
     }
    }else {
      BeneficiaryAccountType = parseInt(this.bankRequirementFromStep2?.beneficiaryAccountType, 10);
      BeneficiaryBankAccountDetails = {
       "BankAccountCountry": this.bankRequirementFromStep2?.bankCountry,
       "Currency": this.bankRequirementFromStep2?.currency,
       "BeneficiaryAccountType": BeneficiaryAccountType,
    }
  }
    const bankDetailsFormForEdit = this.benificiaryForm.get('newBenificiaryBankDetails') as FormGroup;
    of(GetBeneficiaryBankRequirements).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.beneficiaryBankRequirementsObjForEdit = data;
      this.isBankRequireMentErrorForEdit = '';
      this.resetBankDetailFlags();
      // if (this.beneficiaryBankRequirementsObj?.iban) {
      Object.keys(bankDetailsFormForEdit.controls).forEach(controlName => {
        if (controlName === 'iban') {
          if (this.beneficiaryBankRequirementsObjForEdit?.iban) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayIban = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.iban)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayIban = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }
        if (controlName === 'swiftCode') {
          if (this.beneficiaryBankRequirementsObjForEdit?.bic_swift) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displaySwiftCode = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.bic_swift)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displaySwiftCode = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }
        if (controlName === 'bankAccountHolderEmail') { // currentaly not display based on this condition
          this.beneficiaryBankRequirementsObjForEdit.email = '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$'
          if (this.beneficiaryBankRequirementsObjForEdit?.email) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayBankAccountHolderEmail = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.email)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayBankAccountHolderEmail = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }

        if (controlName === 'accountNumber') {
          if (this.beneficiaryBankRequirementsObjForEdit?.account_number) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayAccountNumber = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.account_number)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayAccountNumber = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }
        if (controlName === 'ifsc') {
          if (this.beneficiaryBankRequirementsObjForEdit?.ifsc) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayIfscNumber = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.ifsc)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayIfscNumber = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }
        // if (controlName === 'beneficiaryZipCode') {
        //   if (this.beneficiaryBankRequirementsObjForEdit?.beneficiary_postcode) {
        // this.dynamicControlsForEdit.push(controlName);
        //     this.IsBankDetailObjForEdit.displaybeneficiaryZipCode = true;
        //     bankDetailsFormForEdit.controls[controlName].setValidators([
        //       Validators.required,
        //       Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.beneficiary_postcode)
        //     ]);
        //   } else {
        //     this.IsBankDetailObjForEdit.displaybeneficiaryZipCode = false;
        //     bankDetailsFormForEdit.controls[controlName].clearValidators();
        //     bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
        //     bankDetailsFormForEdit.controls[controlName].setValue('');
        //   }
        // }
        if (controlName === 'beneficiaryState') {
          if (this.beneficiaryBankRequirementsObjForEdit?.beneficiary_state_or_province) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayBeneficiaryState = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.beneficiary_state_or_province)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayBeneficiaryState = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            // bankDetailsFormForEdit.controls['beneficiaryCity'].clearValidators();
            // bankDetailsFormForEdit.controls['beneficiaryCity'].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'bankAccountHolderName') {
          if (this.beneficiaryBankRequirementsObjForEdit?.bank_account_holder_name_in_english) {
            this.beneficiaryBankRequirementsObjForEdit.bank_account_holder_name_in_english = this.beneficiaryBankRequirementsObjForEdit.bank_account_holder_name_in_english;
          } else {
            this.beneficiaryBankRequirementsObjForEdit.bank_account_holder_name_in_english = '^[a-zA-Z0-9., ]{1,100}$';
          }
          if (this.beneficiaryBankRequirementsObjForEdit?.bank_account_holder_name_in_english) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayBankAccountHolderNameInEnglish = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.bank_account_holder_name_in_english)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayBankAccountHolderNameInEnglish = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (this.newBenificiaryStep2Values?.beneficiaryAccountType == 2 && controlName === 'firstName') {
          if (this.beneficiaryBankRequirementsObjForEdit?.firstName) {
            this.beneficiaryBankRequirementsObjForEdit.firstName = this.beneficiaryBankRequirementsObjForEdit.firstName;
          } else {
            this.beneficiaryBankRequirementsObjForEdit.firstName = '^[A-Za-z\\s]{2,40}$';
          }
          if (this.beneficiaryBankRequirementsObjForEdit?.firstName) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayFirstname = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.firstName)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayFirstname = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (this.newBenificiaryStep2Values?.beneficiaryAccountType == 2 && controlName === 'lastName') {
          if (this.beneficiaryBankRequirementsObjForEdit?.lastName) {
            this.beneficiaryBankRequirementsObjForEdit.lastName = this.beneficiaryBankRequirementsObjForEdit.lastName;
          } else {
            this.beneficiaryBankRequirementsObjForEdit.lastName = '^[A-Za-z\\s]{2,40}$';
          }
          if (this.beneficiaryBankRequirementsObjForEdit?.lastName) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayLastName = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.lastName)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayLastName = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'bankAccountHolderHebrewName') {
          if (this.beneficiaryBankRequirementsObjForEdit?.bank_account_holder_name_in_hebrew) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.bankAccountHolderHebrewName = true;
            this.beneficiaryBankRequirementsObjForEdit.bank_account_holder_name_in_hebrew = '^[\u0590-\u05FF0-9 \s]{2,40}$';
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.bank_account_holder_name_in_hebrew)
            ]);
          } else {
            this.IsBankDetailObjForEdit.bankAccountHolderHebrewName = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'bankNumber') {
          if (this.beneficiaryBankRequirementsObjForEdit?.bank_code) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayBankNumber = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.bank_code)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayBankNumber = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'bankBranch') {
          if (this.beneficiaryBankRequirementsObjForEdit?.branch_code) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayBranchCode = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.branch_code)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayBranchCode = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'beneficiaryIdNumber') {
          this.beneficiaryBankRequirementsObjForEdit.id = '^\\d{9}$';
          if (this.beneficiaryBankRequirementsObjForEdit?.id) {
            // this.dynamicControlsForEdit.push(controlName);
            // this.IsBankDetailObjForEdit.displayBranchCode = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.id)
            ]);
          } else {
            // this.IsBankDetailObjForEdit.displayBranchCode = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'aba') {
          if (this.beneficiaryBankRequirementsObjForEdit?.aba) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayABA = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.aba)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayABA = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }

        if (controlName === 'cnaps') {
          if (this.beneficiaryBankRequirementsObjForEdit?.cnaps) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayCNAPS = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.cnaps)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayCNAPS = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }

        if (controlName === 'bsb') {
          if (this.beneficiaryBankRequirementsObjForEdit?.bsb_code) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayBSB = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.bsb_code)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayBSB = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }
        if (controlName === 'sortCode') {
          if (this.beneficiaryBankRequirementsObjForEdit?.sortCode) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displaySortCode = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.sortCode)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displaySortCode = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');

          }
        }
        if (controlName === 'clabe') {
          if (this.beneficiaryBankRequirementsObjForEdit?.clabe) {
            this.dynamicControlsForEdit.push(controlName);
            this.IsBankDetailObjForEdit.displayCLABE = true;
            bankDetailsFormForEdit.controls[controlName].setValidators([
              Validators.required,
              Validators.pattern(this.beneficiaryBankRequirementsObjForEdit?.clabe)
            ]);
          } else {
            this.IsBankDetailObjForEdit.displayCLABE = false;
            bankDetailsFormForEdit.controls[controlName].clearValidators();
            bankDetailsFormForEdit.controls[controlName].updateValueAndValidity();
            bankDetailsFormForEdit.controls[controlName].setValue('');
          }
        }
      });
    }, error => {
      // this.isBankRequireMentError = error?.error?.message || error?.error?.apiErrorMessage[0] || 'Internal server error';
      // return;
    })
    this.contactsService.setBankDetailsDynamicFields(this.IsBankDetailObjForEdit);

    setTimeout(() => {
      if (this.isBankRequireMentErrorForEdit == '') {
        const uniqBankDetailsControlName = [...new Set(this.dynamicControlsForEdit)]
        this.contactsService.setBankDetailsControls(uniqBankDetailsControlName);
        this.contactsService.setBankDetailsDynamicFieldsPatterns(this.beneficiaryBankRequirementsObjForEdit);
        this.cdf.detectChanges();
      }
    }, 1000);
  }

  private resetBankDetailFlags() {
    Object.keys(this.IsBankDetailObjForEdit).forEach(key => {
      this.IsBankDetailObjForEdit[key] = false;
    });
  }

}
