export enum OuterDocType {
    invoice = 1,
    taxDeduction = 2,
    mngAcc = 3,
    idAtt = 4,
    contract = 5,
    union = 6,
    loanAgreement = 7,
    accountantCert = 8
}

export enum CostType {
    'regular' = 1,
    'our' = 2,
    'prime' = 3
}

export enum QuoteType {
    ByBalanceAmount = 1,
    ByTransferAmount = 2
}

export enum QuoteStatus {
    MissingAmount = 1,
    InOrder = 2,
    Error = 3,
    EmptyResult = 4,
    MissingNonTradeDates = 5,
    NewUser = 6,
    TokenError = 7,
    RegularPaymentLimit = 8,
    CloseTradeRoomLimit = 9,
    MinimalTradeAmount = 10,
    IsSetup = 11,
    Scheduled = 12
}

export enum offerChangeType {
    beneficiary = 1,
    amount = 2,
    balance = 3,
    balAmount = 4,
    costType = 5
}

export enum PaymentReasonShortDesc {
    CompanyStocks = 1,
    RealEstateAbroad = 2,
    OtherAssetsAbroad = 3,
    ForeignResidentLoan = 4,
    CompanyOwnerLoan = 5,
    CapitalRefund = 6,
    PartnershipInvest = 7,
    OptionPurchase = 8,
    ServicesUpTo250000 = 9,
    ServicesOver250000 = 10,
    ImportOfGoodsNotIncludingBooks = 11,
    ImportOfBooks = 12,
    IncomingRoyalties = 13,
    EducationAbroad = 14,
    SoftwareUpTo2500k = 15,
    SoftwareOver2500k = 16,
    RelativeAbroad = 17,
    InBoarderTransfer = 18,
    CrossBoarderTransfer = 19,
    TourismServices = 20,
    ThirdPartyTransfer = 21,
    TransportationServicesOverseas = 22,
    RequestForAlimony = 23,
    SoftwareDevelopmentOrOnlineServices = 24,
    Salaries = 25,
    Other = 999
}

export enum PaymentFileType {
    VatDisclaimer = 1,
    DeclarationOnImportOfServices = 2,
    GreenChannel = 3,
    GreenChannelOfakim = 4,
    DeclarationOfTaxDeductedFromWages = 6
}

export enum TransactionType {
    Deposit = 0,
    ReturnedPayment = 1,
    CommitPayment = 2,
    SceduledPayment = 3,
    Withrawal = 4,
    Hedge = 5,
    Bonus = 6,
    PackagePlan = 7,
    PaymentHedge = 8,
    Refund = 9,
    AnnualPremiumDeposit = 10,
    AnnualPremiumProfit = 11,
    ReceiverPayment = 12,
    GlobalAccountCreate = 13,
    AirportCash = 14,
    Convert = 15,
    ConvertFromFuturePayment = 16,
    DepositCollateral = 17,
    WithrawalCollateral = 18,
    DepositDealPremium = 19,
    DepositDealProfit = 20,
    WithdrawalDealPremium = 21,
    WithdrawalDealLoss = 22,
    ConvertFromFunds = 23,
    HedgeOperativeCost = 24,
    FuturePaymentRefund = 25,
    DepositHedgeCollateral = 26,
    HoldingFee = 27,
    FuturePaymentPremium = 28,
    CreditCard = 29
}

export enum BorderType {
    inBorder = 0,
    crossBorder = 1,
}

export enum EntityType {
    beneficiary = 1,
    Payment = 2
}

export enum ExposureDirection {
    Down = 1,   //  Depreciation
    Up = 2      //  Appreciation
}

export enum HedgeProtectionStatus {
    Good = 1,
    Ok = 2,
    Low = 3,
    VeryLow = 4
}

export enum UserRole {
    admin = 1,
    signer = 2,
    editor = 3
}

// export enum BoardFieldType {
//     buySell = 1,
//     number = 2,
//     text = 3,
//     check = 4,
//     date = 5,
//     currency = 6,
//     beneficiary = 7,
//     pay = 8,
//     hedge = 9,
//     payType = 10,
//     payClassification = 11,
//     reconciled = 12,
//     incomingOutgoing = 13,
//     alert = 14,
//     rating = 15,
//     currencyPair = 16,
//     hedgeFW = 17,
//     direction = 18,
//     targetDate = 19
// }

