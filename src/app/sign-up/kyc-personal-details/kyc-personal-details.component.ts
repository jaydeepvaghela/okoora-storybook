import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

// import {HelperService} from "../../../services";
// import {SubjectService} from "@shared/services";
// import {environment} from "@environment/environment";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
// import {EPusherChannels, EPusherEvents} from "@models/enums";
import { CommonModule, DatePipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EBusinessType, IStepsObj } from '../kyc';
import { StepActionType } from '../types/global.type';
import { validateID } from '../models';
import { KycService } from '../services/kyc.service';
import { SubjectService } from '../services/subject.service';
import moment from 'moment';
import { ErrorComponent } from '../fields/error/error.component';
import { MatError } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
    selector: 'kyc-personal-details',
    templateUrl: './kyc-personal-details.component.html',
    styleUrls: ['./kyc-personal-details.component.scss'],
    providers: [DatePipe, provideNativeDateAdapter()],
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorComponent, MatError, MatDatepickerModule, MatDialogModule],

})
export class KycPersonalDetailsComponent implements OnInit, OnDestroy {
    @Input('parentFormGroup') parentFormGroup: any;
    @Input('kycForm')
    kycForm!: FormGroup;
    @Input('stepsObj') stepsObj!: IStepsObj;
    @Output('nextStepEvent') nextStepEvent = new EventEmitter<StepActionType>();
    @Output() shuftiData = new EventEmitter<any>();
    @ViewChild('shuftiModal')
    shuftiModal!: TemplateRef<ViewContainerRef>;
    @ViewChild('iframe')
    iframe!: ElementRef;

    componentDestroyed = new Subject<any>();
    loading: boolean = false;
    minAge!: Date | any;
    step_7!: FormGroup;
    businessTypes = EBusinessType;
    idDuplication: boolean = false;
    idValidation!: FormControl;
    sumsubVareficationResponse: object = {};
    canContinue$ = new BehaviorSubject<boolean>(false);
    hebrewDocument: boolean = false;
    autoApproved: boolean = false;
    sumsubResponseData: object = {};
    autoApproved$ = new BehaviorSubject<boolean>(false);
    hideFieldsAutomatically$ = new BehaviorSubject<boolean>(false);

    constructor(
        private kycS: KycService,
        private fb: FormBuilder,
        private subjectService: SubjectService,
        public dialog: MatDialog,
        public viewContainerRef: ViewContainerRef,
        private sanitizer: DomSanitizer,
        private datePipe: DatePipe,
        private _snackBar: MatSnackBar,
        private translateService: TranslateService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.step_7 = <FormGroup>this.kycForm.get('step_7');
        this.minAge = this.kycS.calcMinAgeFromToday();
        this.idValidation = this.fb.control(SubjectService.idValidation);
        const isPrivate: boolean = this.kycForm.get('step_1')?.get('privateAcc')?.get('isActive')?.value;
        const hideShowFields: boolean = (this.kycS.shuftiData?.getValue() && isPrivate) || !isPrivate ? false : true;
        this.hideFieldsAutomatically$.next(hideShowFields);
        this.listenTovAutoApprovedChange();

        if (isPrivate) {
            // this.setDisabledStatus('first_name', true);
            // this.setDisabledStatus('last_name', true);
            // this.setDisabledStatus('id_number', true);
            // this.setDisabledStatus('birth_date', true);
            // const oldData = this.kycForm.getRawValue();
            // let username: string = oldData.step_2.email.split("@")[0];
            // this.listenToSumsubResponse(username);

            
            //     this.kycS.launchWebSdk('_act-sbx-jwt-eyJhbGciOiJub25lIn0.eyJqdGkiOiJfYWN0LXNieC1hYmJlM2VjMi0yMTA5LTQxN2ItYTYxNS1kM2Y4NWFmZWNmN2ItdjIiLCJ1cmwiOiJodHRwczovL2FwaS5zdW1zdWIuY29tIn0.-v2', 
            //         oldData.step_4.phone_code + oldData.step_4.phone ,oldData.step_2.email)
              
            //   err=>{
            //     if(err.apiErrorCode = 3108) //for activate enable sumsub on server configuration
            //     console.log('')
            //   });

        }

    }

