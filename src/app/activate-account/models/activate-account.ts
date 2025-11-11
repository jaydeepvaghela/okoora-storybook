import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/overlay';
import { cloneDeep } from 'lodash';
import { onlyEnglishAndNumbersAndSpaceValidator, onlyEnglishAndSpaceValidator, onlyNumbersValidators, onlyValidIdNumber, valueMustBeEqualOrNotValidator, websitesValidators } from '../../shared/custom-validators';
import { showFieldsOnCondition } from './activate-account-data';

/**
 * ENUMS
 */
export enum EAllGroupTypes {
  Private = 'private',
  System_Activity = 'system_activity',
  About_Business = 'about_business',
  Shareholders = 'shareholders',
  Agree_Terms = 'agree_terms',
  Financial_Institution = 'financial_institution',
}

export enum EPrivateGroupTypes {
  Private = 'private',
  System_Activity = 'system_activity',
  Agree_Terms = 'agree_terms',
}

export enum EBusinessGroupTypes {
  Private = 'private',
  About_Business = 'about_business',
  System_Activity = 'system_activity',
  Shareholders = 'shareholders',
  Agree_Terms = 'agree_terms',
  Financial_Institution = 'financial_institution',
}

export enum EInvitedBusinessGroupTypes {
  Private = 'private',
  Agree_Terms = 'agree_terms',
}

export enum EActivateAccountUserTypes {
  Business = 'business',
  Private = 'private',
}

export enum EAccountType {
  Private = 1,
  Business = 2,
}

export const UserStatuses: Record<EActivateStatus, string> = {
  0: 'Uncomplete',
  1: 'Pending',
  2: 'Approved',
  3: 'Desclined',
  4: 'Locked',
  5: 'Uncomplete',
  7: 'Rfi',
  999: 'Loading Status',
} as const;

export enum EActivateStatus {
  uncomplete = 0, //<<<user didnt completed kyc
  pending = 1, //<<<user completed kyc and waiting for a review
  approved = 2, //<<<user kyc approved
  declined = 3, //<<<user kyc declined
  isLocked = 4, //<<<user made a operation that wasnt stated in the kyc
  invitedUncomplete = 5, //<<<user invited by admin as admin role
  isRfi = 7, //<<<user need kyc from AW
  loadingStatus = 999,
}

export enum EPanelNameToAPI {
  Private = '_AcPrivate',
  System_Activity = '_AcSystemActivity',
  About_Business = '_AcAboutBusiness',
  Shareholders = '_AcShareHolders',
  Agree_Terms = '_AcAgreeTerms',
  Financial_Institution = '_AcFinancialInstitution',
}

export enum EIsraelAffinity {
  resident = 'resident',
  works_in_israel = 'works_in_israel',
  control_israel_company = 'control_israel_company',
  prop_owner_israel = 'prop_owner_israel',
  without_affinity = 'without_affinity',
  other = 'other',
}

export enum EStatementKyc {
  receiveFunds = 1, // ---> productInterest
  sendingFunds = 2, // ---> productInterest
  purchaseHedgeDeals = 3, // ---> productInterest
  conversions = 4, // ---> productInterest
  //CurrencyManagement = 5,
  //OpeningBankAccounts = 6,
  volume = 7, // ---> annualActivity
  countries = 8, // ---> countriesFundsSent
}

export const fileIdFieldName = 'FileId';

export enum EAgreeTermsFieldsKeys {
  frameworkInformationSystem = 'frameworkInformationSystem',
  frameworkInformationSystemFileId = 'frameworkInformationSystemFileId',
  receivingConnectionWithFinancialAssetServices = 'receivingConnectionWithFinancialAssetServices',
  receivingConnectionWithFinancialAssetServicesFileId = 'receivingConnectionWithFinancialAssetServicesFileId',
  receivingInvestmentMarketingServices = 'receivingInvestmentMarketingServices',
  receivingInvestmentMarketingServicesFileId = 'receivingInvestmentMarketingServicesFileId',
  riskDisclosure = 'riskDisclosure',
  riskDisclosureFileId = 'riskDisclosureFileId',
  agreeToInformOnAnyChange = 'agreeToInformOnAnyChange',
  signature = 'signature',
  signatureFileId = 'signatureFileId',
  voiceRecognition = 'voiceRecognition',
}

export enum EPreventContinueReasons {
  MoneyLaundering = 'MONEY_LAUNDERING',
  NotEligible = 'NOT_ELIGIBLE',
  LocalPublicFigure = 'LOCAL_PUBLIC_FIGURE',
  ForeignPublicFigure = 'FOREIGN_PUBLIC_FIGURE',
  NoAffinityToIsrael = 'NO_AFFINITY_TO_ISRAEL',
  CriminalRecord = 'CRIMINAL_RECORD',
  Cryptocurrency = 'CRYPTOCURRENCY',
  TradingVirtualCurrencies = 'TRADING_VIRTUAL_CURRENCIES',
  representativesPoliticallyExposed = 'REPRESENTATIVES_POLITICALLY_EXPOSED',
  None = "None",
}

export enum EPersonOrCompanyEntity {
  Person = 'Person',
  Company = 'Company',
}

