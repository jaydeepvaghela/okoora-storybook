import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { map, of, Subject, Subscription, takeUntil } from 'rxjs';
import { ActiveCurrencyModel } from '../../../main-dashboard/models/ActiveCurrencyModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ContactsService } from '../../services/contacts.service';
import { PayerService } from '../../services/payer.service';
import { Countries } from '../../../main-dashboard/dashboard-data/all-currency-data';
import { getAllActiveCurrencies } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NewPayerStepOneComponent } from '../new-payer-step-one/new-payer-step-one.component';
import { NewPayerStepTwoComponent } from '../new-payer-step-two/new-payer-step-two.component';
import { NewPayerStepThreeComponent } from '../new-payer-step-three/new-payer-step-three.component';
import { NewPayerSummaryStepComponent } from '../new-payer-summary-step/new-payer-step-summary.component';

@Component({
  selector: 'app-new-payer',
  templateUrl: './new-payer.component.html',
  styleUrls: ['./new-payer.component.scss'],
  imports: [CommonModule, MatProgressBarModule, MatStepperModule, ReactiveFormsModule, NewPayerStepOneComponent, NewPayerStepTwoComponent, NewPayerStepThreeComponent, NewPayerSummaryStepComponent]
})
export class NewPayerComponent implements OnInit, AfterViewInit {
  @Input() editPayer!: boolean;
  @Input() editPayerObj: any;

  progressWidth!: number;
  showProgressAndCurrencyTitle = true;
  unsubscribe$ = new Subject<void>();
  countryList: any;
  currencyData: any;

  @ViewChild('formStepper') formStepper!: MatStepper;
  payerForm: FormGroup | any;
  @Output() moveToMainContactPage = new EventEmitter<void>();
  isSummaryPageInit: boolean = false;
  stepperSubscription!: Subscription;
  isSubSite!: boolean;
  lastscreenCloseIcon!: boolean;
  subsiteLogo!:string;
  // newPayerReasonForm: FormGroup;


  constructor(private fb: FormBuilder, public contactService: ContactsService, private cd: ChangeDetectorRef, private payerService: PayerService) { }

  ngOnInit(): void {
    this.newPayerFoms();
    this.GetSupportedCashflowCurrencies();
    this.getCountries();

    this.contactService.isNewPayerconfirmClicked.subscribe(res => {
      if (res) {
        this.showProgressAndCurrencyTitle = false;
        this.lastscreenCloseIcon = true;
      } else {
        this.showProgressAndCurrencyTitle = true;
        this.lastscreenCloseIcon = false;
      }
    });
    this.contactService.isNewPayerSummaryPage.subscribe(res => {
      if (res) {
        this.isSummaryPageInit = true;
      } else {
        this.isSummaryPageInit = false;
      }
    });

    this.payerService.selectedPayerIndex.subscribe(payerIndex => {
      if (payerIndex > 0) {
        this.showProgress();
      }
    })

    this.payerForm.get('payerAccountDetail').get('bankCountry').valueChanges
      .subscribe((res: any) => {
        if(res) {
          this.payerService.clearValidatorsForControls(this.payerForm.get('payerAccountDetail'), ['accountType', 'iban', 'bicSwift', 'accountNumber', 'bankBranch', 'bankNumber']);
        }
      })
  }

  onStepChange(): void {
    // if (typeof this.formStepper.selectedIndex === 'number') {
    //   this.stepperSubscription = this.contactService.getnewPayerSelectedStepperIndexFromSummary.subscribe((res: any) => {
    //     if (res) { // Handle 0 explicitly
    //       this.navigateToScreen(res);
    //     }
    //   });
    // }
    this.formStepper.next();
    this.showProgress();
    this.cd.detectChanges();
  }


  navigateToScreen(stepperIndex: number) {
    this.formStepper.selectedIndex = 0;
    this.showProgress();
  }

  onStepChangeEvent(event: StepperSelectionEvent): void {
    // Handle step-specific logic
    if (event.selectedIndex === 0) {
      this.handleStepZeroLogic();
    }
  }

  handleStepZeroLogic(): void {
    // Logic specific to step 0
    this.stepperSubscription = this.contactService.getnewPayerSelectedStepperIndexFromSummary.subscribe((res: any) => {
      if (res === 0 || res) {
        this.navigateToScreen(res);
      }
    });
  }

  onStepChangeNewBenificiary(event: any) {
    this.contactService.setNewPayerStepperIndex(event.selectedIndex);
  }

