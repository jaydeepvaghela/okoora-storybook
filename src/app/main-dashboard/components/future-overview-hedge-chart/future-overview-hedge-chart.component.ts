import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexAnnotations,
  ApexLegend
} from "ng-apexcharts";
import { WalletsService } from '../../services/wallets.service';
import { DashboardService } from '../../services/dashboard.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import moment from 'moment';
import DateFormat, { Direction } from '../../enums/riskProfitLoss.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { createHedgeByCategory, getHedgeGrafhData } from '../../dashboard-data/balanceList-data';
import { of } from 'rxjs';
// import { ApprovalProtectiveFormComponent } from 'src/app/purchase-orders/components/approval-protective-form/approval-protective-form.component';
// import { CustomCalendarHeader } from 'src/app/shared/components/custom-calendar-header/custom-calendar-header.component';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { DashboardService } from '../../../../../../OkooraFront2023/src/app/dashboard/services/dashboard.service';
// import DateFormat from 'src/app/common/constants/DateFormat';
// import * as moment from 'moment';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PurchaseHedgeService } from 'src/app/purchase-orders/services/purchase-hedge.service';
// import { CurrencyPipe } from '@angular/common';
// import { CommonService } from 'src/app/common/services/common.service';
// import { Direction } from 'src/app/contacts/enums/alertWallet.enum';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  markers: ApexMarkers;
  annotations: ApexAnnotations;
  legend: ApexLegend;

};
@Component({
  selector: 'app-future-overview-hedge-chart',
  templateUrl: './future-overview-hedge-chart.component.html',
  styleUrls: ['./future-overview-hedge-chart.component.scss'],
  providers: [CurrencyPipe],
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCheckboxModule]
})

