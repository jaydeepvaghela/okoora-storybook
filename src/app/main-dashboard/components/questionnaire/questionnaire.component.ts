import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { WalletsService } from '../../services/wallets.service';
import { balanceList } from '../../dashboard-data/balanceList-data';
import { MatStepperModule } from '@angular/material/stepper';
import { QuestionnaireStep1Component } from '../questionnaire-step1/questionnaire-step1.component';
import { QuestionnaireStep2Component } from '../questionnaire-step2/questionnaire-step2.component';
import { QuestionnaireStep3Component } from '../questionnaire-step3/questionnaire-step3.component';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  imports: [MatDialogModule, MatStepperModule, QuestionnaireStep1Component, QuestionnaireStep2Component, QuestionnaireStep3Component]
})
export class QuestionnaireComponent {
  isLastStep = false;
  questionaryForm!: FormGroup;
  currencyList: any = [];
  showLoader!: boolean;
  visiblePopup: any;
  step2BackClicked: boolean = false;
  unSubscribe$ = new Subject<void>();
  @Input() currentStep = 0;

  constructor(private fb: FormBuilder,
    private _walletService: WalletsService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.showLoader = true;
    this.step2BackClicked = false;
    of(balanceList).subscribe((result: any) => {
      this.visiblePopup = result.find((x: any) => x.wallet_SupportBaseHedging === true && x.wallet_Hedging != null)
      this.showLoader = false
      this.currencyList = result;
    },
    (err) => {
      this.showLoader = false
    })
    this.questionaryForm = this.fb.group({
      defaultCurrency: this.fb.group({
        currency: ['', Validators.required],
      }),
      addMoreCurrency: this.fb.group({
        currencyPair: this.fb.array([]),
      })
    });
  }


  stepChange(stepper: any) {
    this.step2BackClicked = false;
    if (this.data?.openQuestionary == true) {
      this.step2BackClicked = true;
    }
    this.isLastStep = stepper.selectedIndex == stepper.steps.length - 1;
  }
}
