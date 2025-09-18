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

export const getBankNumberList = [
    {
        "bank_Code": 1,
        "bank_Name": "ישראכרט בע\"מ ",
        "bank_Name_En": "ISRACARD LTD. "
    },
    {
        "bank_Code": 3,
        "bank_Name": "בנק אש ישראל בע\"מ",
        "bank_Name_En": "Bank Esh Israel Ltd"
    },
    {
        "bank_Code": 4,
        "bank_Name": "בנק יהב לעובדי המדינה בע\"מ",
        "bank_Name_En": "Bank Yahav  for Government Employees Ltd"
    },
    {
        "bank_Code": 10,
        "bank_Name": "בנק לאומי לישראל בע\"מ",
        "bank_Name_En": "Bank Leumi Le-Israel B.M"
    },
    {
        "bank_Code": 11,
        "bank_Name": "בנק דיסקונט לישראל בע\"מ",
        "bank_Name_En": "Israel Discount Bank Ltd"
    },
    {
        "bank_Code": 12,
        "bank_Name": "בנק הפועלים בע\"מ",
        "bank_Name_En": "Bank Hapoalim B.M"
    },
    {
        "bank_Code": 13,
        "bank_Name": "בנק אגוד לישראל בע\"מ",
        "bank_Name_En": "Union Bank of Israel Ltd"
    },
    {
        "bank_Code": 14,
        "bank_Name": "בנק אוצר החייל בע\"מ",
        "bank_Name_En": "Bank Otsar Ha-hayal Ltd"
    },
    {
        "bank_Code": 17,
        "bank_Name": "בנק מרכנתיל דיסקונט בע\"מ",
        "bank_Name_En": "Mercantile Discount Bank ltd"
    },
    {
        "bank_Code": 18,
        "bank_Name": "One  Zero - הבנק הדיגיטלי בע\"מ",
        "bank_Name_En": "One Zero Digital Bank LTD"
    },
    {
        "bank_Code": 20,
        "bank_Name": "בנק מזרחי טפחות בע\"מ",
        "bank_Name_En": "Mizrahi Tefahot Bank Ltd"
    },
    {
        "bank_Code": 22,
        "bank_Name": "Citibank",
        "bank_Name_En": "Citibank"
    },
    {
        "bank_Code": 23,
        "bank_Name": "HSBC",
        "bank_Name_En": "HSBC BANK plc"
    },
    {
        "bank_Code": 26,
        "bank_Name": "יובנק בע\"מ",
        "bank_Name_En": "UBank Ltd"
    },
    {
        "bank_Code": 31,
        "bank_Name": "בנק הבינלאומי הראשון לישראל בע\"מ",
        "bank_Name_En": "The First International Bank of Israel Ltd"
    },
    {
        "bank_Code": 39,
        "bank_Name": "SBI State Bank of India",
        "bank_Name_En": "State Bank Of India"
    },
    {
        "bank_Code": 46,
        "bank_Name": "בנק מסד בע\"מ",
        "bank_Name_En": "Bank Massad Ltd"
    },
    {
        "bank_Code": 50,
        "bank_Name": "מרכז סליקה בנקאי בע\"מ",
        "bank_Name_En": "Bank Clearing Center Ltd"
    },
    {
        "bank_Code": 52,
        "bank_Name": "בנק פועלי אגודת ישראל בע\"מ",
        "bank_Name_En": "Poaley Agudat Israel Bank Ltd"
    },
    {
        "bank_Code": 54,
        "bank_Name": "בנק ירושלים בע\"מ",
        "bank_Name_En": "Bank of Jerusalem Ltd"
    },
    {
        "bank_Code": 59,
        "bank_Name": "שירותי בנק אוטומטיים",
        "bank_Name_En": "Automated Banking Services"
    },
    {
        "bank_Code": 99,
        "bank_Name": "בנק ישראל",
        "bank_Name_En": "Bank Of Israel"
    }
]

