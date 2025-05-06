import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, throttleTime } from 'rxjs';
import { IStepsObj, TBusinessTypes, EBusinessType } from '../kyc';
import { StepActionType } from '../types/global.type';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-kyc-two',
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './kyc-two.component.html',
  styleUrl: './kyc-two.component.scss'
})
export class KycTwoComponent {
  componentDestroyed = new Subject<void>();
  isLoading: boolean = false;
  @Input() parentFormGroup!: FormGroup;
  @Input() kycForm: any;
  @Input() stepsObj!: IStepsObj;
  @Output() nextStepEvent = new EventEmitter<StepActionType>();
  emailSignUp$ = new Subject<string>();
  privacyPolicyUrl: string = 'https://okoora.com/terms-of-service/';
  termsOfUseUrl: string = 'https://okoora.com/terms-of-service/';
  accountType!: TBusinessTypes;
  EBusinessType = EBusinessType;
  step_2!: FormGroup;

  ngOnInit(): void {
    this.step_2 = this.kycForm.get('step_2') as FormGroup;

    // this.emailSignUp$
    //   .pipe(
    //     throttleTime(300),
    //     exhaustMap((email) => this.kycS.sendMailVerification(email)),
    //     catchError((e: HttpErrorResponse) => {
    //       this.kycS.loading$.next(false);
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe((res) => {
    //     if (!Boolean(res)) {
    //       console.warn(`res is falsy`);
    //       this.kycS.loading$.next(false);
    //       return;
    //     }
    //     if (res) {
    //       this.nextStepEvent.next('NEXT');
    //     }


    //  else  {
    //       // user passed the limit of sending verification code.
    //       // this.kycS.verificationCodeStatus.next('PASSED_LIMIT');
    //       this.nextStepEvent.next('NEXT');
    //     }
    //     // this.kycS.loading$.next(false);
    //   });

    // this.kycS.loading$
    //   .pipe(
    //     takeUntil(this.componentDestroyed)
    //   )
    //   .subscribe(loadingState => {
    //     this.isLoading = loadingState;
    //   });

    // this.kycS.getAccountType$()
    //   .subscribe(accountType => {
    //     this.accountType = accountType;
    //   });
  }

  handleSignUp(): void {
    // Error handling
    if (!this.kycForm.controls.step_2.get('email')?.valid) {
      console.warn(`user was able to click submit even though the form is not valid `)
      return;
    }
    const email = this.kycForm?.controls?.step_2.get('email')?.value;
    if (!email) {
      console.warn(`user was able to click submit even though email is falsy: ${email}`)
      return;
    }
    // Error handling

    // this.kycS.loading$.next(true);
    // this.kycS.verificationCodeStatus.next('DEFAULT');
    this.nextStepEvent.next('NEXT');
    this.emailSignUp$.next(email);
  }

  disableSignUpBtn(): boolean {
    return !this.kycForm.controls.step_2.valid || this.isLoading;
  }

  restrictSpecialCharacters(event: any) {
    const invalidChars = ['<', '>', ';', '=', '+'];
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    } else {
      const dotOccurrences = (event?.target?.value.match(/\./g) || []).length;
      if (event?.key === "." && dotOccurrences >= 3) {
        event?.preventDefault();
      }

      if (invalidChars.includes(event.key)) {
        event.preventDefault();
      }
      // const allowedKeys = /^[a-zA-Z0-9.@\u00C0-\u017F]$/;
      const allowedKeys = /^[a-zA-Z0-9._\-@\u00C0-\u017F]$/; // Included - and _
      if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  filterInvalidCharacters(event: any) {
    const input = event.target;
    const invalidChars = /[<>;=+]/g;
    input.value = input.value.replace(invalidChars, '');
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
