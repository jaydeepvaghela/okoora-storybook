export enum Direction {
    Down = 1,
    Up = 2
}

export type TGeneralMsgPopupData = {
    title: string,
    message: string,
    message2?: string,
    buttonText: string,
    buttonAction?: any,
    imgSrc?: string,
    disableClose?:boolean,
}

export enum BusinessMainType {
    'Payment Request' = 1,
    'Smart Convert' = 2,
    'Future Outgoing' = 3
}
// export enum BusinessMainType {
//     'PAYMENT_REQUEST' = 1,
//     'SMART_CONVERT' = 2,
//     'FUTURE_OUTGOING' = 3
// }
export enum ActionNameType {
    Notify = 'Notify',
    Convert = 'Smart Convert',
    Pay = 'Payment Request'
}

export enum iconFutureActivity {
    'assets/images/activity-fund-icon.svg' = 1,
    'assets/images/activity-up-down-arrow.svg' = 2,
    'assets/images/activity-down-arrow.svg' = 3
}

export enum wiconFutureActivity {
    'assets/images/activity-fund-icon-white.svg' = 1,
    'assets/images/activity-up-down-arrow-white.svg' = 2,
    'assets/images/activity-down-arrow-white.svg' = 3
}

export enum AmountType{
    Email = 1,
    SMS = 2
}

export enum Condition {
   '<' = 1,
   '>' = 2,
}

export enum NotificationRuleStatus
{
    Active = 1,
    'Pending Activition' = 2,
    Cancelled = 3,
    Expired = 4
}

export enum NotificationSentStatus
    {
        Success = 1,
        Fail = 2,
        Queued = 3,
        Created = 4,
    }

    export enum BalanceInOutMainTypeName
    {
        'Commit Payment' = 1,
        'Convert' = 2,
        'Deposit' = 3,
        'Withdrawal airport cash' = 4,
        'Withdrawal Deal Loss' = 5,
        'Package plan' = 6,
        'Create Global Account' = 7,
        'Refund' = 8,
        'Deposit Into Saving' = 9,
        'Future Payment' = 10,
        'Buy Option NDF' = 11,
        'Sell Option NDF' = 12,
        'Buy Option Delivery' = 13,
        'Sell Option Delivery' = 14,
        'Buy Forward NDF' = 15,
        'Sell Forward NDF' = 16,
        'Buy Forward Delivery' = 17,
        'Sell Forward Delivery' = 18,
        'Hedging' = 19,
        'Withdrawal' = 20,
        'Saving' = 21,
        'Deposit Credit Collateral' = 22,
        'Bank Account' = 23
    }

    export enum  notifyMeList  {
         'on total wallet balance' = 1,
        'on available wallet balance' = 3,
        'on balance line usage' = 2
     }

     export enum ExposureStatus
    {
        Closed = 1,
        Active = 2,
        Expired = 3,
        OutOfBalance = 4
    }
