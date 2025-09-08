import { createElement, init } from '@airwallex/components-sdk';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Base64 } from 'js-base64';
import { AirwallexService } from 'src/app/airwallex/services/airwallex.service';
import { ContactsService } from '../services/contacts.service';
import { AirwallexbeneficiaryService } from '../services/airwallexbeneficiary.service';

enum ENV {
  dev = 'dev',
  staging = 'staging',
  demo = 'demo',
  prod = 'prod',
}

@Component({
  selector: 'app-embedded-sca',
  templateUrl: './embedded-sca.component.html',
  styleUrls: ['./embedded-sca.component.scss']
})
export class EmbeddedScaComponent implements OnInit, OnChanges {
  @Input() ScaLink: string;
  @Input() awReviewPayPayload: any;
  @Input('newBenificiaryStep2Values') newBenificiaryStep2Values: any;

  isAWbeneficiaryError: any;
  constructor(
    private aw: AirwallexService,
    private contactsService: ContactsService,
    private awBeneficiaryService: AirwallexbeneficiaryService
  ) { }

  async ngOnInit() {
    await this.EmbeddedSca();
  }

  async EmbeddedSca(): Promise<void> {
    const options = {
      env: ENV[this.contactsService.EmbeddedSca_Env() as keyof typeof ENV],
      authCode: '',
      clientId: this.contactsService.EmbeddedSca_clientId(),
      codeVerifier: '',
    };

    const dec2hex = (dec: number) => ('0' + dec.toString(16)).slice(-2);

    const generateCodeVerifier = () => {
      const length = Math.floor(Math.random() * (129 - 43)) + 43;
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, dec2hex).join('');
    };

    const sha256 = (plain: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest('SHA-256', data);
    };

    const base64urlencode = (hashed: ArrayBuffer) => {
      const bytes = new Uint8Array(hashed);
      return Base64.fromUint8Array(bytes, true);
    };

    const generateCodeChallengeFromVerifier = async (codeVerifier: string) => {
      const hashed = await sha256(codeVerifier);
      return base64urlencode(hashed);
    };

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
    options.codeVerifier = codeVerifier;

    this.aw.embeddedScaConnect(codeChallenge, this.ScaLink).subscribe(async res => {
      if (res) {
        options.authCode = res.authorization_code;
        await this.runScaFlow(options, res);
      }
    });
  }

  async runScaFlow(options: any, res: any): Promise<void> {
    try {
      const awReviewPayPayload = { ...this.awReviewPayPayload };
      await init(options);

      const element = await createElement('scaVerify', {
        userEmail: res.userEmail,
        scaSessionCode: res.scaSession,
        prefilledMobileInfo: {
          countryCode: res.countryCode,
          nationalNumber: res.NationalNumber
        }
      });

      element.mount('sca-container');

      element.on('scaSetupSucceed', async ({ mobileInfo }) => {
        // Re-run the SCA flow again (instead of reload)
        await this.EmbeddedSca();
      });

      element.on('verificationSucceed', ({ token }) => {
        this.aw.createAwBeneficiary(token, res.scaSession, awReviewPayPayload).subscribe(res2 => {
          if (res2['status'] === "Approved") {
            this.awBeneficiaryService.awVerificationSucceed.next(true);
          } else {
            this.awBeneficiaryService.awVerificationFailed.next(true);
          }
          //if sucsses need to apply complete beneficiary created
        }, (error: any) => {
          this.awBeneficiaryService.awVerificationFailed.next(true);
          this.displayErrorMessage(error);
        });
      });

      element.on('verificationFailed', ({ reason }) => {
        // Handle verification failed
        this.awBeneficiaryService.awVerificationFailed.next(true);
        console.warn('Verification failed:', reason);
      });

      element.on('error', e => {
        // Handle generic error
        this.awBeneficiaryService.awVerificationFailed.next(true);
        console.error('SCA error:', e);
      });

      element.on('cancel', e => {
        // Handle user cancellation
        this.awBeneficiaryService.awVerificationFailed.next(true);
        console.log('SCA cancelled by user:', e);
      });

    } catch (error) {
      this.awBeneficiaryService.awVerificationFailed.next(true);
      this.displayErrorMessage(error);

      if (this.isAWbeneficiaryError) {
        this.awBeneficiaryService.awVerificationAWBeneficiaryError.next(this.isAWbeneficiaryError);
      }
      console.error('Error initializing Airwallex SDK:', error);
    }
  }

  displayErrorMessage(errorDetails: any) {
    const errorCode = errorDetails['error'];
    switch (errorCode) {
      case 'beneficiary_type_unsupported':
      case 'transfer_currency_unsupported':
      case 'unsupported_country_code':
      case 'unsupported_currency':
        this.isAWbeneficiaryError = `${this.awReviewPayPayload.beneficiary.bank_details.account_currency} transfers to recipients in ${this.awReviewPayPayload.beneficiary.bank_details.bank_country_code} are not available. Select another currency or another country/region that you transfer to.`;
        break;

      case 'field_required':
      case 'invalid_argument':
      case 'validation_failed':
        const errors = errorDetails['details']?.['errors'];
        if (errors && errors.length !== 0) {
          const formattedSources = errors
            .map((error: any) => {
              const sourceKey = error.source.split('.').pop();
              return sourceKey
                .split('_')
                .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            })
            .join(', ');
          this.isAWbeneficiaryError = `Please enter a valid ${formattedSources.charAt(0).toUpperCase() + formattedSources.slice(1)}`;
          const beneficiaryCountry = this.newBenificiaryStep2Values?.beneficiaryCountry;
          const bankCountry = this.newBenificiaryStep2Values?.bankCountry;
          const currency = this.newBenificiaryStep2Values?.currency;
          if (beneficiaryCountry == 'ca' && bankCountry == 'ca' && currency == 'CAD' && this.isAWbeneficiaryError.includes("Local Clearing System")) {
            this.isAWbeneficiaryError = this.isAWbeneficiaryError.replace("Local Clearing System", "Institution and Transit numbers");
          }
        }
        break;

      case 'already_exists':
        this.isAWbeneficiaryError = `Beneficiary already exists`;
        break;

      case 'service_unavailable':
      case 'too_many_requests':
        this.isAWbeneficiaryError = `Service is temporarily unavailable. Please try again later or contact support`;
        break;
      default:
        this.isAWbeneficiaryError = errorDetails?.[0] || errorDetails?.message || "Unexpected error occured. Please retry";
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['awReviewPayPayload'] && changes['awReviewPayPayload']?.currentValue) {
      this.awReviewPayPayload = changes['awReviewPayPayload']?.currentValue;
    }
  }
}
