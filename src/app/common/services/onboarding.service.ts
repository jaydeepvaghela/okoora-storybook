import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from 'src/app/shared/components/welcome-dialog/welcome-dialog.component';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { WalkmeType } from '../enums/WalkmeType';
import DashboardTourStepsForHe from '../constants/onboarding-tour/he/DashboardTourSteps';
import DashboardTourStepsForEn from '../constants/onboarding-tour/en/DashboardTourSteps';
import { driver } from 'driver.js';
import SidebarTourStepsForHe from '../constants/onboarding-tour/he/SidebarTourSteps';
import SidebarTourStepsForEng from '../constants/onboarding-tour/en/SidebarTourSteps';
import { Router, NavigationEnd } from '@angular/router';
import { OnboardingWelcomeDialogComponent } from 'src/app/shared/components/onboarding-welcome-dialog/onboarding-welcome-dialog.component';
import { OnboardingCompletionDialogComponent } from 'src/app/shared/components/onboarding-completion-dialog/onboarding-completion-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  dashboardTourStepsForHe = DashboardTourStepsForHe;
  dashboardTourStepsForEn = DashboardTourStepsForEn;
  SidebarTourStepsForHe = SidebarTourStepsForHe;
  SidebarTourStepsForEng = SidebarTourStepsForEng;
  showOnboarding = false;
  language: any = 'en';
  isNonIsraeliuser: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router
  ) { }

  /**
   * Waits until a DOM element exists and is laid out (has size), or until timeout.
   */
  private waitForElement(selector: string, timeoutMs: number = 8000, pollMs: number = 50): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        const el = document.querySelector(selector) as HTMLElement | null;
        const ready = !!el && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
        if (ready) {
          // Let layout settle one more frame
          requestAnimationFrame(() => resolve());
          return;
        }
        if (Date.now() - start >= timeoutMs) {
          resolve();
          return;
        }
        setTimeout(check, pollMs);
      };
      check();
    });
  }

  showWelcomePopup(showOnboarding = false) {
    this.showOnboarding = showOnboarding;
    const reachedMaxWelcomeCount = this._authService.getUser('user').displayWalkMe?.welcome?.reachedMaxCount;
    const dontShowAgain = this._authService.getUser('user').displayWalkMe?.welcome?.dontShowAgain;
    const hasPlan = this._authService.getUser('user').plan;
    const walkMeShown = localStorage.getItem('walkMeShown') !== 'true';
    
    if ((!reachedMaxWelcomeCount && !dontShowAgain && walkMeShown && hasPlan != null) || showOnboarding) {
      this.dialog.open(OnboardingWelcomeDialogComponent, {
        width: '100%',
        maxWidth: '840px',
        height: 'auto',
        panelClass: 'fx-dashboard-tour-dialog',
        disableClose: true,
        backdropClass: 'onboarding-backdrop',
        data: {
          showOnboarding: this.showOnboarding
        }
      }).afterClosed().subscribe(res => {
        localStorage.setItem('walkMeShown', 'true');
        if (res === true) {
          this.installDashboardOverlayAndWireClick();
        }
      });
      // document.querySelector('.onboarding-welcome-dialog')?.classList.add('dir-rtl');
    }
  }

  /**
   * Ensures the dashboard onboarding overlay exists and is wired to
   * navigate to the dashboard (if needed) and then start the dashboard tour.
   */
  installDashboardOverlayAndWireClick() {
    try {
      const existingOverlay = document.querySelector('#dashboardOnboardingOverlay');
      existingOverlay?.remove();
      document.querySelector('#content-wrapper')?.insertAdjacentHTML('beforeend', "<div id='dashboardOnboardingOverlay'></div>");
      const overlay = document.querySelector('#dashboardOnboardingOverlay');
      overlay?.addEventListener('click', (event) => {
        this.startDashboardTourFromAnywhere(true);
      });
    } catch (error) {
      // Silent fail to avoid blocking UX if DOM is not ready
    }
  }

  /**
   * Starts the dashboard tour from any route by navigating to dashboard first if required
   */
  startDashboardTourFromAnywhere(forceShow = true) {
    const dashboardUrl = localStorage.getItem('subSite') ? '/' + localStorage.getItem('subSite') + 'dashboard' : '/dashboard';
    if (this._router.url !== dashboardUrl) {
      const subscription = this._router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && this._router.url === dashboardUrl) {
          subscription.unsubscribe();
          // Ensure dashboard DOM and the first step target are ready before starting
          const language = localStorage.getItem('lang') || 'en';
          const steps: any[] = (language == 'en') ? (this.dashboardTourStepsForEn as any).steps : (this.dashboardTourStepsForHe as any).steps;
          const firstSelector: string | undefined = steps?.[0]?.element;
          this.waitForElement('#content-wrapper', 8000)
            .then(() => firstSelector ? this.waitForElement(firstSelector, 8000) : Promise.resolve())
            .then(() => setTimeout(() => this.startDashboardTour(forceShow), 0));
        }
      });
      this._router.navigateByUrl(dashboardUrl);
    } else {
      this.startDashboardTour(forceShow);
    }
  }

  startSidebarTour() {
    this.language = localStorage.getItem('lang') || 'en';
    const nextBtnLabel = this.language === 'he' ? 'הבא' : 'Next';
    const previousBtnLabel = this.language === 'he' ? 'הקודם' : 'Back';

    this.isNonIsraeliuser = this._authService.isNonIsraelUser();

    let allSteps: any = this.language === 'he' ? this.SidebarTourStepsForHe.steps : this.SidebarTourStepsForEng.steps;
    let filteredSteps = allSteps;

    if (this.isNonIsraeliuser) {
      const excludedSelectors = [
        '#purchase-link',
        '#navReceiveFunds'
      ];
      filteredSteps = allSteps.filter((step: any) => !excludedSelectors.includes(step.element));
    }

    filteredSteps = filteredSteps.map((step: any, index: any) => ({
      ...step,
      popover: {
        ...step.popover,
        progressText: `${index + 1}/${filteredSteps.length}`
      }
    }));

    const driverObj = driver({
      steps: filteredSteps,
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      popoverClass: this.language == 'en' ? `onboarding-popup ltr-en` : `onboarding-popup`,
      allowClose: true,
      nextBtnText: nextBtnLabel,
      prevBtnText: previousBtnLabel,
      doneBtnText: nextBtnLabel,

      onDeselected: () => {
        document.querySelector('#dashboardOnboardingOverlay')?.remove();
        if (
          this._router.url === (
            localStorage.getItem('subSite')
              ? '/' + localStorage.getItem('subSite') + 'dashboard'
              : '/dashboard'
          )
        ) {
          document.querySelector("#content-wrapper")?.insertAdjacentHTML("beforeend", "<div id='dashboardOnboardingOverlay'></div>");
        }
      },
      onDestroyed: () => {
        // localStorage.setItem('walkMeShown', 'true');
        this.installDashboardOverlayAndWireClick();
      },
      onPopoverRender: (step, opt) => {
        if (opt.state.activeIndex == 0) {
          document.querySelector('.driver-popover-navigation-btns .driver-popover-prev-btn')?.removeAttribute('disabled');
          document.querySelector('.driver-popover-navigation-btns .driver-popover-prev-btn')?.classList.remove('driver-popover-btn-disabled');
        }
      },
      onPrevClick: (id, element, config) => {
        let activeSlideIndex = config?.state?.activeIndex;
        if (activeSlideIndex != undefined && activeSlideIndex <= 0) {
          driverObj.destroy();
          this.showWelcomePopup(true);
        }
        driverObj.movePrevious();
      }
    });
    driverObj.drive();
  }

   startDashboardTour(showOnboarding = false) {
    const language = localStorage.getItem('lang') || 'en';
    const popupDirClass = 'dir-ltr';
    const nextBtnLabel = (language == 'en') ? 'Next' : 'המשך';
    const previousBtnLabel = (language == 'en') ? 'Previous' : 'חזור';
    const showDashboardOnboarding = this._authService.getUser('user').displayWalkMe?.wallet?.reachedMaxCount;
    const dontShowAgain = this._authService.getUser('user').displayWalkMe?.wallet?.dontShowAgain;
   
    if (((!showDashboardOnboarding && !dontShowAgain) || showOnboarding) && this._router.url == (localStorage.getItem('subSite') ? '/' + localStorage.getItem('subSite') + 'dashboard' : '/dashboard')) {
      const steps = (language == 'en') ? this.dashboardTourStepsForEn.steps : this.dashboardTourStepsForHe.steps;
      const driverObj = driver({
        steps,
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        popoverClass: (language == 'en') ? `onboarding-popup dashboard ltr-en` : 'onboarding-popup dashboard',
        allowClose: true,
        nextBtnText: nextBtnLabel,
        prevBtnText: previousBtnLabel,
        doneBtnText: nextBtnLabel,
        onDestroyed: () => {
          document.querySelector('#dashboardOnboardingOverlay')?.remove();
          document.querySelector('body')!.style.overflowY = 'auto';
        },
        onNextClick: (id, element, config) => {
          const activeIndex = config?.state?.activeIndex;
          const lastIndex = steps!.length - 1;
          if (activeIndex != null && activeIndex >= lastIndex) {
            driverObj.destroy();
            this._authService.dontShowWalkMe(WalkmeType.Wallet).subscribe();
            const dialogRef = this.dialog.open(OnboardingCompletionDialogComponent, {
              width: '100%',
              maxWidth: '653px',
              height: 'auto',
              panelClass: ['fx-dashboard-tour-dialog', language === 'en' ? 'dir-ltr' : '']
            });

            dialogRef.afterClosed().subscribe(() => {
              this._authService.getUserProfile().subscribe();
            });


          } else {
            driverObj.moveNext();
          }
        },
        onPrevClick: (id, element, config) => {
          const activeIndex = config?.state?.activeIndex;
          if (activeIndex != null && activeIndex <= 0) {
            driverObj.destroy();
            this.showWelcomePopup(true);
          } else {
            driverObj.movePrevious();
          }
        },
        onPopoverRender: (popover, opts) => {
          setTimeout(() => {
            document.querySelector('body')!.style.overflowY = 'hidden';
          }, 200);
          if (opts.state.activeIndex == 0) {
            document.querySelector('.driver-popover-navigation-btns .driver-popover-prev-btn')?.removeAttribute('disabled');
            document.querySelector('.driver-popover-navigation-btns .driver-popover-prev-btn')?.classList.remove('driver-popover-btn-disabled');
            if (!this.showOnboarding) {
              const showDashboardOnboarding = this._authService.getUser('user').displayWalkMe?.wallet?.dontShowAgain;
              const dontShowCheckbox = document.querySelector('#dbOnboardDontShowAgain') as HTMLInputElement | null;
              if (dontShowCheckbox) {
                dontShowCheckbox.checked = !!showDashboardOnboarding;
                dontShowCheckbox.addEventListener('change', (event: any) => {
                  if (event.target.checked) {
                    this._authService.walkmeDisable(WalkmeType.Wallet, true).subscribe();
                  } else {
                    this._authService.walkmeDisable(WalkmeType.Wallet, false).subscribe();
                  }
                });
              }
              const skipBtn = document.querySelector('#dashboardOnboardSkip') as HTMLElement | null;
              if (skipBtn) {
                skipBtn.addEventListener('click', (event: any) => {
                  driverObj.destroy();
                });
              }
            }
          }
        }
      });

      driverObj.drive();
    }
  }
}
