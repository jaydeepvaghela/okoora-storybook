import { AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { WalletsService } from 'src/app/wallets/services/wallets.service';
import { ConnectorService } from '../../connector.service';
import { stripDollar } from '../../stripDollar.util';

@Component({
  selector: 'app-edit-cashflow-rules-drawer',
  templateUrl: './edit-cashflow-rules-drawer.component.html',
  styleUrls: ['./edit-cashflow-rules-drawer.component.scss']
})
export class EditCashflowRulesDrawerComponent implements AfterViewInit {
  @ViewChild('minInput') minInput!: ElementRef<HTMLInputElement>;
  @ViewChild('maxInput') maxInput!: ElementRef<HTMLInputElement>;
  @ViewChild('minCInput') minCInput!: ElementRef<HTMLInputElement>;
  @ViewChild('maxCInput') maxCInput!: ElementRef<HTMLInputElement>;
  dueDateTypes = ['24 Hours', '7 Days', '1 Month', '3 Months'];
  filteredCurrencies: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  walletList: any;
  multiFilterCtrl: FormControl = new FormControl();
  activeCurrencyListFilter: any[];

  excludeContactFilterCnt: FormControl = new FormControl();
  excludeContactData$: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  cashFlowFilteredCurrencies$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  connectorForm: any;
  ERPcontactsList: any;
  loading: boolean;

  private ruleData: any = null;
  private walletListLoaded = false;
  private contactsListLoaded = false;
  private originalFormState: any = null;

  Searchbeneficiaries = "Search beneficiaries";
  minAmount = '';
  maxAmount = '';
  minCAmount = '';
  maxCAmount = '';
  validationErrors: string[] = [];
  validationCErrors: string[] = [];
  data: any;
  passdata: any;
  latestRuleResponse: any;
  importExosureType: string | null;
  minLimit: number = 1;
  maxLimit: number = 100000;
  step: number = 1;
  isPayableProtectFilled: any;

  constructor(private _walletService: WalletsService, private _connectorService: ConnectorService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllCurrencies();
    this.initializeForm();
    this.getDataExcludedBenList();
   // this.getRuleResponseFromConnectorStepThree();
     this.getHedgingRules();
     const user = JSON.parse(localStorage.getItem('user')!);
      this.isPayableProtectFilled = user['isPayableProtectFilled']
    this.importExosureType = this._connectorService.getSelectedExposureType();
    
    this._connectorService.selectedExposureType$.subscribe(res => {
      if(res !== null && res !== '') {
        this.importExosureType = res;
      }else {
        const user = JSON.parse(localStorage.getItem('user')!);
        this.importExosureType = user['exposureType']
      }
    })
    this.connectorForm.get('InvoiceBillMinExposureAmount')?.valueChanges.subscribe(() => {
      this.validateAmounts();
    });
 
    this.connectorForm.get('InvoiceBillMaxExposureAmount')?.valueChanges.subscribe(() => {
      this.validateAmounts();
    });
    this.connectorForm.get('CashflowMinExposureAmount')?.valueChanges.subscribe(() => {
      this.validateCAmounts();
    });
 
    this.connectorForm.get('CashflowMaxExposureAmount')?.valueChanges.subscribe(() => {
      this.validateCAmounts();
    });

  }
  get min(): number {
    return this.connectorForm.get('InvoiceBillMinExposureAmount')?.value || 1;
  }
  get max(): number {
    return this.connectorForm.get('InvoiceBillMaxExposureAmount')?.value || 100000;
  }
  get minC(): number {
    return this.connectorForm.get('CashflowMinExposureAmount')?.value || 1;
  }
  get maxC(): number {
    return this.connectorForm.get('CashflowMaxExposureAmount')?.value || 100000;
  }


  getHedgingRules() {
    this.loading = true;
    this._connectorService.getHedgingRules().subscribe({
      next: (response) => {
        if (response) {
          this.rulesData = response;
          setTimeout(() => {
            this.bindFormData();
            this.loading = false;
          }, 500);
          //this.ruleData = this.ruleData.filter((f: any) => f.ruleType.toLowerCase() === this.importExosureType?.toLowerCase());
        }
      },
      error: (error) => {
        console.error('Error fetching hedging rules:', error);
      }
    });
  }

  // getRuleResponseFromConnectorStepThree() {
  //   this._connectorService.ruleResponse$.subscribe({
  //     next: (response) => {
  //       const result = response?.body;

  //       this.rulesData = result?.rules || [];


  //     }, 
  //     error: (err) => {
  //       console.log(err)
  //     }
  //   })
  // }

  bindFormData() {
    if (!this.rulesData || this.rulesData.length === 0 || !this.walletListLoaded || !this.contactsListLoaded) {
      return;
    }

    const invoiceRule = this.rulesData?.find((rule: any) => rule.ruleType.toLowerCase() === 'invoice');
    const cashflowRule = this.rulesData?.find((rule: any) => rule.ruleType.toLowerCase() === 'cashflow');
    const formData: any = {};

    if (invoiceRule) {
      const invoiceCurrencies = this.findCurrenciesFromCodes(invoiceRule.invoiceBillCurrencies || []);
      const blacklistContacts = this.findContactsFromIds(invoiceRule.invoiceBillBlacklist || []);

      formData.ImportExosureType = invoiceRule.importExosureType || '';
      // formData.DirectionType = invoiceRule.directionType || '';
      formData.InvoiceBillCurrencies = invoiceCurrencies;
      formData.InvoiceBillMinExposureAmount = invoiceRule.invoiceBillMinExposureAmount?.toString() || '';
      formData.InvoiceBillMaxExposureAmount = invoiceRule.invoiceBillMaxExposureAmount?.toString() || '';
      formData.InvoiceBillMaxDuePeriod = invoiceRule.invoiceBillMaxDuePeriod || '';
      formData.InvoiceBillBlacklist = blacklistContacts;
      formData.directionType = invoiceRule.directionType
      // 👇 SET these for input display with $ sign
      this.minAmount = invoiceRule.invoiceBillMinExposureAmount?.toString() || '';
      this.maxAmount = invoiceRule.invoiceBillMaxExposureAmount?.toString() || '';
    }

    if (cashflowRule) {
      const cashflowCurrencies = this.findCurrenciesFromCodes(cashflowRule.cashflowCurrencies || []);

      formData.CashflowCurrencies = cashflowCurrencies;
      formData.CashflowMinExposureAmount = cashflowRule.cashflowMinExposureAmount?.toString() || '';
      formData.CashflowMaxExposureAmount = cashflowRule.cashflowMaxExposureAmount?.toString() || '';
      formData.CashflowMaxDuePeriod = cashflowRule.cashflowMaxDuePeriod || '';
      formData.directionType = cashflowRule.directionType || '';
      this.minCAmount = cashflowRule.cashflowMinExposureAmount?.toString() || '';
      this.maxCAmount = cashflowRule.cashflowMaxExposureAmount?.toString() || '';
    }

    this.connectorForm.patchValue(formData);
    this.storeOriginalFormState();

  }

  private rulesData: any;
  private storeOriginalFormState() {
    this.originalFormState = {
      formValue: { ...this.connectorForm.value },
      minAmount: this.minAmount,
      maxAmount: this.maxAmount,
      minCAmount: this.minCAmount,
      maxCAmount: this.maxCAmount
    };
  }

  private revertToOriginalState() {
    if (this.originalFormState) {
      this.connectorForm.patchValue(this.originalFormState.formValue);
      this.minAmount = this.originalFormState.minAmount;
      this.maxAmount = this.originalFormState.maxAmount;
      this.minCAmount = this.originalFormState.minCAmount;
      this.maxCAmount = this.originalFormState.maxCAmount;

      this.validationErrors = [];
      this.validationCErrors = [];
    }
  }

  private findContactsFromIds(blacklistData: any[]): any[] {
    if (!this.ERPcontactsList || !blacklistData || blacklistData.length === 0) {
      return [];
    }

    return this.ERPcontactsList.filter((contact: any) =>
      blacklistData.some((blacklistItem: any) =>
        blacklistItem.counterpartyId === contact.id ||
        blacklistItem.counterpartyName === contact.name
      )
    );
  }

  findCurrenciesFromCodes(currencyCodes: string[]): any[] {
    if (!this.walletList || !currencyCodes || currencyCodes.length === 0) {
      return [];
    }

    return this.walletList.filter((wallet: any) =>
      currencyCodes.includes(wallet?.currency?.code)
    );
  }

  getDataExcludedBenList() {
    this._connectorService.erpCustomerSuppliersList$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(data => {
        this.ERPcontactsList = data;
        this.excludeContactData$.next(data.slice());

        // Mark contacts list as loaded and try to bind form data
        this.contactsListLoaded = true;
        // this.bindFormData();
      });
  }

  ngAfterViewInit() {
    this.excludeContactSearch();
    setTimeout(() => {
      const min = this.connectorForm.get('InvoiceBillMinExposureAmount')?.value || 0;
      const max = this.connectorForm.get('InvoiceBillMaxExposureAmount')?.value || 0;

      this.minInput.nativeElement.value = this.formatAmount(min);
      this.maxInput.nativeElement.value = this.formatAmount(max);
      if(this.importExosureType == 'cashflow'){
        const minC = this.connectorForm.get('CashflowMinExposureAmount')?.value || 0;
        const maxC = this.connectorForm.get('CashflowMaxExposureAmount')?.value || 0;
        this.minCInput.nativeElement.value = this.formatAmount(minC);
        this.maxCInput.nativeElement.value = this.formatAmount(maxC);
      }
    });
  }

  getAllCurrencies() {
    this._connectorService.GetActiveHedgingCurrency().pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.walletList = res?.supportedHedge;
        this.filteredCurrencies.next(this.walletList.slice());
        this.cashFlowFilteredCurrencies$.next(this.walletList.slice());
        this.activeCurrencyListFilter = res;

        // Mark wallet list as loaded and try to bind form data
        this.walletListLoaded = true;
        // this.bindFormData();
      },
      error: (err) => { },
    });
  }

  excludeContactSearch() {
    this.excludeContactFilterCnt.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      if (!this.ERPcontactsList) {
        return;
      }
      let searchTerm = this.excludeContactFilterCnt.value;
      if (!searchTerm) {
        this.excludeContactData$.next(this.ERPcontactsList.slice());
        return;
      } else {
        searchTerm = searchTerm.toLowerCase();
      }
      this.excludeContactData$.next(
        this.ERPcontactsList.filter((data: any) => data?.name?.toLowerCase().indexOf(searchTerm) > -1)
      );
    });
  }

  initializeForm() {
    this.connectorForm = this.fb.group({
      ImportExosureType: [''],
      directionType: [null],
      InvoiceBillCurrencies: [[]],
      InvoiceBillMinExposureAmount: [''],
      InvoiceBillMaxExposureAmount: [''],
      InvoiceBillMaxDuePeriod: [''],
      InvoiceBillBlacklist: [[]],
      CashflowCurrencies: [[]],
      CashflowMinExposureAmount: [''],
      CashflowMaxExposureAmount: [''],
      CashflowMaxDuePeriod: ['']
    });
  }

  onCurrencyRemoved(CurrenciesObj: any) {
    const transactionTypes = [...this.connectorForm.get('InvoiceBillCurrencies')?.value];
    this.removeType(transactionTypes, CurrenciesObj);
    this.connectorForm.patchValue({ 'InvoiceBillCurrencies': transactionTypes });
  }

  get currencies(): any[] {
    return this.connectorForm.get('InvoiceBillCurrencies')?.value || [];
  }

  get cashflowCurrencies(): any[] {
    return this.connectorForm.get('CashflowCurrencies')?.value || [];
  }

  private cashFlowRemoveType<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  confirmRulesSummary(type: string) {
    const importExosureType = this._connectorService.getSelectedExposureType() ?? type;
    const formValue = this.connectorForm.value;
    const walletList = this.walletList || [];

    const extractCurrencyCodes = (wallets: any[]) =>
      (wallets || []).map(w => w?.currency?.code).filter(Boolean);

    const selectedInvoiceCurrencies = formValue.InvoiceBillCurrencies || [];
    const selectedCashflowCurrencies = formValue.CashflowCurrencies || [];
    const allCurrencyCodes = extractCurrencyCodes(walletList);
    const isCashflow = importExosureType?.toLowerCase() === 'cashflow';

    const payload = {
      importExosureType,

      // Invoice settings
      invoiceBillMinExposureAmount: stripDollar(formValue.InvoiceBillMinExposureAmount),
      invoiceBillMaxExposureAmount: stripDollar(formValue.InvoiceBillMaxExposureAmount),
      DirectionType: formValue?.directionType || 'both',
      invoiceBillMaxDuePeriod: formValue.InvoiceBillMaxDuePeriod || '1 Year',
      invoiceBillCurrencies: selectedInvoiceCurrencies.length > 0
        ? extractCurrencyCodes(selectedInvoiceCurrencies)
        : allCurrencyCodes,
      invoiceBillBlacklist: (formValue.InvoiceBillBlacklist || []).map((contact: any) => ({
        counterpartyId: contact.id || '',
        counterpartyType: contact.type || '',
        counterpartyName: contact.name || ''
      })),

      // Cashflow settings only if isCashflow true
      cashflowMinExposureAmount: isCashflow ? stripDollar(formValue.CashflowMinExposureAmount) : '',
      cashflowMaxExposureAmount: isCashflow ? stripDollar(formValue.CashflowMaxExposureAmount) : '',
      cashflowMaxDuePeriod: isCashflow ? (formValue.CashflowMaxDuePeriod || '1 Year') : '',
      cashflowCurrencies: isCashflow
        ? (selectedCashflowCurrencies.length > 0
          ? extractCurrencyCodes(selectedCashflowCurrencies)
          : allCurrencyCodes)
        : [],

      createdAt: '',
      updatedAt: ''
    };

    this.editConnectorRule(payload);
  }

  editConnectorRule(payload: any) {
    this.loading = true;

    this._connectorService.addRule(payload)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (ruleResponse) => {
          this.storeOriginalFormState();
          // this.closeDrawer();

          // Store response in shared BehaviorSubject
          this._connectorService.updateRuleResponse(ruleResponse);

          const result = ruleResponse?.body;
          this.passdata = result || [];

          // Step 3: Prepare payload
          const currency = this.passdata?.colletralCurrency ?? null; // Replace dynamically if needed
          const isSync = true;
          const collateralAmount = this.passdata?.collateralAmount;
          const importExposureType = this.passdata?.rules?.[0]?.importExosureType;

          const finalPayload = {
            currency,
            isSync,
            collateralAmount,
            importExposureType
          };

          // Step 4: Call invoice list API
          this._connectorService.GetFilteredInvoiceBillList(finalPayload)
            .pipe(takeUntil(this._onDestroy))
            .subscribe({
              next: (invoiceList: any) => {
                this.loading = false;
                this.closeDrawer();
                const data = invoiceList;
                this._connectorService.setApprovedList(data);
              },
              error: (listError) => {
                this.loading = false;
                console.error('Error fetching invoice bill list:', listError);
              }
            });
        },
        error: (ruleError) => {
          this.loading = false;
          console.error('Error saving rules:', ruleError);
        }
      });
  }




  onCashFlowCurrencyRemoved(cashflowCurrencyObj: any) {
    const transactionTypes = [...this.connectorForm.get('CashflowCurrencies')?.value];
    this.cashFlowRemoveType(transactionTypes, cashflowCurrencyObj);
    this.connectorForm.patchValue({ 'CashflowCurrencies': transactionTypes });
  }

  onExcludeContactRemoved(excludedContactObj: any) {
    const transactionTypes = [...this.connectorForm.get('InvoiceBillBlacklist')?.value];
    this.removeType(transactionTypes, excludedContactObj);
    this.connectorForm.patchValue({ 'InvoiceBillBlacklist': transactionTypes });
  }

  private removeType<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  updateActivateAccountAboutBusiness() { }

  checkSelectedCurrency(selectedSource: any) {
    if (selectedSource?.value == '' && selectedSource?.selected) {
    }
  }

  saveRule() {
    this._connectorService.openEditCashflowRules(false);
  }

  closeDrawer() {
    this.revertToOriginalState();
    this._connectorService.openEditCashflowRules(false);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  validateAmounts() {
    this.validationErrors = [];
    if (!this.min && !this.max) {
      return;
    }
    const min = parseFloat(this.min.toString().replace(/,/g, ''));
    const max = parseFloat(this.max.toString().replace(/,/g, ''));
    if (isNaN(min) || min <= 0) {
      this.validationErrors.push('Minimum amount must be greater than 0.');
    }
    if (!isNaN(min)) {
      if (isNaN(max)) {
        this.validationErrors.push('Maximum amount must be above or equal to minimum.');
      } else if (max < min) {
        this.validationErrors.push('Maximum amount must be above or equal to minimum.');
      }
    }
  }

  validateCAmounts() {
    if (!this.minC && !this.maxC) {
      return;
    }
    this.validationCErrors = [];
    const min = parseFloat(this.minC.toString().replace(/,/g, ''));
    const max = parseFloat(this.maxC.toString().replace(/,/g, ''));
    if (isNaN(min) || min <= 0) {
      this.validationCErrors.push('Minimum amount must be greater than 0.');
    }
    if (!isNaN(min)) {
      if (isNaN(max)) {
        this.validationCErrors.push('Maximum amount must be above or equal to minimum.');
      } else if (max < min) {
        this.validationCErrors.push('Maximum amount must be above or equal to minimum.');
      }
    }
  }


  formatAmount(value: number | null): string {
    if (value === null || isNaN(Number(value))) return '$0';
    return `$${Number(value).toLocaleString('en-US')}`;
  }
  // Parse and update min from input
  onMinChange(val: string) {
    const parsed = this.parseCurrency(val);
    this.connectorForm.get('InvoiceBillMinExposureAmount')?.setValue(parsed);
    this.validateAmounts();
  }

  // Parse and update max from input
  onMaxChange(val: string) {
    const parsed = this.parseCurrency(val);
    this.connectorForm.get('InvoiceBillMaxExposureAmount')?.setValue(parsed);
    this.validateAmounts();

  }
  // Parse and update min from input
  onMinCChange(val: string) {
    const parsed = this.parseCurrency(val);
    this.connectorForm.get('CashflowMinExposureAmount')?.setValue(parsed);
    this.validateCAmounts();
  }

  // Parse and update max from input
  onMaxCChange(val: string) {
    const parsed = this.parseCurrency(val);
    this.connectorForm.get('CashflowMaxExposureAmount')?.setValue(parsed);
    this.validateCAmounts();

  }

  // Strip $ and non-numeric characters
  parseCurrency(val: any): number {
    if (val == null) return 0;
    const strVal = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(strVal) || 0;
  }
}