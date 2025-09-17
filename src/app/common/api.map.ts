import { environment } from 'src/environments/environment';
import { HttpRequest } from '@angular/common/http';
import HTTPRequest from 'pusher-js/types/src/core/http/http_request';

class Request extends HttpRequest<any> { }

export class ApiMap {
  /** User Login */
  public static login: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/login',
    {},

  );
  public static authSignalAuthenticationCallback: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/AuthSignalAuthenticationCallback',
    {},

  );
  public static logout: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/Logout',
    {},

  );

  public static refreshToken: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/RefreshToken',
    {}
  );
  public static lastUsing: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Authentication/LastUsing',
    {}
  );

  public static checkUserVerification: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Account/CheckIfUserNeedSMSVerification',
    {}
  );

  public static sendSmsVerification: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/SendSmsVerificationCode',
    {}
  );

  public static checkSmsVerification: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/CheckAuthenticationSmsVerificationCode',
    {}
  );

  public static getUserProfile: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Account/GetClientProfile',
    {},
    { withCredentials: true }
  );

  public static getProfileRelatedAccounts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/User/GetAccounts',
    {}
  );

  public static changeYourSelectedAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/User/SetSelectedAccount',
    {}
  );

  /** Forgot Password */
  public static forgotSmsVertificationCode: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/SendSmsVerificationCode',
    {}
  );

  public static sendVertificationByEmail: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/SendVerificationByEmail',
    {}
  );


  public static forgotCheckSmsVertification: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/CheckAuthenticationSmsVerificationCode',
    {}
  );

  public static resetPassword: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/ForgetPassword',
    {}
  );

  /** Benificiary */
  public static readonly contacts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Beneficiary/All',
  );

  public static readonly isBeneficiaryExist: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/BeneficiaryExists',
    {}
  );
  public static readonly addBenificiery: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/SaveBeneficiary',
    {}
  );
  public static readonly getBeneficiary: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Beneficiary/Get',
  );
  public static readonly addInvoice: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/GetVendorFromInvoice',
    {}
  );

  public static readonly deleteBenificiery: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/Delete',
    {}
  );

  public static readonly isBeneficiaryIDExist: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Beneficiary/IsBeneficiaryIdNumberExists',
    {}
  );

  public static readonly ibanDetails: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ibanCom/ibanDetails',
    {}
  );
  public static readonly bicSwiftDetails: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ibanCom/BicSwiftDetails',
    {}
  );
  public static readonly getPayementReasons: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Payment/PaymentReasons',
    {}
  );

  public static readonly getBankNUmberList: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Bank/IL/All',
    {}
  );

  public static readonly getBranchNumberList: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Bank/IL/[bank_Code]/Branches',
    {}
  );

  public static readonly getCity: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Locations/Cities',
    {}
  );
  public static readonly getCityWithIso2: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/locations/CitiesWithIso2',
    {}
  );

  public static readonly getCountries: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Locations/Countries',
    {}
  );
  public static readonly getStates: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Locations/States',
    {}
  );


  public static readonly uploadBeneficiaryFile: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/UploadBeneficiaryFiles',
    {}
  );

  public static readonly changeBeneficiaryStatus: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/ChangeBeneficiaryStatus',
    {}
  );

  public static readonly addPayer: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Receiver/SavePayer',
    {}
  );
  public static readonly uploadPayerFile: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Receiver/UploadPayerFiles',
    {}
  );
  public static readonly calculateIban: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/IbanCom/CalculateIban',
    {}
  );
  public static readonly saveBeneficiaryAsMyAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/SaveBeneficiaryAsMyAccount',
    {}
  );
  //** Global Accounts */
  public static readonly getAllGlobalAccounts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/aw/GetGlobalAccounts',
  );

  /** getAllActiveCurrency */
  public static readonly getActiveCurrencies: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/GetAllActiveCurrencies',
  );

   /** getAllActiveCurrency */
   public static readonly GetAllCurrenciesForPayment: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/GetAllCurrenciesForPayment',
  );



  public static readonly GetCurrenciesNotInWallet: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/GetCurrenciesNotInWallet',
  );

  /** wallets send money */
  public static readonly createPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CreateNewPaymentRequest',
    {}
  );

  public static readonly updateNewPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/UpdateNewPaymentRequest',
    {}
  );

  public static readonly getLastMassRequests: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/GetLastMassRequests',
    {}
  );

  public static readonly getIsMassExcel: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/payment/PayExcel',
  );

  public static readonly createFuturePayment: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/CreateFuturePayment',
    {}
  );

  public static readonly refreshFuturePayment: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/RefreshFuturePayment',
    {}
  );

  public static readonly completeFuturePayment: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/CompleteFuturePayment',
    {}
  );

  public static readonly updateCostType: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/UpdateCostType',
    {}
  );
  public static readonly deletePaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/DeletePaymentRequest',
    {}
  );
  public static readonly uploadPaymentFile: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/UploadPaymentFile',
    {}
  );

  public static readonly updateFuturePaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/payment/UpdatePaymentRequest',
    {}
  );

  public static readonly refreshQuote: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/RefreshQuoteByRequestId',
    {}
  );
  public static readonly refreshCostList: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/RefreshCostListByRequestId',
    {}
  );

  public static readonly completePayment: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CompletePaymentRequest',
    {}
  );

  /* AirWallex  */
  public static readonly needAwKyc: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Aw/NeedAwKyc',
  );
  public static readonly countryByCurrencyAx: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Aw/CountryByCurrencyAx',
  );

  public static readonly createAxAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Aw/CreateAccount',
    {}
  );
  public static readonly GetEmbeddedConnect: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Aw/EmbeddedConnect',
    {}
  );
  public static readonly GetEmbeddedScaConnect: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Aw/ScaEmbeddedConnect',
    {}
  );
  public static readonly createAwBeneficiary: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/AwBeneficiary/UpdateTrustedBeneficiary',
    {}
  );
  public static readonly openCcBanksAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Cloud/OpenCcBanksAccount',
    {}
  );
  public static readonly getIndustryCategories: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Aw/GetIndustryCategories',
    {}
  );
  public static readonly uploadFile: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Aw/UploadFile',
    {}
  );
  public static readonly createBankAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/aw/CreateBankAccount',
    {}
  );

  /** Cash to flight */

  public static readonly noTradeAirPort: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/User/NoTradeAirPort',
  );

  public static readonly getAirPortAvailableCurrencies: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/GetAirPortAvilibaleCurrencies',
    {}
  );
  public static readonly createConvertToTransfer: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CreateConvertToTransfer',
    {}
  );
  public static readonly refreshConvertToTransfer: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/RefreshConvertToTransfer',
    {}
  );
  public static readonly completeConvertToTransfer: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CompleteConvertToTransfer',
    {}
  );
  public static readonly createConvertRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/ConvertRequest',
    {}
  );

  public static readonly checkWalletBalanceForConvert: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CheckWalletBalanceForConvert',
    {}
  );

  public static readonly refreshConvertRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/RefreshConvertRequest',
    {}
  );

  public static readonly completeConvertRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CompleteConvertRequest',
    {}
  );
  /** Api-keys */
  public static readonly apiClient: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiKey/ApiClient',
  );
  public static readonly generate: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiKey/Generate',
    {}
  );
  public static readonly revoke: Request = new HttpRequest<any>(
    'DELETE',
    environment.baseApiUrl + '/ApiKey/Revoke',
  );
  public static readonly apiMetricsStatistics: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiMetrics/Statistics',
  );
  /** Wallets */
  public static readonly getAllBalanceList: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/BalanceList',
  );

  public static readonly getBalanceByCurrency: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/GetBalancesByCurrency',
  );

  public static readonly getWalletTransactions: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/GetAccountTransactions',
  );

  public static readonly addWallet: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/CreateNewWallet',
    {}
  );

  /** Payers */
  public static readonly getPayers: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Receiver/GetPayers',
  );

  public static readonly deletePayer: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Receiver/DeletePayer',
    {}
  );

  /** Get current exchange rate */
  public static readonly getExchangeRate: Request = new HttpRequest<any>(
    'GET',
    environment.exchangeRateAPI,
  );

  public static readonly CreateExposure: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Exposures/CreateExposure',
    {}
  );

  public static readonly deleteExposure: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Exposures/DeleteExposure',
    {}
  );

  public static readonly AlertSpotAndRate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Rates/AlertSpotAndRate',
  );

  public static readonly getNotificationExposures: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Exposures/NotificationExposures',
  );
  /** Upload OCR file */
  public static readonly uploadOCRFile: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/OcrPaymentUpload',
    {}
  )

  public static readonly deleteOcrPayment: Request = new HttpRequest<any>(
    'DELETE',
    environment.baseApiUrl + '/Payment/DeleteOcrPayment',
    {}
  );
  public static readonly ApprovedBenificiaryOCR: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Beneficiary/ApprovedBeneficiaryForOCR',
  );

  public static readonly OcrCreatePaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/OcrCreatePaymentRequest',
    {}
  );

  public static readonly OcrCompletePaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/OcrCompletePaymentRequest',
    {}
  );

  public static readonly GetOcrFile: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Payment/GetOcrFile',
  )
  public static readonly GetDispatchedFile: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Payment/GetDispatchedFile',
  )
  public static readonly GetPaymentConfirmationFile: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Aw/GetPaymentConfirmationFile',
  )

  /** Add Money */
  public static readonly getDepositToFromLocalBank: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/DepositToFromLocalBank',
    {}
  );

  public static readonly payerTransferBankDetails: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/PayerTransferBankDetails',
    {}
  );

  public static readonly createPaymentRequestForAddMoney: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Receiver/CreatePaymentRequest',
    {}
  );

  public static readonly depositRegular: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/DepositRegular',
    {}
  );

  public static readonly GetPairLink: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Currency/GetPair',
  );


  public static readonly FutureActivitiesReport: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Report/FutureActivitiesReport',
    {}
  );

  public static readonly getRules: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/BalanceNotifications/GetAllRules',
  );

  public static readonly addRules: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/BalanceNotifications/AddRule',
    {}
  );

  public static readonly updateRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/BalanceNotifications/UpdateRule',
    {}
  );

  public static readonly NotificationsHistory: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/BalanceNotifications/NotificationsHistory',
  );

  /** My Cashflow */
  public static readonly getPurchaseOrderInvoices: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/PurchaseOrder/GetPurchaseOrdersInvoices',
  );

  public static readonly createOcrPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CreateNewPaymentRequestOCR',
    {}
  );

  public static readonly refreshMultiQuote: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/RefreshMultiPaymentRequest',
    {}
  );

  public static readonly ocrCompleteMultiPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/OcrCompleteMultiPaymentRequest',
    {}
  );

  //Purchase Module
  public static readonly getAllPurchaseOrders: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/PurchaseOrder/GetAllPurchaseOrders',
  );
  public static readonly getPurchaseTypes: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/PurchaseOrder/GetPurchaseTags',
  );
  public static readonly getPurchaseDepartments: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/PurchaseOrder/GetPurchaseDepartments',
  );
  public static readonly createPurchaseOrder: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/CreatePurchaseOrder',
    {}
  );
  public static readonly createDepartmentType: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/CreateDepartmentType',
    {}
  );
  public static readonly createPurchaseType: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/CreatePurchaseTag',
    {}
  );
  public static readonly setPurchaseOrdersTags: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/SetPurchaseOrdersTags',
    {}
  );
  public static readonly uploadOCRFileForPurchase: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/OcrPaymentUpload',
    {}
  )
  public static readonly purchaseOrdersInvoicesUpdate: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/PurchaseOrdersInvoicesUpdate',
    {}
  )
  public static readonly approveOrder: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Approval/Approve',
    {}
  )

  public static readonly deleteRule: Request = new HttpRequest<any>(
    'DELETE',
    environment.baseApiUrl + '/BalanceNotifications/DeleteRule',
    {}
  );

  public static readonly ChangeBalanceRuleStatus: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/BalanceNotifications/ChangeBalanceRuleStatus',
    {}
  );

  public static readonly accountUsersInvite: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Invite/AccountUsers',
    {}
  );
  public static readonly deleteInvitedUser: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Invite/DeleteInvitedUser',
    {}
  );
  public static readonly inviteUser: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Invite/InviteUser',
    {}
  );
  public static readonly updateUserRole: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Invite/UpdateUserRole',
    {}
  );

  public static readonly checkInvitedUser: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Invite/CheckInvitedUserRegistrationValidationTime',
    {}
  );
  public static readonly createInviteUser: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Invite/CreateInviteUser',
    {}
  );


  public static readonly GetProfilesRelatedToAccount: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Account/GetProfilesRelatedToAccount',
  );

  public static readonly GetFutureActivitiesSum: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Exposures/GetFutureActivitiesSum',
  );

  //Compare hedge
  public static readonly tradeRoomCompareId: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Hedge/TradeRoomCompareId',
  );
  public static readonly tradeRoomProducts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Hedge/TradeRoomProducts',
  );
  public static readonly checkMissingFounds: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/MissingFounds',
  );
  public static readonly activateStrategy: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Hedge/ActivateStrategyPusher'
  );

  // Purchase hedge
  public static readonly getOrCreateHedgeForOcr: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/GetOrCreateHedgeForOcr',
    {}
  )

  public static readonly createHedgeForOcr: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/CreateHedgeForOcr',
    {}
  )

  public static readonly refreshQuickHedge: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/RefreshQuickHedge',
    {}
  )

  public static readonly completeQuickHedge: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/CompleteQuickHedge',
    {}
  )

  public static readonly getMultipleHedgeOcrByOrderId: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/GetMultipleHedgeOcrByOrderId',
    {}
  )

  public static readonly completeHedgeOcrForProtectAll: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/CompleteHedgeOcrForProtectAll',
    {}
  )

  public static readonly refreshHedgeOcrForProtectAll: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PurchaseOrder/RefreshHedgeOcrForProtectAll',
    {}
  )

  //reports module
  public static readonly getAllHedgeTransaction: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Report/getHedgeStrategyReport',
  );

  //reports module

  // report-file-download

  public static readonly getPdfByDate: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/BalanceReport',
    {}
  );

  //report file-download

  //workflow drawer

  public static readonly getApprovalProfiles: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/SigningConfig/GetApprovalProfiles',
  );

  //workflow drawe end


  // workflow

  public static readonly GetSigningConfigs: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/SigningConfig/GetSigningConfigs',
  );

  public static readonly DeleteSigningConfig: Request = new HttpRequest<any>(
    'DELETE',
    environment.baseApiUrl + '/SigningConfig/DeleteSigningConfig',
    {}
  );

  public static readonly GetDeletedSigningConfigs: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/SigningConfig/GetDeletedSigningConfigs',
  );
  public static readonly createSigningConfig: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/SigningConfig/CreateSigningConfig',
    {}
  )

  public static readonly GetSigningConfigsById: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/SigningConfig/GetSigningConfig',
  );

  public static readonly getSalaryBeneficiaries: Request = new HttpRequest<any>(
    'Get',
    environment.baseApiUrl + '/Beneficiary/GetSalaryBeneficiaries',
    {}
  );

  public static readonly addSalaryBeneficiariesFromExcel: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Beneficiary/AddSalaryBeneficiariesFromExcel',
    {}
  );
  public static readonly UpdatelimitsDisclaimerApproval: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/User/UpdatelimitsDisclaimerApproval',
  );
  public static readonly createMultiPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CreateMultiPaymentRequest',
    {}
  );
  public static readonly updateMultiPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/UpdateMultiPaymentRequest',
    {}
  );
  public static readonly refreshMultiPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/RefreshMultiPaymentRequest',
    {}
  );

  public static readonly uploadPaymentFileMultiplePaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/UploadPaymentFileMultiplePaymentRequest',
    {}
  );

  public static readonly completeMultiPaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/CompleteMultiPaymentRequest',
    {}
  );


  //profile

  public static SetAccountStamp: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Account/SetAccountStamp',
    {}
  );

  public static GetAccountStampFile: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Payment/GetAccountStampFile',
    {}
  );

  public static DefaultPackages: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Package/DefaultPackages',
    {}
  );

  public static ActivePackage: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Package/ActivePackage',
    {}
  );

  // public static PayMePlanPurchase: Request = new HttpRequest<any>(
  //   'POST',
  //   environment.baseApiUrl + '/PayMe/PayMePlanPurchase',
  //   {}
  // );

  public static CreatePackageBasket: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Package/CreatePlanOffer',
    {}
  );
  public static changePassword: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Authentication/ChangePassword',
    {}
  );

  public static beneficiariesWithOwnAccount: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Beneficiary/BeneficiariesWithOwnAccount',
    {}
  );


  public static GetUserPackageWaitingForPurchase: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Package/UserPackageWaitingForPurchase',
    {}
  );
  public static GetStopUserPlanPurchaseAlert: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Package/StopUserPlanPurchaseAlert',
    {}
  );
  public static PayMePlanPurchase: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/PayMe/PayMePlanPurchase',
    {}
  );
  public static CreateSavingRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/CreateSavingRequest',
    {}
  );

  //------------ Lock up down API start----------
  public static getLockHedgeGrafhData: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Hedge/GetLockHedgeGrafhData',
    {}
  );
  public static getHedgeGrafhData: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Hedge/GetStrikePointsForHedge',
    {}
  );
  public static createHedgeByCategory: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/CreateHedgeByCategory',
    {}
  );
  public static refreshlockHedge: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Hedge/RefreshQuickHedge',
    {}
  );
  public static UpdatePaymentRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Payment/UpdatePaymentRequest',
    {}
  );
  //------------ Lock up down API End------------

  // new dashboard panel

  public static GetDataForDashboardPanel: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Dashboard/GetDataForDashboardPanel',
    {}
  );

  public static GetMarketListData: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Dashboard/GetMarketListData',
    {}
  );

  public static GetDefaultCurrency: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/GetDefaultCurrency',
    {}
  );

  public static SetBalanceExposures: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/SetBalanceExposures',
    {}
  );

  public static GetActiveHedgingCurrency: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Hedge/GetActiveHedgingCurrency',
    {}
  );

  public static LastPaymentRate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Rates/LastPaymentRate',
    {}
  );

  public static noTradeList: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/NoTrade/NoTradeList',
    {}
  );

  public static GetCalendarDataTableByDate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Dashboard/GetCalendarDataTableByDate',
    {}
  );
  public static GetCalendarDataByDate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Dashboard/GetCalendarByDate',
    {}
  );
  //hedge
  public static BaseBalanceExposures: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/BaseBalanceExposures',
    {}
  );

  public static GetCurrentExplosureRate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Rates/CurrentExposureRate',
    {}
  );

  public static getCurrentRate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Rates/CurrentRate',
    {}
  );

  public static convertHtmlToPdf: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/file/ConvertHtmlToPdf',
    {}
  );

  public static getCcBankAccount: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Cloud/GetCcBankAccount',
    {}
  );
  public static openGlobalAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/aw/OpenGlobalAccount',
    {}
  );
  public static getGlobalAccount: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/aw/GetGlobalAccount',
    {}
  );

  public static hasFreeCCBankAccount: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Cloud/HasFreeCCBankAccount',
    {}
  );

  public static ccBankAccountCost: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Cloud/CCBankAccountCost',
    {}
  );

  public static payForBankAccount: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Cloud/PayForBankAccount',
    {}
  );

  public static fundingAccounts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Cloud/FundingAcounts',
    {}
  );

  public static dontShowWalkMe: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/user/WalkmeSetDisplay',
    {}
  );

  public static walkmeDisable: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/user/WalkmeDisable',
    {}
  );

  public static chartTransactions: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Balances/ChartTransactions',
    {}
  );

  public static accountTransactionFilter: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/AccountTransactions',
    {}
  );

  public static BuyNewProduct: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Products/BuyNewProduct',
    {}
  );

  public static GetAllActiveProducts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Products/GetAllActiveProducts',
    {}
  );

  public static PurchaseCustomAddon: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Products/PurchaseCustomAddon',
    {}
  );

  public static PurchaseCustomPlan: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Products/PurchaseCustomPlan',
    {}
  );

  public static BuyNewAddon: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Products/BuyNewAddon',
    {}
  );


  //   // API dashboard Module APIs
  // ----------------------------------------------

  public static ApiMetricsrequests: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiMetrics/requests',
    {}
  );

  public static ApiClient: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiKey/ApiClient',
    {}
  );

  public static GenerateAPIKey: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiKey/Generate',
    {}
  );

  public static DeleteAPIKey: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiKey/Revoke',
    {}
  );

  public static createSession: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/apideck/CreateSession',
    {}
  );
  public static importErpBeneficiaries: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/apideck/ImportErpBeneficiaries',
    {}
  );
  public static getImportedSuppliers: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/apideck/GetImportedSuppliers',
    {}
  );

  public static updateVisibility: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/apideck/UpdateVisibility',
    {}
  );




  public static BuyNewPackage: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Products/BuyNewPackage',
    {}
  );

  // Risk manager API start


  public static updateCashFlowMonthlyExposureData: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/UpdateCashFlowMonthlyExposureData',
    {}
  );

  public static UpdateCashFlowName: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/UpdateCashFlowName',
    {}
  );

  public static showPageZero: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/ShowPageZero',
    {}
  );

  public static readonly GetSupportedCashflowCurrencies: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GetSupportedCashflowCurrencies',
  );

  public static readonly GetMaximumRiskAmount: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GetMaximumRiskAmount',
  );

  public static UpdateCashFlowCurrencyData: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/UpdateCashFlowCurrencyData',
    {}
  );

  public static UpdateCashFlowExposureData: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/UpdateCashFlowExposureData',
    {}
  );

  public static GetCashFlowData: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GetCashFlowData'
  );

  public static readonly GetMidSpotTradeView: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GetMidSpot',
  );

  public static getBudgetRate: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GenerateBudgetRate',
    {}
  );

  public static updateAdvancePolicyData: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/UpdateAdvancePolicyData',
    {}
  );

  public static readonly beneficiaryBankRequirements: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Beneficiary/GetBeneficiaryBankRequirements',
    {}
  );

  public static getAdvancePolicyData: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GetAdvancePolicyData',
    {}
  );


  public static getHedgesFromPolicyData: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/CashFlow/GetHedgesFromPolicyData',
    {}
  );

  public static UpdateHedgesRequest: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/UpdateHedgesRequest',
    {}
  );

  public static CompleteHedgeGroup: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/CashFlow/CompleteHedgeGroup',
    {}
  );

  public static GetIsEligible: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/kyc/GetIsEligible',
    {}
  );

  public static registrationForForeignResidents: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Account/CompletingRegistrationForForeignResidents',
    {},
    { withCredentials: true }
  );

  public static uploadKYBSignature: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Kyc/UploadKYCFile',
    {},
  );

  public static saveKybUser: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Kyc/UpdateForForeignResidents',
    {},
  );

  // Payer new flow API
  public static needsPartialPayerDetails: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Receiver/NeedsPartialPayerDetails'
  );

  public static identifyTaxHavenCountry: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/locations/taxhaven',
    {}
  );

  public static readonly getAWBeneficiaryById: Request = new HttpRequest<any>( // aw Beneficiary
    'GET',
    environment.baseApiUrl + '/AwBeneficiary',
  );

  public static readonly GetAWBeneficiaryFormSchema: Request = new HttpRequest<any>( // aw Beneficiary
    'POST',
    environment.baseApiUrl + '/AwBeneficiary/GetFormSchema',
    {}
  );

  public static readonly validateAWBeneficiary: Request = new HttpRequest<any>( // aw Beneficiary
    'POST',
    environment.baseApiUrl + '/AwBeneficiary/Validate',
    {}
  );

  public static readonly createAWBeneficiary = (payload: any) =>
    new HttpRequest(
      'POST',
      `${environment.baseApiUrl}/AwBeneficiary/Create`,
      payload,
      { reportProgress: true }
    );

  public static readonly deleteAWBeneficiary = (beneficiaryId: string) =>
    new HttpRequest(
      'POST',
      `${environment.baseApiUrl}/AwBeneficiary/${beneficiaryId}/delete`,
      { id: beneficiaryId },  // Ensure API expects this format
      { reportProgress: true }
    );

  public static readonly getAWBeneficiaryByID = (beneficiaryId: string) =>
    new HttpRequest(
      'GET',
      `${environment.baseApiUrl}/AwBeneficiary/${beneficiaryId}`,
      { id: beneficiaryId },  // Ensure API expects this format
      { reportProgress: true }
    );

  public static readonly updateAWBeneficiary = (beneficiaryId: string, payload: any) =>
    new HttpRequest(
      'POST',
      `${environment.baseApiUrl}/AwBeneficiary/${beneficiaryId}/update`,
      payload, // Full payload goes here
      { reportProgress: true }
    );

  public static readonly getAllCurrencies: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Currency/All',
  );

  public static readonly updateMainCurrency: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Balances/SetDefaultCurrency',
    {}
  );
  public static readonly GenerateGlobalAccountStatement: Request = new HttpRequest<any>(
    'POST',
    `${environment.baseApiUrl}/aw/GenerateGlobalAccountStatement`,
    {}
  );
  public static readonly createPayablesProtectSession: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiDeck/CreatePayablesProtectSession',
    {}
  );

  public static readonly getErpCustomerSupplier: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiDeck/GetErpCustomerSupplier',
  );

  public static readonly AddRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiDeck/AddRule',
    {}
  );

   public static readonly GetFilteredInvoiceBillList: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiDeck/GetFilteredInvoiceBillList',
    {}
   );

  public static readonly addApiDeckRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiDeck/AddRule',
    {}
  );

  public static readonly ClearCache: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiDeck/ClearCache',
   );
   
  public static readonly HedgingExposureDetail = (exposureData: any) =>
    new HttpRequest(
      'GET',
      `${environment.baseApiUrl}/ApiDeck/HedgingExposureDetail?strategyId=${exposureData.strategyId}`,
  );

  public static readonly GetExposureList: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiDeck/GetExposureList',
    {}
  );

  public static readonly AutomatedHedging: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ApiDeck/AutomatedHedging',
    {}
  );
  public static readonly getWhiteLabelList: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Wl/GetWhiteLabelList',
  );


  public static readonly CreateSubscriptionLink : Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/package/CreateSubscriptionLink',
    {}
  );

  public static readonly setFreePlan : Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/package/SetFreePackage',
    {}
  );
  public static readonly getClientId: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Authentication/ClientId',
   );
  public static readonly getClientSecret: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Authentication/ClientSecret',
   );

   public static readonly getHedgingRules: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiDeck/UserHedgingRule',
   );

   public static readonly GetUserHedgingRuleDetails: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ApiDeck/GetUserHedgingRuleDetails',
   );

   public static readonly GetYearlyExposureDetails: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/Dashboard/GetYearlyExposure',
   );

   public static readonly CreateFxConversionRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/FxAutomation/CreateRule',
    {}
  );

  public static readonly getFxConversionRules: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/FxAutomation/GetRules',
  );

   public static readonly GetRuleConverts: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/FxAutomation/RuleConverts',
   );
  public static readonly FxConversionEnableRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/FxAutomation/EnableRule',
    {}
  );
  public static readonly FxConversionDisableRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/FxAutomation/DisableRule',
    {}
  );
  public static readonly FxConversionDeleteRule: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/FxAutomation/DeleteRule',
    {}
  );

  public static readonly GetHedgeDealsTable: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Dashboard/GetHedgeDealsTable',
    {}
  );
  // edit month exposure API to edit the total amount of exposure for a month
  
  public static readonly EditMonthExposure: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/Dashboard/EditMonthExposure',
    {}
  );
  // get fair value deals
  public static readonly GetFairValueDeal: Request = new HttpRequest<any>(
    'GET',
    environment.baseApiUrl + '/ForwardDeal/GetFairValueDeal',
  );
  // close the particular deal
  public static readonly CloseDeal: Request = new HttpRequest<any>(
    'POST',
    environment.baseApiUrl + '/ForwardDeal/CloseDeal',
    {}
  );
}
