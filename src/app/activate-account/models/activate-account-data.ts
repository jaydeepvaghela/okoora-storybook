
import {
    ActivateAccountState,
    BusinessGroupTypes,
    DataOptions,
    DataOptionsAffinity,
    DataOptionsSubcategories,
    EAccountType,
    EActivateAccountUserTypes,
    EActivateStatus,
    EBusinessGroupTypes,
    ECategories,
    EIsraelAffinity,
    EPersonOrCompanyEntity,
    EPreventContinueReasons,
    EPrivateGroupTypes,
    ESubcategories,
    IShowFieldsOnCondition,
    otherFieldValue,
    TEligibleDataOptions,
    TEligibleFormCheckboxes,
    TGroupTypeCompleted,
    TGroupTypeCompletedNotPrimaryAccount
} from "./activate-account";

export const titleByGroupName: any = {
    private: 'ActivateAcc.Private',
    system_activity: 'ActivateAcc.System_activity',
    about_business: 'ActivateAcc.About_business',
    shareholders: 'ActivateAcc.Shareholders',
    agree_terms: "ActivateAcc.Agree_terms",
    financial_institution: "ActivateAcc.Financial_Institution",
};
export const activateAccountState: ActivateAccountState = {
    userType: EActivateAccountUserTypes.Private,
    groupType: EPrivateGroupTypes.Private
};
export const Genders: DataOptions[] = [
    {
        translation: 'ActivateAcc.Male',
        value: 'male'
    },
    {
        translation: 'ActivateAcc.Female',
        value: 'female'
    },
];
export const groupTypesCompletedByUserType: any = {
    [EAccountType.Private]: {
        [EPrivateGroupTypes.Private]: false,
        [EPrivateGroupTypes.System_Activity]: false,
        [EPrivateGroupTypes.Agree_Terms]: false,
    },
    [EAccountType.Business]: {
        [EBusinessGroupTypes.About_Business]: false,
        [EBusinessGroupTypes.Private]: false,
        [EBusinessGroupTypes.System_Activity]: false,
        [EBusinessGroupTypes.Shareholders]: false,
        [EBusinessGroupTypes.Agree_Terms]: false,
        [EBusinessGroupTypes.Financial_Institution]: false,
    }
};
export const groupTypesCompletedByUserStatus:any = {
    [EActivateStatus.invitedUncomplete]: {
        private: false,
        agree_terms: false
    }
};
export const groupTypesNotPrimaryAccount: { [key in EAccountType]: TGroupTypeCompletedNotPrimaryAccount } = {
    [EAccountType.Private]: {
        system_activity: false,
    },
    [EAccountType.Business]: {
        system_activity: false,
        about_business: false,
        shareholders: false,
    }
};

export const AffinityToIsrael: DataOptionsAffinity[] = [
    {
        translation: 'ActivateAcc.Resident',
        value: EIsraelAffinity.resident
    },
    {
        translation: 'ActivateAcc.Works_in_Israel',
        value: EIsraelAffinity.works_in_israel
    },
    {
        translation: 'ActivateAcc.Control_Israel_company',
        value: EIsraelAffinity.control_israel_company
    },
    {
        translation: 'ActivateAcc.prop_owner_israel',
        value: EIsraelAffinity.prop_owner_israel
    },
    {
        translation: 'ActivateAcc.Without_affinity',
        value: EIsraelAffinity.without_affinity
    },
    {
        translation: 'ActivateAcc.other',
        value: EIsraelAffinity.other
    },
];

