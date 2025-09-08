import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-benificiary-step6',
  templateUrl: './new-benificiary-step6.component.html',
  styleUrls: ['./new-benificiary-step6.component.scss'],
  imports: [NgbTooltipModule, CommonModule]
})
export class NewBenificiaryStep6Component implements OnInit, OnChanges, OnDestroy, AfterViewInit{
  @ViewChild('copytooltip', { static: false }) copytooltip!: NgbTooltip;
  @Input() stepIndex!: number;
  @Input('newBenificiaryStep2') newBenificiaryStep2: any;
  @Input('newBenificiaryBankDetails') newBenificiaryBankDetails: any;
  @Input('countryList') countryList: any;
  @Input('uploadFile') uploadFile!: FormGroup;
  @Input('uploadFileFormStep5Values') uploadFileFormStep5Values: any;
  @Output() uploadFileFormValues = new EventEmitter<void>();
  @Input('iseditBenificiary') iseditBenificiary?: any;
  @Input('editBenificiaryObj') editBenificiaryObj?: any;
  @Input('isNonIsraeliUser') isNonIsraeliUser!: boolean;
  @Input('transactions') transactions: any;
  @Input('newBenificiaryStep2Values') newBenificiaryStep2Values: any;


  @Output() stepChanged = new EventEmitter<void>();
  @Output() movePreviousStep = new EventEmitter<void>();

  scaShow = false;
  scaRef = "";
  isPayCmarix = false;
  isReviewCmarix = false;
  selectedPaymentReasonName!: string;
  saveBeneficiaryId: any;
  showConfirmPopup: any;
  showLoader!: boolean;
  saveBeneficiaryPayload: any;
  errMsg: any;
  loading!: boolean;
  isUploadError = false;
  isApiCalled = false;
  bankDetailsDataObj: any = {};
  bankDetailsArr: any;
  unSubScribe$ = new Subject<any>();
  globalbankNumberDrpListRes: any = [];
  globalbranchNumberDrpList: any = [];
  ilsScenarioBankName: any;
  ilsScenarioBranchName: any;
  isIsraelTransaction!: boolean;
  awReviewPageData: any = [];
  awReviewPayPayload: any;
  isCreateAWBeneficiary = false;
  isValidateAWError: any;
  reasonDesc: any;

  constructor(private contactService: ContactsService,
    private translateService: TranslateService,
    private router: Router,) {
  }

