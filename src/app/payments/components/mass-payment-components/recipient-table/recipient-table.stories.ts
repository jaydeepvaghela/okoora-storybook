import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RecipientTableComponent } from './recipient-table.component';
import { SelectRecipientComponent } from '../select-recipient/select-recipient.component';
import { TransferTypeComponent } from '../transfer-type/transfer-type.component';
import { InitialRenderComponent } from '../initial-render/initial-render.component';

const approvedBeneficiaries = [
    {
        "id": "f4297563-061c-4179-9f9d-063d0261dd23",
        "status": 2,
        "bankAccountHolderEmail": "bebiyij325@cironex.com",
        "bankAccountHolderName": "Goha",
        "bankAccountHolderNickname": null,
        "firstName": null,
        "lastName": null,
        "bankAccountHolderHebrewName": null,
        "beneficiaryIdNumber": "52154564",
        "beneficiaryCountry": "il",
        "beneficiaryState": null,
        "beneficiaryCity": "Petah Tikva",
        "beneficiaryStreet": null,
        "beneficiaryHouseNumber": null,
        "beneficiaryZipCode": "65256541",
        "bankFlag": "https://okoora-stage-api2023.azurewebsites.net/Images/BanksFlags/3.svg",
        "currencyISO": {
            "code": "ILS",
            "sign": "₪",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
            "currencyName": null
        },
        "currency": "ILS",
        "paymentReason": 18,
        "reasonDesc": null,
        "bankCountry": "IL",
        "bankName": "Bank Esh Israel LTD",
        "bankAddress": null,
        "bankNumber": "3",
        "bankBranch": "1",
        "iban": "IL960030010001324654654",
        "swiftCode": "EIETILITXXX",
        "accountNumber": "1324654654",
        "bankAccountType": 3,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": 1,
        "beneficiaryFiles": [],
        "updatedAt": "2025-05-13T09:10:54.493",
        "companyName": null,
        "createdAt": "2025-05-13T09:10:54.493",
        "deductionNum": null,
        "beneficiaryStateResidenceRecipient": null,
        "aba": null,
        "beneficiaryAddress": "Petah Tikva,  65256541",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": false,
        "relatedPayments": true
    },
    {
        "id": "872172a9-7402-494f-bda2-0fa796cda7ad",
        "status": 1,
        "bankAccountHolderEmail": "signupbusitest@yopmail.com",
        "bankAccountHolderName": "test desc bene",
        "bankAccountHolderNickname": "",
        "firstName": "isltest",
        "lastName": "busi",
        "bankAccountHolderHebrewName": "",
        "beneficiaryIdNumber": null,
        "beneficiaryCountry": "dz",
        "beneficiaryState": "",
        "beneficiaryCity": "test",
        "beneficiaryStreet": "ertetert",
        "beneficiaryHouseNumber": "56564",
        "beneficiaryZipCode": "123456",
        "bankFlag": null,
        "currencyISO": {
            "code": "AUD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/AUD.png",
            "currencyName": null
        },
        "currency": "AUD",
        "paymentReason": 999,
        "reasonDesc": "test desc",
        "bankCountry": "dz",
        "bankName": "SOCIETE GENERALE ALGERIE",
        "bankAddress": null,
        "bankNumber": "",
        "bankBranch": "",
        "iban": "DZ580002100001113000000570",
        "swiftCode": "SOGEDZALXXX",
        "accountNumber": "113000000570",
        "bankAccountType": 1,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": null,
        "beneficiaryFiles": [],
        "updatedAt": "2025-06-05T11:42:23.04",
        "companyName": null,
        "createdAt": "2025-06-05T11:42:16.813",
        "deductionNum": null,
        "beneficiaryStateResidenceRecipient": null,
        "aba": "",
        "beneficiaryAddress": "ertetert 56564, test,  123456",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": true,
        "relatedPayments": false
    },
    {
        "id": "23afa179-3fe7-42da-90b2-130565998baf",
        "status": 1,
        "bankAccountHolderEmail": "wabisi2070@botsoko.com",
        "bankAccountHolderName": "Us Holder Acc",
        "bankAccountHolderNickname": "",
        "firstName": "First",
        "lastName": "last",
        "bankAccountHolderHebrewName": "",
        "beneficiaryIdNumber": null,
        "beneficiaryCountry": "us",
        "beneficiaryState": "Alaska",
        "beneficiaryCity": "Aleutians West Census Area",
        "beneficiaryStreet": "test",
        "beneficiaryHouseNumber": "123456",
        "beneficiaryZipCode": "236",
        "bankFlag": null,
        "currencyISO": {
            "code": "USD",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/USD.png",
            "currencyName": null
        },
        "currency": "USD",
        "paymentReason": 20,
        "reasonDesc": null,
        "bankCountry": "us",
        "bankName": "",
        "bankAddress": null,
        "bankNumber": "",
        "bankBranch": "",
        "iban": "",
        "swiftCode": "",
        "accountNumber": "00012345864",
        "bankAccountType": 2,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": null,
        "beneficiaryFiles": [
            {
                "docType": 1,
                "fileId": "24dfc7ff-268a-4595-a10d-07bf3c4d4b56"
            },
            {
                "docType": 11,
                "fileId": "d0dde7c2-7c6b-4312-b184-447debe3b680"
            },
            {
                "docType": 11,
                "fileId": "2ad65017-8660-4ed9-9ade-3997cefdc3c7"
            },
            {
                "docType": 11,
                "fileId": "f5cfd56f-2ccd-432c-ae9e-bc8375b70809"
            },
            {
                "docType": 11,
                "fileId": "b0f5ff6b-d113-41d9-9aa2-caf42fdc0f7f"
            }
        ],
        "updatedAt": "2025-04-30T10:32:43.507",
        "companyName": null,
        "createdAt": "2025-04-30T10:32:35.92",
        "deductionNum": "",
        "beneficiaryStateResidenceRecipient": "",
        "aba": "132465789",
        "beneficiaryAddress": "test 123456, Aleutians West Census Area, Alaska 236",
        "routingCodeType": 6,
        "routingCodeValue": "132465789",
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": true,
        "relatedPayments": false
    },
    {
        "id": "0ff43722-4a26-496b-82a5-19a3e1a99240",
        "status": 1,
        "bankAccountHolderEmail": "bebiyij325@cironex.com",
        "bankAccountHolderName": "Goha",
        "bankAccountHolderNickname": "",
        "firstName": "",
        "lastName": "",
        "bankAccountHolderHebrewName": "אקאאגיטאייעכיגכ",
        "beneficiaryIdNumber": "455555555",
        "beneficiaryCountry": "il",
        "beneficiaryState": "",
        "beneficiaryCity": "",
        "beneficiaryStreet": "",
        "beneficiaryHouseNumber": "",
        "beneficiaryZipCode": "",
        "bankFlag": "https://okoora-stage-api2023.azurewebsites.net/Images/BanksFlags/12.svg",
        "currencyISO": {
            "code": "ILS",
            "sign": "₪",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
            "currencyName": null
        },
        "currency": "ILS",
        "paymentReason": 18,
        "reasonDesc": null,
        "bankCountry": "il",
        "bankName": "",
        "bankAddress": null,
        "bankNumber": "12",
        "bankBranch": "202",
        "iban": "",
        "swiftCode": "",
        "accountNumber": "66666",
        "bankAccountType": 3,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": null,
        "beneficiaryFiles": [],
        "updatedAt": "2025-04-11T15:54:17.017",
        "companyName": null,
        "createdAt": "2025-02-20T15:09:37.29",
        "deductionNum": null,
        "beneficiaryStateResidenceRecipient": null,
        "aba": "",
        "beneficiaryAddress": " , ,  ",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": false,
        "relatedPayments": true
    },
    {
        "id": "54518c61-69f5-4a21-b28a-22398646998b",
        "status": 2,
        "bankAccountHolderEmail": "bebiyij325@cironex.com",
        "bankAccountHolderName": "Goha",
        "bankAccountHolderNickname": null,
        "firstName": null,
        "lastName": null,
        "bankAccountHolderHebrewName": null,
        "beneficiaryIdNumber": "52154564",
        "beneficiaryCountry": "il",
        "beneficiaryState": null,
        "beneficiaryCity": "Petah Tikva",
        "beneficiaryStreet": null,
        "beneficiaryHouseNumber": null,
        "beneficiaryZipCode": "65256541",
        "bankFlag": "https://okoora-stage-api2023.azurewebsites.net/Images/BanksFlags/12.svg",
        "currencyISO": {
            "code": "ILS",
            "sign": "₪",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
            "currencyName": null
        },
        "currency": "ILS",
        "paymentReason": 18,
        "reasonDesc": null,
        "bankCountry": "IL",
        "bankName": "Bank Hapoalim B.M",
        "bankAddress": null,
        "bankNumber": "12",
        "bankBranch": "11",
        "iban": "IL150120110000000066666",
        "swiftCode": "POALILIT",
        "accountNumber": "66666",
        "bankAccountType": 3,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": 1,
        "beneficiaryFiles": [],
        "updatedAt": "2025-02-11T11:34:10.54",
        "companyName": null,
        "createdAt": "2025-02-11T11:34:10.54",
        "deductionNum": null,
        "beneficiaryStateResidenceRecipient": null,
        "aba": null,
        "beneficiaryAddress": "Petah Tikva,  65256541",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": false,
        "relatedPayments": true
    },
    {
        "id": "08176388-0af7-4905-a5a1-4788ec843e75",
        "status": 1,
        "bankAccountHolderEmail": "test@gmail.com",
        "bankAccountHolderName": "todas",
        "bankAccountHolderNickname": "",
        "firstName": "thjm",
        "lastName": "wyf",
        "bankAccountHolderHebrewName": "",
        "beneficiaryIdNumber": null,
        "beneficiaryCountry": "al",
        "beneficiaryState": "",
        "beneficiaryCity": "hsv",
        "beneficiaryStreet": "hcwygs",
        "beneficiaryHouseNumber": "415617",
        "beneficiaryZipCode": "4167",
        "bankFlag": null,
        "currencyISO": {
            "code": "RON",
            "sign": "RON",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/RON.png",
            "currencyName": null
        },
        "currency": "RON",
        "paymentReason": 999,
        "reasonDesc": "today",
        "bankCountry": "dz",
        "bankName": "SOCIETE GENERALE ALGERIE",
        "bankAddress": null,
        "bankNumber": "",
        "bankBranch": "",
        "iban": "DZ580002100001113000000570",
        "swiftCode": "SOGEDZALXXX",
        "accountNumber": "113000000570",
        "bankAccountType": 1,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": null,
        "beneficiaryFiles": [],
        "updatedAt": "2025-06-05T13:23:37.167",
        "companyName": null,
        "createdAt": "2025-06-05T13:01:42.21",
        "deductionNum": "",
        "beneficiaryStateResidenceRecipient": "al",
        "aba": "",
        "beneficiaryAddress": "hcwygs 415617, hsv,  4167",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": true,
        "relatedPayments": false
    },
    {
        "id": "059f317c-a698-4b6c-ba97-66c1a76cba1a",
        "status": 1,
        "bankAccountHolderEmail": "bebiyij325@cironex.com",
        "bankAccountHolderName": "Goha",
        "bankAccountHolderNickname": "",
        "firstName": "",
        "lastName": "",
        "bankAccountHolderHebrewName": "אקאאג",
        "beneficiaryIdNumber": "521545644",
        "beneficiaryCountry": "il",
        "beneficiaryState": "",
        "beneficiaryCity": "",
        "beneficiaryStreet": "",
        "beneficiaryHouseNumber": "",
        "beneficiaryZipCode": "",
        "bankFlag": "https://okoora-stage-api2023.azurewebsites.net/Images/BanksFlags/12.svg",
        "currencyISO": {
            "code": "ILS",
            "sign": "₪",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
            "currencyName": null
        },
        "currency": "ILS",
        "paymentReason": 18,
        "reasonDesc": null,
        "bankCountry": "il",
        "bankName": "",
        "bankAddress": null,
        "bankNumber": "12",
        "bankBranch": "774",
        "iban": "",
        "swiftCode": "",
        "accountNumber": "66666",
        "bankAccountType": 3,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": null,
        "beneficiaryFiles": [],
        "updatedAt": "2025-04-11T12:38:57.187",
        "companyName": null,
        "createdAt": "2025-03-20T06:52:00.927",
        "deductionNum": null,
        "beneficiaryStateResidenceRecipient": null,
        "aba": "",
        "beneficiaryAddress": " , ,  ",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": false,
        "relatedPayments": true
    },
    {
        "id": "fe25637b-e62a-4988-8b28-696601abaaed",
        "status": 1,
        "bankAccountHolderEmail": "aadil.cmarix@gmail.com",
        "bankAccountHolderName": "Mexico Acc",
        "bankAccountHolderNickname": "",
        "firstName": "jhon",
        "lastName": "doe",
        "bankAccountHolderHebrewName": "",
        "beneficiaryIdNumber": null,
        "beneficiaryCountry": "mx",
        "beneficiaryState": "Baja California Sur",
        "beneficiaryCity": "Cabo San Lucas",
        "beneficiaryStreet": "test",
        "beneficiaryHouseNumber": "123",
        "beneficiaryZipCode": "56",
        "bankFlag": null,
        "currencyISO": {
            "code": "MXN",
            "sign": "$",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/MXN.png",
            "currencyName": null
        },
        "currency": "MXN",
        "paymentReason": 10,
        "reasonDesc": null,
        "bankCountry": "mx",
        "bankName": "BBVA MEXICO S.A.",
        "bankAddress": null,
        "bankNumber": "",
        "bankBranch": "",
        "iban": "",
        "swiftCode": "BCMRMXMMPYM",
        "accountNumber": "113000000570",
        "bankAccountType": 2,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": null,
        "beneficiaryFiles": [
            {
                "docType": 1,
                "fileId": "aa7869de-c1d2-4342-b717-59d15d663b11"
            },
            {
                "docType": 2,
                "fileId": "f015b6bc-2390-4c86-b494-9db71782fb9a"
            }
        ],
        "updatedAt": "2025-05-02T12:41:03.393",
        "companyName": null,
        "createdAt": "2025-04-30T10:34:16.587",
        "deductionNum": "",
        "beneficiaryStateResidenceRecipient": "",
        "aba": "",
        "beneficiaryAddress": "test 123, Cabo San Lucas, Baja California Sur 56",
        "routingCodeType": 4,
        "routingCodeValue": "101546446545645645",
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": true,
        "relatedPayments": false
    },
    {
        "id": "1f7f51f0-8fd2-43b0-8ed1-6a8eea16cd96",
        "status": 2,
        "bankAccountHolderEmail": "bebiyij325@cironex.com",
        "bankAccountHolderName": "Goha",
        "bankAccountHolderNickname": null,
        "firstName": null,
        "lastName": null,
        "bankAccountHolderHebrewName": null,
        "beneficiaryIdNumber": "52154564",
        "beneficiaryCountry": "il",
        "beneficiaryState": null,
        "beneficiaryCity": "Petah Tikva",
        "beneficiaryStreet": null,
        "beneficiaryHouseNumber": null,
        "beneficiaryZipCode": "65256541",
        "bankFlag": "https://okoora-stage-api2023.azurewebsites.net/Images/BanksFlags/13.svg",
        "currencyISO": {
            "code": "ILS",
            "sign": "₪",
            "flag": "https://okoora-stage-api2023.azurewebsites.net/Images/Flags/ILS.png",
            "currencyName": null
        },
        "currency": "ILS",
        "paymentReason": 18,
        "reasonDesc": null,
        "bankCountry": "IL",
        "bankName": "Union Bank of Israel Ltd",
        "bankAddress": null,
        "bankNumber": "13",
        "bankBranch": "64",
        "iban": "IL080130640000000123456",
        "swiftCode": "UNBKILIT",
        "accountNumber": "123456",
        "bankAccountType": 3,
        "beneficiaryAccountType": 2,
        "paymentTerms": null,
        "ownAccount": 1,
        "beneficiaryFiles": [],
        "updatedAt": "2025-05-13T10:01:41.063",
        "companyName": null,
        "createdAt": "2025-05-13T10:01:41.063",
        "deductionNum": null,
        "beneficiaryStateResidenceRecipient": null,
        "aba": null,
        "beneficiaryAddress": "Petah Tikva,  65256541",
        "routingCodeType": null,
        "routingCodeValue": null,
        "erpBeneficiaryId": null,
        "erpService": null,
        "isBeneficiaryBusinessCategoryLegit": false,
        "relatedPayments": true
    },
];