export const ProductInterests = {
    // receive_payments_from_customers: {
    //     translation: 'ActivateAcc.ProductInterest.receive_payments_from_customers',
    //     value: 'receive_payments_from_customers'
    // },
    // make_every_day_purchase: {
    //     translation: 'ActivateAcc.ProductInterest.make_every_day_purchase',
    //     value: 'make_every_day_purchase'
    // },
    // pay_suppliers_n_employees: {
    //     translation: 'ActivateAcc.ProductInterest.pay_suppliers_n_employees',
    //     value: 'pay_suppliers_n_employees'
    // },
    // manage_multi_curr: {
    //     translation: 'ActivateAcc.ProductInterest.manage_multi_curr',
    //     value: 'manage_multi_curr'
    // },
    // open_busi_bank_acc: {
    //     translation: 'ActivateAcc.ProductInterest.open_busi_bank_acc',
    //     value: 'open_busi_bank_acc'
    // },
    // updated
    receive_funds: {
        translation: 'ActivateAcc.ProductInterest.Receive funds',
        value: 'Receive funds'
    },
    sending_funds: {
        translation: 'ActivateAcc.ProductInterest.Sending funds',
        value: 'Sending funds'
    },
    purchase_hedge_deals: {
        translation: 'ActivateAcc.ProductInterest.Purchase hedge deals',
        value: 'Purchase hedge deals'
    },
    conversions: {
        translation: 'ActivateAcc.ProductInterest.Conversions',
        value: 'Conversions'
    },
    currency_management: {
        translation: 'ActivateAcc.ProductInterest.Currency management',
        value: 'Currency management'
    },
    open_bank_acc: {
        translation: 'ActivateAcc.ProductInterest.Opening bank accounts',
        value: 'Opening bank accounts'
    },
    other_busi_activities: {
        translation: 'ActivateAcc.ProductInterest.other_busi_activities',
        value: 'Other business activities'
    },
};//#ProductInterests
export const ProductInterestsByUserType:any = {
    business: [
        ...Object.values(ProductInterests)
    ],
    private: [
        ...Object.values(ProductInterests)
    ]
};//#ProductInterestsByUserType
export const FundsSources:any= {
    business: [
        {
            translation: 'ActivateAcc.Ongoing business activity',
            value: 'Ongoing business activity'
        },
        {
            translation: 'ActivateAcc.Receipts from customers',
            value: 'Receipts from customers'
        },
        {
            translation: 'ActivateAcc.other',
            value: otherFieldValue
        }
    ],
    private: [
        {
            translation: 'ActivateAcc.Savings',
            value: 'Savings'
        },
        // {
        //     translation: 'ActivateAcc.Equity',
        //     value: 'Equity'
        // },
        // {
        //     translation: 'ActivateAcc.Credit in bank',
        //     value: 'Credit in bank'
        // },
        {
            translation: 'ActivateAcc.SaleOfProperty',
            value: "Sale of property"
        },
        {
            translation: 'ActivateAcc.Inheritance',
            value: "Inheritance"
        },
        {
            translation: 'ActivateAcc.other',
            value: otherFieldValue
        }
    ]
};//#FundsSources
export const PerformingOperations: DataOptions[] = [
    {
        translation: 'ActivateAcc.Single',
        value: '1'
    },
    {
        translation: 'ActivateAcc.Multi',
        value: '2'
    },
];
export const ChoseUs: DataOptions[] = [
    {
        translation: 'ActivateAcc.google_search',
        value: '1'
    },
    {
        translation: 'ActivateAcc.recommendations',
        value: '2'
    },
    {
        translation: 'ActivateAcc.advertising',
        value: '3'
    },
    {
        translation: 'ActivateAcc.sales_representative',
        value: '4'
    },
    {
        translation: 'ActivateAcc.dissatisfaction_with_another',
        value: '5'
    },
    {
        translation: 'ActivateAcc.referral_by_client',
        value: '6'
    },
    {
        translation: 'ActivateAcc.other',
        value: '7'
    },
];
export const EligibleClient: Omit<TEligibleDataOptions, 'controlName'>[] = [
    {
        translation: 'ActivateAcc.is_eligible',
        value: true
    },
    {
        translation: 'ActivateAcc.not_eligible',
        value: false
    },
];
export const BanksWorkToday: DataOptions[] = [
    {
        translation: 'ActivateAcc.Banks.Union',// בנק איגוד
        value: 'Union'
    },
    {
        translation: 'ActivateAcc.Banks.Discount',// בנק דיסקונט
        value: 'Discount'
    },
    {
        translation: 'ActivateAcc.Banks.Fibi',// בנק הבינלאומי
        value: 'Fibi'
    },
    {
        translation: 'ActivateAcc.Banks.Poalim',// בנק הפועלים
        value: 'Poalim'
    },
    {
        translation: 'ActivateAcc.Banks.Leumi',// בנק לאומי
        value: 'Leumi'
    },
    {
        translation: 'ActivateAcc.Banks.Mizrahi',// בנק מזרחי
        value: 'Mizrahi'
    },
    {
        translation: 'ActivateAcc.Banks.Mercantile',// בנק מרכנתיל
        value: 'Mercantile'
    },
    // Newly added banks are below
    {
        translation: 'ActivateAcc.Banks.Yahav',// יהב
        value: 'Yahav'
    },
    {
        translation: 'ActivateAcc.Banks.Otsar',// אוצר החייל
        value: 'Otsar'
    },
    {
        translation: 'ActivateAcc.Banks.OneZero',// וואן זירו
        value: 'OneZero'
    },
    {
        translation: 'ActivateAcc.Banks.Hadoar',// הדואר
        value: 'Hadoar'
    },
    {
        translation: 'ActivateAcc.Banks.SBI',// State bank of india
        value: 'SBI'
    },
    {
        translation: 'ActivateAcc.Banks.Masad',// מסד
        value: 'Masad'
    },
    {
        translation: 'ActivateAcc.Banks.PAGI',// ישראל פועלי אגודת
        value: 'PAGI'
    },
    {
        translation: 'ActivateAcc.Banks.Israel',// בנק ישראל
        value: 'Israel'
    },
    {
        translation: 'ActivateAcc.Banks.Jerusalem',// בנק ירושלים
        value: 'Jerusalem'
    },
    {
        translation: 'ActivateAcc.Banks.HSBC',// HSBC
        value: 'HSBC'
    },
    {
        translation: 'ActivateAcc.Banks.Citi',// סיטי בנק
        value: 'Citi'
    }
];
export const BusinessTypes: DataOptions[] = [
    {
        translation: 'ActivateAcc.BusinessTypes.Private',
        value: 'Private'
    },
    {
        translation: 'ActivateAcc.BusinessTypes.Public',
        value: 'Public'
    },
    {
        translation: 'ActivateAcc.BusinessTypes.Association',
        value: 'Association'
    },
];
export const CompanyRoles: DataOptions[] = [
    {
        translation: 'ActivateAcc.CompanyRoles.role1',
        value: '1'
    },
    {
        translation: 'ActivateAcc.CompanyRoles.role2',
        value: '2'
    },
    {
        translation: 'ActivateAcc.CompanyRoles.role3',
        value: '3'
    },
];
export const ProductPossibleOptions: DataOptions[] = [
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Holdings',
        value: 'Holdings'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Environment',
        value: 'Environment'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Hospitality',
        value: 'Hospitality'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Electronics',
        value: 'Electronics'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Energy',
        value: 'Energy'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Entertainment',
        value: 'Entertainment'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Biotechnology',
        value: 'Biotechnology'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Insurance',
        value: 'Insurance'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Construction',
        value: 'Construction'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Banking',
        value: 'Banking'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Health',
        value: 'Health'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Clothing',
        value: 'Clothing'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Engineering',
        value: 'Engineering'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Education',
        value: 'Education'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Agriculture',
        value: 'Agriculture'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Technology',
        value: 'Technology'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Textile',
        value: 'Textile'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Consulting',
        value: 'Consulting'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Production',
        value: 'Production'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Chemicals',
        value: 'Chemicals'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Utilities',
        value: 'Utilities'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.profit',
        value: 'Non profit'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Media',
        value: 'Media'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Food_and_drinks',
        value: 'Food and drinks'
    },

    {
        translation: 'ActivateAcc.ProductPossibleOptions.Machines',
        value: 'Machines'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Government',
        value: 'Government'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Real_estate',
        value: 'Real estate'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Shipping',
        value: 'Shipping'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Vacation',
        value: 'Vacation'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Currency_Service_Provider',
        value: 'Currency Service Provider'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Financial',
        value: 'Financial'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Retail',
        value: 'Retail'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Transportation',
        value: 'Transportation'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Tourism',
        value: 'Tourism'
    },
    {
        translation: 'ActivateAcc.ProductPossibleOptions.Communication',
        value: 'Communication'
    },
    {
        translation: 'ActivateAcc.other',
        value: otherFieldValue
    }
];
export const EligibleFormCheckboxes: TEligibleFormCheckboxes |any = {
    business: [
        {
            controlName: 'option_1',
            translation: 'ActivateAcc.eligible_form.option_1',
            value: false,
        },
        {
            controlName: 'option_2',
            translation: 'ActivateAcc.eligible_form.option_2',
            value: false,
        },
        {
            controlName: 'option_3',
            translation: 'ActivateAcc.eligible_form.option_3',
            value: false,
        },
        {
            controlName: 'option_4',
            translation: 'ActivateAcc.eligible_form.option_4',
            value: false,
        },
        {
            controlName: 'option_5',
            translation: 'ActivateAcc.eligible_form.option_5',
            value: false,
        },
        {
            controlName: 'option_6',
            translation: 'ActivateAcc.eligible_form.option_6',
            value: false,
        },
        {
            controlName: 'option_7',
            translation: 'ActivateAcc.eligible_form.option_7',
            value: false,
        },
        {
            controlName: 'option_8',
            translation: 'ActivateAcc.eligible_form.option_8',
            value: false,
        },
        {
            controlName: 'option_9',
            translation: 'ActivateAcc.eligible_form.option_9',
            value: false,
        },
        {
            controlName: 'option_10',
            translation: 'ActivateAcc.eligible_form.option_10',
            value: false,
        }
    ],
    private: [
        {
            controlName: 'option_11',
            translation: 'ActivateAcc.eligible_form.option_11',
            value: false,
        },
        {
            controlName: 'option_12',
            translation: 'ActivateAcc.eligible_form.option_12',
            value: false,
        },
        {
            controlName: 'option_13',
            translation: 'ActivateAcc.eligible_form.option_13',
            value: false,
        }
    ]
};//# EligibleFormCheckboxes

