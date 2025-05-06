import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {Subject} from 'rxjs';
import {EBusinessType, EDetailsToShowNames, IKycData, IStepsObj} from '../models';
// import {KycService} from '../services/kyc.service';
import {StepActionType} from '../types/global.type';
// import { onlyValidIdNumber } from '../../shared/custom-validators';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SelectCountryComponent } from '../fields/select-country/select-country.component';
import { MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'app-kyc-one',
  imports: [CommonModule,MatExpansionModule,FormsModule,ReactiveFormsModule,MatError,TranslateModule, SelectCountryComponent, MatRadioGroup],
  templateUrl: './kyc-one.component.html',
  styleUrl: './kyc-one.component.scss'
})
export class KycOneComponent {
  componentDestroyed = new Subject<any>();
  @Input('parentFormGroup') parentFormGroup!: FormGroup;
  @Input('kycForm') kycForm: any;
  @Input('stepsObj') stepsObj!: IStepsObj;
  @Output('nextStepEvent') nextStepEvent = new EventEmitter<StepActionType>();
  @Output('activatedBusinessType') activatedBusinessType = new EventEmitter<IKycData['businessTypes']>();
  businessTypes = EBusinessType;
  assetsPath = 'environment.assetsPath';
  step_1!: FormGroup;
  businessTypesCompanyAccount!: FormGroup;
  businessTypesPrivateAccount!: FormGroup;
  privateCountryNotIsrael: boolean = false;
  countryName: any;
  constructor(
    // private KycS: KycService,
  ) {
  }
  ngOnInit(): void {
    this.step_1 = <FormGroup>this.kycForm.get('step_1');
    this.businessTypesCompanyAccount = <FormGroup>this.kycForm.get('step_1').get(this.businessTypes.companyAccount)
    this.businessTypesPrivateAccount = <FormGroup>this.kycForm.get('step_1').get(this.businessTypes.privateAccount)
  }

  handleBusinessTypeChange(panel: MatExpansionPanel, fgName: IKycData['businessTypes']) {
    // this.KycS.handleResetCountries$.next(true);

    if (fgName === EDetailsToShowNames.privateAcc) {
      this.kycForm.controls['step_7'].get('id_number').addValidators([Validators.required]);
    }

    if (fgName === EDetailsToShowNames.companyAcc) {
      this.kycForm.controls['step_7'].get('id_number').setValidators(null);
      this.kycForm.controls['step_7'].get('id_number').setErrors(null);
      this.kycForm.controls['step_7'].get('id_number').updateValueAndValidity();
    }

    const groupSelected = this.kycForm.controls.step_1.get(fgName);
    if (!groupSelected) {
      console.error(`group didnt found given ${groupSelected} \n form group name given ${fgName}`);
      return;
    }

    Object.keys(this.kycForm.controls.step_1['controls']).forEach(bt => {
      const currentBusiness:any = (<AbstractControl>this.kycForm.controls.step_1['controls'][bt]);

      currentBusiness.reset();

      currentBusiness.get('isActive').setValue(null);
      if (bt !== EBusinessType.invitedAccount) {
        currentBusiness.get('countrySelected').setValue(null);
      }
    });

    this.kycForm.controls.step_1.get(fgName).get('isActive').setValue(panel.expanded);

    this.activatedBusinessType.next(fgName)
  }

  handleNextStep() {
  debugger
   this.privateCountryNotIsrael = false;
    if(this.kycForm?.value?.step_1?.companyAcc?.countrySelected != null){
      if(this.kycForm?.value?.step_1?.companyAcc?.countrySelected){
        this.nextStepEvent.next('NEXT');
      }else{
        localStorage.removeItem('kycForm')
        localStorage.setItem('step', JSON.stringify(1));
        window.location.href = "https://onboarding-demo.paydirect.io/okoora/forms/corporate"
      }
    }else{    
      if(this.kycForm?.value?.step_1?.privateAcc?.countrySelected != null && this.kycForm?.value?.step_1?.privateAcc?.countrySelected !='Israel'){
        if(this.countryName === null || this.countryName === undefined){
          this.countryName = this.kycForm?.value?.step_1?.privateAcc?.countrySelected
          // this.KycS.PrivateKYCCountry(this.countryName).subscribe();
        }
        this.privateCountryNotIsrael = true;        
      } else {
        this.nextStepEvent.next('NEXT');
      }
    }
  }

  canClickNextStep(): boolean {
    return this.kycForm.get('step_1')?.valid;
  }

  ngOnDestroy() {
    this.componentDestroyed.next(null);
    this.componentDestroyed.complete();
  };
}
