import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.scss'],
  imports: [CommonModule, FormsModule, MatTooltipModule],
})
export class CodeVerificationComponent {
  @Input() formData: any;
  @Input()
  typeVerification!: string;
  @Input()
  type!: string;
  @Input('timerTooltip')
  timerTooltip!: string;
  codeStatus = 'DEFAULT';
  @Output('codeValidEvent') codeValidEvent = new EventEmitter<boolean>();
  componentDestroyed = new Subject<any>();
  @Output() back: EventEmitter<boolean> = new EventEmitter();
  digit1: string = '';
  digit2: string = '';
  digit3: string = '';
  digit4: string = '';
  privacyPolicyUrl: string = 'https://okoora.com/terms-of-service/';
  termsOfUseUrl: string = 'https://okoora.com/terms-of-service/';
  code!: number;
  refreshAPIError: boolean = false;
  codeIsValid: boolean = true;
  incorrectCode = false;
  passwordResetSuccess = false;
  showLoader = false;
  codeResendSuccess = false;
  verificationError = '';
  timer: {
    minutes: string,
    seconds: string,
    active: boolean
  } = {
      minutes: '0',
      seconds: '00',
      active: false
    };
  timerIntervalId: any;

  constructor(private router: Router) {
  }
  ngOnInit() {
    this.resetFormErrors();
    // if (this.formData.valueChanges) {
    //   this.formData.valueChanges.subscribe(() => {
    //     this.resetFormErrors();
    //   });
    // }
    this.startTimer();

  }

  resetFormErrors() {
    this.verificationError = "";
  }

  performEmailVerification(action: 'SEND' | 'CHECK', email: string): void {
    let request: Observable<[string, any]>;
    this.incorrectCode = true;
    this.showLoader = false;

    if (action === 'SEND') {
      // request = combineLatest([
      //   of('SEND'),
      //   // this.KycS.SendEmailVerificationCode(email)
      // ]);
    } else if (action === 'CHECK') {

    }
    else {
      console.error(`Unhandled action ${action}`);
      return;
    }
  }

  onDigitChange(): void {
    this.verificationError = '';
  }

  allDigitsFilled(): boolean {
    return [this.digit1, this.digit2, this.digit3, this.digit4].every(d => d !== '');
  }

  verifyCode() {
    if (!this.allDigitsFilled()) {
      this.verificationError = 'Please enter all 4 digits.';
      return;
    }

    const enteredCode = `${this.digit1}${this.digit2}${this.digit3}${this.digit4}`;

    if (enteredCode === '1111') {
      this.incorrectCode = true;
      this.verificationError = 'The code you have entered is invalid. Please try again.';
      return;
    }

    this.incorrectCode = false;
    this.verificationError = '';
    this.router.navigate(['/change-password']);
  }



  onResend() {
    if (this.timer.active) {
      console.warn(`Resend code called even though the timer is active.`);
      return;
    }
    this.refreshAPIError = false;
    //this.resendCode = true;
    //this.resend.emit();
    this.handleActionByStep({ action: 'SEND' });
  }

  resendCode() {
    this.startTimer();
  }

  startTimer(): void {
    // Clear any existing timer
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }

    const totalSeconds = 60;
    let remainingSeconds = totalSeconds;

    this.timer.active = true;

    this.timerIntervalId = setInterval(() => {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      this.timer.minutes = minutes.toString();
      this.timer.seconds = seconds < 10 ? '0' + seconds : seconds.toString();

      if (remainingSeconds === 0) {
        clearInterval(this.timerIntervalId);
        this.timer.active = false;
      } else {
        remainingSeconds--;
      }
    }, 1000);
  }


  resetPassword(newPassword: any, validationId: string) {
    let request: any = {
      newPassword: newPassword,
      forgetPasswordValidationId: validationId
    }

    // this._forgotPasswordService.resetPassword(request)
    //   .subscribe(
    //     (response: any) => {
    //       const statusCode = response.status;

    //       if (statusCode) {
    //         this.showLoader = false;
    //         this.passwordResetSuccess = true;
    //       }
    //     },
    //     (error: any) => {
    //       console.error(error);
    //     }
    //   );
  }
  handleEditValue(e: Event) {
    e.preventDefault();
  }
  handleSignUp(): void {
    // Error handling 
  }
  emailValue(): string {
    return this.formData.username;
  }
  restrictSpecialCharacters(event: any) {
    const invalidChars = ['<', '>', ';', '=', '+'];
    if (event?.target?.value?.length === 0 && event?.key === ".") {
      event?.preventDefault();
    } else {
      const dotOccurrences = (event?.target?.value.match(/\./g) || []).length;
      if (event?.key === "." && dotOccurrences >= 3) {
        event?.preventDefault();
      }

      if (invalidChars.includes(event.key)) {
        event.preventDefault();
      }
      const allowedKeys = /^[a-zA-Z0-9.@\u00C0-\u017F]$/;
      if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  handleActionByStep(data: { action: 'SEND' | 'CHECK' }): void {
    const { action: dynamicAction } = data;
    let payload: any;
    let verificationAction: 'CHECK_EMAIL_VERIFICATION' | 'SEND_EMAIL_VERIFICATION' | 'CHECK_PHONE_VERIFICATION' | 'SEND_PHONE_VERIFICATION';

    const userEmail = this.formData.username;
    if (!userEmail) return;
    payload = { email: userEmail };
    verificationAction = dynamicAction === 'SEND' ? 'SEND_EMAIL_VERIFICATION' : 'CHECK_EMAIL_VERIFICATION';

    if (verificationAction === 'CHECK_EMAIL_VERIFICATION' || verificationAction === 'SEND_EMAIL_VERIFICATION') {
      this.performEmailVerification(dynamicAction, payload.email);
    }
  }
}