  ngOnInit(): void {
    // this.awBeneficiaryService.awVerificationSucceed.next(false);
    // this.awBeneficiaryService.awVerificationFailed.next(false);
    // this.awBeneficiaryService.awVerificationAWBeneficiaryError.next('');
    this.allSubscriptions();
    this.copytooltip?.close();
    this.contactService.currentObjectForFile.subscribe((data) => {
      this.saveBeneficiaryPayload = data;
    });
    this.contactService.getBankDetailssummaryControls.subscribe(res => {
      if (res) {
        const filteredObject = Object.keys(this.newBenificiaryBankDetails?.value)
          .filter(key => res.includes(key)) // Check if the key is in the array
          .reduce((result: any, key: any) => {
            result[key] = this.newBenificiaryBankDetails?.value[key]; // Add the key-value pair to the result
            return result;
          }, {});
        this.bankDetailsDataObj = filteredObject;
        if (!this.isNonIsraeliUser) { // for israel user based affiliate country == 'il', display bank data
          this.displayBankDetailsSummary();
        }
      }
    })

    // this.awBeneficiaryService.getAWBeneficiaryPayload.pipe(takeUntil(this.unSubScribe$)).subscribe(reviewPayPayloadRes => {
    //   if (reviewPayPayloadRes && this.isNonIsraeliUser) { // for non-israel user based affiliate country !== 'il', display bank data
    //     this.awReviewPayPayload = reviewPayPayloadRes;
    //   }
    // })

    // this.awBeneficiaryService.getBeneficiaryReviewPageData.pipe(takeUntil(this.unSubScribe$)).subscribe(res => {
    //   if (res && res.length > 0 && this.isNonIsraeliUser) { // for non-israel user based affiliate country !== 'il', display bank data
    //     this.awReviewPageData = res;
    //     this.bankDetailsArr = this.awReviewPageData
    //       .map((item: any) => {
    //         if (item?.label === 'Account routing type1') {
    //           const routingValue = this.awReviewPageData?.find((el: any) => el.label === 'Account routing value1')?.value;
    //           return { label: item.value.toUpperCase(), value: routingValue || item.value };
    //         }
    //         if (item?.label === 'Account routing type2') {
    //           const routingValue2 = this.awReviewPageData?.find((el: any) => el.label === 'Account routing value2')?.value;
    //           return { label: item.value.toUpperCase(), value: routingValue2 || item.value };
    //         }
    //         return item;
    //       })
    //       .filter((item: any) => item.label !== 'Account routing value1' && item.label !== 'Account routing value2' && item.label !== 'Transfer method');
    //   }
    // })


    // aw created beneficiary verification success
    // this.awBeneficiaryService.awVerificationSucceed.pipe(takeUntil(this.unSubScribe$)).subscribe(awBeneficiaryVerifiedSuccessRes => {
    //   if (awBeneficiaryVerifiedSuccessRes) {
    //     this.contactService.isNewBenificiaryconfirmClicked.next(true); // for non-israel and approve go to payment page
    //     this.isCreateAWBeneficiary = true;
    //     this.isPayCmarix = true;
    //     this.isReviewCmarix = false;
    //   }
    // });

    // // aw created beneficiary verification Fail
    // this.awBeneficiaryService.awVerificationFailed.pipe(takeUntil(this.unSubScribe$)).subscribe(awBeneficiaryVerifiedRFailes => {
    //   if (awBeneficiaryVerifiedRFailes) {
    //     this.contactService.isNewBenificiaryconfirmClicked.next(false); // for non-israel and approve go to payment page
    //     this.isCreateAWBeneficiary = false;
    //     this.isPayCmarix = false;
    //     this.isReviewCmarix = false;
    //     this.scaShow = false;
    //   }
    // });

    // this.awBeneficiaryService.awVerificationAWBeneficiaryError.pipe(takeUntil(this.unSubScribe$)).subscribe(awVerificationError => {
    //   if (awVerificationError) {
    //     this.contactService.isNewBenificiaryconfirmClicked.next(false); // for non-israel and approve go to payment page
    //     this.isCreateAWBeneficiary = false;
    //     this.isPayCmarix = false;
    //     this.isReviewCmarix = false;
    //     this.isValidateAWError = awVerificationError
    //   }
    // });


  }

  ngAfterViewInit(): void {
    // if(this.transactions.get('reasonDesc')?.value) {
    //   this.reasonDesc = this.transactions.get('reasonDesc')?.value
    // }
  }

  allSubscriptions() {
    this.contactService.selectedPaymentReasonName.subscribe(res => {
      if (res) {
        this.selectedPaymentReasonName = res;
      }
    });
    this.contactService.currentObjectForFile.subscribe(res => {
      if (res) {
        this.saveBeneficiaryId = res?.['id'];
      }
    });
    this.contactService.getIlsBankBranchCode.subscribe(res => {
      if (res) {
        this.ilsScenarioBankName = res?.ilsBankNumberExist ?? '';
        this.ilsScenarioBranchName = res?.ilsBranchNumberExist ?? '';
      }
    });

    this.contactService.isBeneficiarySummaryInit.next(true);
  }

  prevStep() {
    this.movePreviousStep.emit();
  }

  ngOnChanges(): void {
    this.countryList = this.countryList;
    this.newBenificiaryBankDetails = this.newBenificiaryBankDetails;
  }


