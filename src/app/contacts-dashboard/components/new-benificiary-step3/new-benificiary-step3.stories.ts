import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NewBenificiaryStep3Component } from './new-benificiary-step3.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Countries, getAllCurrencies } from '../../../main-dashboard/dashboard-data/all-currency-data';
import { paymentReason } from '../contacts-data/payments-reason.data';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { importProvidersFrom, inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from '../../../app.routes';
import { createTranslateLoader } from '../../../sign-up/kyc-main/kyc-main.stories';

export default {
  title: 'Contacts/Beneficiary/Step 3: Transaction Details',
  component: NewBenificiaryStep3Component,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
      ],
    }),
    applicationConfig({
      providers: [
        provideRouter(routes, withHashLocation()),
        provideHttpClient(),
        importProvidersFrom(
          CommonModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient],
            },
            defaultLanguage: 'en',
          })
        )
      ]
    })
  ],
} as Meta<NewBenificiaryStep3Component>;

type Story = StoryObj<NewBenificiaryStep3Component>;

export const Default: Story = {
  render: () => {
    const benificiaryForm = new FormGroup({
      newBenificiaryStep2: new FormGroup({
        beneficiaryCountry: new FormControl(),
        bankCountry: new FormControl(),
        currency: new FormControl()
      }),
    });

    const transactions = new FormGroup({
      investmentType: new FormControl(''),
      paymentReason: new FormControl(''),
      reasonDesc: new FormControl(''),
      beneficiaryStateResidenceRecipient: new FormControl('')
    });

    const uploadFile = new FormGroup({
      file: new FormArray([])
    });

    return {
      props: {
        stepIndex: 1,
        formStepper: {},
        formStepperProgress: {},
        transactions: transactions,
        benificiaryForm: benificiaryForm,
        parentCountryList: Countries,
        paymentReasons: paymentReason,
        editBenificiaryObj: { paymentReason: 1 },
        iseditBenificiary: false,
        uploadFile: uploadFile,
        isNonIsraeliUser: false,
        stepChanged: () => console.log('Step changed'),
        transcationFormValues: () => console.log('Transaction form values emitted'),
        onInit: async function(component: NewBenificiaryStep3Component) {
          const translate = inject(TranslateService);
          if (translate) {
            await translate.use('en').toPromise();
          }
        }
      },
      template: `
        <div class="beneficiary-step3-story-container">
          <app-new-benificiary-step3
            [stepIndex]="stepIndex"
            [formStepper]="formStepper"
            [formStepperProgress]="formStepperProgress"
            [transactions]="transactions"
            [benificiaryForm]="benificiaryForm"
            [parentCountryList]="parentCountryList"
            [paymentReasons]="paymentReasons"
            [editBenificiaryObj]="editBenificiaryObj"
            [iseditBenificiary]="iseditBenificiary"
            [uploadFile]="uploadFile"
            [isNonIsraeliUser]="isNonIsraeliUser"
            (stepChanged)="stepChanged()"
            (transcationFormValues)="transcationFormValues()"
            (ngOnInit)="onInit($event)"
          >
          </app-new-benificiary-step3>
        </div>
      `
    };
  }
};
