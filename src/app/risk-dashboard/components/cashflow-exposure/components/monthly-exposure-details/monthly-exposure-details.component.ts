import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-monthly-exposure-details',
  imports: [MatProgressBarModule, CommonModule],
  templateUrl: './monthly-exposure-details.component.html',
  styleUrl: './monthly-exposure-details.component.scss'
})
export class MonthlyExposureDetailsComponent {
  @Input() monthlyPeriod: number | undefined = 12;
  @Input() monthlyExposureObject: any = {
    pair: "USD/ILS",
    sign: "$",
    toCurrency: "USD",
    selectedExposure: "Selling",
    monthlyAmount: 100000,
    monthlyPeriod: 12,
    flag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
    code: "USD",
    baseCurrencyFlag: "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/EUR.png",
    baseCurrency: "ILS",
    baseCurrencySign: "₪"
  };

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
