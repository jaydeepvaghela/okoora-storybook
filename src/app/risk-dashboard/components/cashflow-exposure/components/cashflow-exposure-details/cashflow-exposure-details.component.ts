import {
  Component,
  ElementRef,
  Inject,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  Injectable,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MonthlyExposureDetailsComponent } from '../monthly-exposure-details/monthly-exposure-details.component';
import { cashflowExposureRows, monthlyExposureObject } from '../cashflow-exposure-data';
import { Router } from '@angular/router';

// Custom Date Adapter
@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(@Inject(MAT_DATE_LOCALE) locale: string) {
    super(locale);
  }

  override format(date: moment.Moment, displayFormat: string): string {
    if (displayFormat === 'MMMM YYYY') {
      const formatted = date.format(displayFormat);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
    }
    return date.format(displayFormat);
  }

  override getDayOfWeekNames(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}

export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'DD/MMM/YYYY',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MMM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cashflow-exposure-details',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    NgbTooltipModule,
    MonthlyExposureDetailsComponent,
  ],
  templateUrl: './cashflow-exposure-details.component.html',
  styleUrl: './cashflow-exposure-details.component.scss',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
  ],
})
export class CashflowExposureDetailsComponent {
  @ViewChildren(MatDatepicker) datepickers!: QueryList<MatDatepicker<any>>;
  @ViewChild('cashflowDateColumn', { static: false }) cashflowDateColumn!: ElementRef;
  cashflowExposureRows = cashflowExposureRows;
  monthlyExposureObject = monthlyExposureObject;

  displayedColumns: string[] = ['Month', 'Selling', 'Buying', 'TotalNet', 'DisableMonth'];
  staticMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  openEditSellingIndex: number | null = null;
  openEditBuyingIndex: number | null = null;
  errorMessage: string | null = null;
  errrMsgForBuyingAndSelling: any;
  monthlyPeriod: any;
  maxLengthError: any;
  sellingValueForedit: any;
  buyingValueForedit: any;
  addRowBlinkIndex!: number;
  buyingFlag!: boolean;
  tempcashflowExposureRows: any;
  isCurrentMonthIncrement: boolean = false;
  
  constructor(private cd: ChangeDetectorRef, private router: Router) {}
  
  /**
   * Opens the datepicker for a specific row and sets the date
   */

  ngOnInit() {
    this.monthlyPeriod = this.monthlyExposureObject.monthlyPeriod;
  }
  
  chooseCashflowDate(index: number, year: number, month: string, day: number): void {
    const monthIndex = this.staticMonthNames.findIndex((m) => m === month);
    const selectedDate = new Date(year, monthIndex, day);
    this.cashflowExposureRows[index].date = selectedDate;
    this.cd.detectChanges();

    const datepicker = this.datepickers.toArray()[index];
    if (datepicker) {
      datepicker.open();
    }
  }

  setMonthlyDate(index: number, element: any) {
    const selectedDate = new Date(element.date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();
  
    const monthName = this.staticMonthNames[month];
    const monthDisplay = (month + 1).toString().padStart(2, '0');
    const dateDisplay = date.toString().padStart(2, '0');
    element.year = year;
    element.cashflowDate = date;
    element.month = monthName;
    element.Month = `${dateDisplay}/${monthDisplay}/${year}`;
    element.dayOfExpity = dateDisplay;
    this.cashflowExposureRows[index] = { ...element };
  }

  valueWithComma(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e?.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      if (e == 0) {
        return '0';
      } else {
        return false;
      }
    }
  }

  editSelling(element: any, index: any) {
    this.openEditSellingIndex = index;
    this.cashflowExposureRows[index].openEditForSelling = true
    this.sellingValueForedit = this.valueWithComma(this.cashflowExposureRows[index].selling, 2);
    this.cashflowExposureRows[index].errMsgForsellingFlag = false
    this.cashflowExposureRows[index].openEditForBuying = false
    delete this.errrMsgForBuyingAndSelling
    this.cashflowExposureRows = [...this.cashflowExposureRows]
  }

  cancelEditSelling(element: any, index: any) {
    this.cashflowExposureRows[index].openEditForSelling = false
    this.cashflowExposureRows = [...this.cashflowExposureRows]
  }