export enum ECategories {
  Diamonds = 'Diamonds',
}

export enum ESubcategories {
  Cryptocurrency = 'Cryptocurrency',
  Miscellaneous = 'Miscellaneous',
}

export enum EFaceRecognitionValues {
  valid = '1',
}

export enum EYesNoRadioValue {
  no = '0',
  yes = '1',
}

/**
 * DATA
 **/
export const minAgeForKyc: 18 = 18;
export const otherFieldValue: 'other' = 'other';
export const years_involved_in_companyField = {
  years_involved_in_company: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+$/)]), // /(?<=^| )\d+(\.\d+)?(?=$| )+$/ - כמה שנים הנך מעורב בעסק
};
export const activateAccPrivateGroupFields: any = {
  role_in_company: new FormGroup({
    value: new FormControl('', Validators.required),
    other: new FormControl(''),
    power_of_attorney: new FormControl(''),
  }), // תפקידך בחברה
  country: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, onlyNumbersValidators]],
  full_name: ['', Validators.required],
  date_of_birth: ['', Validators.required], // תאריך לידה
  gender: ['', Validators.required], // מין
  identity: ['', [Validators.required, onlyValidIdNumber()]], //תעודת זהות
  identities: [[], [Validators.required]], // אזרחויות
  israel_affinity: ['', []], // זיקה לישראל
  israel_affinity_other: [''], // זיקה לישראל אחר
  street_address: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]], // רחוב 1
  street_address_2: ['', [onlyEnglishAndNumbersAndSpaceValidator()]], // רחוב 2
  city: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]], //עיר
  zipcode: ['', [Validators.required, onlyNumbersValidators]], // מיקוד
  ...years_involved_in_companyField, // /(?<=^| )\d+(\.\d+)?(?=$| )+$/ - כמה שנים הנך מעורב בעסק
  criminal_record: ['', [Validators.required]], // רישום פלילי
  local_public_figure: [
    '',
    [
      Validators.required,
      valueMustBeEqualOrNotValidator({
        valueToCheck: EYesNoRadioValue.no,
        action: 'EQUAL_TO',
      }),
    ],
  ], // איש ציבור מקומי
  foreign_public_figure: [
    '',
    [
      Validators.required,
      valueMustBeEqualOrNotValidator({
        valueToCheck: EYesNoRadioValue.no,
        action: 'EQUAL_TO',
      }),
    ],
  ], // איש ציבור זר
  funds_source: ['', Validators.required], // מקור הכספים
  funds_source_other: ['', [onlyEnglishAndNumbersAndSpaceValidator()]],
  references_of_funds_source: [[], [Validators.required]],
  representative_acts_in_his_own_name: ['', [Validators.required]],
  face_recognition: ['', Validators.required],
};