  displayBankDetailsSummary() {
     if(this.transactions?.get('reasonDesc')?.value) {
      this.reasonDesc = this.transactions.get('reasonDesc')?.value
    }
    this.isIsraelTransaction = this.newBenificiaryStep2?.value?.beneficiaryCountry === 'il'
      && this.newBenificiaryStep2?.value?.bankCountry === 'il'
      && this.newBenificiaryStep2?.value?.currency === 'ILS';

    this.bankDetailsArr = [
      {
        label: this.bankDetailsDataObj?.iban ? 'IBAN' : '',
        value: this.bankDetailsDataObj?.iban ?? ''
      },
      {
        label: this.bankDetailsDataObj?.swiftCode ? 'BIC / SWIFT' : '',
        value: this.bankDetailsDataObj?.swiftCode ?? ''
      },
      {
        label: this.bankDetailsDataObj?.bankName ? 'Bank name' : '',
        value: this.bankDetailsDataObj?.bankName ?? ''
      },
      // {
      //   label: !this.isIsraelTransaction && this.newBenificiaryStep2?.value?.bankCountry ? 'Beneficiary bank account country' : '',
      //   value: this.getSelectedBankAccCountryFlag(this.newBenificiaryStep2?.value?.bankCountry)
      // },
      {
        label: this.bankDetailsDataObj?.beneficiaryIdNumber && this.newBenificiaryStep2?.value?.beneficiaryAccountType == '1' ? 'Business ID' : this.bankDetailsDataObj?.beneficiaryIdNumber && this.newBenificiaryStep2?.value?.beneficiaryAccountType == '2' ? 'Beneficiary’s ID' : '',
        value: this.bankDetailsDataObj?.beneficiaryIdNumber ?? ''
      },
      {
        label: this.bankDetailsDataObj?.bankNumber ? 'Bank number' : '',
        value: this.bankDetailsDataObj?.bankNumber && (this.isIsraelTransaction || (this.newBenificiaryStep2?.value?.bankCountry == 'il' && this.newBenificiaryStep2?.value?.currency == 'ILS')) && this.ilsScenarioBankName ? this.bankDetailsDataObj?.bankNumber + ' ' + '-' + ' ' + this.ilsScenarioBankName : this.bankDetailsDataObj?.bankNumber ?? ''
      },
      {
        label: this.bankDetailsDataObj?.bankBranch ? 'Branch number' : '',
        value: this.bankDetailsDataObj?.bankBranch && (this.isIsraelTransaction || (this.newBenificiaryStep2?.value?.bankCountry == 'il' && this.newBenificiaryStep2?.value?.currency == 'ILS')) && this.ilsScenarioBranchName ? this.bankDetailsDataObj?.bankBranch + ' ' + '-' + ' ' + this.ilsScenarioBranchName : this.bankDetailsDataObj?.bankBranch ?? ''
      },
      {
        label: this.bankDetailsDataObj?.accountNumber ? 'Account number' : '',
        value: this.bankDetailsDataObj?.accountNumber ?? ''
      },
      {
        label: this.bankDetailsDataObj?.bankAccountHolderHebrewName && this.newBenificiaryStep2?.value?.beneficiaryAccountType == '1' ? 'Bank account holder name in Hebrew' : this.bankDetailsDataObj?.bankAccountHolderHebrewName && this.newBenificiaryStep2?.value?.beneficiaryAccountType == '2' ? 'Full beneficiary name in Hebrew' : '',
        value: this.bankDetailsDataObj?.bankAccountHolderHebrewName ?? ''
      },
      {
        label: this.isIsraelTransaction && this.bankDetailsDataObj?.bankAccountHolderName && this.newBenificiaryStep2?.value?.beneficiaryAccountType == '1' ? 'Bank account holder name in English' : this.isIsraelTransaction && this.bankDetailsDataObj?.bankAccountHolderName && this.newBenificiaryStep2?.value?.beneficiaryAccountType == '2' ? 'Full beneficiary name in English' : !this.isIsraelTransaction ? `Bank account holder’s name` : '',
        value: this.bankDetailsDataObj?.bankAccountHolderName ?? ''
      },
      {
        label: this.bankDetailsDataObj?.bankAccountHolderNickname ? 'Beneficiary’s nickname' : '',
        value: this.bankDetailsDataObj?.bankAccountHolderNickname ?? ''
      },
      {
        label: this.getRoutingCodeLabel(this.newBenificiaryBankDetails?.value?.routingCodeType),
        value: this.newBenificiaryBankDetails?.value?.routingCodeValue ?? ''
      },
      {
        label: this.bankDetailsDataObj?.bankAccountHolderEmail ? 'Beneficiary’s email address' : '',
        value: this.bankDetailsDataObj?.bankAccountHolderEmail ?? ''
      },
      // {
      //   label: !this.isIsraelTransaction && this.newBenificiaryStep2?.value?.beneficiaryCountry ? 'Beneficiary country' : '',
      //   value: this.getCountryName(this.newBenificiaryStep2?.value?.beneficiaryCountry)
      // },
      {
        label: this.newBenificiaryStep2?.value?.beneficiaryAccountType == '2' && this.bankDetailsDataObj?.firstName ? 'Beneficiary’s first name' : '',
        value: this.bankDetailsDataObj?.firstName ?? ''
      },
      {
        label: this.newBenificiaryStep2?.value?.beneficiaryAccountType == '2' && this.bankDetailsDataObj?.lastName ? 'Beneficiary’s last name' : '',
        value: this.bankDetailsDataObj?.lastName ?? ''
      },
      {
        label: this.bankDetailsDataObj?.beneficiaryState ? 'State / Province' : '',
        value: this.bankDetailsDataObj?.beneficiaryState ?? ''
      },
      {
        label: this.bankDetailsDataObj?.beneficiaryCity ? 'City' : '',
        value: this.bankDetailsDataObj?.beneficiaryCity ?? ''
      },
      {
        label: this.bankDetailsDataObj?.beneficiaryStreet ? 'Street' : '',
        value: this.bankDetailsDataObj?.beneficiaryStreet ?? ''
      },
      {
        label: this.bankDetailsDataObj?.beneficiaryHouseNumber ? 'House number' : '',
        value: this.bankDetailsDataObj?.beneficiaryHouseNumber ?? ''
      },
      {
        label: this.bankDetailsDataObj?.beneficiaryZipCode ? 'Zip code' : '',
        value: this.bankDetailsDataObj?.beneficiaryZipCode ?? ''
      }];

    this.bankDetailsArr = this.bankDetailsArr.filter((data: any) => data.label !== '');
  }

