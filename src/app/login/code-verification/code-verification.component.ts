import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, combineLatest, finalize, of, scan, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { KycService } from '../../sign-up/services/kyc.service';
import { TSendMailResponse, TVerificationCodeStatus } from '../../sign-up/kyc';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.scss'],
  imports: [CommonModule, FormsModule, TranslateModule, MatTooltipModule],
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
  digit1!: number;
  digit2!: number;
  digit3!: number;
  digit4!: number;
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

  constructor(private KycS: KycService, private router: Router) {
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
  backToLogin() {
    return location.href = "/login";
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

  verifyCode() {
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
  checkVerification() {
    if (!this.digit1 || !this.digit2 || !this.digit3 || !this.digit4) {
      return;
    }
    this.handleActionByStep({ action: 'CHECK' });
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
