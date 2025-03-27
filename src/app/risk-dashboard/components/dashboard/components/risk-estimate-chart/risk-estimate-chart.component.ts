import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
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
  @Input() selectedYear: string = 'Y10';
  @Input() totalRiskLevel: string = 'HIGH';
  @Input() benchmarkRotate: number = 65;
  @Input() annualLoss: string = '₪4,476,001.2';
  @Input() initialloss: string = '₪4,476,001.2';
  @Input() benchmarkloss: string = '₪2,685,001.2';
  @Input() myloss: string = '₪4,476,001.2';
  @Input() avginitialloss: string = '₪5,220,001.2';
  @Input() avgbenchmarkloss: string = '₪3,170,001.2';
  @Input() avgmyloss: string = '₪5,220,001.2';
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.graphtooltip.open(); // Open the tooltip by default
    }, 100);
  }
  
  public get riskColor() : string {
    if(this.totalRiskLevel == 'HIGH'){
      return '#d92d20';
    }else if(this.totalRiskLevel == 'MEDIUM'){
      return '#DC6803'
    }else if(this.totalRiskLevel == 'LOW'){
      return '#079455'
    }else{
      return '#d92d20'
    }
  }
  public get benchmark() : string {
    if(this.totalRiskLevel == 'HIGH'){
      return 'above';
    }else if(this.totalRiskLevel == 'MEDIUM'){
      return 'similar'
    }else if(this.totalRiskLevel == 'LOW'){
      return 'below'
    }else{
      return 'above'
    }
  }
  public get riskangle() : number {
    if(this.totalRiskLevel == 'HIGH'){
      return 130;
    }else if(this.totalRiskLevel == 'MEDIUM'){
      return 66
    }else if(this.totalRiskLevel == 'LOW'){
      return 0
    }else{
      return 130
    }
  }
}
