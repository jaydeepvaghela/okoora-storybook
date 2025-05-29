import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { getCalendarDataTableByDate } from '../../dashboard-data/calendar-data';
import { of } from 'rxjs';
import { CalendarTableViewComponent } from '../calendar-table-view/calendar-table-view.component';

@Component({
  selector: 'app-dashboard-table-view',
  templateUrl: './dashboard-table-view.component.html',
  styleUrls: ['./dashboard-table-view.component.scss'],
  imports: [CommonModule, MatTabsModule, CalendarTableViewComponent]
})
export class DashboardTableViewComponent {
  //  @Input('tableData') tableData:any;
  @Input('selectedTab') selectedTab: any;
  @Input('showTable') showTable: any;
  @Output('addAlertClick') addAlertClick = new EventEmitter();
  @Output('addPaymentClick') addPaymentClick = new EventEmitter();
  @Output('addConvertClick') addConvertClick = new EventEmitter();
  tableData: any;
  user:any;
  
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    // this.user = JSON.parse(localStorage.getItem('user'));
    this.getCalendarData();
  }

  changeType(event: any) {
    this.dashboardService.setDashboardSideTabesTypes(event?.index)
  }


  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getCalendarData() {
    const currentDate = new Date();
    const oneYearFromNow = new Date(currentDate);
    oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);
    // const currentDateFormatted = this.formatDate(currentDate);
    // const oneYearFromNowFormatted = this.formatDate(oneYearFromNow);
    of(getCalendarDataTableByDate).subscribe(result => {
      if (result) {
        this.tableData = result;
      }
    })
  }

  addNewAlert() {
    this.addAlertClick.emit();
  }

  addNewPayment() {
    this.addPaymentClick.emit();
  }

  addNewConvert() {
    this.addConvertClick.emit();
  }
}
