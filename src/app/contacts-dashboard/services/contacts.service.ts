import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { BenificiaryModel } from '../models/BenificiaryModel';
// import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getBankNumberList, getBranchNumberList, user } from '../components/contacts-data/userData';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private beneficiaryObjectFromInvoice = new BehaviorSubject<any>({});
  currentInvoiceObject = this.beneficiaryObjectFromInvoice.asObservable();
  private beneficiaryObjectForFile = new BehaviorSubject<any>({});
  currentObjectForFile = this.beneficiaryObjectForFile.asObservable();
  private getBeneficiaryData = new BehaviorSubject<any>({});
  getBeneficiaryDataForEdit = this.getBeneficiaryData.asObservable();
  private beneficiaryList = new BehaviorSubject(<BenificiaryModel[]>{});
  availableBeneficiary = this.beneficiaryList.asObservable();

  private ERPbeneficiaryList = new BehaviorSubject(<BenificiaryModel[]>{});
  availableErpBeneficiary = this.ERPbeneficiaryList.asObservable();

  private paymentReasons = new BehaviorSubject<any>({});
  fetchPaymentReasons = this.paymentReasons.asObservable();

  backFromNewBenificiary = new BehaviorSubject<boolean>(false);
  isUploadDocClickedFromNewBeniStep1 = new BehaviorSubject<boolean>(false);
  isUploadDocNewBenFileExist = new BehaviorSubject<boolean>(false);
  isEditNewBenificiary = new BehaviorSubject<boolean>(false);
  isUploadFileScreenNotExist = new BehaviorSubject<boolean>(false);
  isNewBenificiaryconfirmClicked = new BehaviorSubject<boolean>(false);
  isNewPayerconfirmClicked = new BehaviorSubject<boolean>(false);
  isNewPayerSummaryPage = new BehaviorSubject<boolean>(false);
  isBeneficiarySummaryInit = new BehaviorSubject<boolean>(false);
  resetNewBenificiaryForm = new BehaviorSubject<boolean>(false);
  isInvoiceUploadedFromFirstStep = new BehaviorSubject<boolean>(false);
  selectedPaymentReasonName = new BehaviorSubject<string>('');
  //createSinglePaymentFromStep6 = new BehaviorSubject<any>({});
  usUploadFileFromGeneralDetails = new BehaviorSubject<boolean>(false);
  beneficiaryCountryChange = new BehaviorSubject<boolean>(false);
  isPaymentReasonChanged = new BehaviorSubject<boolean>(false);
  clearPaymentReason = new BehaviorSubject<boolean>(false);
  isRedirectToPayerList = new BehaviorSubject<boolean>(false);
  isCreateBeneficiaryFromLastStep = new BehaviorSubject<boolean>(false);
  isBeneficiaryDeleted = new BehaviorSubject<Boolean>(false);
  isPayerDeleted = new BehaviorSubject<Boolean>(false);
  userData = user;

  private createSinglePaymentFromStep6 = new BehaviorSubject<any>(null);
  createSinglePaymentFromBeneficiary = this.createSinglePaymentFromStep6.asObservable();
 
  private setBankDetailsDynamicFieldRes = new BehaviorSubject<any>({});
  getBankDetailsDynamicFieldRes = this.setBankDetailsDynamicFieldRes.asObservable();

  private setBankDetailsDynamicFieldPatternsRes = new BehaviorSubject<any>({});
  getBankDetailsDynamicFieldPatternsRes = this.setBankDetailsDynamicFieldPatternsRes.asObservable();

  private setStateAndCityRes = new BehaviorSubject<any>({});
  getStateAndCityRes = this.setStateAndCityRes.asObservable();

  private newBenificiarySelectedStepperIndex = new BehaviorSubject<any>({});
  getnewBenificiarySelectedStepperIndex = this.newBenificiarySelectedStepperIndex.asObservable();

  public newBenificiarySelectedStepperIndexfromSummary = new BehaviorSubject<any>({});
  getnewBenificiarySelectedStepperIndexFromSummary = this.newBenificiarySelectedStepperIndexfromSummary.asObservable();

  private newPayerSelectedStepperIndex = new BehaviorSubject<any>({});
  getnewPayerSelectedStepperIndex = this.newPayerSelectedStepperIndex.asObservable();

  private newPayerSelectedStepperIndexfromSummary = new BehaviorSubject<any>({});
  getnewPayerSelectedStepperIndexFromSummary = this.newPayerSelectedStepperIndexfromSummary.asObservable();

  private setDynamicBankDetailsControls = new BehaviorSubject<any>([]);
  getDynamicBankDetailsControls = this.setDynamicBankDetailsControls.asObservable();

  private bankDetailssummaryControls = new BehaviorSubject<any>([]);
  getBankDetailssummaryControls = this.bankDetailssummaryControls.asObservable();

  private setIlsBankBranchCode = new BehaviorSubject<any>({});
  getIlsBankBranchCode = this.setIlsBankBranchCode.asObservable();

  private setBeneficiaryBankRequirementFromStep2 = new BehaviorSubject<any>({});
  getBeneficiaryBankRequirementFromStep2 = this.setBeneficiaryBankRequirementFromStep2.asObservable();

  constructor(private readonly dialog: MatDialog) { }

  createSinglePaymentFromBeneficiaryStep6(data: any) {
    this.createSinglePaymentFromStep6.next(data);
  }

  setERPbeneficiaryList(message: any) {
    this.ERPbeneficiaryList.next(message)
  }

  setBeneficiaryObject(message: any) {
    this.beneficiaryObjectFromInvoice.next(message)
  }

  setPaymentReason(message: any) {
    this.paymentReasons.next(message);
  }
  setBeneficiaryFileObject(message: any) {
    this.beneficiaryObjectForFile.next(message)
  }

  setBeneficiaryDataForEdit(data: any) {
    this.getBeneficiaryData.next(data)
  }

  isNonIsraelUser() {
    const user = this.userData;
    return user.afiiliate.country !== 'il';
  }

  // getBeneficiaryById(id: string) {
  //   return this.dataService.getRequest<BenificiaryModel>(ApiMap.getBeneficiary.url + '?id=' + id);
  // }

  // getAllBeneficieryByAccount() {
  //   this.beneficiaryList.next(<BenificiaryModel[]>{});
  //   return this.dataService.getRequest<BenificiaryModel[]>(ApiMap.contacts.url).pipe(
  //     tap(beneficiary => {
  //       beneficiary?.sort(function (a: any, b: any) { return a.bankAccountHolderName.localeCompare(b.bankAccountHolderName) })
  //       this.beneficiaryList.next(beneficiary);
  //     })
  //   );
  // }

  // getOwnAccountBeneficieries(filterObj: any): Observable<BenificiaryModel[]> {
  //   return this.dataService.getRequest<BenificiaryModel[]>(ApiMap.contacts.url).pipe(
  //     map((result: BenificiaryModel[]) => {
  //       if (!result) return [];
  //       const filteredResult = (() => {
  //         if (filterObj?.currency) {
  //           return result.filter(val => val.ownAccount == 1 && val.currency === filterObj?.currency);
  //         } else if (filterObj?.bankCountry) {
  //           return result.filter(val => val.ownAccount == 1 && val.bankCountry === filterObj?.bankCountry);
  //         } else {
  //           return result.filter(val => val.ownAccount == 1);
  //         }
  //       })();
  //       return filteredResult;
  //     })
  //   );
  // }

  // addBenificieryAccount(benificiaryData: any) {
  //   let body = benificiaryData
  //   return this.dataService.request<{ result: any }>(ApiMap.addBenificiery.clone({ body })).pipe(
  //     tap(result => {
  //       this.getAllBeneficieryByAccount().subscribe();
  //       this.getImportedSuppliers().subscribe((data: any) => {
  //         this.ERPbeneficiaryList.next(data)
  //       })
  //     }))
  // }

  // isBenificieryExist(benificiaryData: any) {
  //   let body = benificiaryData
  //   return this.dataService.request<{ result: any }>(ApiMap.isBeneficiaryExist.clone({ body })).pipe(
  //     tap(result => {
  //       this.getAllBeneficieryByAccount().subscribe();
  //       this.getImportedSuppliers().subscribe((data: any) => {
  //         this.ERPbeneficiaryList.next(data)
  //       })
  //     }))
  // }


  // addInvoice(invoiceData: any) {
  //   let body = invoiceData
  //   return this.dataService.request<{ result: any }>(ApiMap.addInvoice.clone({ body, reportProgress: true }));
  // }

  // ibanDetails(id: string) {
  //   let params: any = {
  //     'IbanNumber': id,
  //     'SwiftCode': ''
  //   }
  //   return this.dataService.postWithQueryParams<{ result: any }>(ApiMap.ibanDetails.url, params)
  // };

  // bicSwiftDetails(id: string) {
  //   let params: any = {
  //     'SwiftCode': id,
  //     'IbanNumber': ''
  //   }
  //   return this.dataService.postWithQueryParams<{ result: boolean }>(ApiMap.bicSwiftDetails.url, params)
  // };

  // isBeneficiaryIDExist(beneficiaryId: any, idNumber: string) {
  //   const params = new URLSearchParams();
  //   params.set('beneficiaryId', beneficiaryId);
  //   params.set('idNumber', idNumber);
  //   return this.dataService.getRequest<{ result: boolean }>(ApiMap.isBeneficiaryIDExist.url + '?' + params)
  // };

  // changeBeneficiaryStatus(beneficiaryId: any, sendEmail: any) {
  //   const params = new URLSearchParams();
  //   params.set('beneficiaryId', beneficiaryId);
  //   params.set('sendEmail', sendEmail);
  //   return this.dataService.postRequest<{ result: boolean }>(ApiMap.changeBeneficiaryStatus.url + '?' + params)

  // }
  // getPaymentReasons() {
  //   return this.dataService.getRequest<{ result: any }>(ApiMap.getPayementReasons.url);
  // }

  // getAllActiveCurrencies() {
  //   return this.dataService.getRequest<{ result: any }>(ApiMap.getActiveCurrencies.url);
  // }

  // GetAllCurrenciesForPayment() {
  //   return this.dataService.getRequest<{ result: any }>(ApiMap.GetAllCurrenciesForPayment.url);
  // }

  // uploadBeneficiaryFile(id: string, type: any, body: any) {
  //   let params = new HttpParams();
  //   // const params = new URLSearchParams();
  //   params.set('beneficiaryId', id);
  //   params.set('documentType', type);
  //   return this.dataService.request<{ result: any }>(ApiMap.uploadBeneficiaryFile.clone({ body, reportProgress: true, setParams: { beneficiaryId: id, documentType: type } }))
  // };

  // deleteBenificiary(id: string) {
  //   const params = {
  //     'id': id
  //   }
  //   return this.dataService.postWithQueryParams<{ result: boolean }>(ApiMap.deleteBenificiery.url, '', params).pipe(
  //     tap(result => {
  //       this.getAllBeneficieryByAccount().subscribe();
  //     })
  //   )
  // };
  // createSession() {
  //   return this.dataService.postRequest<{ result: boolean }>(ApiMap.createSession.url)
  // }


  // importErpBeneficiaries() {
  //   return this.dataService.postRequest<{ result: boolean }>(ApiMap.importErpBeneficiaries.url)
  // }

  // getImportedSuppliers() {
  //   return this.dataService.getRequest<{ result: boolean }>(ApiMap.getImportedSuppliers.url)
  // }
  // updateVisibility(visibilityData: any) {
  //   let body = visibilityData
  //   return this.dataService.request<{ result: any }>(ApiMap.updateVisibility.clone({ body })).pipe(
  //     tap((beneficiary: any) => {
  //       this.getImportedSuppliers().subscribe((data: any) => {
  //         this.ERPbeneficiaryList.next(data)
  //       })

  //     }))
  // }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: "confirm-dialog-close-popup"
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dialog.closeAll();
      } else {
        console.log('Cancelled!');
      }
    });
  }

  setNewBeniStepperIndex(stepperIndex: number) {
    this.newBenificiarySelectedStepperIndex.next(stepperIndex);
  }

  setNewBeniStepperIndexFromSummary(stepperIndex: number) {
    this.newBenificiarySelectedStepperIndexfromSummary.next(stepperIndex);
  }

  setNewPayerStepperIndex(stepperIndex: number) {
    this.newPayerSelectedStepperIndex.next(stepperIndex);
  }

  setNewPayerStepperIndexFromSummary(stepperIndex: number) {
    this.newPayerSelectedStepperIndexfromSummary.next(stepperIndex);
  }

  setIlsBankBranchCodeData(ilsBankBranchData: any) {
    this.setIlsBankBranchCode.next(ilsBankBranchData);
  }

  setBeneficiaryBankRequirementData(beneficiaryData: any) {
    this.setBeneficiaryBankRequirementFromStep2.next(beneficiaryData);
  }


  closeAllDialog() {
    this.setNewBeniStepperIndexFromSummary(0);
    this.dialog.closeAll();
    localStorage.removeItem('editBenificiary');
    localStorage.removeItem('payerDocType');
    localStorage.removeItem('newBeneficiaryId');
    localStorage.removeItem('newPayerId');
    this.isNewBenificiaryconfirmClicked.next(false);
    this.isNewPayerconfirmClicked.next(false);
  }

  // BeneficiaryBankAccountDetails(id: string) {
  //   let params: any = {
  //     'IbanNumber': id,
  //     'SwiftCode': ''
  //   }
  //   return this.dataService.postWithQueryParams<{ result: any }>(ApiMap.ibanDetails.url, params)
  // };

  // GetBeneficiaryBankRequirements(BeneficiaryBankAccountDetailsObj: any) {
  //   const params = new URLSearchParams();
  //   params.set('BankAccountCountry', BeneficiaryBankAccountDetailsObj?.BankAccountCountry?.toUpperCase());
  //   params.set('Currency', BeneficiaryBankAccountDetailsObj?.Currency);
  //   params.set('BeneficiaryAccountType', BeneficiaryBankAccountDetailsObj?.BeneficiaryAccountType);
  //   return this.dataService.getRequest<{ result: boolean }>(ApiMap.beneficiaryBankRequirements.url + '?' + params)
  // };

  setBankDetailsDynamicFields(bankDetailsFields: any) {
    this.setBankDetailsDynamicFieldRes.next(bankDetailsFields)
  }

  setBankDetailsControls(bankDetailsControlsNames: any) {
    this.setDynamicBankDetailsControls.next(bankDetailsControlsNames)
  }

  setBankDetailsSummaryControls(bankDetailsControlsNames: any) {
    this.bankDetailssummaryControls.next(bankDetailsControlsNames)
  }

  setBankDetailsDynamicFieldsPatterns(patternObj: any) {
    this.setBankDetailsDynamicFieldPatternsRes.next(patternObj)
  }

  setStateAndCityBankDetailspage(stateCityRes: any) {
    this.setStateAndCityRes.next(stateCityRes)
  }

  getBankNumberList() {
    return of(getBankNumberList);
  }

  getBranchNumberList(bank_Code: string) {
    return of(getBranchNumberList)
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

  restrictNameOnPaste(event: ClipboardEvent, type: string) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');

    let sanitizedText = '';

    if (type === 'letters') {
      sanitizedText = pastedText
        .replace(/^\s+/, '') // Remove leading spaces
        .replace(/\s{2,}/g, ' ') // Replace consecutive spaces
        .replace(/[^a-zA-Z\s]/g, '') // Allow only letters and spaces
        .trim(); // Remove trailing spaces
    } else {
      sanitizedText = pastedText
        .replace(/^\s+/, '') // Remove leading spaces
        .replace(/\s{2,}/g, ' ') // Replace consecutive spaces
        .replace(/[^a-zA-Z0-9\s]/g, '') // Allow letters, numbers, and spaces
        .trim(); // Remove trailing spaces
    }

    event.preventDefault();

    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    // Combine the existing value and sanitized pasted text
    let combinedValue =
      currentValue.substring(0, inputElement.selectionStart || 0) +
      sanitizedText +
      currentValue.substring(inputElement.selectionEnd || 0);

    combinedValue = combinedValue
      .replace(/^\s+/, '') // Remove leading spaces
      .replace(/\s{2,}/g, ' ') // Replace consecutive spaces
      .replace(/[^a-zA-Z0-9\s]/g, '') // Ensure only valid characters
      .trim(); // Remove trailing spaces

    // Update the input field's value
    inputElement.value = combinedValue;

    // **Trigger the native input event**
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    inputElement.dispatchEvent(inputEvent); // Simulate the input event
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
  // EmbeddedSca_clientId(){
  //   return environment.EmbeddedKYCAWClientId;
  // }
  // EmbeddedSca_Env(){
  //     return environment.EmbeddedKYCAWEnv;
  // }

}

