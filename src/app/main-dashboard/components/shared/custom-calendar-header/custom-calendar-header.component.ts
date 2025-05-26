import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-calendar-header',
  templateUrl: './custom-calendar-header.component.html',
  styleUrls: ['./custom-calendar-header.component.scss'],
  imports: [MatSelectModule, FormsModule, CommonModule, MatOptionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCalendarHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();
  selectedMonth: number;
  selectedYear: number;
  selectedDate: any;
  months: { value: number; viewValue: string }[] = [];
  years: number[] = [];
  translateTexts: any;
  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    private dashboardService: DashboardService,
    private translateService: TranslateService,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth();
    this.selectedYear = currentDate.getFullYear();
    // this.initializeMonthAndYear();
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe(ev => {
      this.getTranslations();
    });
    this.getTranslations();
  }

  private initializeMonthAndYear() {
    const activeDate = this._calendar.activeDate;
    this.selectedMonth = this._dateAdapter.getMonth(activeDate);
    this.selectedYear = this._dateAdapter.getYear(activeDate);

    this.months = Array.from({ length: 12 }, (_, i) => ({
      value: i,
      viewValue: this.translateTexts[`MONTH_SELECTION.MONTH_${i}`]
    }));

    const currentYear = new Date().getFullYear();
    this.dashboardService.currentSideTabType.subscribe((data)=> {
      if(data == 2 || data == 0) {
        this.years = [];
        for (let i = currentYear; i <= currentYear + 1; i++) {
          this.years.push(i);
        }
      }
      else {
        this.years = [];
        for (let i = currentYear; i <= currentYear + 1; i++) {
          this.years.push(i);
        }
      }
    })
  }
  monthChanged(event: number) {
    this.selectedMonth = event;
    this.updateCalendar();
  }

  yearChanged(event: number) {
    this.selectedYear = event;
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
  }
  get periodLabel() {
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
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

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);

        if (mode === 'month') {
          this.selectedMonth += 1;
          if (this.selectedMonth > 11) {
            this.selectedMonth = 0; 
            this.selectedYear += 1;
          }
        } else if (mode === 'year') {
          this.selectedYear += 1;
        }
        this.updateCalendar();
  }

  getTranslations() {
    this.translateService.get([
      'MONTH_SELECTION.MONTH_0',
      'MONTH_SELECTION.MONTH_1',
      'MONTH_SELECTION.MONTH_2',
      'MONTH_SELECTION.MONTH_3',
      'MONTH_SELECTION.MONTH_4',
      'MONTH_SELECTION.MONTH_5',
      'MONTH_SELECTION.MONTH_6',
      'MONTH_SELECTION.MONTH_7',
      'MONTH_SELECTION.MONTH_8',
      'MONTH_SELECTION.MONTH_9',
      'MONTH_SELECTION.MONTH_10',
      'MONTH_SELECTION.MONTH_11'
    ]).subscribe(res => {
      this.translateTexts = res;
      console.log('Translations:', this.translateTexts);
      this.initializeMonthAndYear();
    })
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
