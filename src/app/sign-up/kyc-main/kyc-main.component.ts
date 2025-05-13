import { ChangeDetectorRef, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { KycCreatePasswordComponent, pwdConfirming } from '../kyc-create-password/kyc-create-password.component';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DecimalPipe, DOCUMENT } from "@angular/common";
import { IStepsObj, EStepNumber, TVerificationCodeStatus, TBusinessTypes, EBusinessType, IKycData, IKYCFormGroups } from '../kyc';
import { detailsToShow, passwordRgxPatternValidator } from '../models';
import { StepActionType } from '../types/global.type';
import { KycService } from '../services/kyc.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KycEmailConfirmComponent } from '../kyc-email-confirm/kyc-email-confirm.component';
import { KycOneComponent } from '../kyc-one/kyc-one.component';
import { KycPhoneComponent } from '../kyc-phone/kyc-phone.component';
import { KycTwoComponent } from '../kyc-two/kyc-two.component';
import { KycPersonalDetailsComponent } from '../kyc-personal-details/kyc-personal-details.component';
import { KycAddressComponent } from '../kyc-address/kyc-address.component';

// import { select, Store } from "@ngrx/store";

@Component({
    selector: 'app-kyc-main',
    imports: [
        CommonModule,
        MatIconModule,
        TranslateModule,
        ReactiveFormsModule,
        KycOneComponent,
        KycTwoComponent,
        KycEmailConfirmComponent,
        KycPhoneComponent,
        KycCreatePasswordComponent,
        KycPersonalDetailsComponent,
        KycAddressComponent
    ],
    templateUrl: './kyc-main.component.html',
    styleUrls: ['./kyc-main.component.scss'],
})
export class KycMainComponent implements OnInit {

    componentDestroyed = new Subject<any>();
    kycForm: any;
    @Input() stepsObj: IStepsObj = {
        currentStep: EStepNumber.typeOfBusiness,
        maxSteps: EStepNumber.personalAddress,
        minSteps: EStepNumber.typeOfBusiness
    };
    websiteUrl!: string;
    appLoginUrl = '';
    detailsToShow = detailsToShow;
    error: any = {
        hasError: false,
        msg: null
    }
    showLoader: boolean = false;
    Esteps: typeof EStepNumber = EStepNumber;
    codeStatus: TVerificationCodeStatus = 'DEFAULT';
    assetsPath = '';
    accountType!: TBusinessTypes;
    EBusinessType = EBusinessType;
    faqUrl: string = 'https://help.okoora.com/en-us/';
    userType: any;
    stepCurrent: any;
    changeLogo: boolean = false;
    translate?: TranslateService
    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        // private generalS: GeneralService,
        private kycS: KycService,
        private router: Router,
        // private auth: AuthenticationService,

