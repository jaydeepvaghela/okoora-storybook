import { Component } from '@angular/core';
import { EBusinessType, EStepNumber, IStepsObj, TBusinessTypes } from '../kyc';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kyc-main',
  imports: [CommonModule, MatIconModule, TranslateModule],
  providers: [TranslateService],
  templateUrl: './kyc-main.component.html',
  styleUrl: './kyc-main.component.scss'
})
export class KycMainComponent {
  stepsObj: IStepsObj = {
    currentStep: EStepNumber.typeOfBusiness,
    maxSteps: EStepNumber.personalAddress,
    minSteps: EStepNumber.typeOfBusiness
  };

  Esteps: typeof EStepNumber = EStepNumber;

  accountType!: TBusinessTypes;
  EBusinessType = EBusinessType;
  error: any;
  codeStatus: any;
  faqUrl: any;


  constructor(private translate: TranslateService) { }

  ngOnInit() { }

  handlePreviousBtn() {

  }

  showPrevBtn() {

  }

  emailValue() {

  }

  handleEditValue($event: any, type: any) {

  }

  phoneValue() {

  }

  tryAgain() {
    throw new Error('Method not implemented.');
  }
  goToLogin() {
    throw new Error('Method not implemented.');
  }
  showLoginBtn(): any {
    throw new Error('Method not implemented.');
  }

}
