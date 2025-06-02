import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MarketRiskChartComponent } from '../market-risk-chart/market-risk-chart.component';

@Component({
  selector: 'app-market-risk-box',
  imports: [CommonModule, MarketRiskChartComponent],
  templateUrl: './market-risk-box.component.html',
  styleUrl: './market-risk-box.component.scss'
})
export class MarketRiskBoxComponent {
  @Input() dashboardpanelData!: any;
  @Input() defaultRisk!: number; // Default risk value

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cdr.detectChanges(); 
  }

}
