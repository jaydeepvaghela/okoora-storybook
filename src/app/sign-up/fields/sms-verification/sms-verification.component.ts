import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { catchError, exhaustMap, filter, finalize, scan, takeUntil, takeWhile, throttleTime } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, timer } from 'rxjs';
import { FormGroup, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IStepsObj, TVerificationCodeStatus, VerificationReturnType, IPerformVerification, EStepNumber, TSendMailResponse, EErrorMessages } from '../../kyc';
import { KycService } from '../../services/kyc.service';

@Component({
  selector: 'sms-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatTooltipModule],
  templateUrl: './sms-verification.component.html',
  styleUrls: ['./sms-verification.component.scss']
})
export class SmsVerificationComponent implements OnInit, OnDestroy {
  componentDestroyed = new Subject<any>();
  @Output() enterEvent = new EventEmitter<string>();
  @Output() resend = new EventEmitter<string>();
  @Output() call = new EventEmitter();
  @Output() back = new EventEmitter();
  callInProcess!: boolean;
  private _loadingFromParent = new BehaviorSubject<boolean>(false);
  @Input() loadingFromParent(value: boolean) {
    this._loadingFromParent.next(value);
  }

  digit1!: string;
  digit2!: string;
  digit3!: string;
  digit4!: string;

  mail!: string;
  code!: string;
  loading: boolean = false;
  codeIsValid: boolean = true;
  resendCode = false;
  refreshAPIError: boolean = false;
  @Input('kycForm') kycForm!: FormGroup;
  @Input('stepsObj') stepsObj!: IStepsObj;
  codeStatus: TVerificationCodeStatus = 'DEFAULT';
  timer: {
    minutes: string,
    seconds: string,
    active: boolean
  } = {
      minutes: '0',
      seconds: '00',
      active: false
    };
  @Output('codeValidEvent') codeValidEvent = new EventEmitter<boolean>();
  @Input('timerTooltip') timerTooltip!: string;
  @Input('formControlNameToSetValue') formControlNameToSetValue!: string;
  @Input('formControlNameToCompareValue') formControlNameToCompareValue!: string;
  smsReturnType = VerificationReturnType;
  performVerification$ = new Subject<IPerformVerification>();

  constructor(private kycS: KycService) { }

  ngOnInit() {
    if (!this.formControlNameToSetValue) {
      console.warn(`formControlNameToSetValue must be set! at step ${this.stepsObj.currentStep} \n given "${this.formControlNameToSetValue}"`);
    }
    if (!this.formControlNameToCompareValue) {
      console.warn(`formControlNameToCompareValue must be set! at step ${this.stepsObj.currentStep} \n given "${this.formControlNameToCompareValue}"`);
    }

    this._loadingFromParent.subscribe(loading => {
      this.loading = loading;
    });

    this.kycS.verificationCodeStatus.pipe(
      takeUntil(this.componentDestroyed)
    ).subscribe(codeStatus => {
      this.codeStatus = codeStatus;
      if (codeStatus === 'DEFAULT' || codeStatus === 'INCORRECT') {
        this.startTimer();
      } else {
        this.startTimer(codeStatus);
      }
    });
  }

  onInputChange(): void {
    if (this.refreshAPIError) {
      this.refreshAPIError = false;
    }
  }
  

  checkVerification() {
    if (!this.digit1 || !this.digit2 || !this.digit3 || !this.digit4) {
      return;
    }
  
    this.code = this.digit1 + this.digit2 + this.digit3 + this.digit4;
  
    // Custom check for code 1111
    if (this.code === '1111') {
      this.refreshAPIError = true;
      this.codeIsValid = false;
      this.kycS.loading$.next(false);
      return;
    }
  
    if (!this.formControlNameToSetValue) {
      console.warn(`formControlNameToSetValue must be set! at step ${this.stepsObj.currentStep} \n given "${this.formControlNameToSetValue}"`);
      return;
    }
    if (!this.kycForm.controls[`step_${this.stepsObj.currentStep}`].get(this.formControlNameToSetValue)) {
      console.error(`form control with the name ${this.formControlNameToSetValue} does not exist in step_${this.stepsObj.currentStep}`);
      return;
    }
    if (!this.formControlNameToCompareValue) {
      console.warn(`formControlNameToCompareValue must be set! at step ${this.stepsObj.currentStep} \n given "${this.formControlNameToCompareValue}"`);
      return;
    }
    if (!this.kycForm.controls[`step_${this.stepsObj.currentStep}`].get(this.formControlNameToCompareValue)) {
      console.error(`form control with the name ${this.formControlNameToCompareValue} does not exist in step_${this.stepsObj.currentStep}`);
      return;
    }
  
    this.resendCode = false;
    this.codeIsValid = true;
    this.loading = true;
  
    const control = this.kycForm.controls[`step_${this.stepsObj.currentStep}`].get(this.formControlNameToSetValue);
    if (control) {
      control.setValue(this.code);
    } else {
      console.error(`Control with name ${this.formControlNameToSetValue} is null or undefined.`);
    }
  
    this.handleActionByStep({ action: 'CHECK' });
  }

