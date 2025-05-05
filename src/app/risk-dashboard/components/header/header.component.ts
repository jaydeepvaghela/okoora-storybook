import { Component, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { QuickHedgeDrawerComponent } from '../hedging-proposal/components/quick-hedge-drawer/quick-hedge-drawer.component';
import { HedgeAllDrawerComponent } from '../hedging-proposal/components/hedge-all-drawer/hedge-all-drawer.component';
import { HedgingDataService } from '../hedging-proposal/hedging-data.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private hedgeService: HedgingDataService,private router:Router) {}

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
        if (this.hedgeAllDrawer) {
          if (state) {
            this.hedgeAllDrawer.open();
            document.querySelector('body')!.style.overflowY = 'hidden';
            document.querySelector('.drawer-hedge-all')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop'></div>");
          } else {
            this.hedgeAllDrawer.close();
            document.querySelector('body')!.style.overflowY = 'auto';
            document.querySelector('.drawer-backdrop')?.remove();
          }
        }
      });
  }

  checkQuickHedgeDrawerState() {
    this.hedgeService.quickHedgeDrawerState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (this.quickHedgeDrawer) {
          if (state) {
            this.quickHedgeDrawer.open();
            document.querySelector('body')!.style.overflowY = 'hidden';
            document.querySelector('.drawer-hedge-quick')?.insertAdjacentHTML("afterend", "<div class='drawer-backdrop'></div>");
          } else {
            this.quickHedgeDrawer.close();
            document.querySelector('body')!.style.overflowY = 'auto';
            document.querySelector('.drawer-backdrop')?.remove();
          }
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
  logout(){
    localStorage.setItem('isLoggedInUser', 'false');
    this.router.navigate(['/sign-up']);
  }
}
