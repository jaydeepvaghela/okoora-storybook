import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HedgingDataService {
  constructor() { }

  private hedgeAllDrawerState = new BehaviorSubject<boolean>(false);
  hedgeAllDrawerState$ = this.hedgeAllDrawerState.asObservable();

  private quickHedgeDrawerState = new BehaviorSubject<boolean>(false);
  quickHedgeDrawerState$ = this.quickHedgeDrawerState.asObservable();

  public setExposureFormValue = new BehaviorSubject<any>({});
  getExposureFormValue = this.setExposureFormValue.asObservable();

  openCashflowDateTooltip = new BehaviorSubject<boolean>(false);

  public setAdvancePolicyBudgetRate = new BehaviorSubject<any>({});
  getAdvancePolicyBudgetRate = this.setAdvancePolicyBudgetRate.asObservable();

  private advancePolicyFlagSubject = new BehaviorSubject<boolean>(false);
  advancePolicyFlag$ = this.advancePolicyFlagSubject.asObservable();

  step2LastIndex = new BehaviorSubject<boolean>(false);

  setAdvancePolicyFormvalue(formValue: any) {
    this.setAdvancePolicyBudgetRate.next(formValue);
  }

  setAdvancePolicyFlag(value: boolean) {
    this.advancePolicyFlagSubject.next(value);
  }

  openQuickHedgeDrawer() {
    this.quickHedgeDrawerState.next(true);
  }

  closeQuickHedgeDrawer() {
    this.quickHedgeDrawerState.next(false);
  }

  openHedgeAllDrawer() {
    this.hedgeAllDrawerState.next(true);
  }

  closeHedgeAllDrawer() {
    this.hedgeAllDrawerState.next(false);
  }
}