export class FutureOverviewHedgeChartComponent {
  minDate: any;
  showConfirmation = false;
  hedgeType = 'safeUp';
  selectedDate: any;
  minimumDate: any = new Date();
  // customCalendar = CustomCalendarHeader;
  activeCurrency: any;
  hedgeAmount: any;
  selectedHedgeAmount: any;
  lockDate: any;
  createdHedgeData: any;
  typedHedgeAmount: any;
  myForm!: FormGroup;
  showLoader!: boolean;
  errorMsg: any;
  config = { leftTime: 20, format: 'mm:ss' };
  strike: any;
  hedgeCost: any;
  confirmCondition: any;
  myHolidayDates: any;
  maxAllowedDateValue!: Date;
  Directions: any;
  dateClickedFlag: any;
  amountClickedFlag: any;
  typedHedgeAmountMsg: any;
  selectedDateMsg: any;
  userRoleType!: number;

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    private currencyPipe: CurrencyPipe,
    private cd: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    // private _purchaseHedgeService: PurchaseHedgeService,
    // private _authService: AuthenticationService
  ) {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toJSON();
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  ngOnInit() {

    //-------------- ProductType---------
    // 1 - Lock
    // 2 - Safe
    // 3- Range
    this.Directions = Direction
    this.dateClickedFlag = true
    this.lockDate = moment(this.selectedDate).format(DateFormat.dateInput);

    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      delete this.createdHedgeData;
      delete this.typedHedgeAmount;
      delete this.errorMsg;
      // this.selectedDate = new Date()
      this.lockDate = moment(this.selectedDate).format(DateFormat.dateInput);
      this.activeCurrency = wallet;
      this.getGraphData()
    })
    this.myHolidayDates = [];
    // this.userRoleType = this._authService.getRoleType();
  }
  
  ngDoCheck(){
    // this.userRoleType = this._authService.getRoleType();
  }

  ngAfterViewInit() {
    this.getNotradeList(this.maxAllowedDateValue)
  }

  getGraphData() {
    of(getHedgeGrafhData).subscribe((data:any) => {
      this.hedgeAmount = data
      this.selectedHedgeAmount = this.hedgeAmount[0]
    })
  }

  dateClicked() {
    // console.log("date clicked");
    this.dateClickedFlag = true;
    this.amountClickedFlag = false;

  }
  amountClicked() {
    // console.log("amount clicked");
    this.dateClickedFlag = false;
    this.amountClickedFlag = true;
  }
  executeHedge() {
    this.dateClickedFlag = null
    this.amountClickedFlag = null
    if (!this.typedHedgeAmount) {
      this.typedHedgeAmountMsg = "Set an Amount"
    }
    if (!this.selectedDate) {
      this.selectedDateMsg = "Select a date"
    }
  }
  addEvent(type: string, event: any) {

    // this.showLoader = true;
    this.lockDate = moment(event?.value).format(DateFormat.dateInput);
    if (event.value !== null) {
      delete this.selectedDateMsg
    }
    if (event.value !== null && this.typedHedgeAmount && !this.typedHedgeAmountMsg) {
      this.createHedge()
    }
    else {
      delete this.createdHedgeData
      this.showLoader = false;

    }
  }
  keyupvalue(e: any) {
    // console.log(e)
    this.typedHedgeAmount = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  }
  changeAmount(event: any) {
    delete this.typedHedgeAmountMsg
    if (event?.target?.value < 10000) {
      this.typedHedgeAmountMsg = "Minimum amount is 10,000"
    }
    if (this.typedHedgeAmount && this.lockDate && !this.typedHedgeAmountMsg) {
      this.createHedge()
    }
    else {
      delete this.createdHedgeData
      this.showLoader = false;
    }
  }

  createHedge() {
    this.showLoader = true;
    // this.lockDate = moment(event.value).format(DateFormat.dateInput);
    // let createHedgeObject = {
    //   amount: this.typedHedgeAmount?.replace(/\,/g, ''),
    //   productType: this.hedgeType == 'safeUp' ? "2" : "3",
    //   // productType: "1",
    //   expiryDate: this.lockDate,
    //   currencyPair: this.activeCurrency?.wallet_Hedging?.pair,
    //   Strike: this.hedgeType == 'safeUp' ? this.selectedHedgeAmount : "",
    //   // Strike: "",
    //   direction: this.activeCurrency?.wallet_Hedging?.direction
    // }
    of(createHedgeByCategory).subscribe((data: any) => {
      this.createdHedgeData = data
      let splitCost = this.createdHedgeData?.feeCost?.split(" ");
      this.hedgeCost = this.currencyPipe?.transform(splitCost[0], splitCost[1], true)
      this.showLoader = false;
      delete this.errorMsg
      this.cd.detectChanges();
      // this.hedgeType == 'rangeUp' ? this.showConfirmation = true : this.openLockup(this.createdHedgeData);


    }, (err: { error: { apiErrorMessage: string; }; }) => {
      if (err.error.apiErrorMessage == 'Expiry Date Not Valid') {
        this.selectedDateMsg = err.error.apiErrorMessage;
      }
      if (err.error.apiErrorMessage != 'Expiry Date Not Valid') {
        this.errorMsg = err.error.apiErrorMessage
      }
      this.showLoader = false
    })
  }

  typeChange(event: any) {
    delete this.createdHedgeData;
    delete this.typedHedgeAmount;
    delete this.errorMsg;
    delete this.selectedDate
    this.lockDate = moment(this.selectedDate).format(DateFormat.dateInput);
  }

  handleEvent(e: any) {
    this.showLoader = false;
    if (e.action == 'done') {
      this.showLoader = true;

      // if (this.hedgeType == 'rangeUp') {
      //   this._purchaseHedgeService
      //     .refreshlockHedge(this.createdHedgeData?.strategyId)
      //     .subscribe((result: any) => {
      //       if (result) {
      //         this.showLoader = false;
      //         this.createdHedgeData['strike'] == result?.result?.strike
      //         // this.strike = result?.result?.strike;
      //         // this.sellAmount = result?.items[0]?.sellAmount?.toFixed(2);
      //       }
      //     });
      // }
      this.config = { leftTime: 20, format: 'mm:ss' };

    }
  }

  myFilter = (date: Date) => {
    const maxAllowedDate = new Date(this.selectedDate == undefined ? new Date() : this.selectedDate);
    const selectedDATE = new Date(this.minDate);
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() + 1);
    const parsedDate = new Date(date);
    const day = parsedDate.getDay();
    const time = parsedDate.getTime();
    const isHoliday = this.myHolidayDates?.some((holidayDate: Date) => holidayDate.getTime() === time);
    this.maxAllowedDateValue = maxAllowedDate
    return date <= maxAllowedDate && !isHoliday && date > selectedDATE;
  }

  getNotradeList(endDate: any) {
    // this.myHolidayDates = [];
    // let ToDate = moment(endDate).format(DateFormat?.dateInput)
    // let FromDate = moment(new Date()).format(DateFormat?.dateInput)
    // let currency = this.activeCurrency?.wallet_Currency?.code + "," + this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency
    // // this._commonService.noTradeList(FromDate, ToDate, currency).subscribe((data: any) => {
    // //   for (var i = 0; i < data.length; i++) {
    // //     this.myHolidayDates.push(new Date(moment(data[i]?.date).format(DateFormat.parse?.dateInput)))
    // //   }
    // // })
  }
  openLockup(createdHedgeData: any) {
    this.showConfirmation = false;
    // const dialogRef = this.dialog.open(ApprovalProtectiveFormComponent, {
    //   width: '600px',
    //   disableClose: true,
    //   panelClass: 'approval-protective-dialog',
    //   data: {
    //     type: 'lockUP',
    //     fromNewdashboard: true,
    //     expiryDate: this.createdHedgeData?.expiryDate,
    //     buyCurrency: this.createdHedgeData?.buyCurrency,
    //     sellCurrency: this.createdHedgeData?.sellCurrency,
    //     HedgeData: this.createdHedgeData,
    //     lockAmount: this.typedHedgeAmount.replace(/\,/g, ''),
    //     hedgeType: this.hedgeType == 'safeUp' ? "2" : "3",
    //   }
    // }).afterClosed().subscribe((shouldReload: any) => {
    //   delete this.selectedDate
    //   delete this.typedHedgeAmount
    //   delete this.createdHedgeData
    // })
  }

  onChange(ev: any) {
    this.confirmCondition = ev.checked;
  }

  changeAmountValue() {
    this.createHedge()
  }
  async showConfPopup() {

    this.hedgeType == 'rangeUp' ? this.showConfirmation = true : this.openLockup(this.createdHedgeData);
  }
  hideConfPopup() {
    this.showConfirmation = false;
  }


}
