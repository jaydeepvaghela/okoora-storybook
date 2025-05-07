import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Subject } from 'rxjs';
import { catchError, skipWhile, switchMap, takeUntil, tap, throttleTime } from 'rxjs/operators';

import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";
import { CountriesData, EErrorMessages, IStepsObj } from '../kyc';
import { StepActionType } from '../types/global.type';
import { KycService } from '../services/kyc.service';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorComponent } from '../fields/error/error.component';
import { SelectCountryComponent } from '../fields/select-country/select-country.component';

@Component({
    selector: 'kyc-address',
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorComponent, SelectCountryComponent ],
    templateUrl: './kyc-address.component.html',
    styleUrls: ['./kyc-address.component.scss']
})

export class KycAddressComponent implements OnInit, OnDestroy {
    componentDestroyed = new Subject<any>();
    @Input('parentFormGroup')
    parentFormGroup!: FormGroup;
    @Input('kycForm')
    kycForm!: FormGroup;
    @Input('stepsObj') stepsObj!: IStepsObj;
    shuftiData: any;
    @Output('nextStepEvent') nextStepEvent = new EventEmitter<StepActionType>();
    @Output() loginEvent: EventEmitter<void> = new EventEmitter<void>();
    countryArr!: CountriesData[];
    showLoader: any = false;
    autoApproved: boolean = true;
    step_8!: FormGroup;
    addressInHebrew!: FormGroup;
    step_6_passwords!: FormGroup;
    // createUser$ = new Subject();
    createUser$ = new Subject<boolean>();
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private KycS: KycService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    ngOnInit(): void {
        this.step_6_passwords = <FormGroup>this.kycForm.get('step_6')?.get('passwords');
        this.step_8 = <FormGroup>this.kycForm.get('step_8');
        // this.step_8.get('country').setValue('Israel');

        this.KycS.allCountries$
            .pipe(
                skipWhile(countries => !Array.isArray(countries)),
                takeUntil(this.componentDestroyed)
            )
            .subscribe(countries => {
                this.countryArr = countries;
            });

        this.KycS.loading$.subscribe(loadingState => {
            this.showLoader = loadingState;
            this.cd.markForCheck();
        })

        this.addressInHebrew =
            this.formBuilder.group({
                city_he: new FormControl('', Validators.pattern(hebrewPattern)),
                street_he: new FormControl('', Validators.pattern(hebrewPattern))
            });

        this.KycS.shuftiData.subscribe(shuftiData => {
            this.shuftiData = shuftiData;
            const address_data = this.shuftiData['addressData'];
            this.addressInHebrew.get('street_he')?.setValue(address_data['Street']);
            this.addressInHebrew.get('city_he')?.setValue(address_data['City']);

            this.autoApproved = this.shuftiData['autoApproved'];

            if (this.autoApproved) {
                this.addressInHebrew.controls['street_he'].disable();
                this.addressInHebrew.controls['city_he'].disable();
            }
            this.cd.markForCheck();
        })

        this.autoApproved = this.shuftiData['autoApproved'];

        if (this.autoApproved) {
            this.addressInHebrew.controls['street_he'].disable();
            this.addressInHebrew.controls['city_he'].disable();
        }
        this.cd.markForCheck();
        this.kycForm.valueChanges.subscribe(values => {
            // console.log({ values })
        })
        this.callCreateNewUserAPI();
        this.createUser$.subscribe(loadingState => {
          if(loadingState) {
            this.callCreateNewUserAPI();
          }
        });
    };//#ngOnInit

    callCreateNewUserAPI() {
      this.createUser$
            .pipe(
                tap(() => {
                    this.KycS.loading$.next(true);
                    this.loading = true;
                }),
                throttleTime(500),
                switchMap(() => {
                    // console.log(this.kycForm.getRawValue());
                    const oldData = this.kycForm.getRawValue();
                    const isCompany = oldData.step_1.companyAcc.isActive
                    const newData = {
                        accountType: oldData.step_1.companyAcc.isActive ? 2 : 1,
                        email: oldData.step_2.email,
                        countryCode: isCompany ? oldData.step_1.companyAcc.countryCode : oldData.step_1.privateAcc.countryCode, // Assumes ISO 2 code is already being used
                        phoneCode: oldData.step_4.phone_code?.toString().replaceAll('+', ''),
                        phoneNumber: oldData.step_4.phone,
                        passwords: oldData.step_6.passwords,
                        role: 1, // Constant value, assuming user is always created as 'admin'
                        firstName: oldData.step_7.first_name,
                        lastName: oldData.step_7.last_name,
                        idNumber: oldData.step_7.id_number,
                        birthDate: oldData.step_7.birth_date,
                        city: oldData.step_8.city,
                        address: oldData.step_8.street_address,
                        houseNumber: "", // Not available in the old data structure, might need to be provided
                        zipCode: oldData.step_8.zipcode,
                        applicantId: oldData.step_7.applicantId,
                        autoApproved: this.autoApproved
                    };
                    const ref = localStorage.getItem('referal');
                    if (ref != null) {
                        const refAff = Number(ref);
                        if (!isNaN(refAff)) {
                            // return this.KycS.createUserWithReferal(newData ,refAff)

                        }
                    }
                    return []
                }),
                catchError((e: HttpErrorResponse) => {
                    this.KycS.loading$.next(false);
                    this.loading = false;
                    return EMPTY;
                })
            )
            .subscribe(r => {

                if (r) {
                    localStorage.removeItem('step')
                    localStorage.removeItem('kycForm')
                    window.location.href = localStorage.getItem('subSite') ? localStorage.getItem('subSite') + 'login' : '/login'

                    this.nextStepEvent.next('NEXT');

                    // this.KycS.UpdateRegistrationPersonalDetails(this.kycForm.getRawValue(), this.autoApproved)
                    //     .pipe(
                    //         throttleTime(500),
                    //         catchError((e: HttpErrorResponse) => {
                    //             this.KycS.loading$.next(false);
                    //             return EMPTY;
                    //         })
                    //     )
                    //     .subscribe(r => {
                    //         // this.nextStepEvent.next('NEXT');
                    //         // redirect the user to okoora login url
                    //         // window.location.href = environment.appLoginURL;
                    //         this.document.querySelector('html').classList.remove('signup-kyc');
                    //         this.router.navigate(['/login']);
                    //         setTimeout(() => {
                    //             window.location.reload();
                    //         }, 10);
                    //     });
                    // this.nextStepEvent.next('NEXT');
                } else {
                    this.KycS.showError$.next({ hasError: true, msg: EErrorMessages.SomethingWentWrong })
                }
                this.KycS.loading$.next(false);
                this.loading = false;
            });
    }

    hendelEditHebrewFields() {
        this.autoApproved = false;
        this.addressInHebrew.controls['street_he'].enable();
        this.addressInHebrew.controls['city_he'].enable();
    }

    handleNextStep() {
        // this.KycS.loading$.next(true);
        this.createUser$.next(true);

    };

    ngOnDestroy() {
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();
    };
}

const hebrewPattern = /^[\'\"\`\.\s\u0590-\u05fe]+$/i;

