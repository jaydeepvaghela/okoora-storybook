import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
  @Input() step2Res = [
    {
        "index": 0,
        "answer": "5.0955"
    },
    {
        "index": 1,
        "answer": "High"
    },
    {
        "index": 2,
        "answer": "Medium"
    },
    {
        "index": 3,
        "answer": "Low"
    },
    {
        "index": 4,
        "answer": "Very High"
    },
    {
        "index": 5,
        "answer": "High"
    }
  ];
  advancePolicyFlag: boolean = false;
  riskManagerService = inject(HedgingDataService);
  @Output() fromStep3 = new EventEmitter<void>();
  errorMessage = "";
  showLoader: boolean = false;
  advancePolicyFromAPI: any;

  ngOnInit(): void {
    this.riskManagerService.getAdvancePolicyStep2Data.subscribe(res => {
      if (res && res.length > 0) {
        this.step2Res = res.sort((a: any, b: any) => a.index - b.index);
      } 
      console.log('response from step2', this.step2Res);

    })
    this.riskManagerService.advancePolicyFlag$.subscribe(flag => {
      this.advancePolicyFlag = flag;
    });
  }




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
        obj.score = this.mapAnswerToInteger(this.step2Res[index].answer, this.step2Res[index].index);
        questionAndScores.push(obj);
      }

      const updateAdvancePolicyModel = {
        "budgetRate": this.step2Res[0]?.answer,
        "questionAndScores": questionAndScores
      }
      this.showfinalStep = true;

      
    }
  }

}