export const getBranchNumberList = [
    {
        "branch_Code": 488,
        "branch_Name": "משכנות האומה"
    },
    {
        "branch_Code": 497,
        "branch_Name": "פסגת זאב"
    },
    {
        "branch_Code": 233,
        "branch_Name": "רמב\"ם"
    },
    {
        "branch_Code": 140,
        "branch_Name": "חיפה"
    },
    {
        "branch_Code": 311,
        "branch_Name": "כרמל"
    },
    {
        "branch_Code": 193,
        "branch_Name": "מעלה אדומים"
    },
    {
        "branch_Code": 141,
        "branch_Name": "נהרייה"
    },
    {
        "branch_Code": 279,
        "branch_Name": "קריית ביאליק"
    },
    {
        "branch_Code": 133,
        "branch_Name": "נתניה"
    },
    {
        "branch_Code": 114,
        "branch_Name": "אשדוד"
    },
    {
        "branch_Code": 121,
        "branch_Name": "קדם"
    },
    {
        "branch_Code": 123,
        "branch_Name": "בית יהב"
    },
    {
        "branch_Code": 129,
        "branch_Name": "כנפי נשרים"
    },
    {
        "branch_Code": 120,
        "branch_Name": "ראשי ירושלים"
    },
    {
        "branch_Code": 280,
        "branch_Name": "כרמיאל"
    },
    {
        "branch_Code": 142,
        "branch_Name": "נוף הגליל"
    },
    {
        "branch_Code": 281,
        "branch_Name": "אילת"
    },
    {
        "branch_Code": 461,
        "branch_Name": "בית שמש"
    },
    {
        "branch_Code": 236,
        "branch_Name": "גלילות"
    },
    {
        "branch_Code": 278,
        "branch_Name": "סניף רחובות"
    },
    {
        "branch_Code": 118,
        "branch_Name": "כפר סבא"
    },
    {
        "branch_Code": 125,
        "branch_Name": "אשקלון"
    },
    {
        "branch_Code": 134,
        "branch_Name": "נתב\"ג"
    },
    {
        "branch_Code": 245,
        "branch_Name": "עפולה"
    },
    {
        "branch_Code": 119,
        "branch_Name": "פתח תקווה"
    },
    {
        "branch_Code": 136,
        "branch_Name": "ראשון לציון"
    },
    {
        "branch_Code": 430,
        "branch_Name": "לב ראשון"
    },
    {
        "branch_Code": 116,
        "branch_Name": "מודיעין"
    },
    {
        "branch_Code": 137,
        "branch_Name": "אסף הרופא"
    },
    {
        "branch_Code": 145,
        "branch_Name": "קרנות השתלמות"
    },
    {
        "branch_Code": 146,
        "branch_Name": "תוכניות חסכון"
    },
    {
        "branch_Code": 148,
        "branch_Name": "אשראי"
    },
    {
        "branch_Code": 149,
        "branch_Name": "הנהלה ראשית"
    },
    {
        "branch_Code": 126,
        "branch_Name": "מוקד טלפוני יהב ישיר"
    },
    {
        "branch_Code": 110,
        "branch_Name": "מרכז תפעול עורפי*-מרחב צפון"
    },
    {
        "branch_Code": 111,
        "branch_Name": "מרכז תפעול עורפי*-מרחב מרכז"
    },
    {
        "branch_Code": 112,
        "branch_Name": "מרכז תפעול עורפי-מרחב ירושלים"
    },
    {
        "branch_Code": 113,
        "branch_Name": "מרכז תפעול עורפי  מרחב דרום"
    },
    {
        "branch_Code": 44,
        "branch_Name": "הלל יפה חדרה"
    },
    {
        "branch_Code": 135,
        "branch_Name": "סניפון וולפסון- חולון"
    },
    {
        "branch_Code": 207,
        "branch_Name": "קרית אתא"
    },
    {
        "branch_Code": 195,
        "branch_Name": "איכלוב"
    },
    {
        "branch_Code": 115,
        "branch_Name": "קריית הממשלה ת\"א - מגדל היובל"
    },
    {
        "branch_Code": 725,
        "branch_Name": "יקנעם עילית"
    },
    {
        "branch_Code": 203,
        "branch_Name": "נתיבות"
    },
    {
        "branch_Code": 204,
        "branch_Name": "תלפיות"
    },
    {
        "branch_Code": 201,
        "branch_Name": "שלוחה בהדסה"
    },
    {
        "branch_Code": 7,
        "branch_Name": "מלחה ירושלים"
    },
    {
        "branch_Code": 824,
        "branch_Name": "שדרות"
    },
    {
        "branch_Code": 144,
        "branch_Name": "אוניברסיטת חיפה"
    },
    {
        "branch_Code": 150,
        "branch_Name": "באר יעקב"
    },
    {
        "branch_Code": 128,
        "branch_Name": "קריית גת"
    },
    {
        "branch_Code": 206,
        "branch_Name": "ראש העין"
    },
    {
        "branch_Code": 825,
        "branch_Name": "מגדל העמק"
    },
    {
        "branch_Code": 171,
        "branch_Name": "בת ים"
    },
    {
        "branch_Code": 138,
        "branch_Name": "חדרה"
    },
    {
        "branch_Code": 284,
        "branch_Name": "חולון"
    },
    {
        "branch_Code": 246,
        "branch_Name": "סניף טבריה"
    },
    {
        "branch_Code": 124,
        "branch_Name": "באר שבע"
    },
    {
        "branch_Code": 117,
        "branch_Name": "מרכז הנגב"
    },
    {
        "branch_Code": 205,
        "branch_Name": "דימונה"
    },
    {
        "branch_Code": 202,
        "branch_Name": "דלית אל כרמל"
    },
    {
        "branch_Code": 130,
        "branch_Name": "רוטשילד"
    },
    {
        "branch_Code": 131,
        "branch_Name": "הקריה  תל אביב"
    },
    {
        "branch_Code": 132,
        "branch_Name": "תל השומר"
    },
    {
        "branch_Code": 401,
        "branch_Name": "רמת גן"
    }
]