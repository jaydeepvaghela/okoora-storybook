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
    email: new FormControl('', [Validators.required, Validators.email]),
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

  navigateToLogin() {
    if (this.needVerification) {
      this.needVerification = false;
    } else {
      this.router.navigate(['/login']);
    }
  }
  resetFormErrors() {
    this.error = "";
    this.invalidAccount = false;
  }
  resetPassword() {
    this.resetFormErrors();
    this.resetPasswordForm.markAllAsTouched(); // trigger validation messages

    if (this.resetPasswordForm.invalid) {
      return; // prevent proceeding if form is invalid
    }

  // Proceed only if form is valid
    this.needVerification = true;
    this.typeVerification = 'SMS';
  }
}