  getBeneficiartIdLabel(idNumber: any) {
    switch (idNumber) {
      case 1:
        return 'Business ID';
      case 2:
        return 'Beneficiary’s ID';
      default:
        return ''; // Default label if routingCodeType is not recognized
    }
  }

  getRoutingCodeLabel(routingCodeType: number) {
    switch (routingCodeType) {
      case 1:
        return 'BSB';
      case 2:
        return 'CNAPS';
      case 3:
        return 'IFSC';
      case 4:
        return 'CLABE';
      case 5:
        return 'Sort Code';
      case 6:
        return 'ABA';
      default:
        return ''; // Default label if routingCodeType is not recognized
    }
  }

  getSelectedBankAccCountryFlag(countryCode: any) {
    if (this.countryList && this.countryList.length !== 0) {
      const countryName = this.countryList.filter((data: any) => data.countryCode == countryCode)[0]?.['countryName'];
      return countryName;
    }
  }

  getCountryName(countryCode: string) {
    if (this.countryList && this.countryList.length !== 0) {
      return this.countryList.filter((data: any) => data.countryCode == countryCode)[0]?.['countryName'];
    }
  }

  navigateToScreen(index: number) {
    this.contactService.setNewBeniStepperIndexFromSummary(index);
    this.contactService.isBeneficiarySummaryInit.next(false);
  }

  displayBeneficiaryCountry(countryCode: any) {
    if (this.countryList && this.countryList.length !== 0) {
      const countryNameObj = this.countryList?.filter((data: any) => data.countryCode == countryCode);
      return countryNameObj?.[0]?.['countryName'];
    }
  }

  Confirm() {
    if (this.isNonIsraeliUser) {
      // this.createAWBeneficiary(); // create airwalex beneficiary
    } else {
      this.showLoader = true;
      const saveBeneficiaryRes = this.saveBeneficiaryPayload?.['saveBeneficiaryRes'];
      saveBeneficiaryRes['id'] = this.iseditBenificiary ? this.editBenificiaryObj?.id : '';
      saveBeneficiaryRes['bankName'] = this.bankDetailsDataObj.bankName;
      // this.contactService.addBenificieryAccount(saveBeneficiaryRes).subscribe((data: any) => {
        this.loading = false
        this.uploadFile.patchValue(this.uploadFile.value);
        this.uploadFileFormValues.emit(this.uploadFile.value);
        this.isPayCmarix = true;

        // this.callUploadFileApi(data['body']);
      // }, (err: any) => {
      //   this.showLoader = false;
      //   this.errMsg = err.error.apiErrorMessage
      // })
    }
  }