export const activateAccSystemActivityGroupFields: any = {
  product_interest: [[], Validators.required], // איזה מוצרים מעניינים אותך
  countries_funds_sent: [[], Validators.required], // מדינות אליהן יישלחו הכספים
  //   why_chose_us: ['', Validators.required],                      // מדוע בחרת בחברתנו
  // performing_operations: ['', Validators.required],              //מעוניין לבצע פעולות באופן (חד פעמי / שוטף)
  banks_work_today: ['', Validators.required], // אילו בנקים עובד כיום
  money_laundering: [
    '',
    [
      Validators.required,
      valueMustBeEqualOrNotValidator({
        valueToCheck: EYesNoRadioValue.no,
        action: 'EQUAL_TO',
      }),
    ],
  ], //	שאלת הלבנת הון "האם תאגיד בנקאי סרב לתת לך שירות מסיבות הקשורות להלבנת הון או מימון טרור?
  // foreign_financial_activity: ['', Validators.required],         // מנהל פעילות פיננסית מדינה זרה
  // eligible: ['', Validators.required],                           // כשיר או לא
  annual_activity: ['', [Validators.required, Validators.maxLength(10)]], //היקף פעילות שנתית
};
export const activateAccAboutBusinessGroupFields = {
  state_incorporation: ['', Validators.required], // מדינת התאגדות
  business_name: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]], // שם העסק
  business_number: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]], // מספר עסק
  certificate_of_incorporation: ['', Validators.required], // תעודת התאגדות
  date_incorporation: ['', Validators.required], // תאריך התאגדות
  business_type: ['', Validators.required], // סוג העסק
  company_website: ['', [...websitesValidators]], // אתר של העסק
  // major_suppliers_names: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]],//- שמות ספקים עיקריים איתם תעבוד דרך אופקים
  // major_clients_names: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]],//- שמות לקוחות עיקריים
  // own_additional_business: ['', Validators.required],//- האם יש או היו בבעלותך או בבעלות העסק עסקים נוספים?
  // own_additional_business_detail: ['', [onlyEnglishAndNumbersAndSpaceValidator()]],//- האם יש או היו בבעלותך או בבעלות העסק עסקים נוספים? פרט
  // online_presence: ['', [...websitesValidators]],                           // הזנת נוכחות און-ליין (אתר וכו')
  business_category: [
    '',
    [
      Validators.required,
      valueMustBeEqualOrNotValidator({
        valueToCheck: 'Trading in virtual currencies',
        action: 'NOT_EQUAL_TO',
      }),
    ],
  ], //קטגוריות העסק
  business_subcategory: [
    '',
    [
      Validators.required,
      valueMustBeEqualOrNotValidator({
        valueToCheck: ESubcategories.Cryptocurrency,
        action: 'NOT_EQUAL_TO',
      }),
    ],
  ], //קטגוריות העסק
  business_subcategory_free_text: [''], // Miscellaneous  - תיפתח אפשרות להזין מלל חופשי שאנחנו נראה אותו בבק אופיס
  has_diamond_member_certificate: [''], //האם יש לך תעודת חבר בורסת היהלומים?
  upload_diamond_certificate: [''], //להעלות תעודה יהלומים
  report_diamond_reports: [''], //האם הינך מדווח דיווחים רגילים / בלתי רגילים במסגרת פעילותך כיהלומן ?
  sure_not_fake_diamonds: [''], //האם וידאת כי לא מדובר ביהלומי דמי
  //   your_customers: ['', Validators.required],//מי הלקוחות  שלך
  your_product: ['', [Validators.required]], //מה המוצר
  // your_product_other: ['', []],//מה המוצר(אחר)
  //business_proof: ['', Validators.required],//הוכחת עסק
  // statement_descriptor: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]], // השם המסחרי של העסק, במידה והוא שונה מהשם הרשמי)
  business_address: ['', [Validators.required, onlyEnglishAndNumbersAndSpaceValidator()]],
  business_zipcode: ['', [Validators.required, onlyNumbersValidators]],
  business_email: ['', [Validators.email]],
  city: ['', [
    Validators.required, 
    onlyEnglishAndSpaceValidator(),
    Validators.minLength(3),
    Validators.maxLength(50)
  ]],
  any_cryptocurrency_activities: [null, Validators.required],
  any_gambling_activities: [null, Validators.required],
  first_name:['', [onlyEnglishAndNumbersAndSpaceValidator()]],
  last_name: ['', [onlyEnglishAndNumbersAndSpaceValidator()]],
  id_number: [''],
  date_of_birth: [''],
  address: ['', [onlyEnglishAndNumbersAndSpaceValidator()]],
  citizenship: [''],
};
export const activateAccAgreeTermsGroupFields = {
  [EAgreeTermsFieldsKeys.frameworkInformationSystem]: [false, [Validators.requiredTrue]],
  [EAgreeTermsFieldsKeys.frameworkInformationSystemFileId]: ['', [Validators.required]],

  [EAgreeTermsFieldsKeys.receivingConnectionWithFinancialAssetServices]: [false, [Validators.requiredTrue]],
  [EAgreeTermsFieldsKeys.receivingConnectionWithFinancialAssetServicesFileId]: ['', [Validators.required]],

  [EAgreeTermsFieldsKeys.receivingInvestmentMarketingServices]: [false],
  [EAgreeTermsFieldsKeys.receivingInvestmentMarketingServicesFileId]: [''],

  [EAgreeTermsFieldsKeys.riskDisclosure]: [false, [Validators.requiredTrue]],
  [EAgreeTermsFieldsKeys.riskDisclosureFileId]: ['', [Validators.required]],

  [EAgreeTermsFieldsKeys.agreeToInformOnAnyChange]: [false, [Validators.requiredTrue]],

  [EAgreeTermsFieldsKeys.signature]: [false, [Validators.requiredTrue]],
  [EAgreeTermsFieldsKeys.signatureFileId]: ['', [Validators.required]],
  [EAgreeTermsFieldsKeys.voiceRecognition]: [false, [Validators.requiredTrue]],
};

/**
 * PRIVATE CLIENT FIELDS
 */
const privateClientMoreDetails: any = {
  age: ['', Validators.min(minAgeForKyc)], // גיל
  family_status: ['', Validators.required], // מצב משפחתי
  number_of_childrens: ['', Validators.required], // מספר ילדים
  currency_for_personal_use_or_investment: ['', Validators.required], //האם אחזקותיך במטבע חוץ הינו לצורך פרטי, עסקי או לצרכי השקעה?
  purpose_of_joining_company: [[], Validators.required], // e.	מהי מטרת הצטרפותך לחברה (אפשר לבחור יותר מתשובה אחת)
  purpose_of_joining_company_other: [''], // e.	מהי מטרת הצטרפותך לחברה (אפשר לבחור יותר מתשובה אחת)
  get_excess_return_from_foreign_exchange_over_banks_return: ['', Validators.required], // f.	האם ברצונך להשיג תשואה עודפת ממסחר במט"ח על פני תשואה המקובלת בבנקים? כן/לא
  interested_receiving_speculative_investment: ['', Validators.required], // g.	האם אתה מעוניין לקבל שירותי השקעות ספקולטיביות? כן/לא
};
const privateClientEligibleFields = {
  isEligible: new FormGroup({
    value: new FormControl(null, Validators.required),
    option_11: new FormControl(false),
    option_12: new FormControl(false),
    option_13: new FormControl(false),
  }),
};
let { years_involved_in_company, role_in_company, funds_source, funds_source_other, references_of_funds_source, representative_acts_in_his_own_name, ...privateClientPrivateGroupFields } =
  activateAccPrivateGroupFields;
