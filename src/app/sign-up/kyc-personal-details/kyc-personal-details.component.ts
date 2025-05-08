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
        const hideShowFields: boolean = !isPrivate ? false : true;
        this.hideFieldsAutomatically$.next(hideShowFields);
        this.listenTovAutoApprovedChange();
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
