import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoginRoute: any;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(''),
  });
  needVerification: any;
  typeVerificationCode: any;
  hidePassword: any;
  error: any;
  showLoader: any;

  constructor(private router: Router) { }

  login() {
    throw new Error('Method not implemented.');
  }

  rememberValueChange(arg0: any) {
    throw new Error('Method not implemented.');
  }

  goToForgot() {
    throw new Error('Method not implemented.');
  }
  
  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
  
  handleKycCompletion($event: Event) {
    throw new Error('Method not implemented.');
  }

}
