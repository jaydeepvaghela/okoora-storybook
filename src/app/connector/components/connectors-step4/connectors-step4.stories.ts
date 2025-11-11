// Storybook usage note:
// The correct story ID for this file is 'connectors-step4--exposures-tab'.
// If you see an error about navigation, update your Storybook URL to match the exact story ID.
import { Meta, StoryObj } from '@storybook/angular';
import { ConnectorsStep4Component } from './connectors-step4.component';
import { moduleMetadata } from '@storybook/angular';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConnectorService } from '../../connector.service';
import { CommonService } from '../../../common/services/common.service';
import { FxDashboardService } from '../../../fx-dashboard/services/fx-dashboard.service';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { MatStepper } from '@angular/material/stepper';
import { ChangeDetectorRef } from '@angular/core';
import { of, Observable } from 'rxjs';
import { balanceList } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { getAutomatedHedging } from '../../connectors-data';
import { getConversionRules } from '../../../fx-dashboard/components/fx-dashboard-data/conversionRules';

// Mock Translation Loader


const mockExposureData = [
  {
    user: { displayName: 'ABC Corporation Ltd' },
    hedgeState: 1,
    currency: 'USD',
    total: 75000,
    currencySign: '$',
    dueDate: new Date('2024-12-15'),
    erpRecordId: 'INV-2024-001-ABC',
    recordType: 1,
    isRelatedDeals: true,
    isMissingBeneficiary: false,
    strategyId: 'strategy-001'
  },
  {
    user: { displayName: 'European Suppliers GmbH' },
    hedgeState: 2,
    currency: 'EUR',
    total: 45000,
    currencySign: '€',
    dueDate: new Date('2024-11-28'),
    erpRecordId: 'BILL-2024-002-EUR',
    recordType: 2,
    isRelatedDeals: true,
    isMissingBeneficiary: true,
    strategyId: 'strategy-002'
  },
  {
    user: { displayName: 'UK Trading Partners' },
    hedgeState: 0,
    currency: 'GBP',
    total: 32000,
    currencySign: '£',
    dueDate: new Date('2024-12-05'),
    erpRecordId: 'INV-2024-003-GBP',
    recordType: 1,
    isRelatedDeals: false,
    isMissingBeneficiary: false,
    strategyId: 'strategy-003'
  }
];

const mockRulesData = {
  hedgingBalanceResponse: {
    totalAvailableBalance: 250000,
    totalAvailableBalanceCurrencySign: '$',
    collateralBalance: 45000,
    collateralBalanceCurrencySign: '$',
    requiredCollateral: 38000,
    requiredCollateralCurrencySign: '$',
    unprotectedAmount: 52000,
    unprotectedAmountCurrencySign: '$'
  },
  invoiceBillResponses: {
    allInvoices: getAutomatedHedging?.invoiceBillResponses?.allInvoices
  },
  isMissingFunds: false,
  colletralCurrency: 'USD',
  collateralAmount: 45000,
  missingCollateralAmount: 0
};


export default {
  title: 'Automation/Automation Center',
  component: ConnectorsStep4Component,
  decorators: [
    moduleMetadata({
      imports: [
        MatTableModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgbPaginationModule,
        NgbTooltipModule,
        
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ConnectorService,
          useValue: {
            ruleResponse$: of({ body: mockRulesData }),
            getCurrentRuleIdSubject$: of(''),
            getSelectedExposureType: () => 'invoice',
            setSelectedExposureType: () => {},
            openEditCashflowRules: () => {},
            setCurrentRuleIdSubject: () => {},
          }
        },
        {
          provide: CommonService,
          useValue: {
            getErpFlagsFromClientProfile$: of({ isPayableProtectFilled: true }),
            triggerHeaderMethod: () => {},
          }
        },
        {
          provide: FxDashboardService,
          useValue: {}
        },
        {
          provide: WalletsService,
          useValue: {
            getAllBalanceList: () => of(balanceList)
          }
        },
        {
          provide: MatStepper,
          useValue: {
            selectedIndex: 0,
            next: () => {},
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of(null) })
          }
        },
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: () => {}
          }
        }
      ],
    }),
  ],
} as Meta<ConnectorsStep4Component>;

export const ExposuresTab: StoryObj<ConnectorsStep4Component> = {
  args: {
    selectedTab: 'exposures',
    isAutoProtectEnabled: true,
    loading: false,
    isPayableProtectFilled: true,
    exposureData: mockRulesData,
    rulesData: mockRulesData,
    collectionLength: mockExposureData.length,
    page: 1,
    pageSize: 10,
  },
};

export const ConvertsTab: StoryObj<ConnectorsStep4Component> = {
  args: {
    selectedTab: 'converts',
    isAutoProtectEnabled: true,
    loading: false,
    isPayableProtectFilled: true,
    conversionData: getConversionRules,
    ruleConvertList: getConversionRules,
    convertcollectionLength: getConversionRules.length,
    page: 1,
    pageSize: 10,
  },
};

export const MissingFunds: StoryObj<ConnectorsStep4Component> = {
  args: {
    ...ExposuresTab.args,
    exposureData: {
      ...mockRulesData,
      isMissingFunds: true,
      missingCollateralAmount: 15000
    },
    rulesData: {
      ...mockRulesData,
      isMissingFunds: true,
      missingCollateralAmount: 15000,
      collateralCurrencySign: '$'
    },
  },
};

export const SetupIncomplete: StoryObj<ConnectorsStep4Component> = {
  args: {
    selectedTab: 'exposures',
    isAutoProtectEnabled: true,
    loading: false,
    isPayableProtectFilled: false,
    exposureData: {
      hedgingBalanceResponse: {
        totalAvailableBalance: 0,
        totalAvailableBalanceCurrencySign: '$',
        collateralBalance: 0,
        collateralBalanceCurrencySign: '$',
        requiredCollateral: 0,
        requiredCollateralCurrencySign: '$',
        unprotectedAmount: 0,
        unprotectedAmountCurrencySign: '$'
      },
      invoiceBillResponses: { allInvoices: [] },
      isMissingFunds: false,
      colletralCurrency: 'USD',
      collateralAmount: 0,
      missingCollateralAmount: 0
    },
    rulesData: {
      hedgingBalanceResponse: {
        totalAvailableBalance: 0,
        totalAvailableBalanceCurrencySign: '$',
        collateralBalance: 0,
        collateralBalanceCurrencySign: '$',
        requiredCollateral: 0,
        requiredCollateralCurrencySign: '$',
        unprotectedAmount: 0,
        unprotectedAmountCurrencySign: '$'
      },
      invoiceBillResponses: { allInvoices: [] },
      isMissingFunds: false,
      colletralCurrency: 'USD',
      collateralAmount: 0,
      missingCollateralAmount: 0
    },
    collectionLength: 0,
    page: 1,
    pageSize: 10,
  },
};