let {
  banks_work_today: banks_work_today_dup,
  countries_funds_sent,
  performing_operations,
  product_interest,
  money_laundering: money_laundering_dup,
  annual_activity,
  foreign_financial_activity: foreign_financial_activity_dup,
  ...privateClientSystemActivityGroupFields
} = activateAccSystemActivityGroupFields;
let { business_subcategory_free_text, business_category, business_subcategory, has_diamond_member_certificate, upload_diamond_certificate, report_diamond_reports, sure_not_fake_diamonds } =
  activateAccAboutBusinessGroupFields;
export const privateClientPrivateFields = {
  ...privateClientPrivateGroupFields,
  business_category,
  business_subcategory,
  business_subcategory_free_text,
  has_diamond_member_certificate,
  upload_diamond_certificate,
  report_diamond_reports,
  sure_not_fake_diamonds,
  banks_work_today: banks_work_today_dup,
  money_laundering: money_laundering_dup,
  ...privateClientSystemActivityGroupFields,
  ...privateClientMoreDetails,
};
export const privateClientSystemActivityFields = {
  ...privateClientEligibleFields,
  countries_funds_sent,
  product_interest,
  performing_operations,
  funds_source,
  funds_source_other,
  references_of_funds_source,
  annual_activity,
  // foreign_financial_activity: foreign_financial_activity_dup,
  ...privateClientSystemActivityGroupFields,
};

/**
 * BUSINESS CLIENT FIELDS
 */
let { purpose_of_joining_company, purpose_of_joining_company_other, get_excess_return_from_foreign_exchange_over_banks_return, interested_receiving_speculative_investment } = privateClientMoreDetails;
export const businessClientMoreDetailsFields = {
  purpose_of_joining_company,
  purpose_of_joining_company_other,
  exposure_to_foreign_currency: new FormGroup({
      currencies: new FormControl([], [Validators.required]),
      currency_groups: new FormGroup({})
  }),
  get_excess_return_from_foreign_exchange_over_banks_return,
  interested_receiving_speculative_investment,
};
const businessClientEligibleFields = {
  isEligible: new FormGroup({
    value: new FormControl(null, Validators.required),
    option_1: new FormControl(false),
    option_2: new FormControl(false),
    option_3: new FormControl(false),
    option_4: new FormControl(false),
    option_5: new FormControl(false),
    option_6: new FormControl(false),
    option_7: new FormControl(false),
    option_8: new FormControl(false),
    option_9: new FormControl(false),
    option_10: new FormControl(false),
  }),
};
export const exposure_to_foreign_currency_group = {
    // estimated_monthly_holdings: new FormControl(0, Validators.required),
    estimated_yearly_holdings: new FormControl(0, Validators.required),
};
let { funds_source: funds_s, funds_source_other: funds_s_other, references_of_funds_source: references_funds_s, ...businessClientPrivateGroupFields } = activateAccPrivateGroupFields;
let {
  //   why_chose_us,
  banks_work_today,
  money_laundering,
  // foreign_financial_activity,
  ...businessClientSystemActivityGroupFields
} = activateAccSystemActivityGroupFields;
export const businessClientPrivateFields = {
  ...businessClientPrivateGroupFields,
};
/**
 * Shareholders fields
 */
export const shareholdersPopupFields: TShareholdersPopupFields = {
  type: new FormControl({ value: null, disabled: true }, []),
  choose_entity: new FormControl(''),
  company_name: new FormControl(''),
  incorporation_number: new FormControl(''),
  first_name: new FormControl(''),
  last_name: new FormControl(''),
  phone_code: new FormControl(''),
  phone_number: new FormControl(''),
  email: new FormControl(''),
  stake_in_company: new FormControl(''),
  date_of_birth: new FormControl(''),
  date_of_incorporation: new FormControl(''),
  gender: new FormControl(''),
  id_issuing_country: new FormControl(''),
  id_type: new FormControl(''),
  identity: new FormControl(''),
  citizenship: new FormControl([]),
  proof_of_address_type: new FormControl(''),
  residential_address: new FormControl(''),
  address_1: new FormControl(''),
  address_2: new FormControl(''),
  city: new FormControl(''),
  zipcode: new FormControl(''),
  state: new FormControl(''),
  front_of_document: new FormControl('', []),
  back_of_document: new FormControl('', []),
  copy_of_certificate_of_incorporation: new FormControl('', []),
  proof_of_address: new FormControl('', []),
  company_draft: new FormControl('', []),
  shareholders_structure: new FormControl('', []),
  name_of_primary_shareholder: new FormControl('', []),
};
let {
  first_name: first_name_duplicate,
  last_name: last_name_duplicate,
  date_of_birth: date_of_birth_duplicate,
  id_type,
  identity,
  citizenship: citizenship_duplicate,
  address_2: address_2_duplicate,
  front_of_document,
  back_of_document,
  residential_address,
  ..._shareholderCompanyFields
} = cloneDeep(shareholdersPopupFields);
export let shareholderCompanyFields = cloneDeep(_shareholderCompanyFields);
let {
  company_name,
  incorporation_number,
  date_of_incorporation,
  name_of_primary_shareholder,
  address_2: address_2_duplicate_2,
  copy_of_certificate_of_incorporation,
  shareholders_structure,
  ..._shareholderPersonFields
} = cloneDeep(shareholdersPopupFields);
export let shareholderPersonFields = cloneDeep(_shareholderPersonFields);

