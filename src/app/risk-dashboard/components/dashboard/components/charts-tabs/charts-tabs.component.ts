import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MonthlyExposureChartComponent } from "../monthly-exposure-chart/monthly-exposure-chart.component";
import { ExposureRateChartComponent } from "../exposure-rate-chart/exposure-rate-chart.component";
@Component({
  selector: 'app-charts-tabs',
  imports: [MatTabsModule, CommonModule, MonthlyExposureChartComponent, ExposureRateChartComponent],
  templateUrl: './charts-tabs.component.html',
  styleUrl: './charts-tabs.component.scss'
})
export class ChartsTabsComponent {
  loadMonthChart: boolean = true;
  loadExposureChart: boolean = false;
  activeIndex: number = 0;
  onTabChange(event: MatTabChangeEvent) {
    const index = event.index;
    this.activeIndex = index;
    switch (index) {
      case 0:
        this.loadMonthChart = true;
        this.loadExposureChart = false;
        break;
      case 1:
        this.loadExposureChart = true;
        this.loadMonthChart = false;
        break;
      default:
        break;
    }
  }
}
