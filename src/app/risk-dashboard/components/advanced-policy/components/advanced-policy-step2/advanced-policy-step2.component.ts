import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, inject, Input, NgZone, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AdvancePolicyModel } from '../../../model/advance-policy-model';
import { AdvancePolicyData } from '../advance-policy-data';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HedgingDataService } from '../../../hedging-proposal/hedging-data.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-advanced-policy-step2',
  imports: [MatStepperModule,MatProgressBarModule,ReactiveFormsModule,CommonModule,MatRadioModule],
  templateUrl: './advanced-policy-step2.component.html',
  styleUrl: './advanced-policy-step2.component.scss'
})
export class AdvancedPolicyStep2Component implements AfterViewInit,OnDestroy {
  @ViewChild('setp2Stepper') setp2Stepper!: MatStepper;
  @Input("selectedMainStepprIndex") selectedMainStepprIndex: number = 0;
  @Output() moveNextPage = new EventEmitter<void>();
  @Output() movePreviousPage = new EventEmitter<void>();
  router = inject(Router);
  @Input() advancePolicyData: AdvancePolicyModel[] = AdvancePolicyData;
  formGroups: FormGroup[] = [];
  fb = inject(FormBuilder);
  riskManagerService = inject(HedgingDataService);
  cdr = inject(ChangeDetectorRef);

  step2LastIndex = false;
  errorData: any;
  errorMessage: any;
  isSubmitForm = false;
  step1FormValue: any;
  budgetRateobj!: { index: number; answer: any; };
  getAdvancePolicyBudgetRate$!: Subscription;
  step2LastIndex$!: Subscription;
  isAlreadyCompletedPolicy: boolean= false;
  selectedIndex!: number;

  constructor(private zone: NgZone) {

  }

  ngAfterViewInit(): void {
    this.riskManagerService.getAdvancePolicyStepperIndex.subscribe(res => {

      if (this.step2LastIndex) {
        this.step2LastIndex = false;
      }
      if (this.setp2Stepper) { // Check if setp2Stepper is defined
        if (res == 0) {
          this.setp2Stepper.selectedIndex = res; // from step3 edit first step tan index start from 0 in step2
        } else if (res > 0) {
          const stepperIndex = res - 1;
          // this.zone.run(() => {
            this.setp2Stepper.selectedIndex = stepperIndex;
            this.cdr.detectChanges();
          // });
          const formValuesWithIndexAndAnswer = this.formGroups.map((formGroup, index) => ({
            index: index + 1,
            answer: formGroup.value.answer
          }));
          if (this.setp2Stepper.selectedIndex === formValuesWithIndexAndAnswer.length - 1) {
            this.step2LastIndex = true;
          }
          this.cdr.detectChanges();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getAdvancePolicyBudgetRate$ = this.riskManagerService.getAdvancePolicyBudgetRate.subscribe({
      next: (res) => {
        this.step1FormValue = res;
      },
      error: (err) => {
        console.error('Error fetching Advance Policy Budget Rate:', err);
      }
    });

    this.step2LastIndex$ = this.riskManagerService.step2LastIndex.subscribe(res => {
      if (res) {
        this.step2LastIndex = false;
      }
    }
    )
    this.advancePolicyData.forEach((item, index) => {
      const formGroup = this.fb.group({
        answer: ['', Validators.required]
      });
      // Subscribe to value changes to clear error messages
      formGroup.get('answer')!.valueChanges.subscribe(value => {
        if (value) {
          this.errorMessage = '';
          this.isSubmitForm = false;
          if (this.setp2Stepper) {

            this.setp2Stepper.selectedIndex = this.setp2Stepper.selectedIndex;
          }
        }
      });

      this.formGroups.push(formGroup);
    });
    this.riskManagerService.advancePolicyCompleted$.subscribe({
      next: (result) => {
        if (result) {
          this.getAlreadyCompletedPolicy();
        }
      },
      error: (error) => {

      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMainStepprIndex'] && this.setp2Stepper) {
      this.setp2Stepper.selectedIndex = this.selectedMainStepprIndex;
    }
  }
  getAlreadyCompletedPolicy() {
    this.riskManagerService.getAdvancePolicyStep2Data.subscribe(data => {
        if (data) {
            this.isAlreadyCompletedPolicy = true;

            // Replace index 9 with index 5
            data.forEach((item: any) => {
                if (item.index === 9) {
                    item.index = 5; // Replace index 9 with index 5
                }
            });

            // Patch the formGroups with the updated data
            data.forEach((item: any) => {
                const formGroup = this.formGroups[item.index - 1]; // Adjust for zero-based index
                if (formGroup) {
                    formGroup.patchValue({ answer: item.answer });
                }
            });
        }
    });
  }


  submitFormValue() {
    this.budgetRateobj = {
      index: 0,
      answer: Object.values(this.step1FormValue)[0] || this.step1FormValue
    };
    this.isSubmitForm = true;
    const formValuesWithIndexAndAnswer = this.formGroups.map((formGroup, index) => ({
      index: index + 1,
      answer: formGroup.value.answer
    }));
    if (this.step2LastIndex) {
      if (!formValuesWithIndexAndAnswer[formValuesWithIndexAndAnswer.length - 1].answer) {
        this.setp2Stepper.selectedIndex = this.setp2Stepper.selectedIndex;  // index:4
        this.errorMessage = '';
        return;
      }
      this.moveNextPage.emit(); // move to step3 page
    }

    this.errorData = formValuesWithIndexAndAnswer.filter(data => data.index === this.setp2Stepper.selectedIndex)[0];
    this.errorMessage = this.errorData.answer;
    if (!this.errorData.answer) {
      this.setp2Stepper.selectedIndex = this.setp2Stepper.selectedIndex - 1;
      return;
    }
    if (this.setp2Stepper.selectedIndex === formValuesWithIndexAndAnswer.length - 1) {
      this.step2LastIndex = true;
    }
    formValuesWithIndexAndAnswer.push(this.budgetRateobj)
    this.riskManagerService.setAdvancePolicyStep2Formvalue(formValuesWithIndexAndAnswer);
  }

  previous() {
    this.isSubmitForm = false;
    this.errorMessage = '';
    if (this.step2LastIndex) {
      this.step2LastIndex = false;
    }
    if (this.setp2Stepper.selectedIndex === 0) {
      this.movePreviousPage.emit(); // move to step1 page
    } else {
      this.setp2Stepper.previous();
    }
  }

  ngOnDestroy(): void {
    this.getAdvancePolicyBudgetRate$.unsubscribe();
    this.step2LastIndex$.unsubscribe();
  }
  
  backTodashboard() {
    this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + 'risk-manager/risk-manager-dashboard' : '/risk-manager/risk-manager-dashboard']);
  }

}