export const activateAccShareholdersGroupFields = {
  number_of_owners: new FormControl('0', [Validators.required]),
  person_or_company_1: new FormGroup({
    ...cloneDeep(shareholdersPopupFields),
    type: new FormControl({ value: 1, disabled: true }, []),
  }),
  person_or_company_2: new FormGroup({
    ...cloneDeep(shareholdersPopupFields),
    type: new FormControl({ value: 2, disabled: true }, []),
  }),
  person_or_company_3: new FormGroup({
    ...cloneDeep(shareholdersPopupFields),
    type: new FormControl({ value: 3, disabled: true }, []),
  }),
  person_or_company_4: new FormGroup({
    ...cloneDeep(shareholdersPopupFields),
    type: new FormControl({ value: 4, disabled: true }, []),
  }),
  representatives_politically_exposed: new FormGroup({
    value: new FormControl(null, [
      Validators.required,
      valueMustBeEqualOrNotValidator({
        valueToCheck: EYesNoRadioValue.no,
        action: 'EQUAL_TO',
      }),
    ]),
    detail_their_names: new FormControl(''),
  }),
  actions_by_government_agencies_within_past_five_years: new FormControl(null, [Validators.required]),
};
const {
  representatives_politically_exposed,
  actions_by_government_agencies_within_past_five_years,
  number_of_owners: number_of_owners_dup,
  ...allCompanyShareholdersFields
} = activateAccShareholdersGroupFields;
export const numOfOwnersAndPersonOrCompanyFields = cloneDeep(allCompanyShareholdersFields);
export const person_or_company_group = new FormGroup({ ...numOfOwnersAndPersonOrCompanyFields });

export const shareholdersRequiredFields = {
  [EPersonOrCompanyEntity.Company]: {
    ...Object.keys(shareholderCompanyFields),
  },
  [EPersonOrCompanyEntity.Person]: {
    ...Object.keys(shareholderPersonFields),
  },
  fieldsWithSpecialValidators: {
    phone_code: [onlyNumbersValidators],
    phone: [onlyNumbersValidators],
    company_name: [onlyEnglishAndNumbersAndSpaceValidator()],
    first_name: [onlyEnglishAndNumbersAndSpaceValidator()],
    last_name: [onlyEnglishAndNumbersAndSpaceValidator()],
    email: [Validators.email],
    address_1: [onlyEnglishAndNumbersAndSpaceValidator()],
    address_2: [onlyEnglishAndNumbersAndSpaceValidator()],
    city: [onlyEnglishAndNumbersAndSpaceValidator()],
    zipcode: [onlyNumbersValidators],
    state: [onlyEnglishAndNumbersAndSpaceValidator()],
    name_of_primary_shareholder: [onlyEnglishAndNumbersAndSpaceValidator()],
  },
};
/**
 * END Shareholders fields
 */

export const businessClientSystemActivityFields = {
  ...businessClientSystemActivityGroupFields,
  ...businessClientEligibleFields,
};
export const businessClientAboutBusinessFields = {
  funds_source,
  funds_source_other,
  // references_of_funds_source,
  banks_work_today,
  money_laundering,
  // foreign_financial_activity,
  ...activateAccAboutBusinessGroupFields,
  ...businessClientMoreDetailsFields,
  incorporation_document: [null, [Validators.required]],
  ownership_tree: [null, [Validators.required]],
};
export const businessClientShareholdersFields = {
  ...activateAccShareholdersGroupFields,
};

/**
 * Financial Institution
 */
