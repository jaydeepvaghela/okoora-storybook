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
  private dashboardSide = new BehaviorSubject<any>({});

  constructor() { }

  setDashboardSideTabesType(type: any) {
    this.dashboardSideTabesType.next(type)
  }

  
  setDashboardSideTabesTypes(type: any) {
    this.dashboardSide.next(type)
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
}
