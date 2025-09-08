import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ChangeDetectionStrategy, OnChanges, SimpleChanges, AfterContentChecked } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { map, of, Subject, Subscription, takeUntil } from 'rxjs';
import { ActiveCurrencyModel } from '../../../main-dashboard/models/ActiveCurrencyModel';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { getAllActiveCurrencies } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NewBenificiaryStep1Component } from '../new-benificiary-step1/new-benificiary-step1.component';
import { NewBenificiaryStep2Component } from '../new-benificiary-step2/new-benificiary-step2.component';
import { Countries, GetAllCurrenciesForPayment } from '../../../main-dashboard/dashboard-data/all-currency-data';
import { NewBenificiaryStep3Component } from '../new-benificiary-step3/new-benificiary-step3.component';
import { NewBenificiaryStep4Component } from '../new-benificiary-step4/new-benificiary-step4.component';
import { NewBenificiaryStep5Component } from '../new-benificiary-step5/new-benificiary-step5.component';
import { paymentReason } from '../contacts-data/payments-reason.data';
import { NewBenificiaryStep6Component } from '../new-benificiary-step6/new-benificiary-step6.component';

@Component({
  selector: 'app-new-benificiary',
  templateUrl: './new-benificiary.component.html',
  styleUrls: ['./new-benificiary.component.scss'],
  imports: [CommonModule, MatProgressBarModule, MatStepperModule, NewBenificiaryStep1Component, NewBenificiaryStep2Component, NewBenificiaryStep3Component, NewBenificiaryStep4Component, NewBenificiaryStep5Component, NewBenificiaryStep6Component]
})
export class NewBenificiaryComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked{
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('payment') payment?: any;
  @Input('benificiaryForm') benificiaryForm?: any;
  @Input('newBenificiaryStep2') newBenificiaryStep2?: any;
  @Input('newBenificiaryBankDetails') newBenificiaryBankDetails?: any;
  @Input('editBeneficiary') editBeneficiary?: any;
  @Input('editBenificiaryObj') editBenificiaryObj?: any;
  @Input('newBenificiaryStep2Values') newBenificiaryStep2Values?: any;
  @Input('transcationFormStep3Values') transcationFormStep3Values?: any;
  @Input('bankDetailsFormStep4Values') bankDetailsFormStep4Values?: any;
  @Input('uploadFileFormStep5Values') uploadFileFormStep5Values?: any;
  @Input('isNonIsraeliUser') isNonIsraeliUser?: any;
  @Output() moveToMainContactPage = new EventEmitter<void>();
  @ViewChild('newBenificiaryStepper') newBenificiaryStepper!: MatStepper;
  @Output() isAWStep2NextClicked = new EventEmitter<boolean>();
  @Input('awBeneficiaryForm') awBeneficiaryForm!: FormGroup | null;
  @Input('awFormSchemaErrors') awFormSchemaErrors?: any;
  @Input('awBeneficiaryDetailsObj') awBeneficiaryDetailsObj: any;


  stepperSubscription!: Subscription;
  unSubScribe$ = new Subject<void>();
  progressWidth!: number;
  countryList: any;
  currencyData: any = [];
  currentStep = 0;
  paymentReasons: any;
  iseditBenificiary = false;
  showProgressAndCurrencyTitle = true;
  step6ConfirmClicked = false;
  summaryPageInit: boolean = false;
  
  constructor(
    public contactsService: ContactsService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    debugger
    this.stepperSubscription = this.contactsService.getnewBenificiarySelectedStepperIndexFromSummary.subscribe((res: any) => {
      if (res) {
        this.navigateToScreen(res);
      }
    });
    this.getCountries();
    this.GetSupportedCashflowCurrencies();
    this.getPaymentReasons();
    this.allSubscriptions();
    if (!this.iseditBenificiary) {
      window.localStorage.removeItem('selectedPayment');
      window.localStorage.removeItem('selectedInvestmentType');
    }
    this.iseditBenificiary = JSON.parse(localStorage.getItem('editBenificiary')!);
  }

  allSubscriptions() {
    this.contactsService.isNewBenificiaryconfirmClicked.subscribe(res => {
      if (res) {
        this.showProgressAndCurrencyTitle = false;
      } else {
        this.showProgressAndCurrencyTitle = true;
      }
    });
    this.contactsService.isNewBenificiaryconfirmClicked.subscribe(res => {
      if (res) {
        this.step6ConfirmClicked = true;
      } else {
        this.step6ConfirmClicked = false;
      }
    });
    this.contactsService.isBeneficiarySummaryInit.subscribe(res => {
      if (res) {
        this.summaryPageInit = true;
      } else {
        this.summaryPageInit = false;
      }
    });
  }