export const financialInstitutionGroupFields: any = {
  license_or_authorization_to_operate: new FormGroup({
    value: new FormControl(null),
    regulator_for_banking_and_prudential_matters: new FormControl(null),
    regulator_for_aml_ctf_matters: new FormControl(null),
    business_license: new FormControl(null),
  }),
  anti_money_laundering: new FormGroup({
    value: new FormControl(null),
    compliance_manual: new FormControl(null),
  }),
  designated_legal_or_compliance_name: [''],
  designated_legal_or_compliance_email: [''],
  agencies_or_regulators_audit_business_compliance: [null],
  aml_compliance_approved_by_board_or_senior: [null],
  business_have_legal_and_regularity_and_designated_officer: [null],
  business_has_policies_detect_suspicious_transaction: [null],
  company_have_internal_audit_or_third_party_aml_policies: new FormGroup({
    value: new FormControl(null),
    name_of_internal_audit: new FormControl(''),
    business_have_policy_prohibiting_with_shell_banks: new FormControl(null),
    business_have_policies_to_ensure_not_conduct_transactions_or_shell_banks: new FormControl(null),
  }),
  have_policy_comply_applicable_law: [null],
  have_risk_assessment_of_customers: [null],
  determine_appropriate_level_enhanced_due_diligence: [null],
  implemented_processes_identification_customers: [null],
  have_requirement_collect_information_customers_business_activities: [null],
  assess_its_customers_aml_policies_and_practices: [null],
  process_review_customer_information_relating_to_high_risk_information: [null],
  procedures_establish_record_new_customer_noting_their_identification_documents: [null],
  complete_risk_based_assessment_to_understand_transactions_of_customers: [null],
  policies_for_identification_reporting_required_reported_to_authorities: [null],
  procedures_identify_transactions_structured_avoid_obligations: [null],
  screen_customers_and_transactions_against_lists_of_persons: [null],
  have_policies_to_ensure_only_operates_with_correspondent_banks_that_posses_licenses: [null],
  monitoring_program_for_unusual_and_potentially_suspicious_activity: [null],
  business_provide_aml_training_to_employees: [null],
  retain_records_of_its_training_sessions: [null],
  communicate_new_aml_related_laws: [null],
  business_employ_third_parties_to_carry_out_some_of_its_functions: new FormGroup({
    value: new FormControl(null),
    does_the_business_provide_aml_training_to_the_relevant_third_parties: new FormControl(''),
  }),
  // incorporation_document: [null],
  // ownership_tree: [null],
};

/**
 * TYPES
 */
export type TEligibleFormCheckboxes = { [k in ActivateAccountUserTypes]: TEligibleDataOptions[] };
export type ActivateAccountUserTypes = EActivateAccountUserTypes.Business | EActivateAccountUserTypes.Private;
// group types
export type PrivateGroupTypes = EPrivateGroupTypes.Private | EPrivateGroupTypes.System_Activity | EPrivateGroupTypes.Agree_Terms;
export type BusinessGroupTypes =
  | EBusinessGroupTypes.Private
  | EBusinessGroupTypes.System_Activity
  | EBusinessGroupTypes.About_Business
  | EBusinessGroupTypes.Shareholders
  | EBusinessGroupTypes.Agree_Terms
  | EBusinessGroupTypes.Financial_Institution;
export type InvitedGroupTypes = EPrivateGroupTypes.Private;
export type AllGroupTypes =
  | EBusinessGroupTypes.Private
  | EBusinessGroupTypes.System_Activity
  | EBusinessGroupTypes.About_Business
  | EBusinessGroupTypes.Shareholders
  | EBusinessGroupTypes.Agree_Terms
  | EBusinessGroupTypes.Financial_Institution;
export type TProgressStatusResponse = {
  About_Business?: boolean | number;
  Private: boolean | number;
  Shareholders?: number;
  System_Activity: boolean | number;
  shareholdersGeneral?: boolean;
  Financial_Institution?: boolean;
};

// panel types
export type PrivateAccPanelTypes = EPrivateGroupTypes.Private | EPrivateGroupTypes.System_Activity | EPrivateGroupTypes.Agree_Terms;
export type BusinessAccPanelTypes =
  | EBusinessGroupTypes.Private
  | EBusinessGroupTypes.System_Activity
  | EBusinessGroupTypes.About_Business
  | EBusinessGroupTypes.Shareholders
  | EBusinessGroupTypes.Agree_Terms
  | EBusinessGroupTypes.Financial_Institution;
// fields types
export type PrivateClientPrivateFieldsType = typeof privateClientPrivateFields;
export type PrivateClientSystemActivityFieldsType = typeof privateClientSystemActivityFields;
export type BusinessClientPrivateFieldsType = typeof businessClientPrivateFields;
export type BusinessClientSystemActivityFieldsType = typeof businessClientSystemActivityFields;
export type BusinessClientAboutBusinessFieldsType = typeof businessClientAboutBusinessFields;
export type BusinessClientShareholdersFieldsType = typeof businessClientShareholdersFields;
// another types
export type ShowFieldsOnConditionType = typeof showFieldsOnCondition;
export type TAgreeTermsFields = typeof activateAccAgreeTermsGroupFields;
export type PreventContinueReasonsType = IShowFieldsOnCondition['preventContinueReasons'];
export type TFilesControls = keyof FilesControls;
export type TGroupTypeCompleted = { [key in PrivateGroupTypes]: boolean } | { [key in BusinessGroupTypes]: boolean } | { [key in InvitedGroupTypes]: boolean };
export type TGroupTypeCompletedNotPrimaryAccount = Omit<TGroupTypeCompleted, EBusinessGroupTypes.Private>;
export type TAnyPersonOrCompany = 'person_or_company_1' | 'person_or_company_2' | 'person_or_company_3' | 'person_or_company_4';

export type TUpdateActivateAccountKeys =
  | EPanelNameToAPI.Private
  | EPanelNameToAPI.System_Activity
  | EPanelNameToAPI.About_Business
  | EPanelNameToAPI.Shareholders
  | EPanelNameToAPI.Agree_Terms
  | EPanelNameToAPI.Financial_Institution
  | '_Acsperson_or_company_1'
  | '_Acsperson_or_company_2'
  | '_Acsperson_or_company_3'
  | '_Acsperson_or_company_4';
