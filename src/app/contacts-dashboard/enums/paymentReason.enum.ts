export enum paymentReason {
  "CompanyStocks" = 1,
  "RealEstateAbroad" = 2,
  "OtherAssetsAbroad" = 3,
  "ForeignResidentLoan" = 4,
  "CompanyOwnerLoan" = 5,
  "CapitalRefund" = 6,
  "PartnershipInvest" = 7,
  "OptionPurchase" = 8,
  "Servicesupto250K$peryear" = 9,
  "ServicesOver250k" = 10,
  "ImportOfGoodsNotIncludingBooks" = 11,
  "ImportOfBooks" = 12,
  "IncomingRoyalties" = 13,
  "EducationAbroad" = 14,
  "SoftwareUpTo2500k" = 15,
  "SoftwareOver2500k" = 16,
  "RelativeAbroad" = 17,
  "InBoarderTransfer" = 18,
  "CrossBoarderTransfer" = 19,
  "TourismServices" = 20,
  "ThirdPartyTransfer" = 21,
  "TransportationServicesOverseas" = 22,
  "RequestForAlimony" = 23,
  "SoftwareDevelopmentOrOnlineServices" = 24,
  "Salaries" = 25,
  "OptionsInvestments" = 26,
  "Other" = 999
}

export enum newBeneficiaryPaymentReason {
  "CompanyStocks" = 1,
  "RealEstateAbroad" = 2,
  "OtherAssetsAbroad" = 3,
  "CompanyOwnerLoan" = 5,
  "CapitalRefund" = 6,
  "PartnershipInvest" = 7,
  "OptionsInvestments" = 26,
  "UpTo250k" = 9,
  "ServicesOver250k" = 10,
  "TourismServices" = 20,
  "TransportationServicesOverseas" = 22,
  "RequestForAlimony" = 23,
  "Salaries" = 25,
  "EducationAbroad" = 14,
  "RelativeAbroad" = 17,
  "InBoarderTransfer" = 18,
  "CrossBoarderTransfer" = 19,
  "SoftwareDevelopmentOrOnlineServices" = 24,
  "ImportOfGoodsNotIncludingBooks" = 11,
  "Other" = 999
}

export enum paymentReasonGroup {
    "PaymentForServicesOrGoods" = "Payment For Services Or Goods",
    "FamilyAndMyself" = "Family And Myself",
    "Investment" = "Investment",
    "Loan" = "Loan",
    "Other" = "Other"
}

export enum BeneficiaryDocType {
    Invoice = 1,
    TaxDeduction = 2,
    AccountManagement = 3,
    Contract = 5,
    Union = 6,
    LoanAgreement = 7,
    PartnershipAgreement = 9,
    InstitutionPaymentRequest = 10
}
export enum BeneficiaryDocTypeName {
    "Invoice" = 1,
    "Tax Deduction Certificate" = 2,
    "Account Management Certificate" = 3,
    "Contract" = 5,
    "Company Union Document" = 6,
    "Loan Agreement" = 7,
    "Partnership Agreement" = 9,
    "Institution Payment Request" = 10
}

export enum BalanceInOutMainType{
    'Commit Payment' = 1,
    'Convert' = 2,
    'Deposit Into Wallet' = 3,
    'Withdrawal Airport Cash' = 4,
    'Plan' = 6,
    'Refund' = 8,
    'Withdrawal' = 20,
    'Future Payment' = 10
}
