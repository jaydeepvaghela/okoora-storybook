import { Component, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { QuickHedgeDrawerComponent } from '../hedging-proposal/components/quick-hedge-drawer/quick-hedge-drawer.component';
import { HedgeAllDrawerComponent } from '../hedging-proposal/components/hedge-all-drawer/hedge-all-drawer.component';
import { HedgingDataService } from '../hedging-proposal/hedging-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, QuickHedgeDrawerComponent, HedgeAllDrawerComponent, MatDrawer, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hedgeAllDrawer') hedgeAllDrawer!: MatDrawer;
  @ViewChild('quickHedgeDrawer') quickHedgeDrawer!: MatDrawer;
  @Output() openSidebar = new EventEmitter();

  private destroy$ = new Subject<void>();

  constructor(private hedgeService: HedgingDataService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkHedgeAllDrawerState();
      this.checkQuickHedgeDrawerState();
    });
  }

  checkHedgeAllDrawerState() {
    this.hedgeService.hedgeAllDrawerState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        console.log('HedgeAllDrawer State:', state);
        if (this.hedgeAllDrawer) {
          state ? this.hedgeAllDrawer.open() : this.hedgeAllDrawer.close();
        }
      });
  }

  checkQuickHedgeDrawerState() {
    this.hedgeService.quickHedgeDrawerState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        console.log('QuickHedgeDrawer State:', state);
        if (this.quickHedgeDrawer) {
          state ? this.quickHedgeDrawer.open() : this.quickHedgeDrawer.close();
        }
      });
  }

  closeQuickHedgeDrawer() {
    this.hedgeService.closeQuickHedgeDrawer();
  }
  
  closeHedgeAllDrawer() {
    this.hedgeService.closeHedgeAllDrawer();
  }

  openMenu() {
    this.openSidebar.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
