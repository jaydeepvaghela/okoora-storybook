import { Component, inject, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { AdvancedPolicyStep1Component } from './components/advanced-policy-step1/advanced-policy-step1.component';
import { AdvancedPolicyStep2Component } from './components/advanced-policy-step2/advanced-policy-step2.component';
import { AdvancedPolicyStep3Component } from './components/advanced-policy-step3/advanced-policy-step3.component';
import { Subscription } from 'rxjs';
import { HedgingDataService } from '../hedging-proposal/hedging-data.service';

@Component({
  selector: 'app-advanced-policy',
  imports: [ MatStepperModule, MatProgressBarModule, AdvancedPolicyStep1Component, AdvancedPolicyStep2Component, AdvancedPolicyStep3Component ],
  templateUrl: './advanced-policy.component.html',
  styleUrl: './advanced-policy.component.scss'
})
export class AdvancedPolicyComponent {
  @ViewChild('formStepper') formStepper!: MatStepper;
  riskManagerService = inject(HedgingDataService);
  // stepperIndex$: Subscription;
  isPolicyAlreadyCompleted: boolean | undefined;
  constructor() {
  }

  ngOnInit(): void {
    // this.riskManagerService.getAdvancePolicyStepperIndex.subscribe(res => {
    //   if (this.formStepper) {
    //     if (res == 0) {
    //       this.formStepper.selectedIndex = res;
    //     } else if (res > 0) {
    //       this.formStepper.selectedIndex = 1;
    //     }
    //   }
    // });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkIfPolicyAlreadyCompleted();
    });
  }


  checkIfPolicyAlreadyCompleted() {
    // this.riskManagerService.advancePolicyCompleted$.subscribe({
    //   next: (result) => {
    //     this.isPolicyAlreadyCompleted = result;
    //     if (this.isPolicyAlreadyCompleted && this.formStepper) {
    //       this.formStepper.selectedIndex = 2;
    //     }
    //   },
    //   error: (err) => {
    //     console.log('')
    //   }
    // })
  }

  moveNextPage() {
    this.formStepper.next();
  }

  movePreviousPage() {
    this.formStepper.previous();
  }
}
