import { Component, Input, ViewChild } from '@angular/core';
import {
  ChartComponent,
} from "ng-apexcharts";
import { DashboardService } from '../../services/dashboard.service';
import { WalletsService } from '../../services/wallets.service';
import { MatTabsModule } from '@angular/material/tabs';
import { FutureOverviewLockChartComponent } from '../future-overview-lock-chart/future-overview-lock-chart.component';
import { FutureOverviewHedgeChartComponent } from '../future-overview-hedge-chart/future-overview-hedge-chart.component';
import { ConvertNowComponent } from '../convert-now/convert-now.component';
// import { ConvertNowComponent } from '../convert-now/convert-now.component';

@Component({
  selector: 'app-side-tabs',
  imports: [MatTabsModule, FutureOverviewLockChartComponent, FutureOverviewHedgeChartComponent, ConvertNowComponent],
  templateUrl: './side-tabs-container.component.html',
  styleUrls: ['./side-tabs-container.component.scss']
})
export class SideTabsContainerComponent {
  @ViewChild("chart") chart!: ChartComponent;
  minDate: string;
  activeCurrency: any;
  lockLabel!: string;
  selectedIndex = 0;
  @Input('getLockHedgeGrafhData') getLockHedgeGrafhData: any;

  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Highcharts.Options;

  constructor(private dashboardService: DashboardService,    
    private _walletService: WalletsService,
    ) {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toJSON();
  }
  ngOnInit() {
    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      this.activeCurrency = wallet;

     this.lockLabel =  this.activeCurrency?.wallet_Hedging?.direction == 1 ? "Lock & Down" : "Lock & Up"

    })
    //  this.chartOptions = getChartOptions();
  }

  
  changeType(event: any) {
    this.selectedIndex = event.index;
    this.dashboardService.setDashboardSideTabesType(event?.index)
  }
}
