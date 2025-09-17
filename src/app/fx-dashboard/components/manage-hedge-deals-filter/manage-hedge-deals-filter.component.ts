import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DealType, DealStatusType } from '../../models/manageHedging';
import { of, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { HedgeCalendarHeaderComponent } from '../hedge-calendar-header/hedge-calendar-header.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { getActiveHedgingCurrency } from '../fx-dashboard-data/active-hedging-currency';

@Component({
  selector: 'app-manage-hedge-deals-filter',
  templateUrl: './manage-hedge-deals-filter.component.html',
  styleUrls: ['./manage-hedge-deals-filter.component.scss'],
  imports:[MatDialogModule,CommonModule,MatCheckboxModule,MatFormFieldModule,MatDatepickerModule,MatSelectModule,MatChipsModule,MatIconModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatInputModule],
  providers:[provideNativeDateAdapter()]

})
export class ManageHedgeDealsFilterComponent {
  filterDealsPayload!: { dealTypes: number[]; tradeDateFrom?: string | null; tradeDateTo?: string | null; expiryDateFrom?: string | null; expiryDateTo?: string | null; currencies: string[]; hedgeStatus: number[]; };
  filteredData: any;
  removeCurrency(code: any) {
    const control = this.dealsFilterForm.get('currencies');
    const selected = control?.value || [];
    // Remove currency from selection
    const updated = selected.filter((c: any) => String(c) !== String(code));
    control?.setValue(updated);
  }
  dealsFilterForm: FormGroup;
  walletList: any
  filteredCurrencies: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private walletListLoaded = false;
  private _onDestroy = new Subject<void>();
  currencies: string[] = [];

  dealTypes = [
    { label: 'All', value: 'All' },
    { label: 'Spot', value: DealType.Spot },
    { label: 'Forward', value: DealType.Forward },
    { label: 'Vanilla', value: DealType.Vanilla },
    { label: 'Exotic Form', value: DealType.ExoticForm }
  ];
  hedgeStatuses = [
    { label: 'All', value: 'All' },
    { label: 'Open', value: DealStatusType.Open },
    { label: 'Closed', value: 'Closed' }
  ];
  customCalendarHeader = HedgeCalendarHeaderComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // data can contain initial filter values
    private dialogRef: MatDialogRef<ManageHedgeDealsFilterComponent>,
    private fb: FormBuilder,
  ) {
    this.dealsFilterForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.getAllCurrencies();
  }

  getAllCurrencies() {
    of(getActiveHedgingCurrency).pipe(takeUntil(this._onDestroy)).subscribe({
    // this._connectorService.GetActiveHedgingCurrency().pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.walletList = res?.supportedHedge || [];
        this.currencies = this.walletList.map((c: any) => c?.currency?.code);
        this.filteredCurrencies.next(this.walletList.slice());
        this.walletListLoaded = true;
        this.initForm();
        // If data.filterPayload exists, patch form with it (convert ISO date strings to Date objects)
        if (this.data && this.data.filterPayload) {
          const patch = { ...this.data.filterPayload };
          // Convert ISO date strings to Date objects for date fields
          ['tradeDateFrom', 'tradeDateTo', 'expiryDateFrom', 'expiryDateTo'].forEach(key => {
            if (patch[key]) {
              const d = new Date(patch[key]);
              patch[key] = isNaN(d.getTime()) ? null : d;
            }
          });
          // Ensure dealType is always an array of string values for patching
          if (patch.dealTypes) {
            // If dealTypes is array of numbers, convert to string values for the form
            let dealTypeValues = patch.dealTypes.map((dt: any) => {
              const found = this.dealTypes.find(t => t.value === dt || String(t.value) === String(dt));
              return found ? found.value : dt;
            });
            // If all deal types (except 'All') are selected, add 'All'
            const allDealTypeValues = this.dealTypes.filter(dt => dt.value !== 'All').map(dt => dt.value);
            if (dealTypeValues.length === allDealTypeValues.length && allDealTypeValues.every(v => dealTypeValues.includes(v))) {
              dealTypeValues = ['All', ...allDealTypeValues];
            }
            patch.dealType = dealTypeValues;
          } else if (patch.dealType) {
            // Already present, do nothing
          } else {
            patch.dealType = [];
          }
          // Ensure hedgeStatus is always an array of string/number values for patching
          if (patch.hedgeStatus) {
            let hedgeStatusValues = patch.hedgeStatus;
            if (!Array.isArray(hedgeStatusValues)) hedgeStatusValues = [hedgeStatusValues];
            // Map backend numeric values to UI values if needed
            const allHedgeStatusValues = this.hedgeStatuses.filter(hs => hs.value !== 'All').map(hs => hs.value);
            // If all backend values are present (e.g. [1,2,3,4,5,6,7]), treat as 'All'
            const allBackendValues = [1,2,3,4,5,6,7];
            const allClosedValues = [1,3,4,5,6,7];
            // If all backend values are present, patch as ['All', ...allHedgeStatusValues]
            if (
              hedgeStatusValues.includes('All') ||
              (hedgeStatusValues.length === allBackendValues.length && allBackendValues.every(v => hedgeStatusValues.includes(v)))
            ) {
              hedgeStatusValues = ['All', ...allHedgeStatusValues];
            } else if (
              hedgeStatusValues.length === allClosedValues.length && allClosedValues.every(v => hedgeStatusValues.includes(v))
            ) {
              // If only closed values, patch as ['Closed']
              hedgeStatusValues = ['Closed'];
            } else if (
              hedgeStatusValues.length === 1 && hedgeStatusValues[0] === 2
            ) {
              // If only open value, patch as [DealStatusType.Open]
              hedgeStatusValues = [this.hedgeStatuses.find(hs => hs.value !== 'All' && hs.label === 'Open')?.value];
            } else {
              // Otherwise, try to map numeric values to UI values
              hedgeStatusValues = hedgeStatusValues.map((hs: any) => {
                const found = this.hedgeStatuses.find(h => h.value === hs || String(h.value) === String(hs));
                return found ? found.value : hs;
              });
            }
            patch.hedgeStatus = hedgeStatusValues;
          } else {
            patch.hedgeStatus = [];
          }
          this.dealsFilterForm.patchValue(patch);
        } else {
          // Ensure all currencies are selected by default
          this.dealsFilterForm.get('currencies')?.setValue([...this.currencies]);
        }
      },
      error: (err) => { },
    });
  }

  initForm() {
    // Set all deal types and hedge statuses selected by default
    const allDealTypes = ['All', ...this.dealTypes.filter(dt => dt.value !== 'All').map(dt => dt.value)];
    const allHedgeStatuses = ['All', ...this.hedgeStatuses.filter(hs => hs.value !== 'All').map(hs => hs.value)];
    this.dealsFilterForm = this.fb.group({
      dealType: this.fb.control(allDealTypes, Validators.required), // multi-select
      tradeDateFrom: [null],
      tradeDateTo: [null],
      expiryDateFrom: [null],
      expiryDateTo: [null],
      currencies: this.fb.control([], Validators.required), // multi-select
      hedgeStatus: this.fb.control(allHedgeStatuses, Validators.required) // multi-select
    }, { validators: [this.dateRangeValidator('tradeDateFrom', 'tradeDateTo'), this.dateRangeValidator('expiryDateFrom', 'expiryDateTo')] });
    // By default, select all currencies if available
    if (this.currencies.length) {
      this.dealsFilterForm.get('currencies')?.setValue([...this.currencies]);
    }
  }

  dateRangeValidator(fromKey: string, toKey: string) {
    return (group: FormGroup) => {
      const from = group.get(fromKey)?.value;
      const to = group.get(toKey)?.value;
      if (from && to && from > to) {
        return { dateRange: true };
      }
      return null;
    };
  }

  onDealTypeCheckboxChange(event: any, type: any) {
    const dealTypeControl = this.dealsFilterForm.get('dealType');
    let selected: any[] = dealTypeControl?.value || [];
    if (type === 'All') {
      if (event.checked) {
        // Select all options
        selected = this.dealTypes.filter(dt => dt.value !== 'All').map(dt => dt.value);
        dealTypeControl?.setValue(['All', ...selected]);
      } else {
        // Deselect all
        dealTypeControl?.setValue([]);
      }
    } else {
      if (event.checked) {
        selected = [...selected, type];
        // If all individual options are selected, add 'All'
        const allOptions = this.dealTypes.filter(dt => dt.value !== 'All').map(dt => dt.value);
        if (allOptions.every(opt => selected.includes(opt))) {
          selected = ['All', ...allOptions];
        } else {
          selected = selected.filter((v, i, arr) => arr.indexOf(v) === i && v !== 'All');
        }
        dealTypeControl?.setValue(selected);
      } else {
        // Remove deselected option
        selected = selected.filter((v: any) => v !== type && v !== 'All');
        dealTypeControl?.setValue(selected);
      }
    }
  }

  onHedgeStatusChange(event: any, type: any) {
    const hedgeStatusControl = this.dealsFilterForm.get('hedgeStatus');
    let selected: any[] = hedgeStatusControl?.value || [];
    if (type === 'All') {
      if (event.checked) {
        // Select all options
        selected = this.hedgeStatuses.filter(hs => hs.value !== 'All').map(hs => hs.value);
        hedgeStatusControl?.setValue(['All', ...selected]);
      } else {
        // Deselect all
        hedgeStatusControl?.setValue([]);
      }
    } else {
      if (event.checked) {
        selected = [...selected, type];
        // If all individual options are selected, add 'All'
        const allOptions = this.hedgeStatuses.filter(hs => hs.value !== 'All').map(hs => hs.value);
        if (allOptions.every(opt => selected.includes(opt))) {
          selected = ['All', ...allOptions];
        } else {
          selected = selected.filter((v, i, arr) => arr.indexOf(v) === i && v !== 'All');
        }
        hedgeStatusControl?.setValue(selected);
      } else {
        // Remove deselected option
        selected = selected.filter((v: any) => v !== type && v !== 'All');
        hedgeStatusControl?.setValue(selected);
      }
    }
  }

  clearAll(): void {
    this.dealsFilterForm.reset({
      dealType: [],
      tradeDateFrom: null,
      tradeDateTo: null,
      expiryDateFrom: null,
      expiryDateTo: null,
      currencies: [],
      hedgeStatus: []
    });
  }

  applyFilters(): void {
   
    const formValue = this.dealsFilterForm?.value;
    // Build payload as before
    let dealTypes: number[] = [];
    if (formValue?.dealType.includes('All')) {
      dealTypes = this.dealTypes.filter(dt => dt.value !== 'All').map(dt => Number(dt.value));
    } else {
      dealTypes = formValue.dealType.map((dt: any) => Number(dt)).filter((dt: number) => !isNaN(dt));
    }
    let hedgeStatus: number[] = [];
    let hedgeStatusValue = formValue.hedgeStatus;
    if (!Array.isArray(hedgeStatusValue)) {
      hedgeStatusValue = [hedgeStatusValue];
    }
    if (hedgeStatusValue?.includes('All')) {
      hedgeStatus = [1, 2, 3, 4, 5, 6, 7];
    } else if (hedgeStatusValue?.includes('Closed') && hedgeStatusValue.length === 1) {
      hedgeStatus = [1, 3, 4, 5, 6, 7];
    } else if (hedgeStatusValue?.includes(DealStatusType.Open) && hedgeStatusValue.length === 1) {
      hedgeStatus = [2];
    } else {
      hedgeStatus = hedgeStatusValue?.map((hs: any) => hs === 'Closed' ? [1, 3, 4, 5, 6, 7] : Number(hs)).flat().filter((hs: number) => !isNaN(hs));
      hedgeStatus = Array.from(new Set(hedgeStatus));
    }
    let currencies: string[] = [];
    if (formValue.currencies?.length === this.currencies?.length) {
      currencies = [...this.currencies];
    } else {
      currencies = formValue.currencies;
    }
    // Fix: Format date as YYYY-MM-DD to avoid timezone issues
    const toDateString = (dateVal: any) => {
      if (!dateVal) return null;
      let d: Date;
      if (dateVal instanceof Date) {
        d = dateVal;
      } else {
        d = new Date(dateVal);
      }
      if (isNaN(d.getTime())) return null;
      // Format as YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const payload = {
      dealTypes: dealTypes,
      tradeDateFrom: toDateString(formValue.tradeDateFrom),
      tradeDateTo: toDateString(formValue.tradeDateTo),
      expiryDateFrom: toDateString(formValue.expiryDateFrom),
      expiryDateTo: toDateString(formValue.expiryDateTo),
      currencies: currencies,
      hedgeStatus: hedgeStatus
    };

     this.dialogRef.close({filterPayload: payload });
    // Show loader
    // this.walletListLoaded = false;
    // this.fxDashboardService.GetHedgeDealsTable({
    //   dealTypes: dealTypes,
    //   tradeDateFrom: toIsoString(formValue.tradeDateFrom),
    //   tradeDateTo: toIsoString(formValue.tradeDateTo),
    //   expiryDateFrom: toIsoString(formValue.expiryDateFrom),
    //   expiryDateTo: toIsoString(formValue.expiryDateTo),
    //   currencies: currencies,
    //   hedgeStatus: hedgeStatus
    // }).subscribe({
    //   next: (filteredData: any) => {
    //     if (filteredData) {
    //       this.filteredData = filteredData;
    //       this.walletListLoaded = true;
    //       // Send both filteredData and filterPayload
         
    //     }
    //   },
    //   error: (err: any) => {
    //     this.walletListLoaded = true;
    //     this.dialogRef.close({ filteredData: [], filterPayload: payload });
    //   }
    // });
  }

  closeFilters() {
    this.dialogRef.close();
  }

  
}

