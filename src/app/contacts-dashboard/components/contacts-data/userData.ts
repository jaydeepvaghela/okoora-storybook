export const user = {
    id: 4166,
    accountId: "c2213112-f2ef-4202-9f6a-db147e95b6c0",
    fullName: "dsfs dfgdfg",
    stampId: "f5253dc2-f00a-43af-a6db-3cc8fca41974",
    company: "kecccgim",
    type: "Business",
    companyName: "kecccgim",
    email: "bapojo9783@polatrix.com",
    mobile: "0545454545",
    role: 1,
    eligible: 1,
    plan: {
      planName: "Prime",
      startDate: "19/08/2024",
      endDate: "19/08/2025",
      duration: 2
    },
    limitsDisclaimerApproval: false,
    activateStatus: 2,
    kycStatus: 3,
    kycRenewDateDeadline: "2026-08-21T09:18:48.213",
    primaryAccount: true,
    displayWalkMe: {
      welcome: {
        dontShowAgain: false,
        reachedMaxCount: true,
        maxDisplay: 2,
        dispayedCount: 6088
      },
      wallet: {
        dontShowAgain: false,
        reachedMaxCount: true,
        maxDisplay: 2,
        dispayedCount: 39
      }
    },
    afiiliate: {
      country: "il",
      currency: "ILS"
    },
    openGlobalAccount: true,
    activatePurchasePreKyc: false,
    riskLevel: {
      levelName: "",
      type: "A"
    },
    isAuthorizedForWebApi: false,
    sourceAccount: null,
    isAutomatedHedging: true,
    isPayableProtectFilled: true,
    isERPConnected: 1,
    exposureType: "invoice"
  };

export const GetBeneficiaryBankRequirements = {
    beneficiary_state_or_province: "^.{1,255}$",
    beneficiary_postcode: "^.{1,12}$",
    account_number: "^[0-9A-Z]{1,17}$",
    aba: "^\\d{9}$",
    bic_swift: "^[0-9A-Z]{8}$|^[0-9A-Z]{11}$"
}

export const bicSwiftDetails = {
    "bic": "SULCUS62XXX",
    "bic8": "SULCUS62",
    "bicBranch": "XXX",
    "institution": "FINANCIAL",
    "name": "INCAPITAL LLC",
    "branchName": "",
    "office": "HEAD OFFICE",
    "address": "200 S. WACKER DRIVE SUITE 3400",
    "city": "CHICAGO,IL",
    "zip": "60606",
    "countryName": "UNITED STATES OF AMERICA",
    "isoCountryCode": "US"
}

export const getStateAndCityRes = {
    "stateList": [
        {
            "name": "Alabama",
            "state_code": "AL"
        },
        {
            "name": "Alaska",
            "state_code": "AK"
        },
        {
            "name": "Arizona",
            "state_code": "AZ"
        },
        {
            "name": "Arkansas",
            "state_code": "AR"
        },
        {
            "name": "California",
            "state_code": "CA"
        },
        {
            "name": "Colorado",
            "state_code": "CO"
        },
        {
            "name": "Connecticut",
            "state_code": "CT"
        },
        {
            "name": "Delaware",
            "state_code": "DE"
        },
        {
            "name": "Florida",
            "state_code": "FL"
        },
        {
            "name": "Georgia",
            "state_code": "GA"
        },
        {
            "name": "Hawaii",
            "state_code": "HI"
        },
        {
            "name": "Idaho",
            "state_code": "ID"
        }
    ],
    "cityList": []
}