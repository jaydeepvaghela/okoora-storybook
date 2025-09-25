import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { WalletBalanceListModal } from '../../../../../main-dashboard/models/WalletBalanceListModal';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { FxDashboardService } from '../../../../../fx-dashboard/services/fx-dashboard.service';
import { AddWalletComponent } from '../../../../../main-dashboard/components/add-wallet/add-wallet.component';
import { getAllActiveCurrencies } from '../../../../../main-dashboard/dashboard-data/balanceList-data';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fx-conversion-step2',
  templateUrl: './fx-conversion-step2.component.html',
  styleUrls: ['./fx-conversion-step2.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, NgbTooltipModule]
})
export class FxConversionStep2Component {
  @Input() stepper!: MatStepper;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input() fxConversionForm!: FormGroup;
  @Input() mode: string = 'buy';
  @Output() exchangeFormDetails = new EventEmitter<any>();
  @Output() createdConvertDataDetails = new EventEmitter<any>();
  @Output() timerSubscriptionForComplete = new EventEmitter<any>();
  @Output() timerSubscriptionWithTimerdata = new EventEmitter<any>();
  @Output() modeChanged = new EventEmitter<'buy' | 'sell'>();
  activeCurrencyList: any[] = [];
  balanceListData: WalletBalanceListModal[] = [];
  balanceList$ = new BehaviorSubject<WalletBalanceListModal[]>([]);
  firstFilter$ = new BehaviorSubject<string>('');
  secondFilter$ = new BehaviorSubject<string>('');
  @ViewChild('buyInput') buyInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sellInput') sellInput!: ElementRef<HTMLInputElement>;
  filteredFirstCurrencies$!: Observable<WalletBalanceListModal[]>;
  filteredSecondCurrencies$!: Observable<WalletBalanceListModal[]>;
  showLoader = false;
  isFirstInputFocused: boolean = false;
  isSecondInputFocused: boolean = false;
  isCurrencySignFocused: boolean = false;
  firstSign: string | null = null;
  firstDefaultSign: any;
  totalFirstCurrency: number = 0;
  filteredBalanceForFirstCurrency: any;
  secondSign: string | null = null;
  secondDefaultSign: any;
  totalSecondCurrency: number = 0;
  filteredBalanceForSecondCurrency: any;
  createPaymentAPIError: any;
  defaultCurrencyCode: string = '';
  mainCurrency: WalletBalanceListModal | null = null;
  notificationAmount: string = '';
  notificationBuyCurrency: string = '';
  notificationPayCurrency: string = '';
  isFormChanged = false;
  showNotification = false;
  processing = false;
  nextButtonClicked = false;
  buyCurrency = new FormControl([]);
  BuyAmount = new FormControl([]);
  sellCurrency = new FormControl([]);
  SellAmount = new FormControl([]);
  errorMessages: { [key: string]: string } = {
    required: 'This field is required.',
    maxDigits: 'Maximum 7 digits allowed',
    decimalNotAllowed: 'Decimals are not allowed',
    invalidCharacters: 'Only numbers are allowed',
    exceedsBalance: 'Amount exceeds available wallet balance.'
  };
  unSubScribe$: any;
  spotRateError!: null;
  isSwitchingMode = false;

  constructor(
    private readonly _walletService: WalletsService,
    private readonly cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private readonly _fxDashboardService: FxDashboardService
  ) { }

  ngAfterViewInit() {
    // format initial values if coming back
    const buyVal = this.fxConversionForm.get('BuyAmount')?.value;
    if (buyVal) {
      this.fxConversionForm.get('BuyAmount')?.setValue(
        Number(buyVal.toString().replace(/,/g, '')).toLocaleString('en-US'),
        { emitEvent: false }
      );
    }

    const sellVal = this.fxConversionForm.get('SellAmount')?.value;
    if (sellVal) {
      this.fxConversionForm.get('SellAmount')?.setValue(
        Number(sellVal.toString().replace(/,/g, '')).toLocaleString('en-US'),
        { emitEvent: false }
      );
    }
    setTimeout(() => this.buyInput?.nativeElement.focus(), 0);
  }

