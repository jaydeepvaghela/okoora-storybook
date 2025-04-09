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