  newPayerFoms() {
    // this.newPayerReasonForm = this.fb.group({
    //   paymentReason: ['', Validators.required],
    //   currency: ['', Validators.required],
    //   bankNumber: ['', Validators.required],
    //   bankBranch: ['', Validators.required],
    //   accountNumber: ['', Validators.required],
    // });

    this.payerForm = this.fb.group({
      // payerProfileType: this.fb.group({
      //   paymentReason: ['', Validators.required]
      // }),
      newPayerReasonForm: this.fb.group({
        paymentReason: ['', Validators.required],
        currency: ['', Validators.required],
        payerAccount: ['', Validators.required],
        bankNumber: ['', Validators.required],
        bankBranch: ['', Validators.required],
        accountNumber: ['', Validators.required],
      }),
      payerProfileDetail: this.fb.group({
        bankCode: ['', Validators.required],
        bankBranch: ['', Validators.required],
        bankAccountNumber: ['', Validators.required],
        currency: ['', Validators.required],
        ibanNumber: ['', Validators.required],
        paymentExportingFile: this.fb.array([]),
        paymentlaborFile: this.fb.array([])
      }),
      payerAccountDetail: this.fb.group({
        accountType: [null],
        iban: [null],
        bicSwift: [null],
        accountNumber: [null],
        bankCountry: [null],
        bankName: [''], // Default is an empty string
        bankBranch: [null],
        bankNumber: [null],
        bankAccountHolderName: ['', Validators.pattern('^.{1,255}$')],
        entityType: [null],
        unionCountry: [null],
        payerCountry: [null],
        foundsSourceDetails: [''], // Default is an empty string
        currency: [null]
      }),
      uploadFileForm: this.fb.group({
        file: this.fb.array([]),
      })
    })

    if (this.editPayerObj) {
      this.payerForm.get('newPayerReasonForm').patchValue(this.editPayerObj);
      const payerAccountDetailGroup = this.payerForm.get('payerAccountDetail') as FormGroup;
      if (payerAccountDetailGroup) {
        Object.keys(payerAccountDetailGroup.controls).forEach((controlName: string) => {
          const control = payerAccountDetailGroup.get(controlName);
          if (control && this.editPayerObj.hasOwnProperty(controlName)) {
            const allCountries = ['unionCountry', 'bankCountry', 'payerCountry'];
            if (allCountries.includes(controlName)) {
              control.patchValue(this.editPayerObj[controlName]?.toLowerCase());
            } else {
              control.patchValue(this.editPayerObj[controlName]);
            }
          }
        });
      }
    }

  }


  GetSupportedCashflowCurrencies() {
    this.currencyData = of(getAllActiveCurrencies).subscribe(res => {
      this.currencyData = res;
    });

  }

  getCountries() {
    of(Countries).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.countryList = data;
    })
  }

  getAllActiveCurrency() {
    return of(getAllActiveCurrencies).pipe(
      map((data: ActiveCurrencyModel[]) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (Array.isArray(data)) {
          if (user?.affiliate?.currency === 'EUR') {
            const index = data.findIndex((i: ActiveCurrencyModel) => i?.currency?.code === 'ILS');
            if (index > -1) {
              data.splice(index, 1);
            }
          }
        } else {
          console.warn('Response is not an array:', data);
        }
        return data;
      })
    );
  }

  goToNextStep(stepper: MatStepper) {
    if (this.payerForm.get('newPayerReasonForm')!.invalid) {
      this.payerForm.get('newPayerReasonForm')!.markAllAsTouched();
      stepper.next();
    }
  }

  goToPreviousStep(stepper: MatStepper) {
    stepper.previous();  // Move to the previous step
  }

  navigateTOStepper(index: number) {
    this.formStepper.selectedIndex = index;
    this.showProgress();
  }

  showProgress() {
    if (this.formStepper?.selectedIndex === 0) {
      this.progressWidth = 0;
    }
    else if (this.formStepper?.selectedIndex === 1) {
      this.progressWidth = 33;
    }
    else if (this.formStepper?.selectedIndex === 2) {
      this.progressWidth = 66;
    }
    else if (this.formStepper?.selectedIndex === 3) {
      this.progressWidth = 100;
    }
  }

  prevStep() {
    if (this.formStepper.selectedIndex === 0 && this.editPayer || this.formStepper.selectedIndex === 0) {
      this.contactService.closeAllDialog();
      return;
    }

    if (this.formStepper.selectedIndex === 3) {
      if (this.payerForm.get('newPayerReasonForm').get('paymentReason')?.value === 2 && this.payerForm.get('newPayerReasonForm').get('currency')?.value == 'ILS') {
        this.formStepper.selectedIndex = 0;
        this.showProgress();
        return;
      }
      // this.payerService.isMoveToSummaryPage.subscribe((res) => {
      //   if (res) {
      //     this.formStepper.selectedIndex = 0;
      //     this.showProgress();
      //     return;
      //   }
      // });
      const isSkipUpload = JSON.parse(localStorage.getItem('skipPayerDocumentPage')!);
      if (isSkipUpload) {
        this.formStepper.selectedIndex = 2;
        localStorage.removeItem('skipPayerDocumentPage');
      }
    }
    this.formStepper.previous();
    this.showProgress();
  }

  onSubmit() {
    console.log('Payer form values: ', this.payerForm.value)
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.stepperSubscription) {
      this.stepperSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.contactService.getnewPayerSelectedStepperIndexFromSummary.subscribe((res: any) => {
      if (res) {
        this.navigateToScreen(res);
      }
    });
  }


  lastScreenCloseIcon(){
    this.contactService.closeAllDialog();
  }
}
