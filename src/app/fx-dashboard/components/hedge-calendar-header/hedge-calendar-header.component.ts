import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../main-dashboard/services/dashboard.service';
import moment from 'moment';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hedge-calendar-header',
  templateUrl: './hedge-calendar-header.component.html',
  styleUrls: ['./hedge-calendar-header.component.scss'],
  imports:[MatSelectModule,CommonModule,FormsModule]
})
export class HedgeCalendarHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();
  selectedMonth: number;
  selectedYear: number;
  selectedDate: any;
  months: { value: number; viewValue: string }[] = [];
  years: number[] = [];
  selectedMonthViewValue: any;
  previousMonth!: number;
  currentMonth!: number;
  currentYear!: number;
  activeYear!: number;
  isNextButtonDisabled!: boolean;
  isPreviousButtonDisabled: boolean = false;

  constructor(
    private _calendar: MatCalendar<any>,
    private _dateAdapter: DateAdapter<any>,
    private dashboardService: DashboardService,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    private cdr: ChangeDetectorRef
  ) {
    _calendar.selectedChange
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this.updateCalendarHeader();
        this.cdr.markForCheck();
      });

    this.previousMonth = moment(this._calendar.activeDate).month();
    this.currentMonth = moment().month();
    this.currentYear = new Date().getFullYear();
    this.activeYear = moment(this._calendar.activeDate).year();

    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth();
    this.selectedYear = currentDate.getFullYear();
    this.updateCalendarHeader();
    this.initializeMonthAndYear();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private initializeMonthAndYear() {
    const currentDate = new Date();
    if (this._calendar?.selected?.start) {
      this.selectedMonth = this._dateAdapter.getMonth(this._calendar.selected.start);
      this.selectedYear = this._dateAdapter.getYear(this._calendar.selected.start);
    }
    else {
      this.selectedMonth = currentDate.getMonth();
      this.selectedYear = currentDate.getFullYear();
    }
    this.selectedMonthViewValue = moment().month(this.selectedMonth).format('MMMM');
    this.months = [
      { value: 0, viewValue: 'January' },
      { value: 1, viewValue: 'February' },
      { value: 2, viewValue: 'March' },
      { value: 3, viewValue: 'April' },
      { value: 4, viewValue: 'May' },
      { value: 5, viewValue: 'June' },
      { value: 6, viewValue: 'July' },
      { value: 7, viewValue: 'August' },
      { value: 8, viewValue: 'September' },
      { value: 9, viewValue: 'October' },
      { value: 10, viewValue: 'November' },
      { value: 11, viewValue: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let i = currentYear - 50; i <= currentYear + 1; i++) {
      if (i >= 2010) {
        this.years.push(i);
      }
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  private updateCalendarHeader() {
    this.selectedMonth = this._dateAdapter.getMonth(this._calendar.activeDate);
    this.selectedYear = this._dateAdapter.getYear(this._calendar.activeDate);
    this.activeYear = moment(this._calendar.activeDate).year();
    this.selectedMonthViewValue = moment().month(this.selectedMonth).format('MMMM');
  }

  monthChanged(event: number) {
    this.selectedMonth = event;
    this.selectedMonthViewValue = moment().month(this.selectedMonth).format('MMMM');
    this.updateCalendar();
  }

  yearChanged(event: number) {
    this.selectedYear = event;
    this.activeYear = event;
    this.updateCalendar();
  }

  private updateCalendar() {
    const newDate = this._dateAdapter.createDate(
      this.selectedYear,
      this.selectedMonth,
      1
    );
    this._calendar.activeDate = newDate;
    this.selectedDate = newDate;
    this._calendar.selectedChange.emit(newDate);
    this.selectedMonthViewValue = moment().month(this.selectedMonth).format('MMMM');
  }
  get periodLabel() {
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  isMonthDisabled(monthValue: number): boolean {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const maxAllowedMonth = (currentYear === this.selectedYear) ? currentMonth : 12;
    return monthValue > maxAllowedMonth;
  }

  previousClicked(mode: 'month' | 'year') {
    const previousMonth = moment(this._calendar.activeDate).subtract(1, 'month');
    const allowedDate = moment().subtract(1, 'day');
    if (previousMonth.isSameOrBefore(allowedDate) || !previousMonth.isSameOrBefore(allowedDate)) {
      this.previousMonth = previousMonth.month();
      this.activeYear = previousMonth.year();
      this._calendar.activeDate =
        mode === 'month'
          ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
          : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);

      if (mode === 'month') {
        this.selectedMonth -= 1;
        if (this.selectedMonth < 0) {
          this.selectedMonth = 11;
          this.selectedYear -= 1;
        }
      } else if (mode === 'year') {
        this.selectedYear -= 1;
      }

      this.updateCalendar();
    }
  }

  nextClicked(mode: 'month' | 'year') {
    const nextMonth = moment(this._calendar.activeDate).add(1, 'month');
    const allowedDate = moment(this._calendar.activeDate).add(1, 'year');

    if (nextMonth.isSameOrBefore(allowedDate)) {
      this._calendar.activeDate =
        mode === 'month'
          ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
          : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);

      if (mode === 'month') {
        this.selectedMonth += 1;
        if (this.selectedMonth >= 11) {
          this.selectedMonth = 0;
          this.selectedYear += 1;
        }
      } else if (mode === 'year') {
        this.selectedYear += 1;
      }

      this.updateCalendar();
    }
    this.disableNextButton();
  }

  disableNextButton() {
    const maxYear = this.years[this.years.length - 1];
    const maxMonth = 11;
    if (this.selectedYear > maxYear || (this.selectedYear === maxYear && this.selectedMonth > maxMonth)) {
      this.isNextButtonDisabled = true;
    } else {
      this.isNextButtonDisabled = false;
    }
  }
}
