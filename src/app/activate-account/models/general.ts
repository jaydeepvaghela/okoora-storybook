import { EStatementKyc, TAccountStatus, TAccountTypes } from "./activate-account";
import { ECatalogID } from "./enums";

/**
 * Interfaces
 */
 export interface DictionaryResponse {
    Key: string|null,
    Value: string|null
}
export interface dateObject {
    year: number;
    month: number;
    day: number;
}
export interface CountriesData {
    phoneCode:string,
    countryCode: string,
    countryName:string
}
export interface IStatementUpdateData {
    statementType : TStatementTypes,
    changeReason : string,
    changeSetDetailesAfterApprove : string,
}
/**
 * Types
 */
export type TStatesResponse = {state_name:string}[];
export type TFeaturesDisableByUserType = {[k in TAccountTypes] : RegExp[]}
export type TGetIsLockedStatus = {
    statementType: TStatementTypes,
    statementDetails: string,
    statmentValue: number,
} | null;
export type TStatementTypes = EStatementKyc.conversions | EStatementKyc.countries | EStatementKyc.purchaseHedgeDeals | EStatementKyc.receiveFunds | EStatementKyc.sendingFunds| EStatementKyc.volume;
export type TFeaturesAllowPreview = EFeaturesAllowPreview;

export type TGeneralLoader = {loading: boolean, generalMessage?: string};
export type TGeneralMessagePopup = {
    title:string,
    message:string,
    message2?:string,
    buttonText:string,
    buttonAction?:()=>void,
    imgSrc?:string, disableClose?: boolean
}
export type TOkooraFeatures = EOkooraFeatures;
/**
 * Enums
 */
export enum EOkooraFeatures {
    // Hedging
    Hedging = 'hedging',
    Compare = 'compare',
    QuickHedge = 'quick-hedge',
    Explore = 'explore',

    // Payments
    Payments = 'payments',
    MassPayment = 'mass-payment',
    SendPayment = 'send-payment',
    UploadAndPay = 'upload-and-pay',
    InvoiceToBePaid = 'invoice-to-be-paid',
    SalaryPayments = 'salary-payments',

    //Boards
    Board = 'board',
    CashFlow = 'cash-flow',
    AlertPanel = 'alert-panel',
    // Others
    Convert = 'convert',
    Deposit = 'deposit',
    Saving = 'saving',
    CashToFlight = 'cash-to-flight',
}
export enum EFeaturesAllowPreview {
    payments = "payments",
    allPayments = "all-payments",
    balances = "balances",
    hedging = "hedging",
    saving = "saving",
    board = "board",
    reports = "reports",
    inviteFriend = "invite-friend",
    apps = "apps",
    alertsMng = "alerts-mng",
    airportTransfer = "airport-transfer",
    pricingTable = "pricing-table",
    registrationOverview  = 'registration-overview',
    deposit = "deposit",
    accountingReport = "accounting-report",
}
/**
 * Data holders
 */
export const featuresDisabledByUserType : TFeaturesDisableByUserType = {
    1: [/board/, /invite-friend/, /mass-payment/, /open-account/, /bank-kyc/, /bank-accounts/, /create-bank-account/, /team/],// >>> private account
    2: []// >>> business account
}
export const featuresAllowPreview : TFeaturesAllowPreview[] = [
    EFeaturesAllowPreview.payments,
    EFeaturesAllowPreview.allPayments,
    EFeaturesAllowPreview.balances,
    EFeaturesAllowPreview.hedging,
    EFeaturesAllowPreview.saving,
    EFeaturesAllowPreview.board,
    EFeaturesAllowPreview.reports,
    EFeaturesAllowPreview.inviteFriend,
    EFeaturesAllowPreview.apps,
    EFeaturesAllowPreview.alertsMng,
    EFeaturesAllowPreview.airportTransfer,
    EFeaturesAllowPreview.pricingTable,
    EFeaturesAllowPreview.deposit,
    EFeaturesAllowPreview.accountingReport,
];



