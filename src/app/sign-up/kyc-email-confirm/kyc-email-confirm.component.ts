import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import { IStepsObj } from '../kyc';
import { StepActionType } from '../types/global.type';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SmsVerificationComponent } from '../fields/sms-verification/sms-verification.component';


@Component({
  selector: 'kyc-email-confirm',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SmsVerificationComponent],
  templateUrl: './kyc-email-confirm.component.html',
  styleUrls: ['./kyc-email-confirm.component.scss'],
})
export class KycEmailConfirmComponent implements OnInit, OnDestroy {
    componentDestroyed = new Subject<any>();
    @Input('parentFormGroup') parentFormGroup!: FormGroup;
    @Input('kycForm') kycForm!: FormGroup;
    @Input('stepsObj') stepsObj!: IStepsObj;
    @Output('nextStepEvent') nextStepEvent = new EventEmitter<StepActionType>();
    step_3!: FormGroup;

    constructor(
        // private kycS: KycService
    ) { }

    ngOnInit(): void {
        this.step_3 = <FormGroup>this.kycForm.get('step_3');
    }

    codeValidHandler() {
        setTimeout(() => { 
        this.nextStepEvent.next('NEXT');
        }, 500);
    }

    ngOnDestroy(){
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();
    }
}
