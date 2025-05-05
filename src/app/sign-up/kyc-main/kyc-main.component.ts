// kyc-main.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IStepsObj, EStepNumber, TBusinessTypes, EBusinessType, IKycData } from '../kyc';
import { KycOneComponent } from '../kyc-one/kyc-one.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StepActionType } from '../types/global.type';
import { KycTwoComponent } from '../kyc-two/kyc-two.component';

@Component({
  selector: 'app-kyc-main',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    KycOneComponent, 
    KycTwoComponent
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
  kycForm: any;

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
  stepCurrent: any;
  detailsToShow: any;

  constructor(private fb: FormBuilder,) {
    this.kycForm = this.fb.group({
      // kyc-one
      step_1: fb.group({
          companyAcc: fb.group({
              isActive: [false],
              countrySelected: [''],
              countryCode: ['']
          }),
          privateAcc: fb.group({
              isActive: [false],
              countrySelected: [''],
              countryCode: ['']

          }),
      }),
      // kyc-two
      step_2: fb.group({
          email: ['', [Validators.required, Validators.email,Validators.pattern('^(?!-)[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          agree: [false, [Validators.requiredTrue]]
      }),


      // kyc-email-confirm
      step_3: fb.group({
          email_code_sent: [''],
          email_code_user_enter: [''],
      }),
      // kyc-phone
      step_4: fb.group({
          phone_code: ['', Validators.required],
          phone: ['', Validators.required],
      }),
      // kyc-phone-confirm
      step_5: fb.group({
          phone_confirmation_sent: [''],
          phone_confirmation_user_enter: [''],
      }),
      // kyc-create-password
      step_6: fb.group({
          passwords: new FormGroup(
              {
                  password: new FormControl("", [Validators.required]),
                  confirmPassword: new FormControl("", [Validators.required]),
              }, {
              validators: this.passwordMatchValidator()
          }
          )
      }),

      step_7: fb.group({
          first_name: ['', [Validators.required]],
          first_name_he: [''],
          last_name: ['', [Validators.required,]],
          last_name_he: [''],
          id_number: ['', [Validators.required]],
          birth_date: ['', [Validators.required]],
          applicantId: [''],

      }),
      step_8: fb.group({
          country: ['', Validators.required],
          street_address: ['', [Validators.required]],
          city: ['', [Validators.required,]],
          zipcode: ['', [Validators.required]],
      }),
  });
  }

  ngOnInit(): void {
    this.stepsObj.currentStep;
  }
  passwordMatchValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }

        return null;
    };
};
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
  stepHandler(action: StepActionType) {
    if (!action) {
      console.warn(`action is not provided in stepHander`);
      return;
    }
    if (this.kycForm?.value?.step_1?.companyAcc?.countrySelected !== null && this.kycForm?.value?.step_1?.companyAcc?.countrySelected !== 'Israel')
      this.stepsObj.maxSteps = EStepNumber.createPassword;

    switch (action) {
      case 'NEXT':
        // console.log(this.kycForm)
        if (this.stepsObj.currentStep >= this.stepsObj.maxSteps) {
          if (this.stepsObj.currentStep > this.stepsObj.maxSteps) {
            console.warn(`current step was greater than the max steps \n currenct step given ${this.stepsObj.currentStep} \n max steps: ${this.stepsObj.maxSteps}`);
          }
          this.stepsObj.currentStep = this.stepsObj.maxSteps;
        } else {
          if (this.stepsObj.currentStep == this.Esteps.phone) {
            this.stepsObj.currentStep++;
          }
          this.stepCurrent = ++this.stepsObj.currentStep;
          localStorage.setItem('step', JSON.stringify(this.stepCurrent));
          localStorage.setItem('kycForm', JSON.stringify(this.kycForm.value));
        }
        break;
      case 'PREV':
        if (this.stepsObj.currentStep <= this.stepsObj.minSteps) {
          this.stepsObj.currentStep = this.stepsObj.minSteps;
        } else {
          if (this.stepsObj.currentStep == this.Esteps.createPassword) {
            this.stepsObj.currentStep--;
          }
          this.stepsObj.currentStep--;
        }
        break;
      default:
        const exhaustiveCheck: never = action;
        console.error(`unhandeled action occured. ${exhaustiveCheck}`);
        break;
    }
  }// # stepHandler
  handleDetailToShow(bType: IKycData['businessTypes']) {
    if (this.detailsToShow.step_1) {
      this.detailsToShow.step_1.detailName = bType;

    }
}
}