export const signatureComplexityNumber: 10 = 10;
export enum EPaymentStatus
    {
        /// <summary>
        /// 
        /// </summary>
        failed = 0,
        /// <summary>
        /// 
        /// </summary>
        submitted = 1,
        /// <summary>
        /// 
        /// </summary>
        ready_to_send = 2,
        /// <summary>
        /// 
        /// </summary>
        released = 3,
        /// <summary>
        /// 
        /// </summary>
        suspended = 4,
        /// <summary>
        /// 
        /// </summary>
        completed = 5,
        /// <summary>
        /// 
        /// </summary>
        pending = 6,
        /// <summary>
        /// 
        /// </summary>
        canceled = 7,
        /// <summary>
        /// 
        /// </summary>
        UpdatePaymentReason = 8,
        /// <summary>
        /// 
        /// </summary>
        scheduled = 9,
        /// <summary>
        /// 
        /// </summary>
        missingAmount = 10,
        /// <summary>
        /// 
        /// </summary>
        deleted = 11,
        /// <summary>
        /// 
        /// </summary>
        badInvoice = 12,
        /// <summary>
        /// 
        /// </summary>
        badBalAndInv = 13,
        /// <summary>
        /// 
        /// </summary>
        FuturePayment = 14,
        /// <summary>
        /// 
        /// </summary>
        Converted_Founds = 15
}

export enum ERequestPaymentStatus {
    Pending = 1,
    Completed = 2,
    PendingLocal = 3,
}

type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
type GrowToSize<T, A extends Array<T>, N extends number> = { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];

export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;
export type TSpotMap = {
    strongCurrencySpot: number;
    weakCurrencySpot: number;
};
export type TSpotWithRateMap = {
    strongCurrencySpot: number;
    weakCurrencySpot: number;
    rate: number
};
export interface IPairs {
    id: number;
    name: string;
    forward: boolean | null;
    vanilla: boolean | null;
    barrier: boolean | null;
    active: boolean;
    activePayment: boolean;
}
export interface IPairsResponse {
    ItemsList:IPairs[];
    Balances: {[k:string]: string};
    CanTransfer: boolean;
    EvenBalances: null;
    HasRegistered: boolean;
    ID: string;
    LatestMessages: null;
    LoginProvider: null;
    NewMessages: null;
    ProfileStatus: TAccountStatus;
    SourceFunctions: null;
    UserName: string;
    UserRoles: any;
    Version: string;
}
export const daysInYear: 365 = 365 as const;

export type TGeneralMsgPopupData = {
    title: string,
    message: string,
    message2?: string,
    buttonText: string,
    buttonAction?: any,
    imgSrc?: string,
    disableClose?:boolean,
}

export type TCatalogIDs = ECatalogID;
export const catalogsRequireCollateral: TCatalogIDs[] = [
    ECatalogID.LockAndUp,
    ECatalogID.LockAndDown,
    ECatalogID.RangeUp,
    ECatalogID.RangeDown,
    ECatalogID.SafeRangeUp,
    ECatalogID.SageRangeDown,
    ECatalogID.BlockRangeUp,
    ECatalogID.BlockRangeDown,
    ECatalogID.ExtraUp,
    ECatalogID.ExtraDown,
    ECatalogID.ExtraRangeUp,
    ECatalogID.ExtraRangeDown,
    ECatalogID.SemiSafeRangeUp,
    ECatalogID.SemiSafeRangeDown,
];
export enum EDateDays {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAYS,
}
export enum ESessionStorageKeys {
    yearPassedFromAccountActivation = 'yearPassedFromAccountActivation',
}
export const sessionStorageValues: Record<ESessionStorageKeys, any> = {
    [ESessionStorageKeys.yearPassedFromAccountActivation]: {kycDataChanged: false}
}