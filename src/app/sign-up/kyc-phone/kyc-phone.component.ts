import {HttpErrorResponse} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {EMPTY, Subject} from 'rxjs';
import {catchError, skipWhile, takeUntil} from 'rxjs/operators';
import { IStepsObj, CountriesData } from '../kyc';
import { StepActionType } from '../types/global.type';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { countryData } from '../fields/country-data';


@Component({
  selector: 'kyc-phone',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatAutocompleteModule],
  templateUrl: './kyc-phone.component.html',
  styleUrls: ['./kyc-phone.component.scss'],
})
export class KycPhoneComponent implements OnInit {
    componentDestroyed = new Subject<any>();
    @Input('parentFormGroup') parentFormGroup!: FormGroup;
    @Input('kycForm') kycForm!: FormGroup;
    @Input('stepsObj') stepsObj!: IStepsObj;
    @Input('nextStepIsValid') nextStepIsValid: any;
    @Output('nextStepEvent') nextStepEvent = new EventEmitter<StepActionType>();
    countryArr!: CountriesData[];
    selectedPhoneCode!: string;
    step_4!: FormGroup;
    apiErrorMessage = '';

    constructor(
        // private KycS: KycService
    ) { }

    ngOnInit(): void {
        this.countryArr = countryData;
        this.step_4 = <FormGroup>this.kycForm.get('step_4');
    }

    handleNextStep() {
        let {phone_code, phone} = this.kycForm.getRawValue().step_4;
        if(!phone_code || !phone) {
            console.error(`phone or phone code must have a value.`);
            return;
        }
        this.apiErrorMessage = '';
        const phoneGenerated = `${phone_code}${phone}`;
        // this.KycS.sendSMSVerification(phoneGenerated)
        // .pipe(
        //     catchError((e:HttpErrorResponse)=> {
        //         console.error(e);
        //         this.apiErrorMessage = e.error.apiErrorMessage[0];
        //         return EMPTY;
        //     })
        // )
        // .subscribe(r => {
        //     this.apiErrorMessage = '';
        //     if(r) {
        //         this.nextStepEvent.next('NEXT');
        //     }
        // });
        this.nextStepEvent.next('NEXT');
    }

    restrictSpecialCharacters(event: any) {
        if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
          event?.preventDefault();
        }
        else {
          if (event?.key == "." && event?.target?.value.includes(".")) {
            event?.preventDefault();
          }
          const allowedKeys = /^[a-zA-Z0-9+]$/;
          if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
            event.preventDefault();
          }
        }
      }

    handleCountryCodeSearch(e:Event) {
        // this.countryArr = this.KycS.handleCountrySearch({event: e, action: 'PHONE_CODE'})
    }// # handleCountryCodeSearch

    ngOnDestroy(){
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();
    }
}
