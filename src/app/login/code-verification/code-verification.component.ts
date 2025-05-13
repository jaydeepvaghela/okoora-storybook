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
  router: any;

  constructor(private KycS: KycService) {
  }
  ngOnInit() {
    this.resetFormErrors();
    if (this.formData.valueChanges) {
      this.formData.valueChanges.subscribe(() => {
        this.resetFormErrors();
      });
    }
    if(this.typeVerification === 'Email')
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
    } else if (action === 'CHECK'){

    }
    else {
      console.error(`Unhandled action ${action}`);
      return;
    }

    // request.subscribe({
    //   next: ([action, res]: [string, any]) => {
    //     switch (action) {
    //       case 'SEND':
    //         let response: TSendMailResponse = <TSendMailResponse>res;
    //         if (response) {
    //           this.startTimer();
    //           this.KycS.loading$.next(false);
    //         } else if (response?.PassedLimitError === VerificationReturnType.PassedLimitError) {
    //           this.startTimer('PASSED_LIMIT');
    //           this.KycS.loading$.next(false);
    //         } else {
    //           this.KycS.showError$.next({ hasError: true, msg: EErrorMessages.SomethingWentWrong });
    //         }
    //         break;
    //       default:
    //         break;
    //     }
    //   },
    //   error: (error) => {
    //     if (error) {
    //       this.refreshAPIError = true;
    //     }
    //   }
    // })
  }

  verifyCode() {
    this.showLoader = true;
    this.refreshAPIError = false;
    if(this.typeVerification === 'Email')
    {
      let request: Observable<[string, any]>;
      this.code = this.digit1 + this.digit2 + this.digit3 + this.digit4;
      // // this._authService.CheckMailVertification(this.code, this.formData)
      // .pipe(
      //   tap((response: any) => {
      //     this.back.emit(true);
      //   }),
      //   catchError(error => {
      //     this.verificationError = error.error.apiErrorCode.toString();
      //     this.refreshAPIError = true;
      //     this.showLoader = false;
      //     return of(null);
      //   }),        
      // )
      // .subscribe();
    } 
    else {   
      this.verificationError = '';
      let verificationCode = this.digit1 + this.digit2 + this.digit3 + this.digit4;
      this.codeResendSuccess = false;
      if (this.type == 'login') {
        let verificationRequest: any = {
          email: this.formData.username,
          verificationCode: verificationCode,
          verificationType: 1
        }
        // this._authService.checkSmsVerification(verificationRequest, this.formData)
        //   .pipe(
        //     tap(response => {
        //       this.incorrectCode = !response?.success;
        //       this.showLoader = false;
        //     }),
        //     catchError(error => {
        //       this.verificationError = error.error.apiErrorCode.toString();
        //       this.showLoader = false
        //       return of(null);
  
        //     })
        //   )
        //   .subscribe();
      } else if (this.type == 'forgot-password') {
        // let verificationRequest: SmsVerificationRequestModel = {
        //   email: this.formData.email,
        //   verificationCode: verificationCode,
        //   verificationType: 2,
        // }
        // this._forgotPasswordService.checkSmsVerification(verificationRequest)
        //   .pipe(
        //     tap((response: any) => {
        //       if (response.validateId) {
        //         const newPassword = {
        //           password: this.formData.newPassword,
        //           confirmPassword: this.formData.confirmPassword
        //         }
        //         this.resetPassword(newPassword, response.validateId);
        //       } else if (!response.validateId && response.message == ResponseMessages.WrongVerificationCode) {
        //         this.incorrectCode = true;
        //       }
        //       this.showLoader = false;
        //     }),
        //     catchError(error => {
        //       this.verificationError = error.error.apiErrorCode.toString();
        //       this.showLoader = false;
        //       return of(null);
        //     })
        //   )
        //   .subscribe();
      }
    }
  }

  resendCode() {
    if (this.type == 'login') {
      // this._authService.sendSmsVerification(this.formData.username).subscribe((res: any) => {
      //   if (res?.success) {
      //     this.codeResendSuccess = true;
      //   } else {
      //     this.verificationError = res?.message;
      //   }
      // });
    } else if (this.type == 'forgot-password') {
      // this._forgotPasswordService.sendSmsVerification(this.formData.email).subscribe(res => {
      //   this.codeResendSuccess = true;

      //   setTimeout(() => {
      //     this.codeResendSuccess = false;
      //   }, 2000);
      // });
    }
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

  startTimer(codeStatus: TVerificationCodeStatus = 'DEFAULT') {
    this.timer.active = true;
    let OneMinute: 60 = 60;
    let tenMinutes: 600 = 600;
console.log('codeStatus',codeStatus);

    let timeToShow: typeof OneMinute | typeof tenMinutes | any; // 1min or 10 min
    console.log('timeToShow',codeStatus);
    switch (codeStatus) {
      case 'DEFAULT':
      case 'INCORRECT':
        timeToShow = OneMinute;
        break;
      case 'PASSED_LIMIT':
        timeToShow = tenMinutes;
        break;
      default:
        console.error(`Unhandled action in sms verification code status.\n given: ${this.codeStatus}`);
        break;
    }
    timer(0, 1000).pipe(
      scan((acc: any) => {
        const minutes: number = Math.floor(acc / 60);
        const seconds: number = (minutes >= 1) ? acc - minutes * 60 : acc;
        this.timer.minutes = minutes.toString();
        this.timer.seconds = (seconds < 10) ? `0${seconds}` : seconds.toString();
        return --acc;
      }, timeToShow),
      takeWhile(x => x >= 0),
      takeUntil(this.componentDestroyed),
      finalize(() => {
        this.timer.minutes = `0`;
        this.timer.seconds = `00`;
        this.timer.active = false;
      })
    ).subscribe();
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
