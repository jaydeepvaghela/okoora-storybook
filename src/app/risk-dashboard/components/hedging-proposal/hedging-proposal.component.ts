import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChildren, QueryList, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import moment from 'moment';
import { Subscription, take, tap, timer } from 'rxjs';
import { HedgingType } from '../enums/hedgingData';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
export interface PeriodicElement {
  disabledColumn: boolean;
  hedgeRate: number;
  protectAmount: number;
  date?: Date;
  expiryDate?: any;
  month?: string;
  year?: number;
  dayOfExpiry?: string;
  Month?: string;
  openEditForSelling?: boolean;
  collateral?: number;
  saveActivate?: boolean;
  maxHedgeAmount?: number;
  strategyId?: number;
  hedge?: any;
  alreadyHedge?: any;
  status?: any
  requiredCollateral?: any;
}
@Component({
  selector: 'app-hedging-proposal',
  imports: [CommonModule, MatInputModule,MatDatepickerModule,MatMomentDateModule,MatSliderModule, MatSelectModule, MatCheckboxModule, MatIconModule, MatTableModule, FormsModule],
  templateUrl: './hedging-proposal.component.html',
  styleUrl: './hedging-proposal.component.scss'
})
export class HedgingProposalComponent implements AfterViewInit {
  @ViewChildren(MatDatepicker) datepickers!: QueryList<MatDatepicker<any>>;
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('slider') slider!: ElementRef;
  selectedHedgeData!: PeriodicElement;
  displayedColumns: string[] = ['select', 'expiryDate', 'hedgeRate', 'setHedgeAmount', 'hedgeAmount', 'hedged'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, this.dataSource.data);
  openEditSellingIndex: number | null = null;
  hedgeAmountForEdit: any;
  hedgeDetails: any = {
    "totalHedgeAmount": 161.10,
    "hedgeCurrency": {
      "code": "CHF",
      "sign": "CHF",
      "flag": null,
      "currencyName": null
    },
    "totalHedgePercent": 33.5625,
    "avgHedgeRate": 4.3747526315789473684210526316,
    "liabilityRate": 4.3747526315789473684210526316,
    "requiredCollateral": 67.637,
    "price": 0.0,
    "collateralAndPriceCur": {
      "code": "ILS",
      "sign": "₪",
      "flag": null,
      "currencyName": null
    },
    "direction": 2,
    "currencyPair": "CHF/ILS",
    "hedgingType": 1,
    "monthlyHedge": [
      {
        "status": {
          "type": 3,
          "descriprion": "Don't need to create hedge for zero reccomended hedge"
        },
        "maxHedgeAmount": 5.00,
        "recomendedHedgeAmount": 0.00,
        "hedge": null,
        "totalExposure": 5.00,
        "alreadyHedge": 0.0,
        "date": "15/06/2025",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 10.50,
        "hedge": {
          "strategyId": 132575,
          "hedgeRate": 4.3121,
          "expiryDate": "17/11/2025",
          "price": 0.0,
          "collateral": 4.408,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3121,
          "protectAmount": 10.50
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "17/11/2025",
        "hedgeError":true
      },
      {
        "status": {
          "type": 5,
          "descriprion": "Already purchased the entire protection deal for the month"
        },
        "maxHedgeAmount": 0.0,
        "recomendedHedgeAmount": 0.0,
        "hedge": null,
        "totalExposure": 0.0,
        "alreadyHedge": 0.0,
        "date": "15/07/2025",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 50.00,
        "recomendedHedgeAmount": 17.10,
        "hedge": {
          "strategyId": 132567,
          "hedgeRate": 4.2749,
          "expiryDate": "15/08/2025",
          "price": 0.0,
          "collateral": 7.179,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.2749,
          "protectAmount": 17.10
        },
        "totalExposure": 50.00,
        "alreadyHedge": 0.0,
        "date": "15/08/2025",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 14.25,
        "hedge": {
          "strategyId": 132573,
          "hedgeRate": 4.2872,
          "expiryDate": "15/09/2025",
          "price": 0.0,
          "collateral": 5.983,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.2872,
          "protectAmount": 14.25
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "15/09/2025",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 14.25,
        "hedge": {
          "strategyId": 132566,
          "hedgeRate": 4.2996,
          "expiryDate": "15/10/2025",
          "price": 0.0,
          "collateral": 5.983,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.2996,
          "protectAmount": 14.25
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "15/10/2025",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 6.75,
        "hedge": {
          "strategyId": 132570,
          "hedgeRate": 4.3491,
          "expiryDate": "16/02/2026",
          "price": 0.0,
          "collateral": 2.834,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3491,
          "protectAmount": 6.75
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "16/02/2026",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 10.50,
        "hedge": {
          "strategyId": 132577,
          "hedgeRate": 4.3373,
          "expiryDate": "15/01/2026",
          "price": 0.0,
          "collateral": 4.408,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3373,
          "protectAmount": 10.50
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "15/01/2026",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 6.75,
        "hedge": {
          "strategyId": 132564,
          "hedgeRate": 4.3609,
          "expiryDate": "16/03/2026",
          "price": 0.0,
          "collateral": 2.834,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3609,
          "protectAmount": 6.75
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "16/03/2026",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 6.75,
        "hedge": {
          "strategyId": 132569,
          "hedgeRate": 4.3728,
          "expiryDate": "15/04/2026",
          "price": 0.0,
          "collateral": 2.834,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3728,
          "protectAmount": 6.75
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "15/04/2026",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 6.75,
        "hedge": {
          "strategyId": 132565,
          "hedgeRate": 4.3728,
          "expiryDate": "15/05/2026",
          "price": 0.0,
          "collateral": 2.834,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3728,
          "protectAmount": 6.75
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "15/05/2026",
        "hedgeError":false
      },
      {
        "status": {
          "type": 1,
          "descriprion": "Created"
        },
        "maxHedgeAmount": 25.00,
        "recomendedHedgeAmount": 6.75,
        "hedge": {
          "strategyId": 132571,
          "hedgeRate": 4.3728,
          "expiryDate": "15/06/2026",
          "price": 0.0,
          "collateral": 2.834,
          "productName": "LOCK & UP",
          "productType": 1,
          "notionalCurrency": "CHF",
          "notionalCurrencySign": "CHF",
          "secondCurrency": "ILS",
          "secondCurrencySign": "₪",
          "collateralCurrency": "ILS",
          "liabilityRate": 4.3728,
          "protectAmount": 6.75
        },
        "totalExposure": 25.00,
        "alreadyHedge": 0.0,
        "date": "15/06/2026",
        "hedgeError":false
      },
    ]
  };
  hedgedMonthsfromAPI: any;
  showLoader: boolean = false;
  private proposalMessageTimerSubscription!: Subscription;
  showHedgeProposalMessage: boolean = false;
  selectedHedgeType: HedgingType = 1;
  hedgeTypes: HedgingType[] = Object.values(HedgingType).filter(value => typeof value === 'number') as HedgingType[];

  HedgingTypeDisplayNames = {
    [HedgingType.Forward]: 'Forward',
    [HedgingType.Vanilla]: 'Vanilla',
    [HedgingType.Range]: 'Range',
  };
  showSaveButton: boolean = false;
  saveButtonDisable: boolean = false;
  errorMessage = false;
  hedgedCurrencySign: any;
  updatedId: any;
  wallet_Amount: any;
  updateAfterGetting: boolean = false;
  arrOfIds: any[] = [];
  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.proposalMessageTimerSubscription = timer(0, 60000).pipe(
      take(1),
      tap(() => {
        this.showHedgeProposalMessage = true;
      })
    ).subscribe();
    this.getHedgesFromPolicyData();
  }

  checkForAvailableBalance(currency: string) {
    this.wallet_Amount = 10000.51;
    // this.riskManagerService?.getBalanceByCurrency(currency).subscribe({
    //   next: (result) => {
    //     // console.log(result);
    //     this.riskManagerService?.walletAmountInfoSubject.next(this.wallet_Amount);
    //   },
    //   error: (err) => {
    //   }
    // })
  }


  getHedgesFromPolicyData(hedgeType?: HedgingType) {
    this.showLoader = true;
    const collateralAndPriceCurrency = this.hedgeDetails?.collateralAndPriceCur?.code;
    this.checkForAvailableBalance(collateralAndPriceCurrency);
    this.selectedHedgeType = this.hedgeDetails.hedgingType;
    this.hedgedCurrencySign = this.hedgeDetails?.hedgeCurrency?.sign,
      this.hedgedMonthsfromAPI = this.hedgeDetails.monthlyHedge.map((item: any) => ({
        expiryDate: item.hedge?.expiryDate || item.date || '----',
        hedgeRate: item.hedge?.hedgeRate || '--',
        protectAmount: item.hedge?.protectAmount || 0,
        recommendedHedgeAmount: item?.recomendedHedgeAmount || 0,
        maxHedge_amount: item.maxHedgeAmount || 0,
        collateral: item.hedge?.collateral || 0,
        totalExposureAmount: item.totalExposure || 0,
        openEditForSelling: false,
        ...item
      }));
    this.dataSource.data = this.hedgedMonthsfromAPI;
    this.showLoader = false;
    this.selection.select(...this.dataSource.data);
  }

  changeSelectedHedgeType(event: any) {
    const selectedType = event.value;
    this.selectedHedgeType = selectedType;
    if (this.hedgeDetails) {
      this.hedgeDetails.totalHedgeAmount = 0;
    }
    this.selection?.clear();
    this.getHedgesFromPolicyData(selectedType);
    this.calculateTotalHedgeAmount();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  commaseparate(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e?.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      if (e == 0) {
        return '0';
      } else {
        return e;
      }
    }
  }

  editSelling(element: any, index: number) {
    if (this.openEditSellingIndex === index) {
      this.openEditSellingIndex = null;
      element.openEditForSelling = false;
    } else {
      this.dataSource.data.forEach(el => (el.openEditForSelling = false));
      this.openEditSellingIndex = index;
      element.openEditForSelling = true;
      this.hedgeAmountForEdit = this.commaseprate(element.protectAmount, 2);
    }
  }

  clearInput(index: number) {
    this.hedgeAmountForEdit = 0;
  }
  cancelEditSelling(element: any, index: number) {
    element.openEditForSelling = false;
    this.openEditSellingIndex = null;
  }

  saveEditSelling(element: any, index: number): void {
    const formattedValue = this.hedgeAmountForEdit?.replace(/,/g, ''); // Remove commas
    const numericValue = parseFloat(formattedValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      // Check if the value has changed
      if (element.protectAmount !== numericValue) {
        element.saveActivate = true;
        element.protectAmount = numericValue; // Update protectAmount
      }

      // Reset editing mode
      element.openEditForSelling = false;
      this.openEditSellingIndex = null;

      // Recalculate the total hedge amount
      this.calculateTotalHedgeAmount();
    } else {
      // Handle invalid input
      this.errorMessage = true; // Show error message if needed
    }
  }

  toggleAllRows(): void {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data);
    this.calculateTotalHedgeAmount();
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselect' : 'Select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'Deselect' : 'Select'} row ${row.hedgeRate}`;
  }

  openExpiryDateCalendar(element: PeriodicElement, index: number): void {
    if (!element?.expiryDate) {
      return;
    }
    const [day, month, year] = element.expiryDate.split('/').map(Number);
    element.date = new Date(year, month - 1, day);

    const datepicker = this.datepickers.toArray()[index];
    this.cd.detectChanges();

    if (datepicker) {
      datepicker.open();
    }
  }

  applyDate(index: number, element: PeriodicElement): void {
    if (!element.date || !moment(element.date).isValid()) {
      console.error('Invalid date:', element.date);
      return;
    }

    const selectedDate = moment(element.date);
    element.expiryDate = selectedDate.format('DD/MM/YYYY');
    element.saveActivate = true;
  }


  onSliderInput(event: Event, element: PeriodicElement) {
    element.saveActivate = true;
    const sliderValue = (event.target as HTMLInputElement).value;
    element.protectAmount = Number(sliderValue);
    this.dataSource.data = [...this.dataSource.data];
    this.calculateTotalHedgeAmount();
  }

  ngAfterViewInit() {
    // this.selection.select(...this.dataSource.data);
    // this.calculateTotalHedgeAmount();
  }

  calculateTotalHedgeAmount() {
    if (this.hedgeDetails) {
      this.hedgeDetails.totalHedgeAmount = this.selection.selected.reduce((sum, current) => sum + Number(current.protectAmount), 0);
    }
  }

  toggleRow(row: PeriodicElement): void {
    this.selection.toggle(row);
    this.calculateTotalHedgeAmount();
  }


  hedgeAllProposals() {
    this.showHedgeProposalMessage = false;  // Hide the message immediately

    // Clean up any existing subscriptions
    if (this.proposalMessageTimerSubscription) {
      this.proposalMessageTimerSubscription.unsubscribe();
    }

    // Filter out rows where row.hedge is null and ensure row is selected
    const selectedRows = this.selection.selected.filter(row =>
      this.selection.isSelected(row) && row.hedge !== null
    );
    if (selectedRows.length > 0) {
      // this.riskManagerService.hedgeAllActionDispatched.next(true);
      // this.riskManagerService.setSelectedHedgeData(selectedRows);
      // this.riskManagerService.openQuickHedgeSidebar(true);
    } else {
      // The below code changes are for DV-2884
      const protectPendingRows = this.selection.selected.filter(row => row.maxHedgeAmount! > 0)
      if (protectPendingRows.length > 0) {
        // this.riskManagerService.confirmHasMaxHedgeAmountRows(true);
      }
      // this.riskManagerService.hedgeAllActionDispatched.next(true);
      // this.riskManagerService.setSelectedHedgeData(protectPendingRows);
      // this.riskManagerService.openQuickHedgeSidebar(true);
    }

    this.cd.detectChanges();
    // Start the cycle of hiding and showing the message
    this.startRepeatingMessage();
  }



  startRepeatingMessage() {
    // Show message after 1 minute and repeat every 1 minute after that
    setInterval(() => {
      this.showHedgeProposalMessage = !this.showHedgeProposalMessage; // Toggle visibility
      this.cd.detectChanges();  // Trigger change detection to update the UI
    }, 60000);  // 60000 ms = 1 minute
  }

  openQuickHedgeDrawer(element: PeriodicElement): void {
    this.refreshHedging(element);
    this.selectedHedgeData = element;
    // this.riskManagerService.triggerQuickHedgeButtonClick();
    // this.riskManagerService.setSelectedHedgeData([element]);
    // this.riskManagerService.openQuickHedgeSidebar(true);
  }


  calculateImagePosition(recommended: number, i: number): number {
    const min = 0;
    const max = this.hedgedMonthsfromAPI?.[i]?.maxHedge_amount;
    const sliderWidth = 200;
    const originalPercentage = ((recommended - min) / (max - min)) * 100;
    const clampedPercentage = Math.max(0, Math.min(originalPercentage, 100));
    const pixelPosition = (clampedPercentage / 100) * sliderWidth;
    return pixelPosition;
  }

  resetToCollateral(element: PeriodicElement, i: number): void {
    element.protectAmount = this.hedgedMonthsfromAPI?.[i]?.recomendedHedgeAmount;
    this.dataSource.data = [...this.dataSource.data];
    this.calculateTotalHedgeAmount();
  }


  shouldShowError(i: number): boolean {
    return this.hedgeDetails?.monthlyHedge?.[i]?.hedgeError == true;
  }

  refreshPageInError(element: any) {
    this.showLoader = true;
    this.refreshHedging(element);
  }

  refreshHedging(element: any) {
    this.showLoader = true;
    let createPayloadHedge = [];
    const uniqueIds = new Set<number>();
    const strategyId = element?.hedge?.strategyId;
    // Construct common hedge details for the current element
    const hedgeDetails = {
      amount: element?.protectAmount,
      productType: strategyId ? element?.hedge?.productType : this.selectedHedgeType,
      expiryDate: element?.expiryDate || element?.hedge?.expiryDate,
      currencyPair: this.hedgeDetails.currencyPair?.replace(/\//g, ''),
      direction: this.hedgeDetails.direction,
      id: strategyId || undefined
    };

    // Add the primary hedge details to the payload
    createPayloadHedge.push({ hedgeByCategory: hedgeDetails });

    this.dataSource.data.forEach(row => {
      const rowId = row?.hedge?.strategyId;
      if (
        row?.hedge !== null && // Ensure hedge is not null
        rowId &&
        !uniqueIds.has(rowId) &&
        rowId !== strategyId &&
        this.selection.isSelected(row)
      ) {
        uniqueIds.add(rowId);
        createPayloadHedge.push({
          id: rowId,
        });
      }
    });

    // Send the payload to the API
    // this.riskManagerService.UpdateHedgesRequestData(createPayloadHedge).subscribe({
    //   next: (result) => {
    //     this.showLoader = false;
    //     this.hedgeDetails = result.body;
    //     this.updatedId = result.body?.monthlyHedge[0]?.hedge?.strategyId;
    //     // Next three line of changes are from DV-2884
    //     this.arrOfIds.push(this.updatedId);
    //     this.riskManagerService.arrOfIdsSubject.next(this.arrOfIds);
    //     this.dataSource.data = this.dataSource.data.map(row => {
    //       if (row?.hedge && row.hedge.strategyId === strategyId) {
    //         row.hedge.strategyId = this.updatedId;
    //       }
    //       return row;
    //     });


    //     this.riskManagerService.setUpdatedId(this.updatedId);
        this.updateAfterGetting = true;

    //     const extractedData = {
    //       price: this.hedgeDetails.price,
    //       requiredCollateral: this.hedgeDetails.requiredCollateral,
    //       totalHedgeAmount: this.hedgeDetails.totalHedgeAmount,
    //       totalHedgePercent: this.hedgeDetails.totalHedgePercent,
    //       avgHedgeRate: this.hedgeDetails.avgHedgeRate,
    //       liabilityRate: this.hedgeDetails?.liabilityRate
    //     };

    //     this.riskManagerService.hedgeDataSubject.next(extractedData);

    //     // Update data source with the response data
    //     this.hedgeDetails?.monthlyHedge?.map((item: any) => {
    //       ({
    //         expiryDate: item?.hedge?.expiryDate,
    //         hedgeRate: item.hedge?.hedgeRate || '--',
    //         protectAmount: item.hedge?.protectAmount || 0,
    //         recommendedHedgeAmount: item?.recomendedHedgeAmount || 0,
    //         maxHedge_amount: item.maxHedgeAmount || 0,
    //         collateral: item.hedge?.collateral || 0,
    //         totalExposureAmount: item.totalExposure || 0,
    //         openEditForSelling: false,
    //         ...item
    //       })
    //     }) || [];
    //     this.dataSource.data = this.dataSource.data.map(row => {
    //       const updatedRow = this.hedgeDetails?.monthlyHedge?.find((updated: any) => {
    //         updated.hedge?.strategyId === row.hedge?.strategyId
    //       });
    //       return updatedRow ? updatedRow : row;
    //     });

    //     // this.hedgeDetails = this.dataSource.data;
    //     this.showLoader = false;
    //     this.selection.select(...this.dataSource.data.filter(row => this.selection.isSelected(row)));
    //   },
    //   error: (err) => {
    //     this.showLoader = false;
    //   }
    // });

    element.saveActivate = false;
  }


  checkMaximumValue(element: PeriodicElement, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/,/g, '');
    this.errorMessage = false;
    // Handle empty input case
    if (value === '') {
      this.hedgeAmountForEdit = '0';
      this.saveButtonDisable = true;
      return;
    }
    // Ensure no more than two decimal places
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      if (decimalPart.length > 2) {
        value = `${integerPart}.${decimalPart.slice(0, 2)}`;
      }
    }
    // Convert and format the input
    // Parse the numeric value
    const actualNumber = parseFloat(value);
    if (!isNaN(actualNumber)) {
      // Store the numeric value for comparison
      const numericValue = actualNumber;

      // Validate against the maximum allowed value
      const isMaxHedgeAmountValid =
        element?.maxHedgeAmount !== undefined &&
        element.maxHedgeAmount >= numericValue;

      this.saveButtonDisable = !isMaxHedgeAmountValid;
      this.errorMessage = !isMaxHedgeAmountValid;

      // Format the input for display
      this.hedgeAmountForEdit = numericValue.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      });
    }
  }

  getHedgeMonthsCount(): number {
    return this.hedgeDetails?.monthlyHedge?.filter((item: { status: { type: number; }; }) => item.status?.type !== 2 && item.status?.type !== 4).length || 0;
  }

  commaseprate(e: any, fraction: any) {
    if (e || e === 0) {
      const actualNumber = +e?.toString()?.replace(/,/g, '');
      const fixedNumber = Number(actualNumber.toFixed(fraction)); // Maintain precision without rounding
      const formatted = fixedNumber.toLocaleString('en-US', {
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction
      });
      return formatted;
    } else {
      return e;
    }
  }

  onMakeDeposit() {
    // Trigger the header method from this component
    // this.headerCommService.triggerHeaderMethod();
  }

  ngOnDestroy(): void {
    if (this.proposalMessageTimerSubscription) {
      this.proposalMessageTimerSubscription.unsubscribe();  // Clean up when component is destroyed
    }
  }
}
