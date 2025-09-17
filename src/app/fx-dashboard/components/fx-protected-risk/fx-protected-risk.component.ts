import { Component } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexResponsive,
  ApexLegend,
  NgApexchartsModule
} from 'ng-apexcharts';
import { FxDashboardService } from '../../services/fx-dashboard.service';
import { of, Subject, takeUntil } from 'rxjs';
import moment from 'moment';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { DashboardService } from '../../../main-dashboard/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { balanceList } from '../../../main-dashboard/dashboard-data/balanceList-data';
import { defaultCurrency } from '../../../main-dashboard/dashboard-data/default-currency';
import { FormsModule } from '@angular/forms';
import { getMonthlyExposureData } from '../fx-dashboard-data/getmonthlyexposureData';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
  responsive?: ApexResponsive[];
  legend?: ApexLegend;
  colors: string[];
  fill?: any;
  stroke?: any;
};

@Component({
  selector: 'app-fx-protected-risk',
  templateUrl: './fx-protected-risk.component.html',
  styleUrls: ['./fx-protected-risk.component.scss'],
  imports: [CommonModule, MatSelectModule, MatTabsModule, NgApexchartsModule,FormsModule]
})
export class FxProtectedRiskComponent {
  public showUncoveredFirst = false;
  public chartOptionsCovered!: Partial<ChartOptions>;
  public chartOptionsUncovered!: Partial<ChartOptions>;

  isYearly: boolean = false;
  private readonly _onDestroy = new Subject<void>();
  currentData!: any;
  isLoading: boolean = false;
  selectedMonth: string = '';
  selectedTab = 0;
  selectedMonthFirstDate: string = '';  // store the first date (YYYY-MM-DD)
  next12Months: { label: string; value: string }[] = [];
  unSubScribe$ = new Subject<void>();
  baseCurrencyWallet: any;
  walletList: any[] = [];
  showEditForm!: boolean;
  currentYear!: number;
  isEditError: boolean = true; // 
  defaultCurrency: any;
  editedTotal: string = '';
  constructor(private readonly fxDashboardService: FxDashboardService, private _walletService: WalletsService, private dashboardService: DashboardService) { }

  ngOnInit() {
    const currentMonth = moment().format('MMMM');  // e.g., 'July'
    this.selectedMonth = currentMonth;
    this.updateNext12Months();
    this.getAllBalanceList();
    this.currentYear = new Date().getFullYear();
  }

  getAllBalanceList() {
    of(balanceList).pipe(takeUntil(this.unSubScribe$)).subscribe((res) => {
      // this._walletService.getAllBalanceList().pipe(takeUntil(this.unSubScribe$)).subscribe((res) => {
      this.walletList = res;
      this.baseCurrencyWallet = this.walletList.find((wallet: any) => wallet.wallet_IsBaseCurency == true);
    })
  }

  onTabChange(index: number) {
    this.isEditError = true;
    this.selectedTab = index;
    if (index === 0) {
      this.isYearly = false;
      // this.getYearlyExposureDetails();
    } else {
      this.isYearly = true;
      // this.getYearlyExposureDetails();
    }
    if (localStorage.getItem('defaultCurrency')) {
      this.getYearlyExposureDetails();
    }
  }

