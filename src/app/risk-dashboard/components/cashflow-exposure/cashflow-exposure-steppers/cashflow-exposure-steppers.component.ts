import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { CashflowExposureStep1Component } from "../components/cashflow-exposure-step1/cashflow-exposure-step1.component";
import { CashflowExposureDetailsComponent } from "../components/cashflow-exposure-details/cashflow-exposure-details.component";
import { CashflowExposureStep2Component } from '../components/cashflow-exposure-step2/cashflow-exposure-step2.component';

@Component({
  selector: 'app-cashflow-exposure-steppers',
  imports: [MatStepperModule, MatProgressBarModule, CashflowExposureStep1Component, CashflowExposureStep2Component, CashflowExposureDetailsComponent],
  templateUrl: './cashflow-exposure-steppers.component.html',
  styleUrl: './cashflow-exposure-steppers.component.scss'
})
export class CashflowExposureSteppersComponent {
  onStepChange(): void {
    setTimeout(() => {
      const offset = 20;
      const element = document.getElementById('content-wrapper');
      if (element) {
        const topPosition = Math.max(0, element.getBoundingClientRect().top + window.pageYOffset - offset);
        window.scrollTo({
          top: topPosition,
          behavior: 'auto'
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }, 50);
  }
  
}