  ngOnInit() {
    this.initializeForm();
    this.setupFilters();
    this.getAllBalanceListData();
    // Restore notification state if form already has value
    setTimeout(() => {
      this.updateNotification();
    });
    this.setupSellAmountBalanceValidation();

    if (this.mode === 'sell') {
      this.fxConversionForm.get('SellAmount')?.valueChanges.subscribe(() => {
        this.checkSellAmountExceedsBalance();
      });
    }
  }

  setupSellAmountBalanceValidation() {
    // Watch both sell amount and sell currency changes
    combineLatest([
      this.fxConversionForm.get('SellAmount')!.valueChanges.pipe(startWith(this.fxConversionForm.get('SellAmount')!.value)),
      this.fxConversionForm.get('sellCurrency')!.valueChanges.pipe(startWith(this.fxConversionForm.get('sellCurrency')!.value))
    ]).subscribe(() => {
      this.checkSellAmountExceedsBalance();
    });
  }

  addNewWallet() {
    const dialogRef = this.dialog.open(AddWalletComponent, {
      width: '520px',
      height: '200',
      panelClass: 'add-wallet'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBalanceListData();
      }
    });
  }

  onSellAmountInput() {
    const control = this.fxConversionForm.get('SellAmount');
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
      this.checkSellAmountExceedsBalance();

      // Clear required error when user starts typing
      if (this.nextButtonClicked && control.value && control.value.toString().trim() !== '') {
        this.clearRequiredError(control);
      }
    }
  }

  onBuyAmountInput() {
    const control = this.fxConversionForm.get('BuyAmount');
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });

      // Clear required error when user starts typing
      if (this.nextButtonClicked && control.value && control.value.toString().trim() !== '') {
        this.clearRequiredError(control);
      }
    }
  }

  private clearRequiredError(control: any) {
    if (control.errors?.['required']) {
      const { required, ...otherErrors } = control.errors;
      control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
  }

  checkSellAmountExceedsBalance() {
    if (this.mode !== 'sell') return;

    const control = this.fxConversionForm.get('SellAmount');
    const currencyCode = this.fxConversionForm.get('sellCurrency')?.value;
    if (!control || !currencyCode) return;

    const balance = this.getBalance(currencyCode);
    const amount = this.parseAmount(control.value);

    if (this.shouldMarkExceedsBalance(amount, balance)) {
      this.addExceedsBalanceError(control);
    } else {
      this.removeExceedsBalanceError(control);
    }
  }


  private getBalance(currencyCode: string): number {
    const wallet = this.balanceListData.find(
      c => c.wallet_Currency?.code === currencyCode
    );
    return wallet ? Number(wallet.wallet_Amount) : 0;
  }

  private parseAmount(value: any): number {
    if (typeof value === 'string') {
      value = value.replace(/[,\s]/g, '');
    }
    return Number(value || 0);
  }

  private shouldMarkExceedsBalance(amount: number, balance: number): boolean {
    return !isNaN(amount) && amount > 0 && amount > balance;
  }

  private addExceedsBalanceError(control: AbstractControl): void {
    const currentErrors = control.errors || {};
    if (!currentErrors?.['maxDigits']) {
      control.setErrors({ ...currentErrors, exceedsBalance: true });
    }
  }

  private removeExceedsBalanceError(control: AbstractControl): void {
    if (control.errors?.['exceedsBalance']) {
      const { exceedsBalance, ...otherErrors } = control.errors;
      control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
  }

  preventDecimal(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  initializeForm() {
    this.fxConversionForm.valueChanges.subscribe(() => {
      this.isFormChanged = true;
      this.createPaymentAPIError = false;
    });
  }

  previous() {
    this.stepper.previous();
  }

  updateNotification() {
    const isBuyMode = this.mode === 'buy';
    const amountControl = isBuyMode
      ? this.fxConversionForm.get('BuyAmount')
      : this.fxConversionForm.get('SellAmount');

    if (!amountControl || amountControl.invalid) {
      this.showNotification = false;
      return;
    }

    const amount = amountControl?.value;
    const rawAmount = amount?.toString().replace(/,/g, '') || '';

    if (!rawAmount || rawAmount === '0' || rawAmount === '') {
      this.showNotification = false;
      return;
    }

    const numericAmount = Number(rawAmount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      this.showNotification = false;
      return;
    }

    const buyCurrency = this.fxConversionForm.get('buyCurrency')?.value;
    const sellCurrency = this.fxConversionForm.get('sellCurrency')?.value;

    if (isBuyMode && !this.fxConversionForm.get('buyCurrency')?.valid) {
      this.showNotification = false;
      return;
    }

    if (!isBuyMode && !this.fxConversionForm.get('sellCurrency')?.valid) {
      this.showNotification = false;
      return;
    }

    if (!buyCurrency || !sellCurrency) {
      this.showNotification = false;
      return;
    }

    if (buyCurrency === sellCurrency) {
      this.showNotification = false;
      return;
    }

    const payCurrency = isBuyMode ? sellCurrency : buyCurrency;
    const targetCurrency = isBuyMode ? buyCurrency : sellCurrency;

    this.showNotification = true;
    this.notificationAmount = rawAmount;
    this.notificationBuyCurrency = targetCurrency;
    this.notificationPayCurrency = payCurrency;
  }

  setupFilters() {
    this.filteredFirstCurrencies$ = combineLatest([
      this.firstFilter$.pipe(startWith('')),
      this.balanceList$.pipe(startWith([] as WalletBalanceListModal[])),
      this.fxConversionForm.get('sellCurrency')!.valueChanges.pipe(startWith(this.fxConversionForm.get('sellCurrency')!.value))
    ]).pipe(
      map(([term, list, sellCurrency]) =>
        this.filterCurrencies(term, list).filter(c => c.wallet_Currency.code !== sellCurrency)
      )
    );

    this.filteredSecondCurrencies$ = combineLatest([
      this.secondFilter$.pipe(startWith('')),
      this.balanceList$.pipe(startWith([] as WalletBalanceListModal[])),
      this.fxConversionForm.get('buyCurrency')!.valueChanges.pipe(startWith(this.fxConversionForm.get('buyCurrency')!.value))
    ]).pipe(
      map(([term, list, buyCurrency]) =>
        this.filterCurrencies(term, list).filter(c => c.wallet_Currency.code !== buyCurrency)
      )
    );
  }

  filterCurrencies(term: string, list: WalletBalanceListModal[]) {
    if (!term) {
      return list;
    }
    const lowered = term.trim().toLowerCase();
    return list.filter(c =>
      c?.wallet_Currency?.code?.toLowerCase().includes(lowered)
    );
  }

  refreshFilters() {
    this.firstFilter$.next(this.firstFilter$.value);
    this.secondFilter$.next(this.secondFilter$.value);
  }

  // Helper method to identify main currency
  getMainCurrency(): WalletBalanceListModal | null {
    return this.balanceListData.find(wallet => wallet?.wallet_IsBaseCurency === true) || null;
  }

  // Helper method to get currency with highest balance excluding main currency
  getCurrencyWithHighestBalanceExcludingMain(): WalletBalanceListModal | null {
    const nonMainCurrencies = this.balanceListData.filter(wallet =>
      wallet.wallet_IsBaseCurency !== true && wallet.wallet_Amount >= 0
    );

    if (nonMainCurrencies.length === 0) {
      return null;
    }

    return nonMainCurrencies.reduce((highest, current) =>
      current.wallet_Amount > highest.wallet_Amount ? current : highest
    );
  }

  // Helper method to set default currencies based on mode
  setDefaultCurrencies(isInitialLoad: boolean = false) {
    const currentBuy = this.fxConversionForm.get('buyCurrency')?.value;
    const currentSell = this.fxConversionForm.get('sellCurrency')?.value;

    const mainCurrency = this.getMainCurrency();
    const highestBalanceCurrency = this.getCurrencyWithHighestBalanceExcludingMain();

    // Only preserve existing values on initial load (when coming back from next step)
    if (isInitialLoad && currentBuy && currentSell) {
      return;
    }

    // NEW LOGIC: If both currencies are already selected (user has made changes),
    // preserve them when switching modes instead of resetting to defaults
    if (!isInitialLoad && currentBuy && currentSell) {
      // User has already selected currencies, just keep them as they are
      // No need to change the currency selections when switching modes
      return;
    }

    // Only apply defaults if no currencies are selected (first time setup)
    if (!currentBuy || !currentSell) {
      this.fxConversionForm.patchValue({
        buyCurrency: currentBuy || mainCurrency?.wallet_Currency?.code || '',
        sellCurrency: currentSell || highestBalanceCurrency?.wallet_Currency?.code || ''
      });
    }

    // Update currency meta information after setting currencies
    setTimeout(() => {
      const updatedBuyCode = this.fxConversionForm.get('buyCurrency')?.value;
      const updatedSellCode = this.fxConversionForm.get('sellCurrency')?.value;
      if (updatedBuyCode) this.setFirstCurrencyMeta(updatedBuyCode);
      if (updatedSellCode) this.setSecondCurrencyMeta(updatedSellCode);
      this.cd?.detectChanges();
    }, 0);
  }

  getAllBalanceListData() {
    this.showLoader = true;
    forkJoin({
      activeCurrencies: of(getAllActiveCurrencies),
      balanceList: this._walletService.getAllBalanceList(),
    }).subscribe({
      next: ({ activeCurrencies, balanceList }) => {
        this.activeCurrencyList = activeCurrencies || [];
        this.balanceListData = balanceList || [];
        this.balanceList$.next(this.balanceListData);
        this.refreshFilters();
        this.mainCurrency = this.getMainCurrency();
        this.defaultCurrencyCode = this.mainCurrency?.wallet_Currency?.code || '';

        this.setDefaultCurrencies(true);

        // ✅ Restore currency meta info for already selected currencies
        const buyCode = this.fxConversionForm.get('buyCurrency')?.value;
        const sellCode = this.fxConversionForm.get('sellCurrency')?.value;
        if (buyCode) this.setFirstCurrencyMeta(buyCode);
        if (sellCode) this.setSecondCurrencyMeta(sellCode);

        this.showLoader = false;
        this.cd?.detectChanges();
      },
      error: (error) => {
        this.showLoader = false;
        console.error('Error fetching data:', error);
      }
    });
  }

  setFirstCurrencyMeta(code: string) {
    const sel = this.balanceListData.find(c => c.wallet_Currency?.code === code);
    if (sel) {
      this.firstSign = sel.wallet_Currency?.sign || null;
      this.totalFirstCurrency = sel.wallet_Amount ?? 0;
    } else {
      this.firstSign = null;
      this.totalFirstCurrency = 0;
    }
  }

  setSecondCurrencyMeta(code: string) {
    const sel = this.balanceListData.find(c => c.wallet_Currency?.code === code);
    if (sel) {
      this.secondSign = sel.wallet_Currency?.sign || null;
      this.totalSecondCurrency = sel.wallet_Amount ?? 0;
    } else {
      // currency not in balance list: fallback to activeCurrencyList for sign if available
      const active = this.activeCurrencyList.find(
        (c: any) =>
          c.code === code ||
          c?.wallet_Currency?.code === code
      );
      this.secondSign = active?.wallet_Currency?.sign || active?.sign || null;
      this.totalSecondCurrency = 0;
    }
  }

  get buyAmountErrors(): string[] {
    // Return empty immediately if switching modes
    if (this.isSwitchingMode) {
      return [];
    }

    const control = this.fxConversionForm.get('BuyAmount');

    // Only show errors if:
    // 1. We're in buy mode
    // 2. Control exists and has errors
    // 3. For required error: only show if next button was clicked
    // 4. For other errors: show if control has been interacted with (touched OR dirty)
    // 5. We're not currently switching modes
    if (
      this.mode !== 'buy' ||
      !control ||
      !control.errors ||
      this.isSwitchingMode
    ) {
      return [];
    }

    return Object.keys(control.errors)
      .filter(key => {
        if (key === 'required') {
          // Only show required error if next button was clicked
          return this.nextButtonClicked && this.errorMessages[key];
        } else {
          // Show other errors only if control has been interacted with
          return (control.touched || control.dirty) && this.errorMessages[key];
        }
      })
      .map(key => this.errorMessages[key]);
  }

  get sellAmountErrors(): string[] {
    // Return empty immediately if switching modes
    if (this.isSwitchingMode) {
      return [];
    }

    const control = this.fxConversionForm.get('SellAmount');

    // Only show errors if:
    // 1. We're in sell mode
    // 2. Control exists and has errors
    // 3. For required error: only show if next button was clicked
    // 4. For other errors: show if control has been interacted with (touched OR dirty)
    // 5. We're not currently switching modes
    if (
      this.mode !== 'sell' ||
      !control ||
      !control.errors ||
      this.isSwitchingMode
    ) {
      return [];
    }

    return Object.keys(control.errors)
      .filter(key => {
        if (key === 'required') {
          // Only show required error if next button was clicked
          return this.nextButtonClicked && this.errorMessages[key];
        } else {
          // Show other errors only if control has been interacted with
          return (control.touched || control.dirty) && this.errorMessages[key];
        }
      })
      .map(key => this.errorMessages[key]);
  }

  selectBuy(mode: string) {
    this.isSwitchingMode = true;
    this.mode = mode;
    this.modeChanged.emit('buy');

    // Reset next button clicked flag when switching modes
    this.nextButtonClicked = false;

    // Clear notification immediately
    this.clearNotification();

    // Reset controls BEFORE any async operations
    this.resetAmountControlsCompletely();

    // Force change detection to ensure UI updates immediately
    this.cd?.detectChanges();

    // Use setTimeout to ensure proper sequence and prevent validation blinking
    setTimeout(() => {
      this.setDefaultCurrencies(false);

      // Another timeout to ensure everything is settled before clearing the flag
      setTimeout(() => {
        this.isSwitchingMode = false;
        this.buyInput?.nativeElement.focus();
        this.cd?.detectChanges();
      }, 50); // Small delay to ensure UI has updated
    }, 0);
  }

  selectSell(mode: string) {
    this.isSwitchingMode = true;
    this.mode = mode;
    this.modeChanged.emit('sell');

    // Reset next button clicked flag when switching modes
    this.nextButtonClicked = false;

    // Clear notification immediately
    this.clearNotification();

    // Reset controls BEFORE any async operations
    this.resetAmountControlsCompletely();

    // Force change detection to ensure UI updates immediately
    this.cd?.detectChanges();

    // Use setTimeout to ensure proper sequence and prevent validation blinking
    setTimeout(() => {
      this.setDefaultCurrencies(false);

      // Another timeout to ensure everything is settled before clearing the flag
      setTimeout(() => {
        this.isSwitchingMode = false;
        this.sellInput?.nativeElement.focus();
        this.cd?.detectChanges();
      }, 50); // Small delay to ensure UI has updated
    }, 0);
  }

  private resetAmountControlsCompletely() {
    const buyControl = this.fxConversionForm.get('BuyAmount');
    const sellControl = this.fxConversionForm.get('SellAmount');

    // Reset buy control completely
    if (buyControl) {
      buyControl.setValue('', { emitEvent: false });
      buyControl.setErrors(null);
      buyControl.markAsUntouched();
      buyControl.markAsPristine();
      // Also clear the internal validation state
      (buyControl as any)._pendingTouched = false;
      (buyControl as any)._pendingDirty = false;
    }

    // Reset sell control completely
    if (sellControl) {
      sellControl.setValue('', { emitEvent: false });
      sellControl.setErrors(null);
      sellControl.markAsUntouched();
      sellControl.markAsPristine();
      // Also clear the internal validation state
      (sellControl as any)._pendingTouched = false;
      (sellControl as any)._pendingDirty = false;
    }
  }

  // Updated clearNotification method
  clearNotification() {
    this.showNotification = false;
    this.notificationAmount = '';
    this.notificationBuyCurrency = '';
    this.notificationPayCurrency = '';
    this.spotRateError = null;
  }

  resetSellAmountErrors() {
    const sellControl = this.fxConversionForm.get('SellAmount');
    if (sellControl) {
      sellControl.setValue('', { emitEvent: false }); // Don't emit events during reset
      sellControl.setErrors(null); // Clear all errors
      sellControl.markAsUntouched();
      sellControl.markAsPristine();
    }
  }

  resetBuyAmountErrors() {
    const buyControl = this.fxConversionForm.get('BuyAmount');
    if (buyControl) {
      buyControl.setValue('', { emitEvent: false }); // Don't emit events during reset
      buyControl.setErrors(null); // Clear all errors
      buyControl.markAsUntouched();
      buyControl.markAsPristine();
    }
  }

  clearAmounts() {
    this.fxConversionForm.patchValue({
      BuyAmount: '',
      SellAmount: ''
    }, { emitEvent: false }); // Prevent unnecessary form events during clearing
  }

  firstSelectExchangeCurrency($event: MatSelectChange) {
    const code = $event.value;
    this.updateNotification();
    this.setFirstCurrencyMeta(code);
    this.cd?.detectChanges();
  }

  secondSelectExchangeCurrency($event: MatSelectChange) {
    const code = $event.value;
    this.updateNotification();
    this.setSecondCurrencyMeta(code);
    this.cd?.detectChanges();
  }

  searchFromFirstInput($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;
    this.firstFilter$.next(target.value);
  }

  searchFromSecondInput($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;
    this.secondFilter$.next(target.value);
  }

  validateAmount(event: any): void {
    const input = event.target.value
    const decimalPart = input.split('.')[1];
    if (decimalPart && decimalPart.length >= 2) {
      event.preventDefault();
    }
    this.updateNotification();
  }

  restrictInvalidInput(event: KeyboardEvent, currentValue: string): boolean {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(event.key)) return true;
    if (!/[0-9.]/.test(event.key)) return false;
    if (currentValue.length === 0 && (event.key === '0' || event.key === '.')) return false;
    if (event.key === '.' && currentValue.includes('.')) return false;
    if (currentValue === '0' && event.key === '0') return false;

    return true;
  }

  updateCurrencySign() {
    if (this.mode === 'buy') {
      this._fxDashboardService.currencySignForBuySell$.next(this.firstSign || this.firstDefaultSign || '');
    } else {
      this._fxDashboardService.currencySignForBuySell$.next(this.secondSign || this.secondDefaultSign || '');
    }
  }

  getCurrentSpotRateWithHandling() {
     const buyCurrency = this.fxConversionForm.get('buyCurrency')?.value;
    const sellCurrency = this.fxConversionForm.get('sellCurrency')?.value;

    const mockResponse = {
      [buyCurrency]: 1.0,
      [sellCurrency]: 1.3365
    };

    return of(mockResponse).pipe(
      tap((res: any) => {
        this._fxDashboardService.spotRateSubject.next(res);
      }),
      catchError((err) => {
        return throwError(() => err?.error || err);
      })
    );
  }

  private isAmountEmpty(value: any): boolean {
    return !value || value.toString().trim() === '' || Number(value) === 0;
  }

  continueToNextStep() {
    // if (this.processing) return; // ignore repeated clicks
    // this.processing = true;

    // Set flag to indicate next button was clicked
    this.nextButtonClicked = true;

    const buyAmount = this.fxConversionForm.get('BuyAmount');
    const sellAmount = this.fxConversionForm.get('SellAmount');
    const amountControl = this.mode === 'buy' ? buyAmount : sellAmount;

    this.spotRateError = null;

    // Check for required validation first
    if (this.isAmountEmpty(amountControl?.value)) {
      // Set required error
      amountControl?.setErrors({ ...amountControl.errors, required: true });
      amountControl?.markAsTouched();
      this.processing = false;
      this.cd?.detectChanges(); // Force change detection to show error immediately
      return;
    }

    // Check for other validations
    if (!amountControl?.valid) {
      amountControl?.markAsTouched();
      // this.processing = false;
      this.cd?.detectChanges();
      return;
    }

    this.showLoader = true;
    this.getCurrentSpotRateWithHandling().subscribe({
      next: () => {
        this.updateCurrencySign();
        this.stepper.next();
        this.updateNotification();
        this.processing = false;
        this.showLoader = false;
        // Reset the flag after successful navigation
        this.nextButtonClicked = false;
      },
      error: (err) => {
        console.error('Failed to fetch spot rate', err);
        this.spotRateError = err?.apiErrorMessage?.[0] || 'Failed to fetch rate';
        this.processing = false;
        this.showLoader = false;
        // Don't reset the flag on error, so validation errors remain visible
      }
    });
  }

  ngOnDestroy() {
    if (this.unSubScribe$) {
      this.unSubScribe$.unsubscribe();
    }
  }
}