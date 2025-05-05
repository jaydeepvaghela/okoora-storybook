// kyc-main.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IStepsObj, EStepNumber, TBusinessTypes, EBusinessType } from '../kyc';

@Component({
  selector: 'app-kyc-main',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './kyc-main.component.html',
  styleUrls: ['./kyc-main.component.scss']
})
export class KycMainComponent implements OnInit {
  stepsObj: IStepsObj = {
    currentStep: EStepNumber.typeOfBusiness,
    maxSteps: EStepNumber.personalAddress,
    minSteps: EStepNumber.typeOfBusiness
  };

  Esteps: typeof EStepNumber = EStepNumber;
  error: any = {
    hasError: false,
    msg: null
  };
  accountType!: TBusinessTypes;
  EBusinessType = EBusinessType;
  codeStatus: any;
  faqUrl: any;
  appLoginUrl: any;

  constructor(private translateService: TranslateService) {
    // You can set default language here if needed
    // this.translateService.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.stepsObj.currentStep = 1;
  }

  handlePreviousBtn() {
    if (this.stepsObj.currentStep > this.stepsObj.minSteps) {
      this.stepsObj.currentStep--;
    }
  }

  showPrevBtn() {
    return this.stepsObj.currentStep > this.stepsObj.minSteps;
  }

  emailValue() {
    // Implement as needed
    return '';
  }

  handleEditValue($event: any, type: any) {
    // Implement as needed
    console.log('Edit value:', $event, 'for type:', type);
  }

  phoneValue() {
    // Implement as needed
    return '';
  }

  tryAgain() {
    // Implement retry logic
    this.error = { hasError: false, msg: null };
  }
  
  goToLogin() {
    // Implement login navigation
    window.location.href = this.appLoginUrl || '/login';
  }
  
  showLoginBtn(): boolean {
    // Return boolean instead of any
    return !!this.codeStatus && this.codeStatus === 'ACCOUNT_EXISTS';
  }
}