export const showFieldsOnCondition: IShowFieldsOnCondition = {
    // PREVENT CONTINUE
    preventContinue: false,
    preventContinueReasons: EPreventContinueReasons.None,
    // ELIGIBLE
    showEligibleDialogIcon: true,
    // AFFINITY
    showAffinityField: false,
    showAffinityOtherField: false,
    // JEWELRY
    showDiamondFields: false,
    showUploadDiamondCert: false,
    // FUNDS SOURCE user chose (OTHER)
    showFundsSourceOtherField: false,
    // your_product user chose (OTHER)
    showYourProductOtherField: false,
    // show Purpose Of Joining Company Other Field (OTHER)
    showPurposeOfJoiningCompanyOtherField: false,
    // Miscellaneous  - תיפתח אפשרות להזין מלל חופשי שאנחנו נראה אותו בבק אופיס
    businessSubcategoryFreeText: false,
};// # showFieldsOnCondition

export const maxShareholders = 4 as const;
export const personPossibleEntities: DataOptions[] = [
    {
        translation: 'ActivateAcc.person_entity',
        value: EPersonOrCompanyEntity.Person
    },
    {
        translation: 'ActivateAcc.company_entity',
        value: EPersonOrCompanyEntity.Company
    },
];
export const IDTypes: (DataOptions & {id:number})[] = [
    {
        id: 1,
        translation: 'ActivateAcc.ID_Types_national_id',
        value: 'National ID',
    },
    {
        id: 2,
        translation: 'ActivateAcc.ID_Types_passport',
        value: 'Passport',
    },
    {
        id: 3,
        translation: 'ActivateAcc.ID_Types_driver_license',
        value: 'Drivers license'
    },
];
export const proofOfAddressTypes: DataOptions[] = [
    {
        translation: 'ActivateAcc.proof_of_address_utility_bill',
        value: 'Utility bill'
    },
    {
        translation: 'ActivateAcc.proof_of_address_rental_agreement',
        value: 'Rental agreement'
    },
];
export const categoriesNames = {
    'Financial asset service provider': '18',
    'Fintech': '19',
    'Trading in virtual currencies': '20',
    [ECategories.Diamonds]: '17',
} as const;

