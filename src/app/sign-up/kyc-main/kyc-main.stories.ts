import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { inject } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { KycMainComponent } from "./kyc-main.component";
import { KycService } from "../services/kyc.service";
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

export enum EStepNumber {
  typeOfBusiness = 1,
  email = 2,
  emailConfirmation = 3,
  phone = 4,
  createPassword = 6,
  personalDetails = 7,
  personalAddress = 8
}

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

interface KycMainComponentWithCustomArgs extends KycMainComponent {
  initialStep?: EStepNumber;
}

const meta: Meta<KycMainComponentWithCustomArgs> = {
  title: 'User-authentication/Sign-up',
  component: KycMainComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        HttpClientModule,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        KycService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: { get: () => null },
              queryParamMap: { get: () => null },
            },
          },
        }
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
    // Set the language for ngx-translate in Storybook using Angular's inject()
    try {
      const translateService = inject(TranslateService, { optional: true });
      if (translateService && typeof translateService.use === 'function') {
        translateService.use('en');
      }
    } catch (e) {
      // ignore if inject is not available
    }
    return {
      props: args,
      template: `
        <div class="kyc-story-container">
          <app-kyc-main
            [stepsObj]="{
              currentStep: ${currentStep},
              maxSteps: ${EStepNumber.personalAddress},
              minSteps: ${EStepNumber.typeOfBusiness}
            }">
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

export const Step5_CreatePassword: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.createPassword
  }
};

export const Step6_PersonalDetails: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.personalDetails
  }
};

export const Step7_PersonalAddress: Story = {
  ...KycMainFlow,
  args: {
    initialStep: EStepNumber.personalAddress
  }
};