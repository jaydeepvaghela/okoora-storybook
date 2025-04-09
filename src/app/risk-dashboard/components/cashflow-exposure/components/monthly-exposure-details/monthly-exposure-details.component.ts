import { Component } from '@angular/core';
import { monthlyExposureObject } from '../cashflow-exposure-data';
@Component({
  selector: 'app-monthly-exposure-details',
  imports: [],
  templateUrl: './monthly-exposure-details.component.html',
  styleUrl: './monthly-exposure-details.component.scss'
})
export class MonthlyExposureDetailsComponent {
  monthlyExposureObject = monthlyExposureObject;

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
}
