import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-volatility-chart',
  imports: [NgbTooltipModule, CommonModule],
  templateUrl: './volatility-chart.component.html',
  styleUrl: './volatility-chart.component.scss'
})
export class VolatilityChartComponent {
  @Input() currentIndicatorValue: number = 11;
  displayIndicatorValue: number = 0;  // Will start from minVolatility and increment to currentIndicatorValue
  @Input() minVolatility: number = 7;
  @Input() maxVolatility: number = 15;

  degree: number = 0;         // The target degree based on calculation
  currentDegree: number = 0;  // This will incrementally change for smooth animation
  @Input() volatilityRank: string = 'volatile';

  ngOnInit() {
    this.calculateDegree();
    this.animateNeedle();
    this.animateIndicatorValue();
  }

  calculateDegree() {
    if (this.minVolatility && this.maxVolatility && this.currentIndicatorValue) {
      // Calculate the degree based on the formula
      this.degree = ((this.currentIndicatorValue - this.minVolatility) /
        (this.maxVolatility - this.minVolatility)) * 180;
    }
  }

  animateNeedle() {
    const step = (this.degree - this.currentDegree) / 60; // Smooth steps
    const interval = setInterval(() => {
      if (Math.abs(this.currentDegree - this.degree) < Math.abs(step)) {
        this.currentDegree = this.degree;
        clearInterval(interval);  // Stop the animation when we reach the target degree
      } else {
        this.currentDegree += step;
      }
    }, 3);  // Update every ~16ms for smooth transition
  }

  animateIndicatorValue() {
    const step = (this.currentIndicatorValue - this.displayIndicatorValue) / 60;  // Smooth steps for percentage increment
    const interval = setInterval(() => {
      if (Math.abs(this.displayIndicatorValue - this.currentIndicatorValue) < Math.abs(step)) {
        this.displayIndicatorValue = this.currentIndicatorValue;
        clearInterval(interval);  // Stop animation when we reach the target percentage
      } else {
        this.displayIndicatorValue += step;
      }
    }, 3);  // Update every 50ms for slower number increment
  }

}