    restrictSpecialCharacters(event: any) {
        if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
          event?.preventDefault();
        }
        else {
          if (event?.key == "." && event?.target?.value.includes(".")) {
            event?.preventDefault();
          }
          const allowedKeys = /^[a-zA-Z0-9]$/;
          if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
            event.preventDefault();
          }
        }
      }

    /**
     * check whether ID exist in DB or not
     */
    validateID(id: string): boolean {
        return validateID(id);
    }
    checkIdDuplication(e: any) {
        const id = this.step_7.get('id_number')?.value;
        const matSlideValue = this.idValidation.value;
        // console.log({ id })
        // console.log({ matSlideValue })
        // console.log('this.idDuplication', this.idDuplication)
        if (matSlideValue) {
            if (id && id?.toString()?.length == 9 && validateID(id)) {
                this.idDuplication = true;
            } else {
                this.idDuplication = false;
            }
        } else {
            this.idDuplication = false;
        }
        this.cd.detectChanges()
    }

    normalizeDate(date: Date): Date {
        return moment(date).set({hours: 12}).toDate();
    }

    handleNextStep() {
        const normalizedDateOfBirth: Date = this.normalizeDate(this.step_7.get('birth_date')?.value);
        this.step_7.get('birth_date')?.setValue(normalizedDateOfBirth);

        // if (!this.idDuplication) {
        this.nextStepEvent.next('NEXT');
        this.kycS.shuftiData.next({
            ...this.kycS.shuftiData.getValue(),
            autoApproved: this.autoApproved$.value,
            canContinue: this.canContinue$.getValue(),
        });
        // }
    }

    changedIdValidation(e: any) {
        this.subjectService.idValidation = e;
    }

    listenToSumsubResponse(ref: any = null) {
        // this.pusherService.listen<any>(`${EPusherEvents.sumSubRequest}-${ref}`, EPusherChannels.sumSubCall).subscribe(res => {
        //     if (!res) {
        //         this.openSnackBar(this.translateService.instant('KYC_Step_7.unverified'), 'danger-class')
        //         return;
        //     }
        //     const data = res?.result;
        //     // console.log('Sumsub RES', data)
        //     const dateOfBirth = data['dob'] ? new Date(data['dob']) : new Date();
        //     this.sumsubResponseData = {
        //         first_name: data.first_name,
        //         last_name: data.last_name,
        //         id_number: data.document_number,
        //         birth_date: dateOfBirth,
        //         applicantId: data.applicantId
        //     };
        //     this.sumsubVareficationResponse = data;

        //     //update step 7 data
        //     this.step_7.get('id_number').setValue(data['document_number'] ?? 0);
        //     this.step_7.get('first_name').setValue(data['first_name'] ?? '');
        //     this.step_7.get('last_name').setValue(data['last_name'] ?? '');
        //     this.step_7.get('birth_date').setValue(dateOfBirth)
        //     this.step_7.get('applicantId').setValue(data['applicantId'] ?? '')

        //     this.canContinue$.next(true);
        //     this.autoApproved = true;
        //     this.autoApproved$.next(true);
        //     this.checkIdDuplication({});
        //     // console.log(this.canContinue$.getValue())
        //     this.dialog.closeAll();
        //     this.hideFieldsAutomatically$.next(false);
        //     this.kycS.shuftiData.next({
        //         addressData: data.AddressDetails,
        //         autoApproved: this.autoApproved$.value,
        //         canContinue: this.canContinue$.getValue(),

        //     });
        //     this.listenTovAutoApprovedChange();
        //     this.openSnackBar(this.translateService.instant('KYC_Step_7.verified'), 'success-class')
        // });
    }


    openSnackBar(message: string, panelClass: string = "") {
        this._snackBar.open(message, undefined, {
            duration: 3000,
            panelClass: [panelClass, 'snackbar-text'],
            verticalPosition: 'top',
        });
    }

    editData() {
        this.autoApproved = false;
        this.autoApproved$.next(false);
    }

    listenTovAutoApprovedChange() {
        this.autoApproved$.subscribe(res => {
            this.setDisabledStatus('first_name', res);
            this.setDisabledStatus('last_name', res);
            this.setDisabledStatus('id_number', res);
            this.setDisabledStatus('birth_date', res);

        });
    }

    setDisabledStatus(controlName: any, status: any) {
        if (status) {
            this.step_7.controls[controlName].disable();
        }
        else {
            this.step_7.controls[controlName].enable();
        }
    }

    ngOnDestroy() {
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();
    }

}