  onResend() {
    if (this.timer.active) {
      console.warn(`Resend code called even though the timer is active.`);
      return;
    }

    this.resendCode = true;
    this.resend.emit();
    this.handleActionByStep({ action: 'SEND' });
  }

  handleActionByStep(data: { action: 'SEND' | 'CHECK' }): void {
    const { action: dynamicAction } = data;
    let payload: any;
    let verificationAction: 'CHECK_EMAIL_VERIFICATION' | 'SEND_EMAIL_VERIFICATION' | 'CHECK_PHONE_VERIFICATION' | 'SEND_PHONE_VERIFICATION';

    switch (this.stepsObj.currentStep) {
      case EStepNumber.emailConfirmation:
        const userEmail = this.kycForm.getRawValue()?.step_2?.email;
        if (!userEmail) return;
        payload = { email: userEmail };
        verificationAction = dynamicAction === 'SEND' ? 'SEND_EMAIL_VERIFICATION' : 'CHECK_EMAIL_VERIFICATION';
        break;
      case EStepNumber.phoneConfirmation:
        const { phone_code, phone } = this.kycForm.getRawValue().step_4;
        if (!phone_code || !phone) {
          console.error('phone or phone code must have a value.');
          return;
        }
        const phoneGenerated = `${phone_code}${phone}`;
        payload = { phone: phoneGenerated };
        verificationAction = dynamicAction === 'SEND' ? 'SEND_PHONE_VERIFICATION' : 'CHECK_PHONE_VERIFICATION';
        break;
      default:
        console.error(`unhandled action occurred for ${this.stepsObj.currentStep}`);
        return;
    }

    if (verificationAction === 'CHECK_EMAIL_VERIFICATION' || verificationAction === 'SEND_EMAIL_VERIFICATION') {
      this.performEmailVerification(dynamicAction, payload.email);
    } else if (verificationAction === 'CHECK_PHONE_VERIFICATION' || verificationAction === 'SEND_PHONE_VERIFICATION') {
      this.performPhoneVerification(dynamicAction, payload.phone);
    }
  }
  performEmailVerification(action: 'SEND' | 'CHECK', email: string): void {
    let request: Observable<[string, any]>;

    if (action === 'SEND') {
        request = combineLatest([
          of('SEND'),
          of({}) // Emit a valid object to match the expected type [string, any]
        ]) as Observable<[string, any]>;
      } else if (action === 'CHECK') {
        request = combineLatest([
          of('CHECK'),
          of({}) // Emit a valid object to match the expected type [string, any]
        ]) as Observable<[string, any]>;
    } else {
      console.error(`Unhandled action ${action}`);
      return;
    }

    request.subscribe({
      next: ([action, res]: [string, any]) => {
        switch (action) {
          case 'SEND':
            let response: TSendMailResponse = <TSendMailResponse>res;
            if (response?.Success === VerificationReturnType.Success) {
              this.startTimer();
              this.kycS.loading$.next(false);
            } else if (response?.PassedLimitError === VerificationReturnType.PassedLimitError) {
              this.startTimer('PASSED_LIMIT');
              this.kycS.loading$.next(false);
            } else {
              this.kycS.showError$.next({ hasError: true, msg: EErrorMessages.SomethingWentWrong });
            }
            break;
          case 'CHECK':
            if (res) { 
              console.log('res', res);
              this.codeStatus = 'VALID';
              this.codeValidEvent.next(true);
              this.kycS.loading$.next(false);
              this.refreshAPIError = false;
            } else {
              this.codeStatus = 'INCORRECT';
              this.codeIsValid = false;
              this.kycS.loading$.next(false);
            }
            break;
          default:
            break;
        }
      },
      error: (error) => {
        if (error) {
          this.refreshAPIError = true;
        }
      }
    })
  }

