import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-risk-estimate-chart',
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
    NgbTooltipModule],
  templateUrl: './risk-estimate-chart.component.html',
  styleUrl: './risk-estimate-chart.component.scss'
})
export class RiskEstimateChartComponent {
  @ViewChild('graphtooltip', { static: false }) graphtooltip!: NgbTooltip;
  selectedPeriod: string = 'monthly';
  selectedYear: string = 'Y10';
  periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  totalExposure: number = 1500000;
  hedgeRatio: number = 0.75;
  projectedLoss: number = 20000;

  displayedColumns: string[] = ['date', 'exposure', 'hedgeRatio', 'projectedLoss', 'action'];

  riskEstimates = [
    { date: '2025-01-01', exposure: 500000, hedgeRatio: 0.8, projectedLoss: 10000 },
    { date: '2025-02-01', exposure: 300000, hedgeRatio: 0.7, projectedLoss: 8000 },
    { date: '2025-03-01', exposure: 700000, hedgeRatio: 0.65, projectedLoss: 12000 }
  ];
  benchmarkRiskLevel!: number;
  benchMarkDegree!: number;
  benchMarkTooltipPosition!: string;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.graphtooltip.open(); // Open the tooltip by default
    }, 100);
  }

  viewDetails(element: any) {
    console.log('Viewing details for:', element);
    // You can implement further logic here for viewing details
  }

  updateBenchmark(): void {
    let benchmarkData = {
      benchMarkDegree: 0,
      benchMarkTooltipPosition: ''
    };
    switch (true) {
      case (this.benchmarkRiskLevel == 1):
        benchmarkData = { benchMarkDegree: 0, benchMarkTooltipPosition: 'left' };
        break;
      case (this.benchmarkRiskLevel == 2):
        benchmarkData = { benchMarkDegree: 65, benchMarkTooltipPosition: 'top' };
        break;
      default:
        benchmarkData = { benchMarkDegree: 130, benchMarkTooltipPosition: 'right' };
        break;
    }

    this.setBenchmarkValues(benchmarkData.benchMarkDegree, benchmarkData.benchMarkTooltipPosition);
    this.graphtooltip?.close();
    setTimeout(() => {
      if (this.graphtooltip) {
        this.graphtooltip?.open();
      }
    }, 1000);

  }

  setBenchmarkValues(benchMarkDegree: number, benchMarkTooltipPosition: string): void {
    this.benchMarkDegree = benchMarkDegree;
    this.benchMarkTooltipPosition = benchMarkTooltipPosition;
  }
}





