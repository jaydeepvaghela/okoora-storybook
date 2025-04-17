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

  public setAdvancePolicyStepperIndex = new BehaviorSubject<number>(-1);
  getAdvancePolicyStepperIndex = this.setAdvancePolicyStepperIndex.asObservable();

  public setAdvancePolicyBudgetRate = new BehaviorSubject<any>({});
  getAdvancePolicyBudgetRate = this.setAdvancePolicyBudgetRate.asObservable();

  step2LastIndex = new BehaviorSubject<boolean>(false);

  isAdvancePolicyCompletedSubject = new BehaviorSubject<boolean>(false);
  advancePolicyCompleted$ = this.isAdvancePolicyCompletedSubject.asObservable();

  public setAdvancePolicyStep2Data = new BehaviorSubject<any>([]);
  getAdvancePolicyStep2Data = this.setAdvancePolicyStep2Data.asObservable();

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

  setAdvancePolicyStep2Formvalue(formValue: any) {
    this.setAdvancePolicyStep2Data.next(formValue);
  }
}