  createFileObject(fileName: string, docType: string): File {
    return new File(
      [new Blob([])],
      fileName,
      {
        type: docType,
        lastModified: Date.now()
      }
    );
  }

  callUploadFileApi(saveBeneficiaryid: any) {
    const fileArrayControl = this.uploadFile.get('file') as FormArray;
    const fileValues = fileArrayControl.value;
    if (fileValues && fileValues.length !== 0) {
      fileValues.forEach((formFileData: any) => {
        this.saveBeneficiaryPayload?.fileArray.forEach((fileArrdata: any, index: number) => {
          if (formFileData?.fileName && formFileData?.fileName == fileArrdata?.name) {
            let formData = new FormData();
            formData.append("files", fileArrdata);
            // this.contactService.uploadBeneficiaryFile(saveBeneficiaryid, formFileData?.docType, formData).subscribe({
            //   next: (data: any) => {
            //     if (!this.isApiCalled && !this.isUploadError) {
            //       setTimeout(() => {
            //         this.getBeneficiaryAndSendEmail(saveBeneficiaryid);
            //       }, 5000);
            //       this.isApiCalled = true; // Set the flag to true so it won't be called again
            //     }
            //   },
            //   error: (err) => {
            //     this.showLoader = false;
            //     if (err.error.apiErrorMessage[0] === 'No files were loaded') {
            //       this.errMsg = this.translateService.instant('FORMS_ERRORS.FileDoesntUpload');
            //     } else {
            //       this.errMsg = err.error.apiErrorMessage[0]
            //       this.isUploadError = true;
            //     }
            //   }
            // });
          }
        })
      });
    } else {
      // If file is not change during edit beneficiary
      setTimeout(() => {
        this.getBeneficiaryAndSendEmail(saveBeneficiaryid);
      }, 5000);
    }
  }

  getBeneficiaryAndSendEmail(saveBeneficiaryid: string) {
    // this.contactService.getBeneficiaryById(saveBeneficiaryid).pipe(
    //   tap(result => {
    //     this.contactService.isNewBenificiaryconfirmClicked.next(true);
    //     if (result['status'] === 2) {
    //       this.isPayCmarix = true;
    //       this.isReviewCmarix = false;
    //     } else {
    //       this.isPayCmarix = true;
    //       this.isReviewCmarix = true;
    //       this.showLoader = false;
    //     }
    //     this.sendMail(saveBeneficiaryid);
    //   })
    // ).subscribe(res => {
    // }, error => {
    //   this.showLoader = false;
    //   this.errMsg = error?.error?.apiErrorMessage?.[0];
    // });
  }

  sendMail(saveBeneficiaryid: any) {
    // this.contactService.changeBeneficiaryStatus(saveBeneficiaryid, true).subscribe((data: any) => {
    //   this.contactService.getAllBeneficieryByAccount().subscribe(() => {
    //     this.showLoader = false;
    //     this.stepChanged.emit();
    //   });
    // }, err => {
    //   this.showLoader = false;
    //   this.errMsg = err?.error?.apiErrorMessage[0];
    // });
  }

