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
import { cashflowExposureData, monthlyExposureObject } from '../cashflow-exposure-data';

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
  standalone: true,
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

  dataSource = cashflowExposureData;
  monthlyExposureObject = monthlyExposureObject;

  displayedColumns: string[] = ['Month', 'Selling', 'Buying', 'TotalNet', 'DisableMonth'];
  staticMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  openEditSellingIndex: number | null = null;
  openEditBuyingIndex: number | null = null;
  errorMessage: string | null = null;
  errrMsgForBuyingAndSelling: any;
  monthlyPeriod: any;
  maxLengthError: any;

  constructor(private cd: ChangeDetectorRef) {}

  /**
   * Opens the datepicker for a specific row and sets the date
   */
  openDatepicker(index: number, year: number, month: string, day: number): void {
    const monthIndex = this.staticMonthNames.findIndex((m) => m === month);
    const selectedDate = new Date(year, monthIndex, day);
    // this.dataSource[index].date = selectedDate;

    this.cd.detectChanges();

    const datepicker = this.datepickers.toArray()[index];
    if (datepicker) {
      datepicker.open();
    }
  }

  backToPrevious() {
    throw new Error('Method not implemented.');
  }
}