export type PrivateInitialKeys = 'email' | 'phone' | 'full_name' | 'street_address' | 'city' | 'zipcode' | 'country' | 'identity' | 'face_recognition' | 'date_of_birth';
export type TIsraelAffinity = EIsraelAffinity;
export type TAccountTypes = EAccountType.Private | EAccountType.Business;
export type TAccountStatus = EActivateStatus.uncomplete | EActivateStatus.pending | EActivateStatus.approved | EActivateStatus.declined | EActivateStatus.isLocked | EActivateStatus.loadingStatus;
export type TSavedGroups = {
  about_business: boolean | number;
  private: boolean | number;
  shareholders: number;
  system_activity: boolean | number;
};
export type TCompanyNameFields = {
  business_name: string;
};
export type TCompanyNameControls = {
  business_name: FormControl;
};
export type TCompanyNameForm = FormGroup & TCompanyNameControls;
export type TAgreeTermsCheckboxKeys = keyof typeof activateAccAgreeTermsGroupFields;
export type TPreventReasons = EPreventContinueReasons;
export type TShareholdersEntities = EPersonOrCompanyEntity.Company | EPersonOrCompanyEntity.Person;

export type TFileUpdate = { controlName: string; signatureLengthValid: boolean; signaturePad: SignaturePad };
export type TDrawEndParameters = {
  formGroup: FormGroup;
  control: AbstractControl;
  controlName: string;
  signaturePad: SignaturePad;
  fileUpdater$: Subject<TFileUpdate>;
  hasComplexity?: (pad: SignaturePad, complexity?: number) => boolean;
};
export type TDrawClearParameters = { formGroup: FormGroup; controlName: string; signaturePad: SignaturePad };
export type TDisclaimerDialogData = {
  title: string;
  content: string;
  button: {
    show: boolean;
    text: string;
  };
  agreeTermsCheckbox?: {
    formGroup: FormGroup;
    formControlName: string;
    text: string;
  };
  signature: {
    formGroup: FormGroup;
    formControlName: string;
    options: any;
    fileUpdater$: Subject<TFileUpdate>;
    drawEnd: (data: TDrawEndParameters) => any;
    drawClear: (data: TDrawClearParameters) => void;
    hasComplexity: () => any;
  };
  componentAsContent?: ComponentType<any>;
  isPreview?: boolean;
  signatureFileId?: string;
};
export type TAllGroupTypes = EAllGroupTypes;
export type TShareholdersPopupFields = {
  type: any;
  choose_entity: any;
  company_name: any;
  incorporation_number: any;
  first_name: any;
  last_name: any;
  phone_code: any;
  phone_number: any;
  email: any;
  stake_in_company: any;
  date_of_birth: any;
  date_of_incorporation: any;
  gender: any;
  id_issuing_country: any;
  id_type: any;
  identity: any;
  citizenship: any;
  proof_of_address_type: any;
  residential_address: any;
  address_1: any;
  address_2: any;
  city: any;
  zipcode: any;
  state: any;
  front_of_document: any;
  back_of_document: any;
  copy_of_certificate_of_incorporation: any;
  proof_of_address: any;
  company_draft: any;
  shareholders_structure: any;
  name_of_primary_shareholder: any;
};
export type TCompanyShareholderFields = Omit<
  TShareholdersPopupFields,
  'first_name' | 'last_name' | 'date_of_birth' | 'id_type' | 'identity' | 'citizenship' | 'address_2' | 'front_of_document' | 'back_of_document'
>;
export type TPersonShareholderFields = Omit<
  TShareholdersPopupFields,
  'company_name' | 'incorporation_number' | 'date_of_incorporation' | 'gender' | 'name_of_primary_shareholder' | 'address_2' | 'copy_of_certificate_of_incorporation' | 'shareholders_structure'
>;

/**
 * INTERFACES
 */
export interface ActivateAccountState {
  userType: EActivateAccountUserTypes.Private | EActivateAccountUserTypes.Business;
  groupType: PrivateGroupTypes | BusinessGroupTypes;
}

export interface IPrivateFormGroups {
  [EPrivateGroupTypes.Private]: PrivateClientPrivateFieldsType;
  [EPrivateGroupTypes.System_Activity]: PrivateClientSystemActivityFieldsType;
  [EAllGroupTypes.Agree_Terms]: TAgreeTermsFields;
}

export interface IBusinessFormGroups {
  [EBusinessGroupTypes.Private]: BusinessClientPrivateFieldsType;
  [EBusinessGroupTypes.System_Activity]: BusinessClientSystemActivityFieldsType;
  [EBusinessGroupTypes.About_Business]: BusinessClientAboutBusinessFieldsType;
  [EBusinessGroupTypes.Shareholders]: BusinessClientShareholdersFieldsType;
  [EAllGroupTypes.Agree_Terms]: TAgreeTermsFields;
}

export interface DataOptions {
  translation: string;
  value: string;
}

export interface DataOptions2 {
  id: number;
  translation: string;
  value: boolean;
}

export type TEligibleDataOptions = {
  controlName: string;
  translation: string;
  value: boolean;
};