  getCountries() {
    of(Countries).pipe(takeUntil(this.unSubScribe$)).subscribe((data: any) => {
      this.countryList = data;
    })
  }

  GetSupportedCashflowCurrencies() {
    of(GetAllCurrenciesForPayment).pipe(takeUntil(this.unSubScribe$)).subscribe((activeCurrencyRes: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      if (Array.isArray(activeCurrencyRes)) {
        if (user?.affiliate?.currency === 'EUR') {
          const index = activeCurrencyRes.findIndex((i: ActiveCurrencyModel) => i?.currency?.code === 'ILS');
          if (index > -1) {
            activeCurrencyRes.splice(index, 1);
          }
        }
      }
      this.currencyData = activeCurrencyRes;
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

  getPaymentReasons() {
    of(paymentReason).pipe(takeUntil(this.unSubScribe$)).subscribe(paymentReasonsRes => {
      this.paymentReasons = paymentReasonsRes;
    })
  }

  nextStep() {
    this.newBenificiaryStepper.next();
  }

  prevStep() {

    if (this.isNonIsraeliUser) {
      if (this.newBenificiaryStepper.selectedIndex === 1) {
        this.contactsService.closeAllDialog();
        return;
      } else if (this.iseditBenificiary && this.newBenificiaryStepper.selectedIndex === 2) {
        this.contactsService.closeAllDialog();
        localStorage.removeItem('editBenificiary')
        return;
      } else {
        if (this.newBenificiaryStepper.selectedIndex === 5) {
          this.contactsService.isBeneficiarySummaryInit.next(false);
          this.newBenificiaryStepper.selectedIndex = 3;
        } else {
          this.newBenificiaryStepper.previous();
        }
      }
      this.showProgress();
      return;
    }

    // Early return if on the first step and editing a beneficiary
    // this.contactsService.getBeneficiaryDataForEdit.subscribe((data) => {
    //   const moveUserDirectalyToSummaryPage = [18, 25, 19, 21, 999]; // user has no document or no reason fields based on this reason
    //     const paymentReason = Number(data['paymentReason']);
    //     if (moveUserDirectalyToSummaryPage.includes(paymentReason)) {
    //       if(this.newBenificiaryStepper.selectedIndex === 5){
    //         this.newBenificiaryStepper.selectedIndex - 2;
    //       }
    //     }
    // });
    if (this.iseditBenificiary && this.newBenificiaryStepper.selectedIndex === 1) {
      this.contactsService.closeAllDialog();
      return;
    }


    if (this.newBenificiaryStepper.selectedIndex === 0) {
      // Retrieve and check the uploaded document flag
      const uploadDocClicked = JSON.parse(localStorage.getItem('newBenificiaryUploadFile')!);
      const isStep1BenefiExist = localStorage.getItem('isStep1BenefiExist')!;
      // If no document upload flag is set, notify that the upload screen doesn't exist
      if (!uploadDocClicked) {
        this.contactsService.isUploadFileScreenNotExist.next(true);
        this.contactsService.closeAllDialog();
        if (!isStep1BenefiExist) {
          const dialogRef = this.dialog.open(AddContactsComponent, {
            width: '100vw',
            maxWidth: '100vw',
            disableClose: true,
            data: {
              createContact: ''
            }
          }).beforeClosed().subscribe(data => {
          });
        } else {
          localStorage.removeItem('isStep1BenefiExist');
        }
        return; // No further processing needed if no upload doc clicked
      }

      // Handle cases based on the uploadDocClicked flag
      switch (uploadDocClicked) {
        case 1:
          this.contactsService.isUploadDocClickedFromNewBeniStep1.next(true);
          localStorage.removeItem('newBenificiaryUploadFile');
          break;
        case 2:
          this.contactsService.isUploadDocNewBenFileExist.next(true);
          localStorage.setItem('newBenificiaryUploadFile', JSON.stringify(1)); // Set to next step
          break;
        default:
          this.moveToMainContactPage.emit();
          break;
      }
      return; // Ensure no further steps are taken once handling is complete
    }

    // If at the last step and not confirmed, just go back to the previous step
    const isStepAddNewClicked = JSON.parse(localStorage.getItem('step6AddNewBeneficiary')!);
    // If at the last step and confirmed, reset the form and go to the first step
    if (this.newBenificiaryStepper.selectedIndex === 5 && isStepAddNewClicked) {
      localStorage.removeItem('step6AddNewBeneficiary');
      this.iseditBenificiary = false;
      this.contactsService.resetNewBenificiaryForm.next(true);
      this.contactsService.isBeneficiarySummaryInit.next(false);
      this.newBenificiaryStepper.selectedIndex = 1;
      this.showProgress();
      return;
    }


    if (this.newBenificiaryStepper.selectedIndex === 5 && !this.step6ConfirmClicked) {
      this.newBenificiaryStepper.previous();
      const moveUserDirectalyToSummaryPage = [18, 25, 19, 21, 999];
      const paymentReason = Number(this.transcationFormStep3Values?.paymentReason);
      if (moveUserDirectalyToSummaryPage.includes(paymentReason)) {
        this.newBenificiaryStepper.previous();
      }
      this.contactsService.isBeneficiarySummaryInit.next(false);
      this.showProgress();
      return;
    }

    if (this.newBenificiaryStepper.selectedIndex === 5) {
      this.newBenificiaryStepper.selectedIndex = 0;
      this.contactsService.resetNewBenificiaryForm.next(true);
      this.contactsService.isBeneficiarySummaryInit.next(false);
      this.showProgress();
      return;
    }
    this.newBenificiaryStepper.previous();
    this.showProgress();
  }


  onStepChange() {
    this.newBenificiaryStepper.next();
    this.showProgress();
    this.cd.detectChanges();
  }

  skipUploadFileStep() {
    this.newBenificiaryStepper.selectedIndex = 5;
    this.showProgress();
  }

  step2ChangedValues(step2values: any) {
    this.newBenificiaryStep2Values = step2values;
    this.isAWStep2NextClicked.emit(true);
  }

  transcationFormValues(step3Values: any) {
    this.transcationFormStep3Values = step3Values;
  }

  bankDetailsFormValues(step4Value: any) {
    this.bankDetailsFormStep4Values = step4Value;
  }

  uploadFileFormValues(step5Value: any) {
    this.uploadFileFormStep5Values = step5Value;
  }

  navigateToScreen(stepperIndex: number) {
    if (stepperIndex && this.newBenificiaryStepper) {
      this.newBenificiaryStepper.selectedIndex = stepperIndex;
      this.showProgress();
      if (this.isNonIsraeliUser && !this.iseditBenificiary) {
        this.showProgressAndCurrencyTitle = true;
      }
      this.cd.detectChanges()
    }
  }

  showProgress() {

    if (this.newBenificiaryStepper.selectedIndex === 2) {
      this.progressWidth = 0;
    }
    else if (this.newBenificiaryStepper.selectedIndex === 3) {
      this.progressWidth = 33;
      if (this.isNonIsraeliUser) {
        this.progressWidth = 50;
      }
    }
    else if (this.newBenificiaryStepper.selectedIndex === 4) {
      this.progressWidth = 66;
    }
    else if (this.newBenificiaryStepper.selectedIndex === 5) {
      this.progressWidth = 100;
    }
  }

  onStepChangeNewBenificiary(event: any) {
    this.contactsService.setNewBeniStepperIndex(event.selectedIndex);
  }

  ngOnDestroy(): void {
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
    this.contactsService.isCreateBeneficiaryFromLastStep.next(false);
    if (this.stepperSubscription) {
      this.stepperSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (typeof this.newBenificiaryStepper.selectedIndex === 'number') {
      this.stepperSubscription = this.contactsService.getnewBenificiarySelectedStepperIndexFromSummary.subscribe((res: any) => {
        if (res) {
          this.navigateToScreen(res);
        }
      });
    }
    // this.awBeneficiaryService.awSkipUploadFile.subscribe(res => {
    //   if (res && this.isNonIsraeliUser) {
    //     this.newBenificiaryStepper.selectedIndex = 5;
    //     this.showProgress();
    //   }
    // });


    if (this.isNonIsraeliUser && !this.iseditBenificiary) {
      if (this.formStepper) {
        this.newBenificiaryStepper.selectedIndex = 1;
      }
    } else if (this.isNonIsraeliUser && this.iseditBenificiary) {
      if (this.formStepper) {
        this.newBenificiaryStepper.selectedIndex = 2;
        this.showProgress();
        this.cd.detectChanges();
      }
    }else {
      if(!this.isNonIsraeliUser && this.iseditBenificiary) {
        this.newBenificiaryStepper.selectedIndex = 2
      }
    }
    this.cd.detectChanges();
  }

  ngAfterContentChecked(): void {
    //This condition is only for handling ADD/UPDATE text for non israeli user
    if(this.isNonIsraeliUser && this.newBenificiaryStepper?.selectedIndex == 1) {
        this.iseditBenificiary = false
    }
  }
}
