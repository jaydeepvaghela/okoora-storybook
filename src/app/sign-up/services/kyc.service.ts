import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
// import { TAccountPackageDto } from 'src/app/activate-account/models/user';
// import { ApiMap } from 'src/app/common/api.map';
// import { CommonService } from 'src/app/common/services/common.service';
// import { DataService } from 'src/app/core/services/data.service';
// import { environment } from 'src/environments/environment';
import snsWebSdk from '@sumsub/websdk';
import {
    CountriesData,
    CountryData,
    CountryDataType,
    EBusinessType,
    IErrorData,
    IKYCFormGroups,
    SupportedCountries,
    TBusinessTypes,
    TSendMailResponse,
    TVerificationCodeStatus,
    VerificationReturnType
} from '../models/index';
import { countryData } from '../fields/country-data';
// import {minAgeForKyc} from "../../models";

@Injectable({
    providedIn: 'root'
})
export class KycService {
    allCountriesDataMap: Map<string, CountryDataType[any]>;
    allCountriesDataArr: CountryDataType[any][];
    loading$ = new Subject<boolean>();
    verificationCodeStatus = new BehaviorSubject<TVerificationCodeStatus>('DEFAULT');
    showError$ = new Subject<IErrorData>();
    allCountries$!: BehaviorSubject<CountriesData[]>;
    handleResetCountries$ = new Subject<boolean>();
    errorOverlayTryAgainClicked$ = new Subject();
    selectedAccountType$ = new BehaviorSubject(null);
    shuftiData = new BehaviorSubject<any>(null);
    isClickOnRenewKYCDlg = new BehaviorSubject(false);
    removeDocumentVerificationDlg = new BehaviorSubject(false);
    refreshKycTooltip = new BehaviorSubject(false);
    constructor(
        private http: HttpClient,
        // private dataService: DataService,
        // private _commonService: CommonService
    ) {

        this.allCountriesDataMap = new Map(Object.entries(CountryData));
        this.allCountriesDataArr = [...this.allCountriesDataMap.values()];
        this.allCountries$ = new BehaviorSubject<CountriesData[]>([]);

        const countries: any = countryData;
        this.allCountries$.next(countries);
          
    }
    stepOneValidations(newVal: IKYCFormGroups, kycForm: any) {
        if (
            !newVal.step_1.companyAcc.isActive &&
            !newVal.step_1.privateAcc.isActive
        ) {
            kycForm.controls.step_1.setErrors({ required: true });
        } else {
            kycForm.controls.step_1.setErrors(null);
        }

        Object.keys(newVal.step_1).forEach((bt) => {
            if (bt === EBusinessType.invitedAccount) return;

            let step1Control: any = kycForm.controls.step_1.get(bt) as AbstractControl<any, any>;
            if (!step1Control) return; // Add null check

            const countrySelected = step1Control.get('countrySelected');

            if (step1Control.get('isActive').value) {
                if (!countrySelected.value) {
                    countrySelected.setErrors({ required: true });
                } else if (newVal.step_1?.companyAcc?.countrySelected == null) {
                    // if (!SupportedCountries.includes(countrySelected.value?.toLowerCase())) {
                    //     countrySelected.setErrors({
                    //         not_supported_country: {
                    //             message: `Okoora is currently not available in ${countrySelected.value}`,
                    //         },
                    //     });
                    // }
                }
                else if (newVal.step_1?.companyAcc?.countrySelected != null) {
                    let finalObject:any;
                    this.allCountries$.subscribe(
                        (data) => {
                            data.map((item: any) => {
                                if (item.countryName == newVal.step_1.companyAcc.countrySelected) {
                                    finalObject = item
                                }
                            })
                        })
                    //    if(finalObject?.canRegister == 0){
                    //     if (!SupportedCountries.includes(countrySelected.value?.toLowerCase())) {
                    //         countrySelected.setErrors({
                    //             not_supported_country: {
                    //                 message: `Okoora is currently not available in ${countrySelected.value}`,
                    //             },
                    //         });
                    //     }
                    //    }
                }
            } else {
                step1Control.get('countrySelected').setErrors(null);
            }
        });
    }// #stepOneValidations
    handleCountrySearch(data: { event: Event, action: 'PHONE_CODE' | 'NAME' }): any {
        const { value } = <HTMLInputElement>data.event.target;
        let { action } = data;

        if (!value) {
            return this.allCountries$.getValue();
        }

        switch (action) {
            case 'PHONE_CODE':
                return this.allCountries$.getValue().filter((cData: any) => {
                    if (!isNaN(+value) && typeof +value === typeof Number()) {
                        return cData.phoneCode?.toString()?.includes(value);
                    } else if (typeof value === typeof String()) {
                        return cData.countryName.toLowerCase().includes(
                            value.toLowerCase()
                        );
                    }
                })

            case 'NAME':
                return this.allCountries$.getValue().filter(cData => {
                    return cData.countryName.toLowerCase().includes(
                        value.toLowerCase()
                    );
                })

            default:
                const exhaustCheck: never = action;
                console.error(`unhandled action occured ${exhaustCheck}`);
                break;
        }

    }// # handleCountrySearch

    calcMinAgeFromToday(age: number = 18) {
        if (typeof age !== typeof Number()) {
            console.error(`age must be number`);
            return null;
        }

        const today = new Date();
        let todayDate = today.getDate() < 18 ? `0${today.getDate()}` : today.getDate();
        const todayMonth = today.getMonth() < 18 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
        const year = new Date().getFullYear() - age;

        const minDate = new Date(`${todayMonth}/${todayDate}/${year}`);

        return minDate;
    }
    getllCountriesDataArr(): CountryDataType[any][] {
        return [...this.allCountriesDataMap.values()];
    }
    // createUserWithReferal(value: any, refAff: number) {
    //     return this.http.post<boolean>(environment.baseApiUrl + `/Signup/CreateNewUser?refAff=${refAff}`, value);
    // }
    // createUser(value: any) {
        