const selectedWallet = {
    wallet_Currency: {
        code: 'USD',
        sign: '$'
    }
};

const mockWalletsService = {
    currentImportMassPaymentFile: of({}),
    mockCreatePaymentRequest: () => of({
        requestId: 'f4297563-061c-4179-9f9d-063d0261dd23',
        status: true,
        message: "Create Payment Request Successfully",
        paymentRequst: {
            quoteId: 'f4297563-061c-4179-9f9d-063d0261dd23',
            spot: 0.4817,
            exchangeRate: {
                major: {
                    rate: 1.0,
                    currency: {
                        code: 'ILS',
                        sign: "₪",
                        flag: null,
                        currencyName: null
                    }
                },
                minor: {
                    rate: 0.4817,
                    currency: {
                        code: "ILS",
                        sign: "₪",
                        flag: null,
                        currencyName: null
                    }
                }
            },
            charge: 43.58,
            chargeCurrency: 'ILS',
            send: 21,
            sendCurrency: "ILS",
            paymentType: 1,
            costType: {
                key: null,
                value: 0.0
            }
        },
        costList: [
            {
                key: "1 - regular",
                value: 0.0
            },
            {
                key: "2 - our",
                value: Number((21 * 1.02).toFixed(2))
            }
        ],
        signAndFiles: {
            needSign: false,
            needFile: false,
            needStamp: false
        }
    })

};

const meta: Meta<RecipientTableComponent> = {
    title: 'Payments/Payment Dashboard/Payments/Mass Payment/Recipient Table',
    component: RecipientTableComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatDialogModule,
                MatTooltipModule,
                MatProgressBarModule,
                InitialRenderComponent,
                TransferTypeComponent,
                SelectRecipientComponent,
            ],
            providers: [
                { provide: 'WalletsService', useValue: mockWalletsService },
            ],
        }),
    ],
    args: {
        approvedBeneficiaries,
        selectedWallet,
        isAddRecipient: false,
        beneficiaryForms: [],
        addMoreRecipients: false,
    },
};

export default meta;
type Story = StoryObj<RecipientTableComponent>;

export const Default: Story = {
    render: (args) => ({
        props: args,
    }),
};

export const InitialRender: Story = {
    render: (args) => ({
        props: args,
    }),
    args: {
        approvedBeneficiaries: [],
        selectedWallet: {
            wallet_Currency: {
                code: '',
                sign: ''
            }
        },
        isAddRecipient: true,
        beneficiaryForms: [],
        addMoreRecipients: false,
    }
};
