import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeVerificationComponent } from './code-verification/code-verification.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatCheckboxModule, CodeVerificationComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  hidePassword = true;
  needVerification = false;
  userNotExist = false;
  invalidCredentials = false;
  typeVerificationCode  = '';
  showLoader = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(''),
  });
  planMsg: any;
  error!: string;
  loginData: boolean = false;

  constructor(private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.checkRemember();

    this.loginForm.controls.username.valueChanges.subscribe((value) => {
      if (!value) {
        this.isloginFormHasError();
      } else {
        this.error = '';
      }
    });
    this.loginForm.controls.password.valueChanges.subscribe((value) => {
      if (!value) {
        this.isloginFormHasError();
      } else {
        this.error = '';
      }
    });
  }

  goToForgot() {
    this.router.navigate(['/reset-password']);
  }

  navigateToDashboard() {
    if (!this.loginForm.valid) {
      this.isloginFormHasError();
      return;
    }

    const enteredPassword = this.loginForm.value.password;
    if (enteredPassword !== 'Okoora1!') {
      this.error = 'Passwords do not match';
      return;
    }
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000);
    this.error = '';
    this.rememberValueChange(this.loginForm?.value?.rememberMe!);
  }


  goToSignUp() {
    this.router.navigate(['sign-up']);
  }

  rememberValueChange(remember: string) {
    if (remember) {
      localStorage.setItem('remember_me', JSON.stringify(this.loginForm.value));
    } else {
      localStorage.removeItem('remember_me');
    }
  }

  checkRemember() {
    let rememberMe = localStorage.getItem('remember_me');
    if (rememberMe) {
      this.loginForm.patchValue(JSON.parse(rememberMe));
    }
  }

  isloginFormHasError(errorMessage: string | null = null) {
    console.log('errorMessage',errorMessage);
    if (errorMessage && errorMessage.includes("Login Timeout")) {
      this.error = errorMessage;
    } else {
      if (errorMessage && errorMessage.includes("Account is blocked. Please contact support")) {
        this.error = errorMessage;
      } else {
        this.error = "User name or password are incorrect";
      }
    }
  }

}
