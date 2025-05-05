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

  private advancePolicyFlagSubject = new BehaviorSubject<boolean>(false);
  advancePolicyFlag$ = this.advancePolicyFlagSubject.asObservable();

  step2LastIndex = new BehaviorSubject<boolean>(false);

  public setAdvancePolicyStep2Data = new BehaviorSubject<any>([]);
  getAdvancePolicyStep2Data = this.setAdvancePolicyStep2Data.asObservable();

  isAdvancePolicyCompletedSubject = new BehaviorSubject<boolean>(false);
  advancePolicyCompleted$ = this.isAdvancePolicyCompletedSubject.asObservable();

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

  setAdvancePolicyStep2Formvalue(formValue: any) {
    this.setAdvancePolicyStep2Data.next(formValue);
  }
  navigateToAdvancePolicyStepper(stepperIndex: any) {
    this.setAdvancePolicyStepperIndex.next(stepperIndex);
  }
}
