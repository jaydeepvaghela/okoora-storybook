import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HedgingDataService } from '../../../hedging-proposal/hedging-data.service';
import { AdvancePolicyQuestions } from '../../../enums/advancePolicyQuestions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-policy-step3',
  imports: [CommonModule],
  templateUrl: './advanced-policy-step3.component.html',
  styleUrl: './advanced-policy-step3.component.scss'
})
export class AdvancedPolicyStep3Component implements OnInit {
  showfinalStep: boolean = false;
  router = inject(Router);
  step2Res: any;
  advancePolicyFlag: boolean = false;
  riskManagerService = inject(HedgingDataService);
  @Output() fromStep3 = new EventEmitter<void>();
  errorMessage = "";
  showLoader: boolean = false;
  advancePolicyFromAPI: any;

  ngOnInit(): void {
    // this.getAlreadyCompletedPolicy();
    this.riskManagerService.getAdvancePolicyStep2Data.subscribe(res => {
      this.step2Res = res.sort((a: any, b: any) => a.index - b.index);
    })
    // this.advancePolicyFlag = this.riskManagerService.advancePolicyFlag;
    this.riskManagerService.advancePolicyFlag$.subscribe(flag => {
      this.advancePolicyFlag = flag;
    });
  }


  // getAlreadyCompletedPolicy() {
  //   this.riskManagerService?.advancePolicyCompleted$.subscribe({
  //     next: (response) => {
  //       if (response) {
  //         this.riskManagerService?.getAdvancePolicyData().subscribe({
  //           next: (result) => {
  //             this.advancePolicyFromAPI = result;
  //             const budgetRateFromAPI = this.advancePolicyFromAPI?.budgetRate;
  //             this.riskManagerService.setAdvancePolicyFormvalue(budgetRateFromAPI);
  //             if (this.advancePolicyFromAPI && this.advancePolicyFromAPI?.questionAndScores) {
  //               this.step2Res = [];
  //               this.step2Res.push({
  //                 index: 0,
  //                 answer: this.advancePolicyFromAPI.budgetRate
  //               });

  //               this.step2Res.forEach((item: any) => {
  //                 const index = item.advancePolicyQuestions;
  //                 if (index >= 0) {
  //                   this.step2Res.push({
  //                     index: index,
  //                     answer: this.mapIntegerToAnswer(item.score, index)
  //                   });
  //                 }
  //               });
  //               this.step2Res = this.step2Res.sort((a: any, b: any) => a.index - b.index);
  //               this.riskManagerService.setAdvancePolicyStep2Formvalue(this.step2Res);
  //         //     }
  //           },
  //           error: (error) => {

  //           }
  //         })
  //       }
  //     },
  //     error: () => {
  //       console.error('Error fetching policy completion flag');
  //     }
  //   });
  // }


  previous() {
    this.fromStep3.emit();
  }