  reviewCmarix() {
    this.contactService.closeAllDialog();
    this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + 'Payments' : 'Payments']);
    if (this.isNonIsraeliUser) {
      this.contactService.createSinglePaymentFromBeneficiaryStep6(this.awReviewPayPayload.beneficiary.bank_details);
    } else {
      this.contactService.createSinglePaymentFromBeneficiaryStep6(this.newBenificiaryBankDetails?.value);
    }

  }

  navigateToContactPage() {
    if (!this.router?.url.includes('/contacts')) {
      this.router.navigate(['/contacts']);
    }
    this.contactService.isRedirectToPayerList.next(false);
    // this.commonService.closeDrawer();
    this.contactService.closeAllDialog();
    this.contactService.isBeneficiarySummaryInit.next(false);
    localStorage.removeItem('step6AddNewBeneficiary');
    localStorage.removeItem('resetNewBeneficiaryForm');
  }

  createNewBenificiary() {
    this.contactService.isNewBenificiaryconfirmClicked.next(false);
    this.contactService.isBeneficiarySummaryInit.next(false);
    localStorage.setItem('isStep1BenefiExist', 'true');
    localStorage.setItem('step6AddNewBeneficiary', JSON.stringify(true));
    localStorage.setItem('resetNewBeneficiaryForm', JSON.stringify(true));
    localStorage.removeItem('newBeneficiaryId');
    localStorage.removeItem('editBeneficiary');
    this.contactService.isCreateBeneficiaryFromLastStep.next(true);
    this.contactService.setBeneficiaryDataForEdit({})
    if (!this.isNonIsraeliUser) {
      this.movePreviousStep.emit();
    } else {
      this.contactService.setNewBeniStepperIndexFromSummary(1);
      // this.awBeneficiaryService.resetawCounter.next(true);
    }
  }

  isHebrew(text: string = ''): boolean {
    const hebrewPattern = /[\u0590-\u05FF]/;
    return hebrewPattern.test(text);
  }


  copyDetailsToClipboard() {
    const data = [
      ['Beneficiary Type', this.newBenificiaryStep2?.value?.beneficiaryAccountType == '1' ? 'Business' : 'Individual'],
      [`Beneficiary’s country`, this.displayBeneficiaryCountry(this.newBenificiaryStep2?.value?.beneficiaryCountry) ?? '--'],
      [`Beneficiary's bank account's country`, this.displayBeneficiaryCountry(this.newBenificiaryStep2?.value?.bankCountry) ?? '--'],
      ['Currency', this.newBenificiaryStep2?.value?.currency ?? '--'],
      ['Transfer Reason', this.selectedPaymentReasonName ?? '--']
    ]
    // dynamic fields from bank details page
    if (this.bankDetailsArr && this.bankDetailsArr?.length > 0) {
      for (let index = 0; index < this.bankDetailsArr.length; index++) {
        data.push([this.bankDetailsArr[index]?.label, this.bankDetailsArr[index]?.value]);
      }
    }
    // Add bold formatting for keys and extra tab space for values in HTML
    // const htmlData = data
    //   .map(([key, value]) => `<b>${key}:</b>&emsp;&emsp;${value}`) // &emsp; adds a tab-like space
    //   .join('<br>');

    const htmlData = data
      .map(([key, value]) => {
        const isBankField =
          (key === 'Bank number' || key === 'Branch number') &&
          ((this.bankDetailsDataObj?.bankNumber && (this.isIsraelTransaction || (this.newBenificiaryStep2?.value?.bankCountry == 'il' && this.newBenificiaryStep2?.value?.currency == 'ILS')) && this.ilsScenarioBankName) ||
            (this.bankDetailsDataObj?.bankBranch && (this.isIsraelTransaction || (this.newBenificiaryStep2?.value?.bankCountry == 'il' && this.newBenificiaryStep2?.value?.currency == 'ILS')) && this.ilsScenarioBranchName));

        const directionStyle = (isBankField || (this.newBenificiaryStep2?.value?.bankCountry == 'il' && this.newBenificiaryStep2?.value?.currency == 'ILS')) ? 'direction: rtl; text-align: left;' : '';
        if (key === 'Bank number' || key === 'Branch number') {
          if (/[\u0590-\u05FF]/.test(value)) {
            return `<div style="${directionStyle}"><b>${value}&emsp;&emsp;:</b>${key}</div>`;
          }
          else {
            return `<b>${key}:</b>&emsp;&emsp;${value.split('-')[1]} - ${value.split('-')[0]}`;
          }
        } else {
          return `<b>${key}:</b>&emsp;&emsp;${value}`;
        }
      })
      .join('<br>');

    // Add an extra tab space for plain text
    const plainTextData = data
      .map(([key, value]) => `${key}:\t\t${value}`) // \t\t adds an extra tab space
      .join('\n');

    // Use Clipboard API to copy formatted data
    navigator.clipboard
      .write([
        new ClipboardItem({
          'text/html': new Blob([htmlData], { type: 'text/html' }),
          'text/plain': new Blob([plainTextData], { type: 'text/plain' }),
        }),
      ])
      .then(() => {
        this.copytooltip?.open(); // Show tooltip on success
        setTimeout(() => this.copytooltip?.close(), 3000); // Hide after 2 seconds
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  createAWBeneficiary() {
    const selectedPaymentReason = this.transactions.get('paymentReason')?.value;
    this.awReviewPayPayload['transfer_reason'] = selectedPaymentReason;

    this.showLoader = true;
    if (this.editBenificiaryObj) {
      // this.awBeneficiaryService.updateAWBeneficiary(this.editBenificiaryObj.id, this.awReviewPayPayload).subscribe(
      //   (response: any) => {
      //     this.isAWCreateUpdateBeneficiaryStatus(response);
      //   },
      //   (error: any) => {
      //     this.showLoader = false;
      //     this.displayAWErrorMessage(error?.error?.apiErrorMessages || error.error.apiErrorMessage);
      //     this.isCreateAWBeneficiary = false;
      //   }
      // );
    } else {
      this.showLoader = true;
      
      
      // this.awBeneficiaryService.createAWBeneficiary(this.awReviewPayPayload).subscribe(
      //   (response: any) => {
      //     this.isAWCreateUpdateBeneficiaryStatus(response);
      //   },
      //   (error: any) => {
      //     this.showLoader = false;
      //     this.displayAWErrorMessage(error?.error?.apiErrorMessages || error.error.apiErrorMessage);
      //     this.isCreateAWBeneficiary = false;
      //   }
      // );
    }
  }

  isAWCreateUpdateBeneficiaryStatus(response: any) {
    this.isValidateAWError = '';
    this.showLoader = false;
    if (response?.body?.status == "Approved") {
      this.contactService.isNewBenificiaryconfirmClicked.next(true); // for non-israel and approve go to payment page
      this.isCreateAWBeneficiary = true;
      this.isPayCmarix = true; // for hide other data and show only pay popup
    }
    else {
      this.scaRef = response?.body?.refId;
      this.scaShow = true;
    }
  }

  displayAWErrorMessage(errorDetails: any) {
    const errorCode = errorDetails['code'];
    switch (errorCode) {
      case 'beneficiary_type_unsupported':
      case 'transfer_currency_unsupported':
      case 'unsupported_country_code':
      case 'unsupported_currency':
        this.isValidateAWError = `${this.newBenificiaryStep2.value.currency} transfers to recipients in ${this.newBenificiaryStep2.value.bankCountry} are not available. Select another currency or another country/region that you transfer to.`;
        break;

      case 'field_required':
      case 'invalid_argument':
      case 'validation_failed':
        const errors = errorDetails['details']?.['errors'];
        if (errors && errors.length !== 0) {
          const formattedSources = errors
            .map((error: any) => {
              const sourceKey = error.source.split('.').pop();
              return sourceKey
                .split('_')
                .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            })
            .join(', ');
          this.isValidateAWError = `Please enter a valid ${formattedSources.charAt(0).toUpperCase() + formattedSources.slice(1)}`;
          const beneficiaryCountry = this.newBenificiaryStep2Values?.beneficiaryCountry;
          const bankCountry = this.newBenificiaryStep2Values?.bankCountry;
          const currency = this.newBenificiaryStep2Values?.currency;
          if (beneficiaryCountry == 'ca' && bankCountry == 'ca' && currency == 'CAD' && this.isValidateAWError.includes("Local Clearing System")) {
            this.isValidateAWError = this.isValidateAWError.replace("Local Clearing System", "Institution and Transit numbers");
          }
        } else {
          this.isValidateAWError = errorDetails.message;
        }
        break;

      case 'already_exists':
        this.isValidateAWError = `Beneficiary already exists`;
        break;

      case 'service_unavailable':
      case 'too_many_requests':
        this.isValidateAWError = `Service is temporarily unavailable. Please try again later or contact support`;
        break;
      default:
        this.isValidateAWError = errorDetails?.[0] || errorDetails?.message;
        break;
    }
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next(true);
    this.unSubScribe$.complete();
  }

}
