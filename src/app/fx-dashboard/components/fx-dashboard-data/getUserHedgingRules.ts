

export const getUserHedgingRules = [
    {
        "id": "d298525c-a984-4ca5-aaf2-2dcd1d106654",
        "accountId": "c2213112-f2ef-4202-9f6a-db147e95b6c0",
        "importExosureType": "cashflow",
        "invoiceBillMinExposureAmount": 1,
        "invoiceBillMaxExposureAmount": 200000000.00,
        "invoiceBillMaxDuePeriod": "3 Months",
        "invoiceBillCurrencies": [
            "ILS",
            "GBP",
            "PLN",
            "USD",
            "JPY"
        ],
        "invoiceBillBlacklist": [
            {
                "counterpartyId": "ebc53106-9026-44f4-934d-db83569d2ccf",
                "counterpartyType": "customers",
                "counterpartyName": "test"
            },
            {
                "counterpartyId": "46ddf536-419a-4090-8797-650b48f106fe",
                "counterpartyType": "customers",
                "counterpartyName": "testuser"
            }
        ],
        "cashflowMinExposureAmount": null,
        "cashflowMaxExposureAmount": null,
        "cashflowMaxDuePeriod": null,
        "cashflowCurrencies": [],
        "ruleType": "Invoice",
        "createdAt": "2025-09-18T11:27:20.0483362",
        "updatedAt": "2025-09-22T06:55:33.4579997",
        "isFromCashFlowAPI": false,
        "directionType": 3
    },
    {
        "id": "7e29d8ef-c4a8-4833-b384-3f8d5185c1a1",
        "accountId": "c2213112-f2ef-4202-9f6a-db147e95b6c0",
        "importExosureType": "cashflow",
        "invoiceBillMinExposureAmount": null,
        "invoiceBillMaxExposureAmount": null,
        "invoiceBillMaxDuePeriod": null,
        "invoiceBillCurrencies": [],
        "invoiceBillBlacklist": [],
        "cashflowMinExposureAmount": 5572,
        "cashflowMaxExposureAmount": 74320,
        "cashflowMaxDuePeriod": "1 Month",
        "cashflowCurrencies": [
            "GBP",
            "CHF",
            "JPY"
        ],
        "ruleType": "Cashflow",
        "createdAt": "2025-09-18T11:27:20.0649947",
        "updatedAt": "2025-09-18T11:27:20.0649951",
        "isFromCashFlowAPI": true,
        "directionType": 3
    }
]