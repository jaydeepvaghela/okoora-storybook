import {cloneDeep} from "lodash";
import { ActivateAccountUserTypes } from "./activate-account";

/**
 * Interfaces
 */
export interface IPackagesOptions {
    [key: string]: {
        objectKey?: keyof any,
        showToPrivateClient: boolean,
        showToBusinessClient: boolean,
        isCategoryTitle?: boolean,
        title: string,
        subtitle: string,
        valueByPackage: {
            [key in EPackages]: any
        }
    }
}

export interface IPackagesData {
    name: TPackages,
    isFree: boolean,
    currency: string | null,
    yearly_amount: number | null,
    monthly_amount: number | null,
    yearly_period: string | null,
    monthly_period: string | null,
    isCustom?: boolean,
}

/**
 * Enums
 */
export enum EPackages {
    Standard = 'standard',
    Metal = 'metal',
    Grow = 'grow',
    Scale = 'scale',
    Prime = 'prime',
    Enterprise = 'enterprise',
    Elite = 'elite'
}

export enum EPackageType {
    Standard = 3,
    Metal = 4,
    Scale = 5,
    Prime = 6,
    EnterPrise = 7,
    Elite = 8,
    Grow = 10
}

export enum EPayOptions {
    Yearly = 'yearly',
    Monthly = 'monthly'
}

export enum EPackagePurchaseSource {
    BOFunds = 1,
    BOSalesYearly = 2,
    FrontMonthly = 3,
    FrontYearly = 4,
    BOSalesMonthly = 5,
}

/**
 * Types
 */
export type TPayOptions = EPayOptions.Monthly | EPayOptions.Yearly;
export type TPackages =
    EPackages.Standard
    | EPackages.Metal
    | EPackages.Grow
    | EPackages.Scale
    | EPackages.Prime
    | EPackages.Enterprise
    | EPackages.Elite;
export type TPackageBaseInfo = {
    name: TPackages,
    isFree: boolean,
    currency: string | null,
    yearlyAmount: string | null,
    monthlyAmount: string | null,
    yearlyTextContent: string | null,
    monthlyTextContent: string | null,
    isCustom?: boolean,
    packageTypeId: TPackageType,
}
export type TPackagePurchaseSource = EPackagePurchaseSource;
export type TPackageType = EPackageType;

/**
 * Data
 */
export const packagesNamesByUserType: { [key in ActivateAccountUserTypes]: TPackages[] } = {
    private: [EPackages.Standard, EPackages.Metal, EPackages.Grow],
    business: [EPackages.Scale, EPackages.Prime, EPackages.Enterprise, EPackages.Elite],
};
const popularPlan = "prime";
const custom = "Custom";
export const xIcon = "X";
export const vIcon = "show_v_icon";
const unlimited = "Unlimited";

const TitlesValueByPackage: { [key in TPackages]: null } = {
    [EPackages.Standard]: null,
    [EPackages.Metal]: null,
    [EPackages.Grow]: null,
    [EPackages.Scale]: null,
    [EPackages.Prime]: null,
    [EPackages.Enterprise]: null,
    [EPackages.Elite]: null,
};

export const packagesData: { [key in ActivateAccountUserTypes]: IPackagesData[] } = {
    private: [
        {
            name: EPackages.Standard,
            isFree: true,
            currency: null,
            yearly_amount: null,
            monthly_amount: null,
            yearly_period: '/y',
            monthly_period: '/m',
        },
        {
            name: EPackages.Metal,
            isFree: false,
            currency: '$',
            monthly_amount: 35,
            yearly_amount: 357,
            yearly_period: '/y',
            monthly_period: '/m',
        },
        {
            name: EPackages.Grow,
            isFree: false,
            currency: '$',
            monthly_amount: 300,
            yearly_amount: 3000,
            yearly_period: '/y',
            monthly_period: '/m',
        },
    ],
    business: [
        {
            name: EPackages.Scale,
            isFree: true,
            currency: null,
            monthly_amount: null,
            yearly_amount: null,
            yearly_period: '/y',
            monthly_period: '/m',
        },
        {
            name: EPackages.Prime,
            isFree: false,
            currency: '$',
            monthly_amount: 340,
            yearly_amount: 3468,
            yearly_period: '/y',
            monthly_period: '/m',
        },
        {
            name: EPackages.Enterprise,
            isFree: false,
            currency: '$',
            monthly_amount: 630,
            yearly_amount: 6426,
            yearly_period: '/y',
            monthly_period: '/m',
        },
        {
            name: EPackages.Elite,
            isFree: false,
            currency: '$',
            monthly_amount: 1200,
            yearly_amount: 11240,
            yearly_period: '/y',
            monthly_period: '/m',
            isCustom: false
        },
    ]
};