// export enum payProgressStatus {
//     init = 1, // all field are open (default state)
//     paymentInProgress = 2, // started paying but didn't pay all hedge and didn't pass the Target Date
//     payedAllHedge = 3, // finished paying all hedge before Target Date has passed
//     dateHasPassed = 4 // Target date has passed
// }

export enum VerificationMethod {
    sms = 1,
    call = 2
}

export enum BoardType {
    template = 1,
    payments = 2,
    invoiceTracker = 3,
    alerts = 4,
    amountToHedge = 5,
    forwardManager = 6,
    smartHedge = 7,
    hedgePay = 8,
    proHedge = 9,
    paymentBoard = 10,
    beneficiaryBoard = 11,
    massPayment = 12,
    PaymentAlerts = 13,
    PaymentsTransactions = 14,
    FinancialManagement = 15,
    FlowInOneCurrency = 16,
    PaymentReceive = 17,
    HedgeDeals = 18,
    CashFlow = 19,
    AlertPanel = 20,
}

//  all type of boards by the BoardType enum
export type TBoardTypes = BoardType;

export enum LogEventType {
    NewBoard = 26,
    AddRow = 28,
    DeleteRow = 29,
    NameChanged = 30
}

export enum AvailableLanguage {
    English = 8,
    Hebrew = 24
}

export enum MarketDistance {
    CloseTo = 1,
    FarFrom = 2
}

export enum ReceivingPaymentReasonShortDesc {
    Export = 1,
    SameEntity = 2,
    InvestmentReturn = 3,
    Other = 4
}

export enum BoardPolicyType {
    basic = 1,
    advanced = 2
}

export enum PaymentRequestReferenceResponse {
    UnknownError = 0,
    Success = 1,
    UnknownReference = 2,
    UsedReference = 3,
    WrongPayer = 4,
    UnacceptedReference = 5
}

export enum PrimaryCurrenciesAirport {
    USD = 'USD',
    EUR = 'EUR'
}

export enum TransferTo {
    beneficiary = 1,
    wallet = 2
}

export enum ProtectSource {
    board = 1,
    search = 2,
    recommended = 3,
    payment = 4,
    catalog = 5,
    dashboard = 6,
    freeStyle = 7,
    proHedge = 8,
    fastProtection = 9,
    futurePayment = 10,
    DepositBox = 11
}

export enum DirectDebitPaymentType {
    Monthly = 1,
    Yearly = 2
}

export type TDirectDebitPaymentType = DirectDebitPaymentType;

export enum PackageField {
    OutgoingPayments = 1,
    IncomingPayments = 2,
    LocalPayments = 3,
    ForeignExchange = 4,
    FuturePayments = 5,
    PayrollPayments = 6,
    OneClickProtection = 7,
    TransactionValuation = 8,
    SensitivityAnalysis = 9,
    BankServiceHours = 10,
    SavingProducts = 11,
    TeamMembers = 12,
    SubsidiaryAccounts = 13,
    SmartBoards = 14,
    Templates = 15,
    SmartAlerts = 16
}

export enum PackageFeeField {
    ForeignExchange = 1,
    FxOutsideMarketHours = 2,
    FxOutsideMarketHoursOtherCurrencies = 3,
    OutsidePlatformOptions = 4,
    OutsidePlatformForwards = 5,
    OutsidePlatformSpot = 6,
    OutsidePlatformCommodities = 7,
    OutsidePlatformInterestRate = 8,
    OutsidePlatformIndices = 9,
    OutsidePlatformCurrencySwaps = 10,
    InternationalPaymentsOur = 11,
    InternationalPaymentsShare = 12,
    LocalPayments = 13,
    PayrollPayments = 14,
    FuturePayments = 15,
    SwiftRequest = 16,
    Chargeback = 17,
    MinimumPayment = 18,
    OwnAccountToOkoora = 19,
    ThirdPartyToOkoora = 20,
    Withdrawal = 21,
    OverseasAccount = 22,
    HoldingBalance = 23,
    HoldingBalanceEur = 24,
    OneClickProtection = 25,
    MinimumHedging = 26,
    TransactionValuation = 27,
    SensitivityAnalysis = 28,
    BankServiceHours = 29,
    TeamMembers = 30,
    SubsidiaryAccounts = 31,
    SmartBoards = 32,
    SavingProducts = 33
}

