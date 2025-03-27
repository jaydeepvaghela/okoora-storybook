import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-annual-exposure-details',
  imports: [NgbTooltipModule],
  templateUrl: './annual-exposure-details.component.html',
  styleUrl: './annual-exposure-details.component.scss'
})
export class AnnualExposureDetailsComponent {
  @Input() annualExposure: number = 1200001.2;
  @Input() recommendedHedge: number = 720001;
  @Input() recommendedHedgePercent: number = 60;
  @Input() currentHedge: number = 0;
  @Input() currentHedgePercent: number = 0;
  @Input() avgHedgeRate: string = '--';
}
