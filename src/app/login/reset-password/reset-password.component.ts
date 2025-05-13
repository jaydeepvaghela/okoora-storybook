import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CodeVerificationComponent } from '../code-verification/code-verification.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, CodeVerificationComponent, TranslateModule],
})
export class ResetPasswordComponent implements OnInit {
  hidePassword = true;
  hideConfPassword = true;
  typeVerification!: string;
  illegall!: boolean;
  hasLower!: boolean;
  minPasswordLength: number = 8;
  hasEight!: boolean;
  hasUpper!: boolean;
  hasDigit!: boolean;
  hasSpecial!: boolean;
  Validation = {
    hasLowerCase: /[a-z]/,
    hasUpperCase: /[A-Z]/,
    hasDigit: /\d/,
    hasSpecial: /[!@#$%^&*\(\)\_\-\[\]\{}\\=+|;':",.\/<>?]/,
    minPasswordLength: 8
  }
  _hasLowerCase = this.Validation.hasLowerCase;
  _hasUpperCase = this.Validation.hasUpperCase;
  _hasDigit = this.Validation.hasDigit;
  _hasSpecial = this.Validation.hasSpecial;
  isPasswordNotMatch = false;
  invalidAccount = false;
  needVerification = false;
  showLoader = false;
  error = ""
 

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, this.passwordValidator()]),
    confirmPassword: new FormControl('', [Validators.required])
  })

  constructor(private router: Router) { }


  ngOnInit() {
    this.resetFormErrors();
    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.resetFormErrors();
    });
  }

  passwordValidator(): ValidatorFn {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*]*$/;

    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value || !passwordPattern.test(value)) {
        return { 'invalidPassword': true };
      }
      return null;
    };
  }

  gotoBack() {
    this.router.navigate(['/login']);
  }
  resetFormErrors() {
    this.error = "";
    this.invalidAccount = false;
  }
  resetPassword() {
    if (!this.illegall) {
      this.resetPasswordForm.markAllAsTouched(); // Mark all form controls as touched to trigger validation messages
      if (this.resetPasswordForm.valid) {
        this.error = '';
        this.showLoader = true;

        // this._forgotPasswordService.sendSmsVerification(this.resetPasswordForm?.value?.email)
        //   .pipe(
        //     tap((response: any) => {
        //       this.showLoader = false;
        //       if (response.message === ResponseMessages.UserNotExist) {
        //         this.invalidAccount = true;
        //       } else {
        //         this.needVerification = true;
        //         this.typeVerification = 'SMS';
        //       }
        //     }),
        //     catchError((error: any) => {
        //       this.showLoader = false;
        //       this.error = error.error.apiErrorCode.toString();
        //       console.error(error);
        //       return throwError(error);
        //     })
        //   )
        //   .subscribe();
      }
    }
  }

  strongPasswordCheck() {
    this.illegall = false;
    let password = this.resetPasswordForm?.value?.newPassword;
    this.hasEight = (password && password.length >= this.minPasswordLength) || false;
    this.hasLower = this._hasLowerCase?.test(password!);
    this.hasUpper = this._hasUpperCase?.test(password!);
    this.hasDigit = this._hasDigit?.test(password!);
    this.hasSpecial = this._hasSpecial?.test(password!);

    if (
      !this.hasEight ||
      !this.hasDigit ||
      !this.hasSpecial ||
      !this.hasUpper ||
      !this.hasLower
    ) {
      this.illegall = true;
    } else {
      this.illegall = false;
    }
  }
}