export const packagesOptions: IPackagesOptions = {
    // "PAYMENTS": {
    //     isCategoryTitle: true,
    //     showToPrivateClient: true,
    //     showToBusinessClient: true,
    //     title: "PAYMENTS",
    //     subtitle: "",
    //     valueByPackage: TitlesValueByPackage
    // },
    "Free outgoing payments": {
        objectKey: "outgoingPayments",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free outgoing payments",
        subtitle: "A $5 fee applies per international payment above the package allowance",
        valueByPackage: {
            [EPackages.Standard]: 0,
            [EPackages.Metal]: 10,
            [EPackages.Grow]: 10,
            [EPackages.Scale]: 0,
            [EPackages.Prime]: 10,
            [EPackages.Enterprise]: 30,
            [EPackages.Elite]: 40,
        }
    },
    "Free incoming payments": {
        objectKey: "incomingPayments",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free incoming payments",
        subtitle: "A $5 fee applies per international payment above the package allowance",
        valueByPackage: {
            [EPackages.Standard]: 0,
            [EPackages.Metal]: 10,
            [EPackages.Grow]: 10,
            [EPackages.Scale]: 0,
            [EPackages.Prime]: 10,
            [EPackages.Enterprise]: 30,
            [EPackages.Elite]: 40,
        }
    },
    "Free local payments": {
        objectKey: "localPayments",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free local payments",
        subtitle: "A $3 fee applies per local payment above the package allowance (Refers to in-border payments in same the currency)",
        valueByPackage: {
            [EPackages.Standard]: 5,
            [EPackages.Metal]: 30,
            [EPackages.Grow]: 20,
            [EPackages.Scale]: 5,
            [EPackages.Prime]: 30,
            [EPackages.Enterprise]: 50,
            [EPackages.Elite]: 60,
        }
    },
    "Foreign exchange (FX) at Interbank rate": {
        objectKey: "foreignExchange",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Foreign exchange (FX) at Interbank rate",
        subtitle: "A 0.4% markup applies for each FX outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: '10k$',
            [EPackages.Metal]: '200k$',
            [EPackages.Grow]: '1M$',
            [EPackages.Scale]: '10k$',
            [EPackages.Prime]: '100k$',
            [EPackages.Enterprise]: '250k$',
            [EPackages.Elite]: '500k$',
        }
    },
    "Lock rate & Pay later": {
        objectKey: "futurePayments",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Lock rate & Pay later",
        subtitle: "A $5 fee applies per Lock Rate & Pay later transaction outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: 2,
            [EPackages.Metal]: 200000,
            [EPackages.Grow]: unlimited,
            [EPackages.Scale]: 2,
            [EPackages.Prime]: 8,
            [EPackages.Enterprise]: unlimited,
            [EPackages.Elite]: unlimited,
        }
    },
    "Free payroll payments": {
        objectKey: "payrollPayments",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free payroll payments",
        subtitle: "A $1 fee applies per payroll payment outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: 3,
            [EPackages.Prime]: 8,
            [EPackages.Enterprise]: 30,
            [EPackages.Elite]: 50,
        }
    },
    "Multi signator validation": {
        objectKey: "multiSignatorValidation",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Multi signator validation",
        subtitle: "Manage multi-signatory permission structures and levels of access",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Mass payouts": {
        objectKey: "massPayouts",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Mass payouts",
        subtitle: "Upload a bulk-payments file to quickly and simultaneously execute multiple payments ",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Free payments to Okoora accounts": {
        objectKey: "okooraPayments",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free payments to Okoora accounts",
        subtitle: "Real-time transfers to any Okoora business or personal account",
        valueByPackage: {
            [EPackages.Standard]: unlimited,
            [EPackages.Metal]: unlimited,
            [EPackages.Grow]: unlimited,
            [EPackages.Scale]: unlimited,
            [EPackages.Prime]: unlimited,
            [EPackages.Enterprise]: unlimited,
            [EPackages.Elite]: unlimited,
        }
    },
    "CURRENCY RISKS": {
        isCategoryTitle: true,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "CURRENCY RISKS",
        subtitle: "",
        valueByPackage: TitlesValueByPackage
    },
    "Free one click protection": {
        objectKey: "oneClickProtection",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free one click protection",
        subtitle: "A 0.5% markup applies for each hedge transaction above the package allowance",
        valueByPackage: {
            [EPackages.Standard]: '10k$',
            [EPackages.Metal]: '200k$',
            [EPackages.Grow]: '1M$',
            [EPackages.Scale]: '0$',
            [EPackages.Prime]: '100k$',
            [EPackages.Enterprise]: '250k$',
            [EPackages.Elite]: '500k$',
        }
    },
    "Free transaction valuation": {
        objectKey: "transactionValuation",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free transaction valuation",
        subtitle: "A $5 fee applies per hedging transaction outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: 10,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: 50,
            [EPackages.Enterprise]: 100,
            [EPackages.Elite]: 150,
        }
    },
    "Free sensativity analysis": {
        objectKey: "sensitivityAnalysis",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free sensitivity analysis",
        subtitle: "A $8 fee applies per hedging transaction outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: 10,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: 40,
            [EPackages.Enterprise]: 80,
            [EPackages.Elite]: 120,
        }
    },
    "Free professional services hourly bank": {
        objectKey: "bankServiceHours",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free professional services hourly bank",
        subtitle: "Consult with our professional experts. A $400 fee per additional consulting hour outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: 3,
            [EPackages.Scale]: 0,
            [EPackages.Prime]: 2,
            [EPackages.Enterprise]: 6,
            [EPackages.Elite]: 8,
        }
    },
    "Dedicated risk management manager": {
        objectKey: "riskManager",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Dedicated risk management manager",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: xIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Risk analyzer": {
        objectKey: "riskAnalysisModel",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Risk analyzer",
        subtitle: "Analyze your cashflow risks in real-time",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Risk management policy": {
        objectKey: "riskManagementPolicy",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Risk management policy",
        subtitle: "Set your automated hedge policy for each cashflow",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: xIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Hedge command center": {
        objectKey: "hedgeCommandCenter",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Hedge command center",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: xIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Market trends analysis": {
        objectKey: "marketTrendsAnalysis",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Market trends analysis",
        subtitle: "Explore trends and statistics of currency markets worldwide",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Transaction tracker": {
        objectKey: "transactionTracker",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Transaction tracker",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "BANKING": {
        isCategoryTitle: true,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "BANKING",
        subtitle: "",
        valueByPackage: TitlesValueByPackage
    },
    "Multi currency account": {
        objectKey: "multiCurrencyAccount",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Multi currency account",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: vIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Free currency conversions": {
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free currency conversions",
        subtitle: "No extra fees on currency conversions",
        valueByPackage: {
            [EPackages.Standard]: vIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Global banking gateway": {
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Global banking gateway",
        subtitle: "Access rates from top-tier banks and trade rooms through our global infrastructure ",
        valueByPackage: {
            [EPackages.Standard]: vIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Open a overseas account": {
        objectKey: "overseasAccount",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Open a overseas account",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Free savings products": {
        objectKey: "savingProducts",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free savings products",
        subtitle: "A 0.5% markup applies for each deposit outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: '10k$',
            [EPackages.Metal]: '200k$',
            [EPackages.Grow]: '1M$',
            [EPackages.Scale]: '0$',
            [EPackages.Prime]: '50k$',
            [EPackages.Enterprise]: '100k$',
            [EPackages.Elite]: unlimited,
        }
    },
    "WORKFLOWS": {
        isCategoryTitle: true,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "WORKFLOWS",
        subtitle: "",
        valueByPackage: TitlesValueByPackage
    },
    "Free team members": {
        objectKey: "teamMembers",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free team members",
        subtitle: "Onboard team members according to need. $35 per additional team member per month outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: 2,
            [EPackages.Prime]: 4,
            [EPackages.Enterprise]: 6,
            [EPackages.Elite]: 8,
        }
    },
    "Free subsidiary accounts": {
        objectKey: "subsidiaryAccounts",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free subsidiary accounts",
        subtitle: "Onboard subsidiary accounts according to need. A 50% discount on license fees per additional account outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: 1,
            [EPackages.Enterprise]: 2,
            [EPackages.Elite]: 3,
        }
    },
    "Free smart boards": {
        objectKey: "smartBoards",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Free smart boards",
        subtitle: "Add smart-boards according to need. $5 per smart-board per month outside the package allowance",
        valueByPackage: {
            [EPackages.Standard]: 2,
            [EPackages.Metal]: unlimited,
            [EPackages.Grow]: unlimited,
            [EPackages.Scale]: 2,
            [EPackages.Prime]: unlimited,
            [EPackages.Enterprise]: unlimited,
            [EPackages.Elite]: unlimited,
        }
    },
    "Smart alerts": {
        objectKey: "smartAlerts",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Smart alerts",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: xIcon,
            [EPackages.Prime]: 5,
            [EPackages.Enterprise]: 20,
            [EPackages.Elite]: 50,
        }
    },
    "Free templates": {
        objectKey: "templates",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Free templates",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: 2,
            [EPackages.Prime]: unlimited,
            [EPackages.Enterprise]: unlimited,
            [EPackages.Elite]: unlimited,
        }
    },
    "SUPPORT": {
        isCategoryTitle: true,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "SUPPORT",
        subtitle: "",
        valueByPackage: TitlesValueByPackage
    },
    "Self serve knowledge base": {
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Self-serve knowledge base",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: vIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "24/7 customer support": {
        objectKey: "customerSupport",
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "24/7 customer support",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: vIcon,
            [EPackages.Grow]: vIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Dedicated customer success manager": {
        objectKey: "customerSuccessManager",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Dedicated customer success manager",
        subtitle: "",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "OPERATIONAL": {
        isCategoryTitle: true,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "OPERATIONAL",
        subtitle: "",
        valueByPackage: TitlesValueByPackage
    },
    "Business API": {
        objectKey: "businessAPI",
        isCategoryTitle: false,
        showToPrivateClient: false,
        showToBusinessClient: true,
        title: "Business API",
        subtitle: "Connect your company’s data to  Okoora's ABCM™ platform",
        valueByPackage: {
            [EPackages.Standard]: xIcon,
            [EPackages.Metal]: xIcon,
            [EPackages.Grow]: xIcon,
            [EPackages.Scale]: vIcon,
            [EPackages.Prime]: vIcon,
            [EPackages.Enterprise]: vIcon,
            [EPackages.Elite]: vIcon,
        }
    },
    "Operationals fees": {
        isCategoryTitle: false,
        showToPrivateClient: true,
        showToBusinessClient: true,
        title: "Operationals fees",
        subtitle: "Operational fees will be charged as shown in the Fees table",
        valueByPackage: {
            [EPackages.Standard]: 'Standard',
            [EPackages.Metal]: 'Top',
            [EPackages.Grow]: 'Excellence',
            [EPackages.Scale]: 'Standard',
            [EPackages.Prime]: 'Top',
            [EPackages.Enterprise]: 'Excellence',
            [EPackages.Elite]: 'Supreme',
        }
    }
};

export let packagesOptionsDynamic: IPackagesOptions = cloneDeep(packagesOptions);