        @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute
    ) {
        this.kycForm = this.fb.group({
            // kyc-one
            step_1: fb.group({
                companyAcc: fb.group({
                    isActive: [false],
                    countrySelected: [''],
                    countryCode: ['']
                }),
                privateAcc: fb.group({
                    isActive: [false],
                    countrySelected: [''],
                    countryCode: ['']

                }),
            }),
            // kyc-two
            step_2: fb.group({
                email: ['', [Validators.required, Validators.email,Validators.pattern('^(?!-)[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
                agree: [false, [Validators.requiredTrue]]
            }),


            // kyc-email-confirm
            step_3: fb.group({
                email_code_sent: [''],
                email_code_user_enter: [''],
            }),
            // kyc-phone
            step_4: fb.group({
                phone_code: ['', Validators.required],
                phone: ['', Validators.required],
            }),
            // kyc-phone-confirm
            step_5: fb.group({
                phone_confirmation_sent: [''],
                phone_confirmation_user_enter: [''],
            }),
            // kyc-create-password
            step_6: fb.group({
                passwords: new FormGroup(
                    {
                        password: new FormControl("", [Validators.required, passwordRgxPatternValidator()]),
                        confirmPassword: new FormControl("", [Validators.required, passwordRgxPatternValidator()]),
                    }, {
                    validators: this.passwordMatchValidator()
                }
                )
            }),

            step_7: fb.group({
                first_name: ['', [Validators.required]],
                first_name_he: [''],
                last_name: ['', [Validators.required,]],
                last_name_he: [''],
                id_number: ['', [Validators.required]],
                birth_date: ['', [Validators.required]],
                applicantId: [''],

            }),
            step_8: fb.group({
                country: ['', Validators.required],
                street_address: ['', [Validators.required]],
                city: ['', [Validators.required,]],
                zipcode: ['', [Validators.required]],
            }),
        });
    }
 
    ngOnInit(): void { 
        localStorage.removeItem('step');  
        this.stepsObj.currentStep
        // this.websiteUrl = this.generalS.websiteUrl;
        this.kycForm.valueChanges.subscribe(this.handleValueChanges);
        this.updatePackageBasketLastOffer();


        if (localStorage?.getItem('step') == '2') {
            this.stepsObj.currentStep = 2;
            localStorage?.getItem('kycForm');
            JSON.parse(localStorage?.getItem('kycForm')!);
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2']
                });
            }
        }
        if (localStorage?.getItem('step') == '3') {
            this.stepsObj.currentStep = 3;
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3']
                });
            }
        }
        if (localStorage?.getItem('step') == '4') {
            this.stepsObj.currentStep = 4;
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3'],
                    step_4: form['step_4']
                });
            }

        }
        if (localStorage?.getItem('step') == '5') {
            this.stepsObj.currentStep = 5;
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3'],
                    step_4: form['step_4'],
                    step_5: form['step_5']
                });
            }
        }
        if (localStorage?.getItem('step') == '6') {
            this.stepsObj.currentStep = 6;
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3'],
                    step_4: form['step_4'],
                    step_5: form['step_5'],
                    step_6: form['step_6']
                });
            }
        }
        if (localStorage?.getItem('step') == '7') {
            this.stepsObj.currentStep = 7;
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3'],
                    step_4: form['step_4'],
                    step_5: form['step_5'],
                    step_6: form['step_6'],
                    step_7: form['step_7']
                });
            }
        }
        if (this.route.snapshot.queryParams['upn']) {
            // console.log(this.route.snapshot.queryParams['upn'])
        }
        if (localStorage?.getItem('step') == '8') {
            this.stepsObj.currentStep = 7;
            localStorage.setItem('step', JSON.stringify(this.stepsObj.currentStep));
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3'],
                    step_4: form['step_4'],
                    step_5: form['step_5'],
                    step_6: form['step_6'],
                    step_7: form['step_7']
                });

            }
        }
        if (localStorage?.getItem('step') == '9') {
            this.stepsObj.currentStep = 9;
            let form = JSON.parse(localStorage?.getItem('kycForm')!);
            if (form != null) {
                this.kycForm.patchValue({
                    step_1: form['step_1'],
                    step_2: form['step_2'],
                    step_3: form['step_3'],
                    step_4: form['step_4'],
                    step_5: form['step_5'],
                    step_6: form['step_6'],
                    step_7: form['step_7'],
                    step_8: form['step_8'],
                    step_9: form['step_9'],
                });

            }
        }
        const url = window?.location?.href;
        if (url.includes('/max')) {
            this.changeLogo = true;
        }
    }

    triggerChangeDetection() {
        throw new Error("Method not implemented.");
    }

    stepHandler(action: StepActionType) {
        if (!action) {
            console.warn(`action is not provided in stepHander`);
            return;
        }
        if(this.kycForm?.value?.step_1?.companyAcc?.countrySelected !== null && this.kycForm?.value?.step_1?.companyAcc?.countrySelected !== 'Israel')
            this.stepsObj.maxSteps = EStepNumber.createPassword;
        
        switch (action) {
            case 'NEXT':
                // console.log(this.kycForm)
                const step1 = this.kycForm?.value?.step_1;
                const companyCountry = step1?.companyAcc?.countrySelected;
                const privateCountry = step1?.privateAcc?.countrySelected;
                const isCompanyCountryValid = companyCountry !== null && companyCountry !== 'Israel';
                const isPrivateCountryValid = privateCountry !== null && privateCountry !== 'Israel';
                const isNonIsraeli = isCompanyCountryValid || isPrivateCountryValid;
                
                if (this.stepsObj.currentStep >= this.stepsObj.maxSteps && isNonIsraeli) {
                    if (this.stepsObj.currentStep > this.stepsObj.maxSteps) {
                        console.warn(`current step was greater than the max steps \n currenct step given ${this.stepsObj.currentStep} \n max steps: ${this.stepsObj.maxSteps}`);
                    }
                    this.stepsObj.currentStep = this.stepsObj.maxSteps;
                } else {
                    if (this.stepsObj.currentStep == this.Esteps.phone) {
                      this.stepsObj.currentStep++;
                    }
                    this.stepCurrent = ++this.stepsObj.currentStep;
                    localStorage.setItem('step', JSON.stringify(this.stepCurrent));
                    localStorage.setItem('kycForm', JSON.stringify(this.kycForm.value));
                }
                break;
            case 'PREV':
                if (this.stepsObj.currentStep <= this.stepsObj.minSteps) {
                    this.stepsObj.currentStep = this.stepsObj.minSteps;
                } else {
                    if (this.stepsObj.currentStep == this.Esteps.createPassword) {
                      this.stepsObj.currentStep--;
                    }
                    this.stepsObj.currentStep--;
                }
                break;
            default:
                const exhaustiveCheck: never = action;
                console.error(`unhandeled action occured. ${exhaustiveCheck}`);
                break;
        }
    }// # stepHandler

    /**
     * returns true is the step is valid
     */
    nextStepIsValid(): boolean {
        switch (this.stepsObj.currentStep) {
            case EStepNumber.typeOfBusiness:
                return this.step1IsValid();
            case EStepNumber.email:
                return this.step2IsValid();
            case EStepNumber.emailConfirmation:
                return this.step3IsValid();
            case EStepNumber.phone:
                return this.step4IsValid();
            case EStepNumber.phoneConfirmation:
                return this.step5IsValid();
            case EStepNumber.createPassword:
                return this.step6IsValid();
            case EStepNumber.personalDetails:
                return this.step7IsValid();
            case EStepNumber.personalAddress:
                return this.step8IsValid();
            default:
                console.warn(`stepIsValid() went to default in switch case in step ${this.stepsObj.currentStep}`);
                return false;
        }
    }
    step1IsValid(): boolean {
        const isBusiness = this.kycForm.controls.step_1.get('companyAcc').value;
        return (isBusiness && this.kycForm.controls.step_1.get('companyAcc').valid) || (!isBusiness && this.kycForm.controls.step_1.get('privateAcc').valid);
    }

    step2IsValid(): boolean {
        return this.step1IsValid() && this.kycForm.controls.step_2.touched && this.kycForm.controls.step_2.valid;
    }

    step3IsValid(): boolean {
        return this.step2IsValid() && this.kycForm.controls.step_3.valid;
    }

    step4IsValid(): boolean {
        return this.step3IsValid() && this.kycForm.controls.step_4.valid;
    }

    step5IsValid(): boolean {
        return this.step4IsValid() && this.kycForm.controls.step_5.valid;
    }

    step6IsValid(): boolean {
        return this.step4IsValid() && this.kycForm.controls.step_6.valid;
    }

    step7IsValid(): boolean {
        return this.step6IsValid() && this.kycForm.controls.step_7.valid;
    }

    step8IsValid(): boolean {
        return this.step7IsValid() && this.kycForm.controls.step_8.valid;
    }

    /**
     * handles the content to be shown in the details component
     * @param bType
     */
    handleDetailToShow(bType: IKycData['businessTypes']) {
        this.detailsToShow.step_1.detailName = bType;
    }

    showError(msg: string) {
        this.error.hasError = true;
        this.error.msg = msg;

        setTimeout(() => {
            this.error.hasError = false;
            this.error.msg = null;
            // this.kycS.showError$.next({ hasError: false, msg: null });
        }, 3000);
    }// # showError

    handlePreviousBtn() {
        switch (this.stepsObj.currentStep) {
            case EStepNumber.typeOfBusiness:
                // this.auth.logout();
                // window.location.href = '/login';
                this.router.navigate(['/login']);
                // localStorage.getItem('subSite') ?  window.location.href = localStorage.getItem('subSite') +'login'  : window.location.href = '/login';
                break;
            case EStepNumber.createPassword:
                this.stepsObj.currentStep = EStepNumber.phone;
                break;
            default:
                this.stepHandler('PREV');
                break;
        }
    }


    emailValue(): string {
        return this.kycForm?.controls?.step_2?.get('email')?.value
    }

    phoneValue(): string {
        const phone = this.kycForm.controls.step_4.get('phone').value;
        const phoneCode = this.kycForm.controls.step_4?.get('phone_code')?.value?.toString()?.replaceAll('+', '');
        return `+${phoneCode}${phone}`;
    }

    /**
     * END GET form Values
     */

    handleEditValue(e: Event, action: 'EMAIL' | 'PHONE') {
        e.preventDefault();
        switch (action) {
            case 'EMAIL':
                this.stepsObj.currentStep = EStepNumber.email;
                break;
            case 'PHONE':
                this.stepsObj.currentStep = EStepNumber.phone;
                break;
            default:
                const exhaustiveCheck: never = action;
                console.error(`unhandled action occured ${exhaustiveCheck}`);
                break;
        }
    }

    goToLogin() {
        // localStorage.removeItem('kycForm')
        // localStorage.removeItem('step')
        this.router.navigate(['/login']);
    }
    passwordMatchValidator = (): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password');
            const confirmPassword = control.get('confirmPassword');

            if (!password || !confirmPassword) {
                return null;
            }

            if (password.value !== confirmPassword.value) {
                return { passwordMismatch: true };
            }

            return null;
        };
    };
    showPrevBtn(): boolean {
        return this.stepsObj.currentStep < EStepNumber.phone
            ||
            this.stepsObj.currentStep === EStepNumber.phoneConfirmation
            ||
            this.stepsObj.currentStep === EStepNumber.createPassword
            ||
            this.stepsObj.currentStep === EStepNumber.personalAddress
    }

    showLoginBtn(): boolean {
        return this.stepsObj.currentStep < EStepNumber.createPassword
    }

    showCloseBtn(): boolean {
        return this.stepsObj.currentStep === EStepNumber.phone
            ||
            this.stepsObj.currentStep === EStepNumber.createPassword
    };

    /**
     * fired when a value change in form
     * @param newVal
     */
    handleValueChanges = (newVal: IKYCFormGroups) => {
        const selectedAccountType: TBusinessTypes | any = newVal.step_1?.companyAcc?.isActive ? EBusinessType.companyAccount : EBusinessType.privateAccount;
        this.kycS.selectedAccountType$.next(selectedAccountType);
        // Step #1 is valid validations
            this.kycS.stepOneValidations(newVal, this.kycForm);
        // END Step #1 is valid validations

    };//#handleValueChanges

    tryAgain() {
        this.codeStatus = 'DEFAULT';
        this.kycS.errorOverlayTryAgainClicked$.next(true);
    }

    /**
     * when form submitted this method occur
     */
    handleSubmit() {
        // console.log(`form submitted!`, this.kycForm);
    };// #handleSubmit

    ngOnDestroy() {
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();
    }

    updatePackageBasketLastOffer() {
        // 1 get email + basketId from URL
        // 2 update table in DB
        let activatedRoute = this.route.snapshot.params;
        if (activatedRoute['basketId']) {

        }
    }


}