  performPhoneVerification(action: 'SEND' | 'CHECK', phone: string): void {
    let request: Observable<[string, any]> | null = null;

    if (action === 'SEND') {
      request = combineLatest([
        of('SEND'),
        of({}) // Replace with actual observable for sending SMS verification
      ]);
    } else if (action === 'CHECK') {
      request = combineLatest([
        of('CHECK'),
        of({}) // Replace with actual observable for checking SMS verification
      ]);
    } else {
      console.error(`Unhandled action ${action}`);
      return;
    }

    request?.subscribe(([action, res]: [string, any]) => {
      switch (action) {
        case 'SEND':
          let response: TSendMailResponse = <TSendMailResponse>res;
          if (response?.Success === VerificationReturnType.Success) {
            this.startTimer();
            this.kycS.loading$.next(false);
          } else if (response?.PassedLimitError === VerificationReturnType.PassedLimitError) {
            this.startTimer('PASSED_LIMIT');
            this.kycS.loading$.next(false);
          } else {
            this.kycS.showError$.next({ hasError: true, msg: EErrorMessages.SomethingWentWrong });
          }
          break;
        case 'CHECK':
          if (res) {
            this.codeStatus = 'VALID';
            this.codeValidEvent.next(true);
            this.kycS.loading$.next(false);
          } else {
            this.codeStatus = 'INCORRECT';
            this.codeIsValid = false;
            this.kycS.loading$.next(false);
          }
          break;
        default:
          break;
      }
    });
  }
  processVerificationRequest(request: Observable<[string, any]>): void {
    this.performVerification$.pipe(
      throttleTime(300),
      exhaustMap(({ action, payload }) => {
        // this.KycS.loading$.next(true);
        return request;
      }),
      catchError((e: HttpErrorResponse) => {
        console.error(e);
        // this.KycS.loading$.next(false);
        return EMPTY;
      })
    ).subscribe(([action, res]: any) => {
      switch (action) {
        case 'SEND':
          let response: TSendMailResponse = <TSendMailResponse>res;

          if (response?.Success === VerificationReturnType.Success) {
            this.startTimer();
            // this.KycS.loading$.next(false);
          } else if (response?.PassedLimitError === VerificationReturnType.PassedLimitError) {
            this.startTimer('PASSED_LIMIT');
            // this.KycS.loading$.next(false);
          } else {
            // this.KycS.showError$.next({ hasError: true, msg: EErrorMessages.SomethingWentWrong });
          }
          break;
        case 'CHECK':
          if (res) {
            this.codeStatus = 'VALID';
            this.codeValidEvent.next(true);
            // this.KycS.loading$.next(false);
          } else {
            this.codeStatus = 'INCORRECT';
            this.codeIsValid = false;
            // this.KycS.loading$.next(false);
          }
          break;
        default:
          break;
      }
    });
  }

  handleErrorOverlayTryAgainClicked(): void {
    // this.KycS.errorOverlayTryAgainClicked$.pipe(
    //   filter(r => !!r)
    // ).subscribe(() => {
    //   this.tryAgain();
    // });
  }

  onCall() {
    this.call.emit();
    this.callInProcess = true;
  }

  onBack() {
    this.back.emit();
  }

  tryAgain() {
    this.codeIsValid = true;
    this.reset();
  }

  reset() {
    this.codeStatus = 'DEFAULT';
    this.digit1 = '';
    this.digit2 = '';
    this.digit3 = '';
    this.digit4 = '';
    this.code = '';
  }

  startTimer(codeStatus: TVerificationCodeStatus = 'DEFAULT') {
    this.timer.active = true;
    let OneMinute: 60 = 60;
    let tenMinutes: 600 = 600;

    let timeToShow: typeof OneMinute | typeof tenMinutes | any; // 1min or 10 min
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

  ngOnDestroy() {
    this.componentDestroyed.next(null);
    this.componentDestroyed.complete();
  }

  restrictSpecialCharacters(event: KeyboardEvent | ClipboardEvent) {
    const restrictedChars = ['<', '>', ';', ':', '=', '+', '(', ')'];

    if (event instanceof KeyboardEvent) {
      if (restrictedChars.includes(event.key)) {
        event.preventDefault();
      }
    } else if (event instanceof ClipboardEvent) {
      let pasteData = (event.clipboardData || (window as any).clipboardData).getData('text');
      if (restrictedChars.some(char => pasteData.includes(char))) {
        event.preventDefault();
      }
    }
  }
}