export enum Insights {
    Threat = 1,
    Opportunity = 2,
    News = 3,
    GoodToKnow = 4,
    Reminder = 5,
    TakeProfit = 6,
    StopLoss = 7
}

export enum NarrowWide {
    Normal = 1,
    Narrow_1 = 2,
    Narrow_2 = 3,
    Wide_1 = 4,
    Wide_2 = 5,
    Wide_3 = 6,
    Wide_4 = 7,
    Wide_5 = 8,
    Other = 9
}

export enum EPusherChannels {
    livePurchase = 'live-purchase',
    paymeUpdateSubscription = 'payme-update-subscription',
    ocrPayment = 'Ocr-payment',
    shuftiProValidationRsponseChannel = 'shufti-pro',
}

export enum EPusherEvents {
    callStatus = 'call-status',
    subscriptionUpdate = 'subscription-update',
    ocrPaymentResponse = 'Ocr-response',
    shuftiProValidationResponseEvent = 'verify-id',
    shuftiProPendingRequest = 'pending-request',
}

export enum EEligible {
    yes = '1',
    no = '2',
}

export enum ELocalStorageItems {
    currentUser = 'currentUser',
    account = 'account',
}

export enum EBalanceInOutMainType {
    CommitPayment = 1,
    Convert,
    DepositIntoWallet,
    WithdrawalAirportCash,
    WithdrawalDealLoss,
    Plan,
    GlobalAccountCreate,
    Refund,
    DepositIntoSaving,
    FuturePayment,
    BuyOptionNdf,
    SellOptionNdf,
    BuyOptionDelivery,
    SellOptionDelivery,
    BuyForwardNDF,
    SellForwardNDF,
    BuyForwardDelivery,
    SellForwardDelivery,
    Hedging,
    Withdrawal,
    Saving,
    CreditCollateral
}

export enum EBalanceInOutType {
    deposit = 0,
    returnedPayment,
    commitPayment,
    scheduledPayment,
    withdrawal,
    hedge,
    Bonus,
    packagePlan,
    paymentHedge,
    refund,
    AnnualPremiumDeposit,
    AnnualPremiumProfit,
    receiverPayment,
    globalAccountCreate,
    AirportCash,
    Convert,
    convertFromFuturePayment,
    depositCollateral,
    withdrawalCollateral,
    depositDealPremium,
    depositDealProfit,
    withdrawalDealPremium,
    withdrawalDealLoss,
    convertFromFunds,
    hedgeOperativeCost,
    futurePaymentRefund,
    depositHedgeCollateral,
    holdingFee,
    FuturePaymentPremium,
    packageCreditCard,
    cooperationDeposit,
    paymentCost,
    ConvertCommission,
    Fee,
    ReturnFee,
    ExpiryDeal,
    SavingInterest,
    WithdrawalSaving,
    DepositIntoSaving,
    SavingFee,
    DepositCreditCollateral
}

export enum EStoreFeatureNames {
    accountingReport = 'accountingReport',
    deposit = 'deposit',
    layout = 'layout',
    plans = 'plans',
    accountPackage = 'accountPackage',
    holidays = 'holidays',
}

export enum ECurrencies {
    USD = 'USD',
    EUR = 'EUR',
    ILS = 'ILS',
}

export enum EPackagePaymentType {
    isNew = 1,
    isUpgrade = 2,
    isDowngrade = 3,
}

export type TPackagePaymentType = EPackagePaymentType;

export enum ECatalogID {
    LockAndUp = 100,// LOCK & UP
    LockAndDown = 101,// LOCK & DOWN
    SafeUp = 102,// SAFE UP
    SafeDown = 103,
    RangeUp = 104,
    RangeDown = 105,
    SafeRangeUp = 106,
    SageRangeDown = 107,
    BlockRangeUp = 108,
    BlockRangeDown = 109,
    ExtraUp = 112,
    ExtraDown = 113,
    ExtraRangeUp = 116,
    ExtraRangeDown = 117,
    BullSpread = 124,
    BearSpread = 125,
    SemiSafeRangeUp = 127,
    SemiSafeRangeDown = 129,
}

export enum EBarrierType {
    European = 1,
    American = 2,
    Kiko = 3
}
export enum ETriggerType {
    KnockIn = 1,
    KnockOut = 2,
}