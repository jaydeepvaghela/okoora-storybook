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
import { HedgingDataService } from './hedging-data.service';
import { hedgeData } from './hedging-static-data';

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
  imports: [CommonModule, MatInputModule,MatDatepickerModule,MatMomentDateModule,MatSliderModule, MatSelectModule, MatCheckboxModule, MatIconModule, MatTableModule, FormsModule, NgbTooltipModule],
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
  hedgeDetails = hedgeData;
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
  constructor(private cd: ChangeDetectorRef, private hedgeService: HedgingDataService) {

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
    this.hedgeService.closeQuickHedgeDrawer();
    this.hedgeService.openHedgeAllDrawer();
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
    this.hedgeService?.openQuickHedgeDrawer();
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