export const BusinessCategoryData: DataOptionsSubcategories[] = [
    {
        translation: 'ActivateAcc.BusinessCategory.Automotive',
        value: '1',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Auto_Accessories',
            value: '1'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Auto_Dealers_new',
                value: '2'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Auto_Dealers_used',
                value: '3'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Detail_n_carwash',
                value: '4'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Gas_Stations',
                value: '5'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Motorcycle_Sales',
                value: '6'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Rental_n_Leasing',
                value: '7'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Service_Repair',
                value: '8'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Towing',
                value: '9'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Business_Support_n_Supplies',
        value: '2',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Consultants',
            value: '10'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Employment_Agency',
                value: '11'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Marketing_n_Communications',
                value: '12'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Office_Supplies',
                value: '13'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Printing_Publishing',
                value: '14'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Computers_n_Electronics',
        value: '3',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Computer_Programming_n_Support',
            value: '15'
        },
            // {
            //     translation: 'ActivateAcc.BusinessCategory.Consumer_Electronics_n_Accessories',
            //     value: '16'
            // },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Construction_n_Contractors',
        value: '4',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Architects_Landscape_Architects_Engineers_n_Surveyors',
            value: '16'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Blasting_n_Demolition',
                value: '17'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Building_Materials_n_Supplies',
                value: '18'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Construction_Companies',
                value: '19'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Electricians',
                value: '20'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Engineer_Survey',
                value: '21'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Environmental_Assessments',
                value: '22'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Inspectors',
                value: '23'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Plaster_n_Concrete',
                value: '24'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Plumbers',
                value: '25'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Roofers',
                value: '26'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Education',
        value: '5',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Adult_n_Continuing_Education',
            value: '27'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Early_Childhood_Education',
                value: '28'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Educational_Resources',
                value: '29'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Other_Educational',
                value: '30'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Entertainment',
        value: '6',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Artists_Writers',
            value: '31'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Event_Planners_n_Supplies',
                value: '32'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Golf_Courses',
                value: '33'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Movies',
                value: '34'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Productions',
                value: '35'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Food_n_Dining',
        value: '7',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Desserts_Catering_n_Supplies',
            value: '36'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Fast_Food_n_Carry_Out',
                value: '37'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Grocery_Beverage_n_Tobacco',
                value: '38'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Restaurants',
                value: '39'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Health_n_Medicine',
        value: '8',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Acupuncture',
            value: '40'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Assisted_Living_n_Home_Health_Care',
                value: '41'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Audiologist',
                value: '42'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Chiropractic',
                value: '43'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Clinics_n_Medical_Centers',
                value: '44'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Dental',
                value: '45'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Diet_n_Nutrition',
                value: '46'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Laboratory_Imaging_n_Diagnostic',
                value: '47'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Massage_Therapy',
                value: '48'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Mental_Health',
                value: '49'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Nurse',
                value: '50'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Optical',
                value: '51'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Pharmacy_Drug_n_Vitamin_Stores',
                value: '52'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Physical_Therapy',
                value: '53'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Physicians_n_Assistants',
                value: '54'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Podiatry',
                value: '55'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Social_Worker',
                value: '56'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Animal_Hospital',
                value: '57'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Veterinary_n_Animal_Surgeons',
                value: '58'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Home_n_Garden',
        value: '9',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Antiques_n_Collectibles',
            value: '59'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Cleaning',
                value: '60'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Crafts_Hobbies_n_Sports',
                value: '61'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Flower_Shops',
                value: '62'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Home_Furnishings',
                value: '63'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Home_Goods',
                value: '64'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Home_Improvements_n_Repairs',
                value: '65'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Landscape_n_Lawn_Service',
                value: '66'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Pest_Control',
                value: '67'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Pool_Supplies_n_Service',
                value: '68'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Security_System_n_Services',
                value: '69'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Legal_n_Financial',
        value: '10',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Accountants',
            value: '70'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Attorneys',
                value: '71'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Financial_Institutions',
                value: '72'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Financial_Services',
                value: '73'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Insurance',
                value: '74'
            },         
            {
                translation: 'ActivateAcc.BusinessCategory.Cryptocurrency',
                value: '75'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Other_Legal',
                value: '76'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Manufacturing_Wholesale_Distribution',
        value: '11',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Distribution_Import_Export',
            value: '77'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Manufacturing',
                value: '78'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Wholesale',
                value: '79'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Merchants_Retail',
        value: '12',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Cards_n_Gifts',
            value: '80'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Clothing_n_Accessories',
                value: '81'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Department_Stores_Sporting_Goods',
                value: '82'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.General',
                value: '83'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Jewelry',
                value: '84'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Shoes',
                value: '85'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Miscellaneous',
        value: '13',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Civic_Groups',
            value: '86'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Funeral_Service_Providers_Cemetaries',
                value: '87'
            },
            // {
            //     translation: 'ActivateAcc.BusinessCategory.Miscellaneous',
            //     value: ESubcategories.Miscellaneous
            // },
            {
                translation: 'ActivateAcc.BusinessCategory.Other',
                value: '88'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Utility_Companies',
                value: '89'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Personal_Care_n_Services',
        value: '14',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Animal_Care_n_Supplies',
            value: '90'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Barber_n_Beauty_Salons',
                value: '91'
            },
            // {
            //     translation: 'ActivateAcc.BusinessCategory.Miscellaneous',
            //     value: 'Miscellaneous'
            // },
            {
                translation: 'ActivateAcc.BusinessCategory.Beauty_Supplies',
                value: '92'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Dry_Cleaners_n_Laundromats',
                value: '93'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Exercise_n_Fitness',
                value: '94'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Massage_n_Body_Works',
                value: '95'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Nail_Salons',
                value: '96'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Shoe_Repairs',
                value: '97'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Tailors',
                value: '98'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Real_Estate',
        value: '15',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Agencies_n_Brokerage',
            value: '99'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Agents_n_Brokers',
                value: '100'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Apartment_n_Home_Rental',
                value: '101'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Mortgage_Broker_n_Lender',
                value: '102'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Property_Management',
                value: '103'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Title_Company',
                value: '104'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Travel_n_Transportation',
        value: '16',
        subcategories: [{
            translation: 'ActivateAcc.BusinessCategory.Hotel_Motel_n_Extended_Stay',
            value: '105'
        },
            {
                translation: 'ActivateAcc.BusinessCategory.Moving_n_Storage',
                value: '106'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Packaging_n_Shipping',
                value: '107'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Transportation',
                value: '108'
            },
            {
                translation: 'ActivateAcc.BusinessCategory.Travel_n_Tourism',
                value: '109'
            },
        ]
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Financial_asset_service_provider',
        value: categoriesNames["Financial asset service provider"],
        subcategories: []
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Fintech',
        value: categoriesNames.Fintech,
        subcategories: []
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Trading_in_virtual_currencies',
        value: categoriesNames["Trading in virtual currencies"],
        subcategories: []
    },
    {
        translation: 'ActivateAcc.BusinessCategory.Diamonds',
        value: '17',
        subcategories: [
        //     {
        //     translation: 'ActivateAcc.BusinessCategory.Diamonds',
        //     value: '109'
        // },
    ]
    },
];