export interface DataOptionsSubcategories {
  translation: string;
  value: string;
  subcategories: DataOptions[];
}

export interface DataOptionsAffinity {
  translation: string;
  value: TIsraelAffinity;
}

export interface EligileClientCheckboxes {
  business: DataOptions2[];
  private: DataOptions2[];
}

export interface IPrivateFields {
  private: {
    country: string;
    email: string;
    phone: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    identity: string;
    identities: [];
    israel_affinity: string;
    israel_affinity_other: string;
    street_address: string;
    street_address_2: string;
    city: string;
    zipcode: string;
    criminal_record: string;
    local_public_figure: string;
    foreign_public_figure: string;
    funds_source: string;
    upload_identity: string;
    face_recognition: string;
    age: string;
    family_status: string;
    number_of_childrens: string;
    currency_for_personal_use_or_investment: string;
    purpose_of_joining_company: string[]; // e.	מהי מטרת הצטרפותך לחברה (אפשר לבחור יותר מתשובה אחת)
    purpose_of_joining_company_other: string; // e.	מהי מטרת הצטרפותך לחברה (אפשר לבחור יותר מתשובה אחת)
    get_excess_return_from_foreign_exchange_over_banks_return: string;
    interested_receiving_speculative_investment: string;
    business_category: string;
    business_subcategory: string;
    has_diamond_member_certificate: string;
    upload_diamond_certificate: string;
    report_diamond_reports: string;
    sure_not_fake_diamonds: string;
  };
}

export interface ISystemActivityFields {
  system_activity: {
    product_interest: [];
    countries_funds_sent: [];
    why_chose_us: string;
    performing_operations: string;
    banks_work_today: string;
    money_laundering: string;
    // foreign_financial_activity: string,
    isEligible: {
      value: boolean;
      [key: string]: boolean;
    };
  };
}
export interface IAboutBusinessFields {
  about_business: {
    business_category: string;
    business_subcategory: string;
    countries_funds_sent: [];
    // why_chose_us: string,
    performing_operations: string;
    state_incorporation: string;
    business_name: string;
    business_number: string;
    date_incorporation: string;
    city: string;
    business_type: string;
    company_website: string;
    role_in_company: string;
    first_name: string;
    last_name: string;
    id_number: string;
    date_of_birth: string;
    address: string;
    citizenship: any;
    years_involved_in_company: string;
    major_suppliers_names: string;
    major_clients_names: string;
    // own_additional_businessown_additional_business: string,
    // own_additional_business_detail: string,
    online_presence: string;
    has_diamond_member_certificate: string;
    upload_diamond_certificate: string;
    report_diamond_reports: string;
    sure_not_fake_diamonds: string;
    // your_customers:string,
    your_product: string;
    // business_proof: string,
  };
}

export interface IShareholdersFields {
  shareholders: {
    number_of_owners: string;
    company_owners: FormArray;
    representatives_politically_exposed: {
      value: string;
      detail_their_names: string;
    };
    actions_by_government_agencies_within_past_five_years: string;
  };
}

export interface IAgreeTermsFields {
  agreeTerms: { [key in keyof typeof activateAccAgreeTermsGroupFields]: boolean };
}

export interface IAllActivateAccFields extends IPrivateFields, ISystemActivityFields, IAboutBusinessFields, IShareholdersFields, IAgreeTermsFields {}

export interface IShowFieldsOnCondition {
  // PREVENT CONTINUE
  preventContinueReasons: TPreventReasons;
  preventContinue: boolean;
  // ELIGIBLE
  showEligibleDialogIcon: boolean;
  // AFFINITY
  showAffinityField: boolean;
  showAffinityOtherField: boolean;
  // JEWELRY
  showDiamondFields: boolean;
  showUploadDiamondCert: boolean;
  // FUNDS SOURCE user chose (OTHER)
  showFundsSourceOtherField: boolean;
  // your_product user chose (OTHER)
  showYourProductOtherField: boolean;
  // Show Purpose Of Joining Company Other Field( O T H E R)
  showPurposeOfJoiningCompanyOtherField: boolean;
  businessSubcategoryFreeText: boolean;
}

export interface FilesState {
  loading: boolean;
  file: any | null;
  error: any | null;
}

export interface FilesControls {
  upload_diamond_certificate?: FilesState;
  back_of_document?: FilesState;
  front_of_document?: FilesState;
  proof_of_address?: FilesState;
  shareholders_certificate?: FilesState;
  references_of_funds_source?: FilesState;
  business_license?: FilesState;
  compliance_manual?: FilesState;
  incorporation_document?: FilesState;
  ownership_tree?: FilesState;
  power_of_attorney?: FilesState;
  certificate_of_incorporation?: FilesState;
  copy_of_certificate_of_incorporation?: FilesState;
  company_draft?: FilesState;
  shareholders_structure?: FilesState;
}

export const ACCOUNT_LOCALSTORAGE_NAME = 'account';

export interface IAccountLocalStorage {
  status: TAccountStatus;
  activePackage: any;
  type: TAccountTypes;
}

export const accountLocalStorageInitial: any = {
  type: undefined,
  status: EActivateStatus.loadingStatus,
  activePackage: undefined,
};
