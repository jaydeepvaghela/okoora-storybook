import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { CountriesData } from 'src/app/activate-account/models/general';
import { DataService } from 'src/app/core/services/data.service';
import { ActiveCurrencyModel } from 'src/app/shared/models/ActiveCurrencyModel';
import { ApiMap } from '../api.map';
import { BalanceByCurrencyResposeModel } from '../models/BalanceByCurrencyResposeModel';
import { FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  allCountries$ = new BehaviorSubject<CountriesData[]>([]);
  private maxSelectableDateSubject = new BehaviorSubject<Date | null>(null);
  private triggerHeaderMethodSource = new Subject<void>();
  triggerHeaderMethod$ = this.triggerHeaderMethodSource.asObservable();

  private setErpFlagsFromClientProfile = new BehaviorSubject<any>(null);
  public getErpFlagsFromClientProfile$ = this.setErpFlagsFromClientProfile.asObservable();


  private setSourceAccountList = new BehaviorSubject<any>([]);
  getSourceAccountList$ = this.setSourceAccountList.asObservable();
  drawerRef: MatDrawer;

  constructor(
    private dataService: DataService,
    private ngZone: NgZone
  ) { }

   setERPFlagsFromClientProfile(data: any) {
    this.setErpFlagsFromClientProfile.next(data)
  }

  getAllActiveCurrency() {
    return this.dataService.getRequest<ActiveCurrencyModel[]>(ApiMap.getActiveCurrencies.url).pipe(
      map((data: any) => {
        // var user = JSON.parse(localStorage.getItem('user') || '{}');
        // if (user?.afiiliate?.currency == 'EUR') {
        //   let index = data.findIndex((i: any) => i?.currency?.code === 'ILS');
        //   if (index > -1) {
        //     data.splice(index, 1);
        //   }
        // }
        return data;
      }));
  }

  GetCurrenciesNotInWallet() {
    return this.dataService.getRequest<ActiveCurrencyModel[]>(ApiMap.GetCurrenciesNotInWallet.url).pipe(
      map((data: any) => {
        // var user = JSON.parse(localStorage.getItem('user') || '{}');
        // if (user?.afiiliate?.currency == 'EUR') {
        //   let index = data.findIndex((i: any) => i?.wallet_Currency?.code === 'ILS');
        //   if (index > -1) {
        //     data.splice(index, 1);
        //   }
        // }
        return data;
      }))
  }

  beneficiariesWithOwnAccount() {
    return this.dataService.getRequest<any>(ApiMap.beneficiariesWithOwnAccount.url);
  }

  getCountries() {
    return this.dataService.getRequest<{ result: any }>(ApiMap.getCountries.url);
  }
  getWhiteLabelList() {
    return this.dataService.getRequest<{ result: any }>(ApiMap.getWhiteLabelList.url);
  }

  setSourceAccountListData(data: any) {
    this.setSourceAccountList.next(data);
  }

  geStateList(iso2: string) {
    const params = new URLSearchParams();
    params.set('iso2', iso2);
    return this.dataService.getRequest<BalanceByCurrencyResposeModel>(ApiMap.getStates.url + '?' + params);
  }

  getCityList(country: string, state: string) {
    const params = new URLSearchParams();
    params.set('country', country);
    params.set('state', state);

    return this.dataService.getRequest<{ result: boolean }>(ApiMap.getCity.url + '?' + params)
  };
  getCityWithIso2(iso2: string) {
    const params = new URLSearchParams();
    params.set('iso2', iso2);
    return this.dataService.getRequest<{ result: boolean }>(ApiMap.getCityWithIso2.url + '?' + params)

  }

  getCurrentExchangeRate(baseCurrency = 'ILS') {
    return this.dataService.getRequest<{ result: any }>(ApiMap.getExchangeRate.url.concat(baseCurrency));
  }

  noTradeList(FromDate: any, ToDate: any, currency: string) {
    const params = new URLSearchParams();
    params.set('FromDate', FromDate);
    params.set('ToDate', ToDate);
    params.set('currency', currency || null);

    return this.dataService.postRequest<{ result: boolean }>(ApiMap.noTradeList.url + '?' + params)

  }

  getCurrentRate(buy: any, sell: any) {
    let params = {
      buy: buy,
      sell: sell
    };
    return this.dataService.getRequest<any>(
      ApiMap.getCurrentRate.url, params
    );
  }

  setMaxSelectableDate(date: Date | null): void {
    this.maxSelectableDateSubject.next(date);
  }

  getMaxSelectableDate(): Observable<Date | null> {
    return this.maxSelectableDateSubject.asObservable();
  }

  triggerHeaderMethod() {
    this.triggerHeaderMethodSource.next();
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

  // restrictNameOnPaste(event: ClipboardEvent, type: string) {
  //   const clipboardData = event.clipboardData || (window as any).clipboardData;
  //   const pastedText = clipboardData.getData('text');

  //   // Declare sanitizedText outside the blocks
  //   let sanitizedText = '';

  //   if (type === 'letters') {
  //     sanitizedText = pastedText
  //       .replace(/^\s+/, '') // Remove leading spaces
  //       .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
  //       .replace(/[^a-zA-Z\s]/g, '') // Allow only letters and spaces
  //       .trim(); // Remove trailing spaces
  //   } else {
  //     sanitizedText = pastedText
  //       .replace(/^\s+/, '') // Remove leading spaces
  //       .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
  //       .replace(/[^a-zA-Z0-9\s]/g, '') // Allow only letters, numbers, and spaces
  //       .trim(); // Remove trailing spaces
  //   }

  //   // Prevent the default paste behavior
  //   event.preventDefault();

  //   // Insert the sanitized text into the input
  //   const inputElement = event.target as HTMLInputElement;
  //   const currentValue = inputElement.value;

  //   // Combine current value and sanitized pasted text
  //   let combinedValue =
  //     currentValue.substring(0, inputElement.selectionStart || 0) +
  //     sanitizedText +
  //     currentValue.substring(inputElement.selectionEnd || 0);

  //   // Apply sanitization again on the combined value to handle multiple pastes
  //   combinedValue = combinedValue
  //     .replace(/^\s+/, '') // Remove leading spaces
  //     .replace(/\s{2,}/g, ' ') // Replace consecutive spaces with a single space
  //     .replace(/[^a-zA-Z0-9\s]/g, '') // Ensure only valid characters remain
  //     .trim(); // Remove trailing spaces

  //   // Update the input's value
  //   inputElement.value = combinedValue;

  //   // Move the cursor to the correct position
  //   const newCursorPosition =
  //     (inputElement.selectionStart || 0) + sanitizedText.length;
  //   inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
  // }

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

  restrictNameOnPasteWithFormGroup(event: ClipboardEvent, type: string, formGroup: FormGroup, formControlName?: any) {
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

  setDrawer(drawer: MatDrawer) {
    this.drawerRef = drawer;
  }

  closeDrawer() {
    this.drawerRef?.close();
    document.querySelector('.drawer-backdrop')?.remove();
  }
}
