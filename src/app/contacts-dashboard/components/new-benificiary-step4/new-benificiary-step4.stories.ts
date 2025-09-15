import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { NewBenificiaryStep4Component } from './new-benificiary-step4.component';
import { ContactsService } from '../../services/contacts.service';

// Mock ContactsService
class MockContactsService {
    getBankDetailsDynamicFieldPatternsRes = new BehaviorSubject({
        bank_code: '^[0-9]{3}$',
        branch_code: '^[0-9]{3}$',
        iban: '^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$',
        bic_swift: '^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$',
        account_number: '^[0-9]{8,18}$'
    });

    getBankDetailsDynamicFieldRes = new BehaviorSubject({
        displayIban: false,
        displaySwiftCode: true,
        displayAccountNumber: true,
        displayBankNumber: false,
        displayBranchCode: false,
        displaySortCode: false,
        displayBeneficiaryState: true
    });

    getDynamicBankDetailsControls = new BehaviorSubject([
        'iban',
        'swiftCode',
        'accountNumber',
        'bankName'
    ]);

    getStateAndCityRes = new BehaviorSubject({
        stateList: [
            { name: 'California', state_code: 'CA' },
            { name: 'New York', state_code: 'NY' },
            { name: 'Texas', state_code: 'TX' }
        ],
        cityList: ['Los Angeles', 'New York City', 'Houston', 'San Francisco']
    });

    currentInvoiceObject = new BehaviorSubject({});
    beneficiaryCountryChange = new BehaviorSubject(false);

    setBankDetailsSummaryControls(fields: string[]) { }
    setStateAndCityBankDetailspage(data: any) { }
    setIlsBankBranchCodeData(data: any) { }
    setBeneficiaryObject(data: any) { }
    setBeneficiaryFileObject(data: any) { }
}

// Mock MatDialogRef
class MockMatDialogRef {
    close() { }
}

// Mock data
const mockCountryList = [
    { countryCode: 'US', countryName: 'United States', flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/us.svg' },
    { countryCode: 'GB', countryName: 'United Kingdom', flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/gb.svg' },
    { countryCode: 'IL', countryName: 'Israel', flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/il.svg' },
    { countryCode: 'DE', countryName: 'Germany', flag: 'https://okoora-stage-api2023.azurewebsites.net//Images/CountryFlags/de.svg' }
];


const mockPaymentReasons = {
    category1: [
        { paymentReason: 1, name: 'Business Services', documentTypes: ['invoice', 'contract'] },
        { paymentReason: 2, name: 'Investment', documentTypes: ['investment_doc'] }
    ]
};

const meta: Meta<NewBenificiaryStep4Component> = {
    title: 'Contacts/Beneficiary/Step 4: Beneficiary Details',
    component: NewBenificiaryStep4Component,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatSelectModule,
                MatProgressSpinnerModule,
                NgbTooltipModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: ContactsService, useClass: MockContactsService },
                { provide: MatDialogRef, useClass: MockMatDialogRef }
            ]
        })
    ],
    parameters: {
        layout: 'fullscreen'
    },
    argTypes: {
        stepIndex: {
            control: 'number',
            description: 'Current step index in the stepper'
        },
        iseditBenificiary: {
            control: 'boolean',
            description: 'Whether the component is in edit mode'
        },
        // Disable form controls from appearing in Storybook controls
        newBenificiaryStep2: { control: false },
        transactions: { control: false },
        payment: { control: false },
        newBenificiaryBankDetails: { control: false },
        editBenificiaryObj: { control: false },
        countryList: { control: false },
        paymentReasons: { control: false }
    }
};

export default meta;
type Story = StoryObj<NewBenificiaryStep4Component>;

export const Default: Story = {
    render: (args) => {
        const fb = new FormBuilder();
        
        const newBenificiaryStep2 = fb.group({
            beneficiaryCountry: 'US',
            bankCountry: 'US',
            currency: 'USD',
            beneficiaryAccountType: '1',
            IsBeneficiaryBusinessCategoryLegit: 'true'
        });

        const transactions = fb.group({
            paymentReason: 1
        });

        const payment = fb.group({
            invoice: fb.array([])
        });

        const newBenificiaryBankDetails = fb.group({
            iban: ['', [Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$')]],
            swiftCode: ['', [Validators.pattern('^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$')]],
            accountNumber: ['', [Validators.required]],
            bankName: [''],
            bankNumber: [''],
            bankBranch: [''],
            sortCode: [''],
            routingCodeType: [null],
            routingCodeValue: [null],
            bankAccountType: [1],
            bankAccountHolderName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]{2,40}$')]],
            bankAccountHolderHebrewName: [''],
            bankAccountHolderEmail: ['', [Validators.required, Validators.email]],
            bankAccountHolderNickname: [''],
            firstName: [''],
            lastName: [''],
            beneficiaryCity: ['', [Validators.required]],
            beneficiaryState: [''],
            beneficiaryStreet: ['', [Validators.required]],
            beneficiaryHouseNumber: ['', [Validators.required]],
            beneficiaryZipCode: ['', [Validators.required]],
            beneficiaryIdNumber: ['']
        });
        
        return {
            props: {
                stepIndex: 3,
                countryList: mockCountryList,
                paymentReasons: mockPaymentReasons,
                iseditBenificiary: false,
                editBenificiaryObj: {},
                newBenificiaryStep2,
                transactions,
                payment,
                newBenificiaryBankDetails,
                newBenificiaryStep2Values: newBenificiaryStep2.value
            }
        };
    }
};