  saveEditSelling(element: any, index: any) {
    this.addRowBlinkIndex = -1;

    if (this.sellingValueForedit === '') {
        this.cashflowExposureRows[index].errMsgForsellingFlag = true;
        this.cashflowExposureRows[index].openEditForSelling = true;
        this.cashflowExposureRows = [...this.cashflowExposureRows];
        this.errrMsgForBuyingAndSelling = "Please enter only 0-9 numbers";
    } else {
        const rawSellingValue = this.sellingValueForedit.replace(/\,/g, '');
        const sellingNumber = parseFloat(rawSellingValue);

        const regex = /^\d*\.?\d*$/;

        if (regex.test(rawSellingValue)) {
            if (sellingNumber > 100000000) {
                this.cashflowExposureRows[index].errMsgForsellingFlag = true;
                this.cashflowExposureRows[index].openEditForSelling = true;
                this.errrMsgForBuyingAndSelling = "Maximum amount allowed is 100,000,000";
            } else {
                const formattedValue = this.valueWithComma(rawSellingValue, 2);
                this.cashflowExposureRows[index].selling = formattedValue !== false ? formattedValue : '';
                this.cashflowExposureRows[index].totalNetValue = sellingNumber - parseFloat(this.cashflowExposureRows[index].buying.toString()?.replace(/\,/g, '') || '0');

                this.cashflowExposureRows[index].errMsgForsellingFlag = false;
                this.cashflowExposureRows[index].openEditForSelling = false;
                this.cashflowExposureRows = [...this.cashflowExposureRows];
            }
        } else {
            this.cashflowExposureRows[index].errMsgForsellingFlag = true;
            this.cashflowExposureRows = [...this.cashflowExposureRows];
            this.errrMsgForBuyingAndSelling = "Please enter only 0-9 numbers";
        }
    }
  }

  clearSellingZeroValue(element: any, index: any) {
    this.sellingValueForedit = element.selling == "0" ? '' : this.valueWithComma(this.cashflowExposureRows[index].selling, 2);
  }

  editBuying(element: any, index: any) {
    this.openEditBuyingIndex = index;
    this.cashflowExposureRows[index].openEditForBuying = true
    this.buyingValueForedit = this.valueWithComma(element?.buying, 2);
    this.cashflowExposureRows[index].errMsgForbuyingFlag = false
    this.cashflowExposureRows[index].openEditForSelling = false
    delete this.errrMsgForBuyingAndSelling
    this.cashflowExposureRows = [...this.cashflowExposureRows]
  }

  ClearBuyingZeroValue(element: any, index: any) {
    this.buyingValueForedit = element.buying == "0" ? '' : this.valueWithComma(element?.buying, 2);
  }

  cancelEditBuying(element: any, index: any) {
    this.cashflowExposureRows[index].openEditForBuying = false
    this.cashflowExposureRows = [...this.cashflowExposureRows]
  }
  saveEditBuying(element: any, index: any) {
    this.addRowBlinkIndex = -1;
    if (this.buyingValueForedit === '') {
        this.cashflowExposureRows[index].errMsgForbuyingFlag = true;
        this.cashflowExposureRows[index].openEditForBuying = true;
        this.cashflowExposureRows = [...this.cashflowExposureRows];
        this.errrMsgForBuyingAndSelling = "Please enter only 0-9 numbers";
    } else {
        const rawBuyingValue = this.buyingValueForedit.replace(/\,/g, '');
        const buyingNumber = parseFloat(rawBuyingValue);

        const regex = /^\d*\.?\d*$/;

        if (regex.test(rawBuyingValue)) {
            if (buyingNumber > 100000000) {
                this.cashflowExposureRows[index].errMsgForbuyingFlag = true;
                this.cashflowExposureRows[index].openEditForBuying = true;
                this.errrMsgForBuyingAndSelling = "Maximum amount allowed is 100,000,000";
            } else {
                const formattedValue = this.valueWithComma(rawBuyingValue, 2);
                this.cashflowExposureRows[index].buying = formattedValue !== false ? formattedValue : '';
                this.cashflowExposureRows[index].totalNetValue = buyingNumber - parseFloat(this.cashflowExposureRows[index].selling.toString()?.replace(/\,/g, ''));

                this.cashflowExposureRows[index].errMsgForbuyingFlag = false;
                this.cashflowExposureRows[index].openEditForBuying = false;
                this.cashflowExposureRows = [...this.cashflowExposureRows];
            }
        } else {
            this.cashflowExposureRows[index].errMsgForbuyingFlag = true;
            this.cashflowExposureRows = [...this.cashflowExposureRows];
            this.errrMsgForBuyingAndSelling = "Please enter only 0-9 numbers";
        }
    }
  }

