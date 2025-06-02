import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, ViewChild } from '@angular/core';

import {
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
  ApexPlotOptions,
  ApexAnnotations,
  NgApexchartsModule
} from "ng-apexcharts";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { addMonths, isAfter, isBefore } from 'date-fns';  
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { WalletsService } from '../../services/wallets.service';
import DateFormat, { Direction } from '../../enums/riskProfitLoss.enum';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../services/dashboard.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomCalendarHeader } from '../shared/custom-calendar-header/custom-calendar-header.component';
import { getCurrentExplosureRate, getLockHedgeGrafhData } from '../../dashboard-data/chart-data';
import { of } from 'rxjs';
import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';
import { FutureOverviewLockUpdownComponent } from '../future-overview-lock-updown/future-overview-lock-updown.component';
import { createHedgeByCategory } from '../../dashboard-data/balanceList-data';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  yaxis: ApexYAxis
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions
  title: ApexTitleSubtitle;
  fill: ApexFill
  colors: any;

};

@Component({
  selector: 'app-future-overview-lock-chart',
  templateUrl: './future-overview-lock-chart.component.html',
  styleUrls: ['./future-overview-lock-chart.component.scss'],
  imports: [MatSelectModule, CommonModule, FormsModule, MatDatepickerModule, NgbTooltipModule, NgApexchartsModule, MatCheckboxModule, MatNativeDateModule, HtmlTooltipDirective],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'MM/DD/YYYY',
        },
        display: {
          dateInput: 'MM/DD/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FutureOverviewLockChartComponent implements OnDestroy {
  minDate: string;
  activeCurrency: any;
  currencyOfUser: any;
  lockDate: any;
  myHolidayDates!: Date[];
  customCalendar = CustomCalendarHeader;
  selectedTimeFrame!: string;
  isCalendarEnable: boolean = false;
  selectedDate!: Date;
  seriesData: any;
  lockUpDatepickerFilter!: (date: Date | null) => boolean;
  showLoader!: boolean;
  createdHedgeData: any;
  lockDateValue: any;
  currencyPairFromHedge: any;
  errorMsg: any;
  endDateValue!: Date;
  Directions: any;
  walletList: any = [];
  noTradeListData: any;
  timeFrameClickedFlag!: boolean;
  dateClickedFlag!: boolean;
  timeFrameMsg: any;
  dateErrMsg: any;
  errFlag!: boolean;
  @ViewChild('lockUpDatepicker')
  lockUpDatepicker!: MatDatepicker<any>;
  currentCurrencyValue: any;
  colorForstrock: any;
  DateClickedFlagForAPI!: boolean;
  showConfirmation = false;
  confirmCondition: any;
  customDate!: string;
  userRoleType!: number;
  filteredCurrencyOfUser: any;
  rateValue: any;
  rate = false
  rateAfterDestroy: boolean = true;
  isCallHegeGraphData = false;
  @Input('getLockHedgeGrafhData') getLockHedgeGrafhData: any;
  @Input() currentExposureRate!: { [key: string]: number };
  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DATE_LOCALE) private dateLocale: string,
  ) {
    this.dateLocale = 'en-US';
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toJSON();

  }

  public chartOptions!: Partial<ChartOptions>;

  async ngOnInit() {
    console.log('FutureOverviewLockChartComponent initialized', this.getLockHedgeGrafhData);
    this.activeCurrency = JSON.parse(localStorage.getItem('activeWallet') || '');
    this.showLoader = true;
    this.Directions = Direction
    const currentDate = new Date();

    const nextYearDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
    this.getNotradeList(nextYearDate)
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletList = data
    })
    await this._walletService.activeCurrentWallet.subscribe((wallet) => {
      this.activeCurrency = wallet;
      if (this.activeCurrency?.wallet_Currency?.code) {
        of(getCurrentExplosureRate).subscribe((data: any) => {
          this.currentCurrencyValue = data;
          this.cd.detectChanges()
        })
      }
      this.updateDateFilter();

      this.currencyOfUser = this.walletList?.find((x: any) => x.wallet_Currency?.code === this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency)?.wallet_Flag
      delete this.createdHedgeData;
      delete this.errorMsg;
      this.lockDateValue = null;
      this.lockDate = null
      this.isCalendarEnable = false;
      this.selectedTimeFrame = ""

      this.currencyPairFromHedge = this.activeCurrency?.wallet_Hedging?.pair?.slice(0, 3)
        + "/" + this.activeCurrency?.wallet_Hedging?.pair?.slice(3);
      this.getGraphData(this.activeCurrency?.wallet_Currency?.code, [])

      this.cd.detectChanges();

    });


    this._walletService?.availableWalletsData.subscribe((data: any) => {
      if (data.length != 0) {
        this.filteredCurrencyOfUser = this.walletList?.find((x: any) => x.wallet_Currency?.code.toLowerCase() === this.activeCurrency?.wallet_Currency?.code.toLowerCase())
         if (!this.rate) {
          this.getExpoureRate(this.filteredCurrencyOfUser?.wallet_Currency?.code)
         }
      }

    })

    this._walletService.availableWalletsDataForLock.subscribe((data: any) => {
      if (data.length != 0 && this.rateAfterDestroy) {
        this.getExpoureRate(data?.wallet_Currency?.code)
      }
    })

    this.myHolidayDates = [];
  }

  getExpoureRate(code: any) {
    if (code) {
      this.rate = true
      of(getCurrentExplosureRate).subscribe((data: any) => {
        this.currentCurrencyValue = data;
        localStorage.setItem('currentCurrencyValue', this.currentCurrencyValue?.[this.activeCurrency?.wallet_Currency?.code])
        this.cd.detectChanges()
      })
    }
  }

  ngOnDestroy(): void {
    this.rateAfterDestroy = false
  }

  ngDoCheck() {
    this.cd.detectChanges()
  }

  openLockDateCalendar() {
    const nodes = document.getElementsByClassName("mat-calendar-content");
    if (this.dateErrMsg) {
      const textnode = document.createTextNode(this.dateErrMsg);
      for (let i = 0; i < nodes.length; i++) {
        const node = document.createElement("div");
        node.classList.add("date-error-msg");
        node.appendChild(textnode.cloneNode(true));
        nodes[i].appendChild(node);
      }
    }
  }

  timeFrameClick() {
    this.timeFrameClickedFlag = true;
    this.dateClickedFlag = false;
    this.DateClickedFlagForAPI = true

  }
  dateClicked() {
    this.DateClickedFlagForAPI = true;
    this.timeFrameClickedFlag = false;
    this.dateClickedFlag = true;
  }

  updateDateFilter() {
    const currentDate = new Date();
    let endDate: Date;
    switch (this.selectedTimeFrame) {
      case '1 month':
        endDate = addMonths(currentDate, 1);
        this.endDateValue = endDate
        this.lockDateValue = endDate
        this.lockDate = endDate
        this.getNotradeList(this.endDateValue)
        this.getDateValue(this.endDateValue)
        break;
      case '3 months':
        endDate = addMonths(currentDate, 3);
        this.endDateValue = endDate
        this.lockDateValue = endDate
        this.lockDate = endDate
        this.getNotradeList(this.endDateValue)
        this.getDateValue(this.endDateValue)
        break;
      case '6 months':
        endDate = addMonths(currentDate, 6);
        this.endDateValue = endDate
        this.lockDateValue = endDate
        this.lockDate = endDate
        this.getNotradeList(this.endDateValue)
        this.getDateValue(this.endDateValue)
        break;
      case '9 months':
        endDate = addMonths(currentDate, 9);
        this.endDateValue = endDate
        this.lockDateValue = endDate
        this.lockDate = endDate
        this.getNotradeList(this.endDateValue)
        this.getDateValue(this.endDateValue)
        break;
      case '1 year':
        endDate = addMonths(currentDate, 12);
        this.endDateValue = endDate
        this.lockDateValue = endDate
        this.lockDate = endDate
        this.getNotradeList(this.endDateValue)
        this.getDateValue(this.endDateValue)
        break;
      default:
        endDate = currentDate;

      this.getNotradeList(this.endDateValue)
      this.getDateValue(this.endDateValue)
    }

    this.lockUpDatepickerFilter = (date: Date | null) => {
      if (date === null || date === undefined) {
        return true;
      } else {
        const parsedDate = new Date(date);
        const nextYearDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
        const day = parsedDate.getDay();
        const time = parsedDate.getTime();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = this.myHolidayDates.some((holidayDate: Date) => holidayDate.getTime() === time);
        if (this.selectedTimeFrame) {
          return ((!isWeekend && !isHoliday && isAfter(parsedDate, currentDate) && isBefore(parsedDate, endDate)));
        }
        else {
          return ((!isWeekend && !isHoliday && parsedDate <= nextYearDate && isAfter(parsedDate, currentDate)));
        }
      }
    };

  }


  getGraphData(pair: any, points: any) {
    let direction = this.activeCurrency?.wallet_Hedging?.direction
    let currencyPair = this.activeCurrency?.wallet_Hedging?.pair
    if (direction && currencyPair && !this.isCallHegeGraphData) {
      this.isCallHegeGraphData = true;

      of(getLockHedgeGrafhData).subscribe((data: any) => {
        this.seriesData = data

        for (var i = 0; i < this.seriesData?.spotPoints?.length; i++) {
          if (this.seriesData?.spotPoints[i + 1] != undefined && this.activeCurrency?.wallet_Hedging?.direction == this.Directions?.Up) {
            if (this.seriesData?.spotPoints[0] > this.seriesData?.spotPoints[i + 1]) {
              this.colorForstrock = "#29CC6A"
            }
            else if (this.seriesData?.spotPoints[0] < this.seriesData?.spotPoints[i + 1]) {
              this.colorForstrock = "#F04853"
            }
            else {
              this.colorForstrock = "#01031C"
              break
            }
          }

          if (this.seriesData?.spotPoints[i + 1] != undefined && this.activeCurrency?.wallet_Hedging?.direction == this.Directions?.Down) {
            if (this.seriesData?.spotPoints[0] < this.seriesData?.spotPoints[i + 1]) {
              this.colorForstrock = "#29CC6A"
            }
            else if (this.seriesData?.spotPoints[0] > this.seriesData?.spotPoints[i + 1]) {
              this.colorForstrock = "#F04853"
            }
            else {
              this.colorForstrock = "#01031C"
              break
            }
          }

        }

        let min = Math.min(...this.seriesData?.spotPoints)
        let max = Math.max(...this.seriesData?.spotPoints)
        let ratio = max - min
        this.chartOptions = {
          series: [
            {
              name: "Rate",
              type: 'line',
              data: this.seriesData?.spotPoints
            },

          ],
          chart: {
            height: 300,
            type: "line",
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          annotations: {
            yaxis: [
              {
                y: this.seriesData?.spotPoints[0],
                borderColor: "#000000",
                label: {
                  borderColor: "#000000",
                  position: "top",
                  // offsetX: 18,
                  offsetX: 25,
                  offsetY: 7,
                  borderRadius: 8,

                  style: {
                    color: "#FFF",
                    background: "#000000"
                  },
                  text: this.seriesData?.spotPoints[0]?.toFixed(4).toString(),

                }
              },
              {
                y: this.seriesData?.spotPoints[0] < this.seriesData?.spotPoints[1] ? Math.min(...this.seriesData?.spotPoints) - ratio : Math.min(...this.seriesData?.spotPoints),
                y2: this.seriesData?.spotPoints[0] > this.seriesData?.spotPoints[1] ? Math.max(...this.seriesData?.spotPoints) + ratio : Math.max(...this.seriesData?.spotPoints),
                strokeDashArray: 1,
                fillColor: "white",
                borderColor: 'white',
                opacity: 0,
              },
            ],

            points: points,

            xaxis: this.seriesData?.timesPoints?.map((month: any) => {
              return {
                x: month,
                borderColor: '#D9DADD',
                strokeDashArray: 2,
              };
            }),

          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "straight",
            colors: [this.colorForstrock],
            width: 3,

          },
          colors: [this.colorForstrock],
          grid: {

            yaxis: {
              lines: {
                offsetX: 0,
                show: false  //or just here to disable only y axis
              }
            },

            xaxis: {
              lines: {
                offsetX: 0,
                show: false  //or just here to disable only x axis
              }
            },
          },
          title: {
            align: "left"
          },
          labels: this.seriesData?.timesPoints,
          xaxis: {
            // type: "numeric",
            axisBorder: {
              show: true,
              color: 'false',

            },
            axisTicks: {
              show: false
            },
            labels: {
              style: {
                fontSize: '12px',
                colors: ['#909199', '#909199', '#909199', '#909199', '#909199', '#909199'],
              }
            }
          },
          yaxis: {
            min: this.seriesData?.spotPoints[0] < this.seriesData?.spotPoints[2] ? Math.min(...this.seriesData?.spotPoints) - ratio > 0 ? Math.min(...this.seriesData?.spotPoints) - ratio : 0 : Math.min(...this.seriesData?.spotPoints),
            max: this.seriesData?.spotPoints[0] > this.seriesData?.spotPoints[2] ? Math.max(...this.seriesData?.spotPoints) + ratio : Math.max(...this.seriesData?.spotPoints),

            opposite: true,
            tickAmount: 5,
            axisBorder: {
              show: true,
              color: '#78909C',
              offsetX: 0,
              offsetY: 0
            },
            labels: {
              style: {
                fontSize: '12px',
                colors: ['#909199'],
              }
            }
          }
        };
        this.showLoader = false;
        this.cd.detectChanges();
      })
    }
  }


  getNotradeList(endDate: any) {
    this.myHolidayDates = [];
  }

  getDateValue(endDate: any) {
    if (this.DateClickedFlagForAPI) {
      let lockDate = moment(endDate).format(DateFormat.dateInput);
      let holidayDate = this.noTradeListData?.filter((date: any) => lockDate == moment(date?.date).format(DateFormat.dateInput))
      if (holidayDate?.length != 0 && holidayDate != undefined) {
        let DateValue = new Date(moment(holidayDate[0]?.date).format(DateFormat.parse?.dateInput))
        let minusHolidayDate = DateValue.setDate(DateValue.getDate() - 1);
        this.getDateValue(new Date(minusHolidayDate))
      }
      else {
        // console.log(endDate);
        this.endDateValue = endDate
        this.lockDateValue = endDate
        this.lockDate = endDate
        this.getStrikeValue(endDate)
        this.cd.detectChanges()
      }
    }
  }

  async getStrikeValue(date: any) {
    this.showLoader = true;
    this.lockDate = moment(date).format(DateFormat.dateInput);
    this.lockDateValue = date
    let createHedgeObject = {
      // amount: this.activeCurrency?.wallet_Hedging?.exposureAmount,
      amount: "50000",
      productType: "1",
      expiryDate: this.lockDate,
      currencyPair: this.activeCurrency?.wallet_Hedging?.pair,
      Strike: "",
      direction: this.activeCurrency?.wallet_Hedging?.direction
    }
    if (this.DateClickedFlagForAPI == true) {
      this.DateClickedFlagForAPI = false
      await of(createHedgeByCategory).subscribe((data: any) => {
        this.createdHedgeData = data
        this.showLoader = false;
        this.isCalendarEnable = true
        delete this.timeFrameMsg
        delete this.dateErrMsg
        this.errFlag = false
        let points = [
          {
            x: this.selectedTimeFrame == '1 month' ? '1M' : this.selectedTimeFrame == '3 months' ? '3M' : this.selectedTimeFrame == '6 months' ? '6M' : this.selectedTimeFrame == '9 months' ? '9M' : this.selectedTimeFrame == '1 year' ? '1Y' : '',
            y: Math.max(...this.seriesData?.spotPoints),
            image: {
              path: '../../../../assets/images/lockChartGradient.svg',
              width: 120,
              height: 120,
              offsetX: 0,
              offsetY: 50,
            },
            marker: {
              size: 0,
              fillColor: "#fff",
              strokeColor: "#333",
              strokeWidth: 3,
              shape: "",
              radius: 2,
            },

          },
          {
            x: this.selectedTimeFrame == '1 month' ? '1M' : this.selectedTimeFrame == '3 months' ? '3M' : this.selectedTimeFrame == '6 months' ? '6M' : this.selectedTimeFrame == '9 months' ? '9M' : this.selectedTimeFrame == '1 year' ? '1Y' : '',
            y: data?.strike,
            marker: {
              size: 0,
              fillColor: "#fff",
              strokeColor: "#333",
              strokeWidth: 3,
              shape: "",
              radius: 2,
            },
            image: {
              path: '../../../../assets/images/pointCircleForlock.svg',
              width: 20,
              height: 20,
              offsetX: 0,
              offsetY: 0,
            },
            label: {

              borderColor: "white",
              borderRadius: 5,
              borderWidth: 10,
              offsetY: -30,

              style: {
                color: "blue",
                background: "white",
                cssClass: "futurOverview_chart",

              },
              // text: data?.strike?.toFixed(2)
              text: data?.strike

            },
          }
        ]
        this.getGraphData(this.activeCurrency?.wallet_Currency?.code, points)
        this.cd.detectChanges()
        delete this.errorMsg;
      },
        (        err: { error: { apiErrorMessage: any; }; }) => {
          this.showLoader = false;
          this.errorMsg = err.error.apiErrorMessage;
          // this.DateClickedFlagForAPI = false

        })
    }
  }
  onTimeFrameChange() {
    this.isCalendarEnable = true;
    this.updateDateFilter();
  }


  opneLockup(createdHedgeData: any) {

    if (this.isCalendarEnable || this.lockDate) {
      const dialogRef = this.dialog.open(FutureOverviewLockUpdownComponent, {
        width: '50vw',
        maxWidth: '50vw',
        panelClass: 'lock-up-popup',
        data: {
          hedgeData: createdHedgeData,
        }

      }).afterClosed()
        .subscribe((shouldReload: any) => {
        });
    }
    else {
      this.errFlag = true;
      this.timeFrameMsg = "Please select time frame"
      this.dateErrMsg = "Please select date"
    }


  }

  async addEvent(type: string, event: { value: any }) {
    if (!event.value) {
      return;
    }
    try {
      await this.getTimeframe(1, event.value);
      await this.getStrikeValue(event.value);
    } catch (error) {
      console.error("Error occurred in addEvent:", error);
    }
  }
  onChange(ev: any) {
    this.confirmCondition = ev.checked;
  }
  async showConfPopup() {
    if (this.isCalendarEnable || this.lockDate) {
      this.showConfirmation = true
    }
    else {
      this.showConfirmation = false
      this.errFlag = true;
      this.timeFrameMsg = "Please select time frame"
      this.dateErrMsg = "Please select date"
    }
  }
  hideConfPopup() {
    this.showConfirmation = false;
  }

  getTimeframe(value: any, date: any) {
  }

  myHolidayFilter = (d: Date): boolean => {
    const time = (new Date(d))?.getTime();
    return !this.myHolidayDates.find((x: any) => x.getTime() == time);
  }
}
