// manage-hedge-deals.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

import { ManageHedgeDealsComponent } from './manage-hedge-deals.component';
import { DealStatusType } from '../../enums/manageHeadging';
import { MatExpansionModule } from '@angular/material/expansion';
import { hedgeDealTable } from '../fx-dashboard-data/hedgeDealTable';

// Mock WalletsService
class MockWalletsService {
  availableWalletsData = of([
    { 
      wallet_Id: 1, 
      wallet_IsBaseCurency: true, 
      wallet_Currency: { code: 'USD' } 
    }
  ]);
  
  setCurrentCurrencyData(_: any) {}
}

// Mock ChangeDetectorRef
class MockChangeDetectorRef {
  detectChanges() {}
  markForCheck() {}
  detach() {}
  reattach() {}
  checkNoChanges() {}
}

const meta: Meta<ManageHedgeDealsComponent> = {
  title: 'FX-Dashboard/ManageHedgeDeals',
  component: ManageHedgeDealsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatSelectModule,
        NgbPaginationModule,
        MatExpansionModule
    ],
      providers: [
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'WalletsService', useClass: MockWalletsService },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Component to manage hedge deals with table, search, filter, pagination, CSV export, and actions.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ManageHedgeDealsComponent>;

// Create a mock enum to map dealStatus numbers to string values
const MockDealStatusType = {
  1: 'Expired',
  2: 'Open',
  3: 'Early Termination',
  4: 'Deliver',
  5: 'Settle',
  6: 'Delete',
  7: 'Close',
};

// Ensure the `dealStatus` column is properly defined in the table configuration
const displayedColumns = [
  'id', 'tradeDate', 'dealType', 'callPutType', 'pair', 'strike', 'amount', 'isOnline', 'expiryDate', 'hedgeStatus', 'isProfit', 'canCloseDeal'
];

// Ensure the first page loads correctly with hedge status and accordion functionality
export const Default: Story = {
  render: (args) => {
    const dataSource = new MatTableDataSource(hedgeDealTable);
    dataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'hedgeStatus':
          return MockDealStatusType[item.mainHedgeDealDto?.dealStatus as keyof typeof MockDealStatusType] || '';
        default:
          return item[property] || '';
      }
    };

    dataSource.filterPredicate = (data: any, filter: string): boolean => {
      filter = filter.trim().toLowerCase();
      const values = [
        MockDealStatusType[data.mainHedgeDealDto?.dealStatus as keyof typeof MockDealStatusType],
        data.mainHedgeDealDto?.tradeDate,
        data.mainHedgeDealDto?.pair,
      ];
      return values.some(val => val?.toString().toLowerCase().includes(filter));
    };

    return {
      props: {
        ...args,
        dataSource,
        displayedColumns, // Pass displayedColumns
        searchText: '', // Ensure searchText is compatible with filtering
      },
    };
  },
  args: {
    searchText: '',
  },
};

export const EmptyState: Story = {
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div style="padding: 20px;">
        <app-manage-hedge-deals></app-manage-hedge-deals>
      </div>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Wait for component initialization', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    await step('Set empty data', async () => {
      // This would require modifying the component to accept input data
      // For now, we'll simulate a search that returns no results
      const searchInput = canvasElement.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = 'NONEXISTENT';
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  },
};