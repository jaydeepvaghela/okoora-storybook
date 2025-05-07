import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';

import { catchError, skip, switchMap, take, tap, throttleTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { IStepsObj, EErrorMessages } from '../kyc';
import { StepActionType } from '../types/global.type';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KycService } from '../services/kyc.service';

export const pwdConfirming = (data: { key: string, confirmationKey: string }): ValidatorFn => {
    const { key, confirmationKey } = data;

    return (group: any) => {
        const input = group.controls[key];
        const confirmationInput = group.controls[confirmationKey];
        return input.value !== confirmationInput.value ? { passwordNotEquivalent: true } : null
    };
}


@Component({
    selector: 'kyc-create-password',
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './kyc-create-password.component.html',
    styleUrls: ['./kyc-create-password.component.scss'],
})
export class KycCreatePasswordComponent implements OnInit {
    hidePassword = true;
    hideConfirmPassword = true;

  componentDestroyed = new Subject<any>();
  @Input('parentFormGroup')
  parentFormGroup!: FormGroup;
  @Input('kycForm') kycForm: any;
  @Input('stepsObj') stepsObj!: IStepsObj;
  @Output('nextStepEvent') nextStepEvent = new EventEmitter<StepActionType>();
  foused = false;
  minPasswordLength = 8;
  _hasLowerCase = /[a-z]/;
  _hasUpperCase = /[A-Z]/;
  _hasDigit = /\d/;
  _hasSpecial = /[!@#$%^&*()\[\]{}\\\-_+={}|\\:;'",<>,.?/~`]/;
  hasEightCharsListItem!: boolean;
  hasSpecialListItem!: boolean;
  hasDigitListItem!: boolean;
  hasSpecial!: boolean;
  hasUpper!: boolean;
  hasDigit!: boolean;
  hasLower!: boolean;
  hasEight!: boolean;
  illegally!: boolean;
  isFromIsrael!: boolean;
  showLoader: any = false;  
  createUser$ = new BehaviorSubject<boolean>(false);
  loading = false;
  step_6_passwords!: FormGroup | any;

    constructor(
        private KycS: KycService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.step_6_passwords = this.getPasswordsFormGroup()
        console.log('this.kycForm?.value?.step_1',this.kycForm?.value?.step_1);
        this.isFromIsrael = this.kycForm?.value?.step_1?.companyAcc?.countrySelected !== null && this.kycForm?.value?.step_1?.companyAcc?.countrySelected !== 'Israel' ? true : false;
      this.checkStrength()
    }

    codeValidHandler() {
        this.nextStepEvent.next('NEXT');
    }
    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
      }
    toggleConfirmPasswordVisibility(): void {
        this.hideConfirmPassword = !this.hideConfirmPassword;
      }
    checkStrength() {
        this.illegally = false;
        let pw = this.getPasswordControl()?.value;
        this.hasEight = pw.length >= this.minPasswordLength;
        this.hasDigit = this._hasDigit.test(pw);
        this.hasSpecial = this._hasSpecial.test(pw);
        this.hasLower = this._hasLowerCase.test(pw);
        this.hasUpper = this._hasUpperCase.test(pw);
        if (!this.hasEight || !this.hasDigit || !this.hasSpecial || !this.hasLower || !this.hasUpper) {
            this.illegally = true;
        }

    }
    handleNextStep() {
        let pw = this.getPasswordControl()?.value;
        if (!pw) {
            console.error(`must enter password`);
            return;
        }
        if (!this.kycForm.get('step_6').valid) {
            console.error(`user was able to click continue even though button disabled.`);
            return;
        }
        if (this.illegally) {
            console.error(`user was able to click continue even though button disabled.`);
            return;
        }

        if (this.isFromIsrael) {
          console.log('isFromIsrael', this.isFromIsrael);
          this.createUser$
              .pipe(take(1))
              .subscribe(() => {
                  this.callCreateNewUserAPI();
              });
  
          this.createUser$.next(true);
          this.nextStepEvent.next('NEXT');
        } else {
          this.nextStepEvent.next('NEXT');
        }
    }

    callCreateNewUserAPI() {
      this.createUser$
            .pipe(
                tap(() => {
                    this.KycS.loading$.next(true);
                    this.loading = true;
                }),
                throttleTime(500),
                switchMap(() => {
                    // console.log(this.kycForm.getRawValue());
                    const oldData = this.kycForm.getRawValue();
                    const isCompany = oldData.step_1.companyAcc.isActive
                    const newData = {
                        accountType: oldData.step_1.companyAcc.isActive ? 2 : 1,
                        email: oldData.step_2.email,
                        countryCode: isCompany ? oldData.step_1.companyAcc.countryCode : oldData.step_1.privateAcc.countryCode, // Assumes ISO 2 code is already being used
                        phoneCode: oldData.step_4.phone_code?.toString().replaceAll('+', ''),
                        phoneNumber: oldData.step_4.phone,
                        passwords: oldData.step_6.passwords,
                        role: 1
                    };
                    return [];  
                }),
                catchError((e: HttpErrorResponse) => {
                    this.KycS.loading$.next(false);
                    this.loading = false;
                    return EMPTY;
                })
            )
            .subscribe(r => {

                if (r) {
                    localStorage.removeItem('step')
                    localStorage.removeItem('kycForm')

                      window.location.href = '/login';
                      this.nextStepEvent.next('NEXT');

                } else {
                    this.KycS.showError$.next({ hasError: true, msg: EErrorMessages.SomethingWentWrong })
                }
                this.KycS.loading$.next(false);
                this.loading = false;
            });
    }

    getPasswordsFormGroup(): FormGroup | null {
        return this.kycForm.get('step_6').get('passwords') as FormGroup | null;
    }

    getPasswordControl(): AbstractControl | null {
        const passwordsFormGroup = this.getPasswordsFormGroup();
        return passwordsFormGroup ? passwordsFormGroup.get('password') : null;
    }
    getConfirmPasswordControl(): AbstractControl | null {
        const passwordsFormGroup = this.getPasswordsFormGroup();
        return passwordsFormGroup ? passwordsFormGroup.get('confirmPassword') : null;
    }

  restrictSpecialCharacters(event: any) {
    const disallowedKeys = /[<>:;+=]/;

    if (event.type === 'paste') {
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      const pastedData = clipboardData.getData('text');
      if (disallowedKeys.test(pastedData)) {
        event.preventDefault();
      }
    } else {
      if (event?.target?.value?.length === 0 && (event?.key === '0' || event?.key === '.')) {
        event?.preventDefault();
      } else {
        if (event?.key === '.' && event?.target?.value.includes('.')) {
          event?.preventDefault();
        }
        const allowedKeys = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|\\,.<>\/?~`'"]$/;
        if (!allowedKeys.test(event.key) || disallowedKeys.test(event.key)) {
          if (!['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
            event.preventDefault();
          }
        }
      }
    }
  }

  restrictPaste(event: any) {
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData.getData('Text');
    const restrictedSymbols = /[<>=+]/;
    if (restrictedSymbols.test(pastedData)) {
      event.preventDefault();
    }
  }

    ngOnDestroy() {
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();
    }
}