export const categoriesWithoutSubcategory = [
    categoriesNames["Financial asset service provider"],
    categoriesNames.Fintech,
    categoriesNames["Trading in virtual currencies"],
    categoriesNames[ECategories.Diamonds],
];

export const familyStatusOptions: DataOptions[] = [
    {
        value: 'Single',
        translation: 'ActivateAcc.family_status_dic.Single',
    },
    {
        value: 'Married',
        translation: 'ActivateAcc.family_status_dic.Married',
    },
    {
        value: 'Divorced',
        translation: 'ActivateAcc.family_status_dic.Divorced',
    },
    {
        value: 'Widower',
        translation: 'ActivateAcc.family_status_dic.Widower',
    },
];
export const currencyForPersonalUseOrInvestmentOptions: DataOptions[] = [
    {
        value: 'Private',
        translation: 'ActivateAcc.currency_for_personal_use_or_investment_dic.Private',
    },
    {
        value: 'Business',
        translation: 'ActivateAcc.currency_for_personal_use_or_investment_dic.Business',
    },
    {
        value: 'Investment',
        translation: 'ActivateAcc.currency_for_personal_use_or_investment_dic.Investment',
    },
];

export const purposeOfJoiningCompanyOptions: DataOptions[] = [
    {
        value: 'Preservation of money value',
        translation: 'ActivateAcc.purpose_of_joining_company_dic.Preservation of money value',
    },
    {
        value: 'Currency risk management',
        translation: 'ActivateAcc.purpose_of_joining_company_dic.Currency risk management',
    },
    {
        value: 'Make transfers at a regular frequency to one or more beneficiary',
        translation: 'ActivateAcc.purpose_of_joining_company_dic.Make transfers at a regular frequency to one or more beneficiary',
    },
    {
        value: 'Make transfers at an infrequent frequency to one or more beneficiaries',
        translation: 'ActivateAcc.purpose_of_joining_company_dic.Make transfers at an infrequent frequency to one or more beneficiaries',
    },
    {
        value: otherFieldValue,
        translation: 'ActivateAcc.purpose_of_joining_company_dic.other',
    },
];
export const roleOptions: DataOptions[] = [
    {
        value: 'CEO',
        translation: 'ActivateAcc.CEO',
    },
    {
        value: 'Director',
        translation: 'ActivateAcc.Director',
    },
    {
        value: otherFieldValue,
        translation: 'ActivateAcc.other',
    },
];
