import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { importProvidersFrom, inject } from "@angular/core";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { KycMainComponent } from "./kyc-main.component";
import { KycService } from "../services/kyc.service";
import { provideRouter, withHashLocation } from "@angular/router";
import { routes } from "../../app.routes";

export enum EStepNumber {
  typeOfBusiness = 1,
  email = 2,
  emailConfirmation = 3,
  phone = 4,
  //   phoneConfirmation = 5,
  createPassword = 6,
  personalDetails = 7,
  personalAddress = 8
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}

interface KycMainComponentWithCustomArgs extends KycMainComponent {
  initialStep?: EStepNumber;
}

const meta: Meta<KycMainComponentWithCustomArgs> = {
  title: 'KYC/KycMain',
  component: KycMainComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
      ],
      providers: [KycService]
    }),
    applicationConfig({
      providers: [
        provideRouter(routes, withHashLocation()),
        provideHttpClient(),
        importProvidersFrom(CommonModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          },
          defaultLanguage: 'en',
        }),)
      ]
    })
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    initialStep: {
      control: {
        type: 'select',
        options: Object.values(EStepNumber).filter(val => typeof val === 'number')
      },
      description: 'Initial step in the KYC flow',
    }
  }
};

export default meta;
type Story = StoryObj<KycMainComponentWithCustomArgs>;

export const KycMainFlow: Story = {
  args: {
    initialStep: EStepNumber.typeOfBusiness
  },
  render: (args) => {
    const currentStep = args.initialStep || EStepNumber.typeOfBusiness;

    return {
      props: {
        ...args,
        stepsObj: {
          currentStep,
          maxSteps: EStepNumber.personalAddress,
          minSteps: EStepNumber.typeOfBusiness
        },
        onInit: async function (component: KycMainComponent) {
          const translate = inject(TranslateService);
          if (translate) {
            await translate.use('en').toPromise();
          }

          if (component) {
            component.stepsObj = {
              currentStep,
              maxSteps: EStepNumber.personalAddress,
              minSteps: EStepNumber.typeOfBusiness
            };

            if (currentStep >= EStepNumber.email) {
              component.kycForm.get('step_1')?.patchValue({
                companyAcc: {
                  isActive: true,
                  countrySelected: 'Israel',
                  countryCode: 'IL'
                }
              });
            }

            if (currentStep >= EStepNumber.emailConfirmation) {
              component.kycForm.get('step_2')?.patchValue({
                email: 'test@example.com',
                agree: true
              });
            }

            if (currentStep >= EStepNumber.phone) {
              component.kycForm.get('step_3')?.patchValue({
                email_code_sent: '123456',
                email_code_user_enter: '123456'
              });
            }

            // if (currentStep >= EStepNumber.phoneConfirmation) {
            //   component.kycForm.get('step_4')?.patchValue({
            //     phone_code: '972',
            //     phone: '5551234567'
            //   });
            // }

            if (currentStep >= EStepNumber.createPassword) {
              component.kycForm.get('step_5')?.patchValue({
                phone_confirmation_sent: '123456',
                phone_confirmation_user_enter: '123456'
              });
            }

            if (currentStep >= EStepNumber.personalDetails) {
              component.kycForm.get('step_6')?.get('passwords')?.patchValue({
                password: 'Password123!',
                confirmPassword: 'Password123!'
              });
            }

            if (currentStep >= EStepNumber.personalAddress) {
              component.kycForm.get('step_7')?.patchValue({
                first_name: 'John',
                first_name_he: '',
                last_name: 'Doe',
                last_name_he: '',
                id_number: '123456789',
                birth_date: '1990-01-01',
                applicantId: '12345'
              });
            }
            if (component.triggerChangeDetection) {
              component.triggerChangeDetection();
            }
          }
        }
      },
      template: `
        <div class="kyc-story-container">
          <app-kyc-main
            [stepsObj]="stepsObj"
            (ngOnInit)="onInit($event)">
          </app-kyc-main>
        </div>
      `
    };
  }
};

export const Step1_TypeOfBusiness: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.typeOfBusiness
  }
};

export const Step2_Email: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.email
  }
};

export const Step3_EmailConfirmation: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.emailConfirmation
  }
};

export const Step4_Phone: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.phone
  }
};

// export const Step5_PhoneConfirmation: Story = {
//   ...KycMainFlow,
//   args: {
//     ...KycMainFlow.args,
//     initialStep: EStepNumber.phoneConfirmation
//   }
// };

export const Step6_CreatePassword: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.createPassword
  }
};

export const Step7_PersonalDetails: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.personalDetails
  }
};

export const Step8_PersonalAddress: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.personalAddress
  }
};