  onSwitchToggle(event?: any, element?: any, index?: any) {
    this.cashflowExposureRows[index].disabledColumn = !this.cashflowExposureRows[index].disabledColumn;
    this.cashflowExposureRows[index].postPoneFlag = false;
    this.cashflowExposureRows[index].postPoneInactiveFlag = event.checked ? false : true;
    this.cashflowExposureRows[index].openEditForBuying = false
    this.cashflowExposureRows[index].openEditForSelling = false
    this.cashflowExposureRows[index].buying =  this.cashflowExposureRows[index].disabledColumn ? '0' : this.buyingFlag ? this.monthlyExposureObject.monthlyAmount.toString() : '0';
    this.cashflowExposureRows[index].selling = this.cashflowExposureRows[index].disabledColumn ? '0' : !this.buyingFlag ? this.monthlyExposureObject.monthlyAmount.toString() : '0';
    this.cashflowExposureRows[index].totalNetValue = this.cashflowExposureRows[index].disabledColumn ? 0 : 
      parseFloat(this.cashflowExposureRows[index].selling.toString().replace(/,/g, '')) - 
      parseFloat(this.cashflowExposureRows[index].buying.toString().replace(/,/g, ''));
    this.cashflowExposureRows = [...this.cashflowExposureRows]
  }

