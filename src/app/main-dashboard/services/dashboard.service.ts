import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private slidePositionSubject = new BehaviorSubject<number>(0);
  private getlastPaymentRateData = new BehaviorSubject<any>({});
  private dashboardSideTabesType = new BehaviorSubject<any>({});
  currentSideTabType = this.dashboardSideTabesType.asObservable();
  private dashboardDrawer = new BehaviorSubject<any>({});
  currentdashboardDrawerType = this.dashboardDrawer.asObservable();
  
  constructor() { }

  setDashboardSideTabesType(type: any) {
    this.dashboardSideTabesType.next(type)
  }

  setSlidePosition(position: number) {
    this.slidePositionSubject.next(position);
  }

  getSlidePosition() {
    return this.slidePositionSubject.asObservable();
  }

  setlastPaymentRateData(type: any) {
    this.getlastPaymentRateData.next(type)
  }

  setDashboardDrawerType(type: any) {
    this.dashboardDrawer.next(type)
  }
}
