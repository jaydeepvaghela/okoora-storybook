import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { ApiMap } from 'src/app/common/api.map';
// import { DataService } from 'src/app/core/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class FxDashboardService {
  private openFxNotificationDrawerSubject = new BehaviorSubject<boolean>(false);
  fxNotificationDrawer$ = this.openFxNotificationDrawerSubject.asObservable();

  private openFxWalletSummaryDrawerSubject = new BehaviorSubject<boolean>(false);
  fxWalletSummaryDrawer$ = this.openFxWalletSummaryDrawerSubject.asObservable();

  private openEditConversionDrawerSubject = new BehaviorSubject<boolean>(false);
  fxEditConversionDrawer$ = this.openEditConversionDrawerSubject.asObservable();
  
  currencySignForBuySell$ = new BehaviorSubject<string>('');

  public spotRateSubject = new BehaviorSubject<any>(null);
  spotRate$ = this.spotRateSubject.asObservable();

  constructor() { }

  openFxNotificationDrawer(isOpen: any) {
    this.openFxNotificationDrawerSubject.next(isOpen);
  }

  openEditConversionDrawer(isOpen: any) {
    this.openEditConversionDrawerSubject.next(isOpen);
  }

  openFxWalletSummaryDrawer(isOpen: any) {
    this.openFxWalletSummaryDrawerSubject.next(isOpen);
  }

  // GetYearlyExposureDetails(isYearly: boolean, date?: string | null) {
  //   let params = {
  //     isYearly: isYearly,
  //     ...(date ? { date } : {})
  //   }
  //   return this.dataService.getRequest<any>(ApiMap.GetYearlyExposureDetails.url, params);
  // }

  // createFxConversionRule(params: any) {
  //   return this.dataService.postRequestBody<any>(ApiMap.CreateFxConversionRule.url, params);
  // }

  // getFxConversionRules() {
  //   return this.dataService.getRequest<{ result: any }>(ApiMap.getFxConversionRules.url);
  // }
  // // get hedging data (POST with payload)
  // GetHedgeDealsTable(payload: any) {
  //   return this.dataService.postRequestBody<any>(ApiMap.GetHedgeDealsTable.url, payload);
  // }
  // // API to edit the total amount of exposure for a month
  // EditMonthExposure(amount: number, date?: string | null) {
  //   let params = {
  //     ...(date ? { date } : {}),
  //     amount: amount,
  //   }
  //   return this.dataService.postWithQueryParams<any>(ApiMap.EditMonthExposure.url, '', params)
  // }

  // GetFairValueDeal(strategyId: string) {
  //   let params = {
  //     strategyId: strategyId,
  //   }
  //   return this.dataService.getRequest<any>(ApiMap.GetFairValueDeal.url, params);
  // }

  // CloseDeal(strategyId: number) {
  //   let params = {
  //     strategyId: strategyId,
  //   }
  //   return this.dataService.postWithQueryParams<any>(ApiMap.CloseDeal.url, '', params)
  // }
}
