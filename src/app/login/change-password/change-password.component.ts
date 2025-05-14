import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
})
export class ChangePasswordComponent implements OnInit {
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
    newPassword: new FormControl('', [Validators.required, this.passwordValidator()]),
    confirmPassword: new FormControl('', [Validators.required])
  })

  constructor(private router: Router) { }


  ngOnInit() {
    this.changeFormErrors();
    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.changeFormErrors();
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

  navigateBack() {
    this.router.navigate(['/reset-password']);
  }
  changeFormErrors() {
    this.error = "";
    this.invalidAccount = false;
  }
  changePassword() {
    if (this.resetPasswordForm?.value?.newPassword == this.resetPasswordForm?.value?.confirmPassword &&
      this.resetPasswordForm.controls.newPassword.valid && this.resetPasswordForm.controls.confirmPassword.valid
    ) {
      this.resetPasswordForm.markAllAsTouched();
      this.router.navigate(['/login']);
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