  backToDashboard() {
    this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + 'risk-manager/risk-manager-dashboard' : '/risk-manager/risk-manager-dashboard']);
  }

  navigateToSteppers(stepperindex: number) {
    this.riskManagerService.navigateToAdvancePolicyStepper(stepperindex);
  }

  private mapIntegerToAnswer(score: number, questionIndex: number): string {
    switch (questionIndex) {
      case 1:
        switch (score) {
          case 4: return "Very High";
          case 3: return "High";
          case 2: return "Medium";
          case 1: return "Low";
          default: return "Unknown";
        }
      case 2:
        switch (score) {
          case 4: return "No Impact";
          case 3: return "Low";
          case 2: return "Medium";
          case 1: return "High";
          default: return "Unknown";
        }
      case 3:
        switch (score) {
          case 4: return "Very Low";
          case 3: return "Low";
          case 2: return "Medium";
          case 1: return "High";
          case 0: return "Don't Know";
          default: return "Unknown";
        }
      case 4:
        switch (score) {
          case 4: return "Very High";
          case 3: return "High";
          case 2: return "Medium";
          case 1: return "Low";
          case 0: return "Don't Know";
          default: return "Unknown";
        }
      case 5:
        switch (score) {
          case 4: return "Low";
          case 3: return "Medium";
          case 2: return "High";
          case 1: return "Very High";
          case 0: return "Don't Know";
          default: return "Unknown";
        }
      case 9:
        switch (score) {
          case 4: return "Low";
          case 3: return "Medium";
          case 2: return "High";
          case 1: return "Very High";
          case 0: return "Don't Know";
          default: return "Unknown";
        }
      default:
        return "Unknown";
    }
  }

  private mapAnswerToInteger(answer: string, questionIndex: number): number {
    switch (questionIndex) {
      case 1:
        switch (answer) {
          case "Very High": return 4;
          case "High": return 3;
          case "Medium": return 2;
          case "Low": return 1;
          default: return -1;
        }
      case 2:
        switch (answer) {
          case "No Impact": return 4;
          case "Low": return 3;
          case "Medium": return 2;
          case "High": return 1;
          default: return -1;
        }
      case 3:
        switch (answer) {
          case "Very Low": return 4;
          case "Low": return 3;
          case "Medium": return 2;
          case "High": return 1;
          case "Don't Know": return 0;
          default: return -1;
        }
      case 4:
        switch (answer) {
          case "Very High": return 4;
          case "High": return 3;
          case "Medium": return 2;
          case "Low": return 1;
          case "Don't Know": return 0;
          default: return -1;
        }
      case 5:
        switch (answer) {
          case "Low": return 4;
          case "Medium": return 3;
          case "High": return 2;
          case "Very High": return 1;
          case "Don't Know": return 0;
          default: return -1;
        }
      case 9:
          switch (answer) {
            case "Low": return 4;
            case "Medium": return 3;
            case "High": return 2;
            case "Very High": return 1;
            case "Don't Know": return 0;
            default: return -1;
          }
      default:
        return -1;
    }
  }

  private mapQuestionsToInteger(index: number): number {
    switch (index) {
      case 1: return AdvancePolicyQuestions["CertaintyExposureLevel"];
      case 2: return AdvancePolicyQuestions["AbilityImpactCustomer"];
      case 3: return AdvancePolicyQuestions["DifferentiationFromCompetitors"];
      case 4: return AdvancePolicyQuestions["CompetitivenessLevel"];
      case 5: return AdvancePolicyQuestions["CreditSensitivity"];
      case 9: return AdvancePolicyQuestions["CreditSensitivity"];
      default: return -1; // Handle unexpected values
    }
  }

  onConfirm() {
    this.showLoader = true;
    if (this.step2Res && this.step2Res.length !== 0) {
      let questionAndScores = [];
      this.errorMessage = '';
      for (let index = 1; index < this.step2Res.length; index++) {
        const obj = {
          advancePolicyQuestions: 0,
          score: 0
        };
        // Map question index and score
        obj.advancePolicyQuestions = this.mapQuestionsToInteger(this.step2Res[index].index);
        // obj.score = this.mapAnswerToInteger(this.step2Res[index].answer);
        obj.score = this.mapAnswerToInteger(this.step2Res[index].answer, this.step2Res[index].index);
        questionAndScores.push(obj);
      }

      const updateAdvancePolicyModel = {
        "budgetRate": this.step2Res[0]?.answer,
        "questionAndScores": questionAndScores
      }
      this.showfinalStep = true;

      // this.riskManagerService?.updateAdvancePolicydata(updateAdvancePolicyModel).subscribe((res: any) => {
      //   if (res?.["body"]) {
      //     this.showfinalStep = true;
      //     this.showLoader = false;
      //   }
      // }, (error) => {
      //   this.showLoader = false;
      //   this.errorMessage = error?.error?.apiErrorMessage[0] ? error?.error?.apiErrorMessage[0] : "Oops! Something went wrong. Please try again later.";
      // });
    }
  }

}