  setChartOptions(uncoveredPercent: number) {
    const coveredPercent = 100 - uncoveredPercent;

    // Show the smaller one on top
    this.showUncoveredFirst = uncoveredPercent < coveredPercent;

    const trackVisible = {
      background: '#ECECFF',
      strokeWidth: '100%',
      margin: 0
    };

    const trackHidden = { show: false };

    const sharedRadialSettings = {
      startAngle: -180,
      endAngle: 180,
      hollow: { size: '70%' },
      dataLabels: { show: false },
      barWidth: 20
    };

    this.chartOptionsCovered = {
      series: [coveredPercent],
      chart: {
        type: 'radialBar',
        height: 295,
        sparkline: { enabled: true }
      },
      plotOptions: {
        radialBar: {
          ...sharedRadialSettings,
          track: this.showUncoveredFirst ? trackVisible : trackHidden
        }
      },
      fill: { type: 'solid' },
      stroke: { lineCap: 'round' },
      labels: ['Covered Risk'],
      colors: coveredPercent > 0 ? ['#2320E6'] : ['transparent']
    };

    this.chartOptionsUncovered = {
      series: [uncoveredPercent],
      chart: {
        type: 'radialBar',
        height: 295,
        sparkline: { enabled: true }
      },
      plotOptions: {
        radialBar: {
          ...sharedRadialSettings,
          track: this.showUncoveredFirst ? trackHidden : trackVisible
        }
      },
      fill: { type: 'solid' },
      stroke: { lineCap: 'round' },
      labels: ['Uncovered Risk'],
      colors: uncoveredPercent > 0 ? ['#EF8888'] : ['transparent']
    };
  }

  getYearlyExposureDetails() {
    const date = new Date();
    const firstDateOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
    this.isLoading = true;
   of(getMonthlyExposureData)
      .pipe(takeUntil(this._onDestroy))
      .subscribe((res) => {
        if (res) {
          this.isLoading = false;
          this.currentData = res;
          this.setChartOptions(res.unProtectedPercent);
        }
      });
  }
  // update the next 12 months
  updateNext12Months(): void {
    this.next12Months = [];
    const today = moment().startOf('month');

    for (let i = 0; i < 12; i++) {
      const month = today.clone().add(i, 'months');
      this.next12Months.push({
        label: month.format('MMMM - YYYY'),   // e.g., July 2025
        value: month.format('YYYY-MM-DD')   // First date of the month
      });
    }

    this.selectedMonth = this.next12Months[0]?.value;
    this.updateFirstDateOfSelectedMonth(this.selectedMonth);
  }
  // when the month changes, update the first date of the selected month
  onMonthChange(): void {
    this.updateFirstDateOfSelectedMonth(this.selectedMonth);
  }
  // update the first date of the selected month
  updateFirstDateOfSelectedMonth(monthName: string): void {
    this.selectedMonthFirstDate = monthName;
    if (!localStorage.getItem('defaultCurrency')) {
      this.getDefaultCurrency();
    } else {
      this.getYearlyExposureDetails()
    }
  }

  getDefaultCurrency() {
    this.isLoading = true;
    //  this.dashboardService.GetDefaultCurrency().subscribe(res => {
    of(defaultCurrency).subscribe({
      next: (res) => {
        this.defaultCurrency = res?.baseCurency;
        if (this.defaultCurrency) {
          localStorage.setItem('defaultCurrency', this.defaultCurrency);
          this.getYearlyExposureDetails();
        }
      }, error: (err) => {
        this.isLoading = false
      }
    })
  }

  editTotal() {
    const sign = this.baseCurrencyWallet?.wallet_Currency?.sign || '';
    const amount = this.currentData?.total ?? 0;
    this.editedTotal = `${sign}${amount}`;
    this.showEditForm = true;
  }

  saveTotal() {
    const sign = this.baseCurrencyWallet?.wallet_Currency?.sign || '';
    // Remove sign, commas, and whitespace before parsing
    const numericPart = this.editedTotal.replace(sign, '').replace(/,/g, '').trim();
    const parsedValue = parseFloat(numericPart);

    if (!isNaN(parsedValue)) {
      this.currentData.total = parsedValue;
    }

    this.showEditForm = false;
    this.EditMonthExposure(parsedValue);
  }

  clearTotal() {
    this.editedTotal = '';
    setTimeout(() => {
      this.showEditForm = false;
    }, 100);
  }
  // handle the edit action for the total amount
  EditMonthExposure(parsedValue: number) {
    const date = new Date();
    const firstDateOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
    this.isLoading = true;
    of(getMonthlyExposureData)
      .pipe(takeUntil(this._onDestroy))
      .subscribe((res) => {
        if (res) {
          this.isLoading = false;
          this.getYearlyExposureDetails();
        } else {
          this.isEditError = res;
        }
      });
  }
}
