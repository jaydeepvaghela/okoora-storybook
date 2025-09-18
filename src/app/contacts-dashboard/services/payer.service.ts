import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { PayersModel } from '../models/PayersModel';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaxHavenCountryCodes } from '../../main-dashboard/dashboard-data/all-currency-data';

@Injectable({
  providedIn: 'root'
})
export class PayerService {
  private payersList = new BehaviorSubject(<PayersModel[]>{});
  availablePayers = this.payersList.asObservable();
  private payerIDForFile = new BehaviorSubject<any>({});
  currentpayerIDForFile = this.payerIDForFile.asObservable();

  private payerdetailForEdit = new BehaviorSubject<any>({});
  currentPayerdetailForEdit = this.payerdetailForEdit.asObservable();

  private payerObject = new BehaviorSubject<any>({});
  currentpayerObject = this.payerObject.asObservable();
  private paymentReasonSubject = new BehaviorSubject<number | null>(null);

  private payerObjectForFile = new BehaviorSubject<any>({});
  getPayerObjectForFile = this.payerObjectForFile.asObservable();

  isMoveToSummaryPage = new BehaviorSubject<boolean>(false);

  public selectedPayerIndex = new BehaviorSubject<number>(-1);

  isSameCurrencySummaryPageSubject = new BehaviorSubject<boolean>(false);
  sameCurrencySummaryPage = this.isSameCurrencySummaryPageSubject.asObservable();


  // Set the payer information from step2
  private payerObjectFinalSaveSubject = new BehaviorSubject<any>({});
  getPayerObjectFinalSave = this.payerObjectFinalSaveSubject.asObservable();

  isPopulatePayerProfileCurrency = new BehaviorSubject<string>('');

  constructor() { }

  setPayerID(message: any) {
    this.payerIDForFile.next(message)
  }
  setPayerObject(message: any) {
    this.payerObject.next(message)
  }
  setPayerDetailForEdit(message: any) {
    this.payerdetailForEdit.next(message)
  }

  getAllPayers() {
    // this.payersList.next(<PayersModel[]>{});
    // return this._dataService.getRequest<PayersModel[]>(ApiMap.getPayers.url).pipe(
    //   tap(payers => {
    //     this.payersList.next(payers);
    //   })
    // );
  }

  addPayer(isComplete: any, body: any) {
    const params = new URLSearchParams();
    params.set('isComplete', isComplete);
    // return this._dataService.request<{ result: any }>(ApiMap.addPayer.clone({ body, reportProgress: true, setParams: { isComplete: isComplete } })).pipe(
    //   tap(payers => {
    //     this.getAllPayers().subscribe()
    //   })
    // );

  }
  uploadPayerFile(id: string, type: any, body: any) {
    let params = new HttpParams();
    // return this._dataService.request<{ result: any }>(ApiMap.uploadPayerFile.clone({ body, reportProgress: true, setParams: { payerid: id, documentType: type } }))
  };

  calculateIban(body: any) {
    let params = new HttpParams();
    // return this._dataService.request<{ result: any }>(ApiMap.calculateIban.clone({ body, reportProgress: true }))
  };

  saveBeneficiaryAsMyAccount(body: any) {
    let params = new HttpParams();
    // return this._dataService.request<{ result: any }>(ApiMap.saveBeneficiaryAsMyAccount.clone({ body, reportProgress: true }))
  };



  deletePayer(id: string) {
    const params = {
      'payerid': id
    }
    // return this._dataService.postWithQueryParams<{ result: boolean }>(ApiMap.deletePayer.url, '', params).pipe(
    //   tap(result => {
    //     this.getAllPayers().subscribe();
    //   })
    // );
  }

  needsPartialPayerDetails() {
    // return this._dataService.getRequest<{ result: any }>(ApiMap.needsPartialPayerDetails.url);
  }

  identifyTaxHavenCountry(country: string): Observable<boolean> {
    const isTaxHaven = TaxHavenCountryCodes.includes(country.toLowerCase());
    return of(isTaxHaven);
  }

  setPaymentReason(reason: number): void {
    this.paymentReasonSubject.next(reason);
  }

  getPaymentReason() {
    return this.paymentReasonSubject.asObservable();
  }

  getPaymentReasonValue(): number | null {
    return this.paymentReasonSubject.value;
  }

  applyValidatorsIfEmpty(form: FormGroup, controlNames: string[]): void {
    controlNames.forEach(controlName => {
      const control = form.get(controlName);
      if (control && !control.value) {
        control.setValidators([Validators.required]);
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  clearValidatorsForControls(form: FormGroup, controlNames: string[]): void {
    controlNames.forEach(controlName => {
      const control = form.get(controlName);
      if (control) {
        control.reset();
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });
  }

  removeControls(form: FormGroup, controlNames: string[]): void {
    controlNames.forEach(controlName => {
      if (form.contains(controlName)) {
        form.removeControl(controlName);
      }
    });
  }

  addControls(form: FormGroup, controlNames: string[]): void {
    controlNames.forEach(controlName => {
      if (!form.contains(controlName)) {
        form.addControl(controlName, new FormControl('', Validators.required));
      }
    });
  }

  setpayerObjectForFile(message: any) {
    this.payerObjectForFile.next(message)
  }

  // setpayerObjectFinalSave(data: any) {
  //   this.payerObjectFinalSaveSubject.next(data);
  // }

  setpayerObjectFinalSave(newData: any) {
    if (JSON.stringify(newData) !== JSON.stringify(this.payerObjectFinalSaveSubject.value)) {
      this.payerObjectFinalSaveSubject.next(newData);
    }
  }

  setPayerIndex(payerIndex: number) {
    this.selectedPayerIndex.next(payerIndex);
  }
}