    //     const headers = new HttpHeaders({
    //         'X-Client-Url': window.location.href // Send full URL
    //       });

    //       return this.http.post<boolean>(
    //         `${environment.baseApiUrl}/Signup/CreateNewUser`,
    //         value,
    //         { headers }
    //       );
    // }
    // sendMailVerification(email: any) {
    //     let params : any = { 'number': '0' ,'email':email}; 
    //     return this.dataService.postWithQueryParams<{ result: any }>(environment.baseApiUrl + '/Signup/SendEmailVerificationCode', params)  
    // }
    // SendEmailVerificationCode(email: any) {
    //     return this.http.post<any>(`${environment.baseApiUrl}/Account/SendEmailVerificationCode?email=${email}`,null);
    // }

    // PrivateKYCCountry(country: any) {
    //     return this.http.post<any>(`${environment.baseApiUrl}/Signup/AddCountryRegisterUserOutsideIsrael?country=${country}`,null);
    // }
    
    // CheckMailVertification(code: any, email: any) {
    //     const body = {
    //         email,
    //         verificationCode: code
    //     }
    //     return this.http.post<boolean>(environment.baseApiUrl + '/Signup/CheckEmailVerificationCode', body);
    // }
    // CheckSMSVertification(code: any, phone: any) {
    //     const body = {
    //         phoneNumber: phone,
    //         verificationCode: code
    //     }
    //     return this.http.post<boolean>(environment.baseApiUrl + '/Signup/CheckSmsVerificationCode', body);
    // }
    // sendSMSVerification(phone: any) {
    //     let params : any = { 'number': phone};
    //     return this.dataService.postWithQueryParams<{ result: any }>(environment.baseApiUrl + '/Signup/SendSmsVerificationCode', params)
    // }
    // UpdateRegistrationPersonalDetails(value: any, autoApproved: any) {
    //     return this.http.post<boolean>(`${environment.baseApiUrl}/Signup/UpdateRegistrationPersonalDetails?isAutoApprove=${autoApproved}`, value);
    // }
    // GetCountries() {
    //     return this.dataService.getRequest<{ result: any }>(ApiMap.getCountries.url);

    // }
    verifyID(file: any) {
        return this.http.post('api.shuftipro.com', { headers: { 'Content-Type': 'application/json' } }, file);
    }
    // checkIdDuplication(id: any) {
    //     return this.http.get<boolean>(`${environment.baseApiUrl}/Signup/CheckClientIdDuplication?id=${id}`);
    // }
    // shuftiProVareficationResponse() {
    //     return this.http.post(`${environment.baseApiUrl}/Signup/ShuftiProClientVerification`, {});
    // }
    // getAccountType$(): Observable<TBusinessTypes> {
    //     return this.selectedAccountType$.asObservable()
    //         .pipe(
    //             takeWhile((bt): bt is TBusinessTypes => bt !== null),
    //             debounceTime(500)
    //         );
    // }
    // notNow() {
    //     return this.dataService.getRequest<{ result: any }>(ApiMap.GetStopUserPlanPurchaseAlert.url);
    // }
    // EmbeddedKYC_clientId(){
    //     return environment.EmbeddedKYCAWClientId;
    // }
    // EmbeddedKYC_Env(){
    //     return environment.EmbeddedKYCAWEnv;
    // }
    
    // PayMePlanPurchase(AccountPackageDto: TAccountPackageDto) {
    //     return this.dataService.postWithQueryParams<boolean>(ApiMap.PayMePlanPurchase.url, AccountPackageDto);
    // }
    // getSumSubApplicant(applicantId: string) {
    //     return this.http.get<any>(environment.baseApiUrl + '/Kyc/GetApplicantData?applicantId=' + applicantId);
    // }
    // getSumSubAccessToken(email: string) {
    //         return this.http.get<any>(environment.baseApiUrl + '/Kyc/GetSumSubAccessToken?email=' + email);
    // }

    launchWebSdk(accessToken: any, phone: string, email: string) {
        let snsWebSdkInstance = snsWebSdk.init(
                accessToken,
                () => this.getNewAccessToken(email)
            )
            .withConf({
                lang: 'en',
                email: email,
                phone: phone,
            })
            .on('idCheck.onStepCompleted', (payload) => {

            })
            .on('idCheck.onError', (error) => {
            })
            .onMessage((type, payload:any) => {
                if(type as string == "idCheck.onApplicantLoaded" ){
                    this.getSumSubApplicant(payload.applicantId)
                }

            })

            .build();

        snsWebSdkInstance.launch('#sumsub-websdk-container')
      }
    getSumSubApplicant(applicantId: any) {
        throw new Error('Method not implemented.');
    }
    getNewAccessToken(email: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    //   getNewAccessToken(email: string) {
    //     return this.getSumSubAccessToken(email)
    //         .toPromise()
    //         .then((accessToken: string | undefined) => {
    //             if (typeof accessToken === 'string') {
    //                 return accessToken;
    //             } else {
    //                 throw new Error('Access token is not a valid string');
    //             }
    //         })
    //         .catch((error: any) => {
    //             console.error('Error getting a new access token:', error);
    //             throw error;
    //         });
    // }
}
