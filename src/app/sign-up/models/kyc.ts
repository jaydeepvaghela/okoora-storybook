export interface IStepsObj {
    currentStep: number,
    maxSteps: number,
    minSteps: number
}

export interface IKycData {
    businessTypes: 'companyAcc' | 'privateAcc' | 'invitedAcc';
}

export interface IKYCFormGroups {
    step_1: {
        companyAcc: {isActive:boolean, countrySelected:string},
        privateAcc:{isActive:boolean, countrySelected:string},
        invitedAcc:{isActive:boolean}
    },
    step_2: {
        email: string
    }
}

export enum EBusinessType {
    companyAccount = "companyAcc",
    privateAccount = "privateAcc",
    invitedAccount = "invitedAcc"
}
export enum EKycStatus {
    basicKYC = 1,
    partialKYC = 2,
    fullKYC = 3
}

export type TBusinessTypes = EBusinessType.companyAccount | EBusinessType.privateAccount;
export enum EDetailsToShowNames {
    DEFAULT = "DEFAULT",
    companyAcc = "companyAcc",
    privateAcc = "privateAcc",
    invitedAcc = "invitedAcc",
    email = "email",
    emailConfirmation = "emailConfirmation",
    phone=  "phone",
    phoneConfirmation = "phoneConfirmation",
    createdPassword = "createdPassword",
    personalDetails = "personalDetails",
    personalAddress = "personalAddress",
}
export interface IDetailsToShow {
    step_1: {
        detailName: IKycData['businessTypes'] | EDetailsToShowNames.DEFAULT,
    },
    step_2: {
        detailName: EDetailsToShowNames.email
    },
    step_3: {
        detailName:  EDetailsToShowNames.emailConfirmation
    },
    step_4: {
        detailName:  EDetailsToShowNames.phone
    },
    step_5: {
        detailName:  EDetailsToShowNames.phoneConfirmation
    },
    step_6: {
        detailName:  EDetailsToShowNames.createdPassword
    },
    step_7: {
        detailName:  EDetailsToShowNames.personalDetails
    },
    step_8: {
        detailName: EDetailsToShowNames.personalAddress
    }
}

export const detailsToShow: IDetailsToShow = {
    step_1: {
        detailName: EDetailsToShowNames.DEFAULT,
    },
    step_2: {
        detailName: EDetailsToShowNames.email,
    },
    step_3: {
        detailName: EDetailsToShowNames.emailConfirmation,
    },
    step_4:{
        detailName: EDetailsToShowNames.phone,
    },
    step_5: {
        detailName: EDetailsToShowNames.phoneConfirmation,
    },
    step_6: {
        detailName: EDetailsToShowNames.createdPassword
    },
    step_7: {
        detailName: EDetailsToShowNames.personalDetails
    },
    step_8: {
        detailName: EDetailsToShowNames.personalAddress
    },
}

export enum EStepNumber {
    typeOfBusiness = 1,
    email = 2,
    emailConfirmation = 3,
    phone = 4,
    phoneConfirmation = 5,
    createPassword = 6,
    personalDetails = 7,
    personalAddress = 8
}

export enum VerificationReturnType
{
    Success = 1,
    GeneralError = 2,
    PassedLimitError = 3,
}

export enum SiteSource
{
    Ofakim = 1,
    Okoora = 2
}

export type EmailVerificationPerCustomerResponse = { SiteSource :any}

export type VerificationReturnTypeOptions = VerificationReturnType.Success | VerificationReturnType.GeneralError | VerificationReturnType.PassedLimitError;
export type TSiteSource = SiteSource.Ofakim | SiteSource.Okoora;
export type TSendMailResponse = {
    Success:VerificationReturnTypeOptions, 
    SiteSource: TSiteSource,
    PassedLimitError?:VerificationReturnTypeOptions
}

export interface ICheckEmailVerification {
    action: 'CHECK_EMAIL_VERIFICATION',
    payload: {
        email: string,
        onFinalize?: ()=>void
    }
}
export interface ISendEmailVerification {
    action: 'SEND_EMAIL_VERIFICATION',
    payload: {
        email: string,
        onFinalize?: ()=>void
    }
}
export interface ICheckPhoneVerification {
    action: 'CHECK_PHONE_VERIFICATION',
    payload: {
        phone: string,
        onFinalize?: ()=>void
    }
}
export interface ISendPhoneVerification {
    action: 'SEND_PHONE_VERIFICATION',
    payload: {
        phone: string,
        onFinalize?: ()=>void
    }
}
export type IPerformVerification = ICheckEmailVerification | ISendEmailVerification | ICheckPhoneVerification | ISendPhoneVerification;

export type TVerificationCodeStatus =  'DEFAULT' | 'INCORRECT' | 'VALID' | 'PASSED_LIMIT';
export enum EErrorMessages {
    SomethingWentWrong = 'Something went wrong.',
    FillAllFields = 'Please fill all fields in order to continue',
}
export interface IErrorData {hasError:boolean,msg:string}
export interface CountriesData  {
    phoneCode:number,
    countryCode: string,
    countryName:string
}