  formatValue(event: Event, valueType: 'sellingValueForedit' | 'buyingValueForedit'): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/,/g, '');
    this.maxLengthError = false;
    if (value === '') {
      this[valueType] = '0';
      return;
    }
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      if (decimalPart.length > 2) {
        value = integerPart + '.' + decimalPart?.slice(0, 2);
      }
    }
    const actualNumber = parseFloat(value);
    if (!isNaN(actualNumber)) {
      this[valueType] = actualNumber.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  }

  restrictLength(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const valueWithoutCommas = input.value.replace(/,/g, '');
    const cursorPosition = input.selectionStart; // Track cursor position
    const parts = valueWithoutCommas.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    if (event.key === '.' && valueWithoutCommas.includes('.')) {
      event.preventDefault();
    }

    if (valueWithoutCommas.includes('.') && cursorPosition! > valueWithoutCommas.indexOf('.') && decimalPart.length >= 2 && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }

    if (!/^[0-9.]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && !event.key.includes('Arrow')) {
      event.preventDefault();
    }
  }

  preventDecimalValue(event: KeyboardEvent) {
    if (event.key === '.') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  clearInput(number: any) {
    if (number == 1) {
      this.buyingValueForedit = ""
    }
    if (number == 2) {
      this.sellingValueForedit = ""
    }
  }

  addOneMore() {
    this.monthlyPeriod++
    this.tempcashflowExposureRows = this.cashflowExposureRows;
    this.cashflowExposureRows = [];
    this.addRowBlinkIndex = -1;
    this.isCurrentMonthIncrement = true;
    this.getNext12MonthNamesWithYear(this.monthlyPeriod);
    this.cashflowExposureRows?.splice(0, this.tempcashflowExposureRows?.length);
    this.cashflowExposureRows = [...this.tempcashflowExposureRows, ...this.cashflowExposureRows]
    // this.cashflowExposureRows[this.cashflowExposureRows.length - 1].blinkRowIndex = this.cashflowExposureRows.length - 1;
  }

  getNext12MonthNamesWithYear(monthlyPeriod: any) {
    var now = new Date();
    var month = now.getMonth();
    var year = now.getFullYear();
    var todayDate = now.getDate();

    var names = this.staticMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var res = [];

    for (var i = 0; i < monthlyPeriod; ++i) {
      let buyingValue: any = this.buyingFlag ? this.monthlyExposureObject.monthlyAmount : "0";
      let sellingValue: any = this.buyingFlag ? "0" : this.monthlyExposureObject.monthlyAmount;

      // Getting Net value
      let totalNetValue =  sellingValue - buyingValue

      // Getting last DD date
      let getMonthNumberFromName = new Date(`${names[month]} 1, ${year}`).getMonth() + 1;
      let lastDayDD = new Date(year, getMonthNumberFromName, 0).getDate();

      const startDate = new Date(`${names[month]} 1, ${year}`);
      const endDate = new Date(`${names[month]} ${lastDayDD}, ${year}`);

      const midDayDD = new Date((startDate.getTime() + endDate.getTime()) / 2);
      let monthFormate: any = month + 1

      const newElement: any = {
        month: this.cashflowExposureRows[i]?.month ? this.cashflowExposureRows[i]?.month : names[month],
        year: this.cashflowExposureRows[i]?.year ? this.cashflowExposureRows[i]?.year : year,
        buying: this.valueWithComma(this.cashflowExposureRows[i]?.buying ? this.cashflowExposureRows[i]?.buying : buyingValue, 2),
        selling: this.valueWithComma(this.cashflowExposureRows[i]?.selling ? this.cashflowExposureRows[i]?.selling : sellingValue, 2),
        totalNetValue: this.cashflowExposureRows[i]?.totalNetValue ? this.cashflowExposureRows[i]?.totalNetValue : totalNetValue,
        lastDay: this.cashflowExposureRows[i]?.lastDay ? this.cashflowExposureRows[i]?.lastDay : lastDayDD,
        midDay: this.cashflowExposureRows[i]?.midDay ? this.cashflowExposureRows[i]?.midDay : midDayDD.getDate(),
        openEditForBuying: this.cashflowExposureRows[i]?.openEditForBuying ? this.cashflowExposureRows[i]?.openEditForBuying : false,
        openEditForSelling: this.cashflowExposureRows[i]?.openEditForSelling ? this.cashflowExposureRows[i]?.openEditForSelling : false,
        errMsgForbuyingFlag: this.cashflowExposureRows[i]?.errMsgForbuyingFlag ? this.cashflowExposureRows[i]?.errMsgForbuyingFlag : false,
        errMsgForsellingFlag: this.cashflowExposureRows[i]?.errMsgForsellingFlag ? this.cashflowExposureRows[i]?.errMsgForsellingFlag : false,
        postPoneFlag: this.cashflowExposureRows[i]?.postPoneFlag ? this.cashflowExposureRows[i]?.postPoneFlag : false,
        postPoneInactiveFlag: this.cashflowExposureRows[i]?.postPoneInactiveFlag ? this.cashflowExposureRows[i]?.postPoneInactiveFlag : true,
        postPoneMonth: this.cashflowExposureRows[i]?.postPoneMonth ? this.cashflowExposureRows[i]?.postPoneMonth : names[month],
        monthNumber: month,
      };
      if (now.getMonth() == month) {
        if (this.isCurrentMonthIncrement) {
          newElement['cashflowDate'] = 15;
        }
        if (!this.isCurrentMonthIncrement) {
          if (todayDate <= 15) {
            newElement['cashflowDate'] = 15;
          } else {
            newElement['cashflowDate'] = todayDate;
          }
        }
      } else {
        newElement['cashflowDate'] = 15;
      }
      newElement['Month'] = `${newElement['cashflowDate'].toString().length == 1 ? "0" + newElement['cashflowDate'] : newElement['cashflowDate']}/${monthFormate?.toString().length == 1 ? "0" + monthFormate : monthFormate}/${year}`,
        newElement['dayOfExpity'] = `${newElement['cashflowDate'].toString().length == 1 ? "0" + newElement['cashflowDate'] : newElement['cashflowDate']}`,

        this.cashflowExposureRows = [...this.cashflowExposureRows, newElement];
      res.push(names[month] + ' ' + year);
      if (++month === 12) {
        month = 0;
        ++year;
      }
    }
    return res;
  }
  
  exposureDetailsNextStep() {
    this.router.navigate(['/dashboard']);
  }

  backToPrevious() {
    throw new Error('Method not implemented.');
  }
}
