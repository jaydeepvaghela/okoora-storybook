import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./risk-dashboard/components/header/header.component";
import { SidebarComponent } from "./risk-dashboard/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { of, take } from 'rxjs';
import { user } from './contacts-dashboard/components/contacts-data/userData';
import { NewHeaderComponent } from './shared/new-header/new-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NewHeaderComponent, SidebarComponent, CommonModule],
  templateUrl:'app.component.html',
  styleUrl:'app.component.scss',
})
export class AppComponent {
  @ViewChild(SidebarComponent) private sidebar!: SidebarComponent;
  @Input() ShowDashboard: boolean = false;
  @Input() Showhedging: boolean = false;
  @Input() showCashflowExposure: boolean = false;
  @Input() selectedTheme: string = '';
  isLoggedInUser!: string | null;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Only navigate if it's the initial load (empty path)
    // if (this.router.url === '/') {
    // }
    this.isLoggedInUser = localStorage.getItem('isLoggedInUser')
    if (!this.isLoggedInUser) {
      this.router.navigate(['/login']);
    } else {
      of(user).pipe(take(1)).subscribe((res: any) => {
        localStorage.setItem('user', JSON.stringify(res)); 
      });
      this.router.navigate(['/fx-dashboard']);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTheme']) {
      this.applyTheme(changes['selectedTheme'].currentValue);
    }
  }

  private applyTheme(theme: string) {
    const root = document.documentElement;

    root.classList.remove('theme-max', 'theme-wrap', 'theme-default');

    if (theme) {
      root.classList.add(theme);
    }
  }

  get isAuthRoute(): boolean {
    return (
      this.isSignUpRoute ||
      this.isLoginRoute ||
      this.isForgotPasswordRoute ||
      this.isChangePasswordRoute ||
      this.isCodeVerificationRoute
    );
  } 

  get isRiskManagerRoute(): boolean {
    return this.router.url === '/dashboard' || this.router.url === '/hedging' || this.router.url === '/cashflow' || this.router.url === '/advanced-policy';
  }

  get isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  get isSignUpRoute(): boolean {
    return this.router.url === '/sign-up';
  }

  get isForgotPasswordRoute(): boolean {
    return this.router.url === '/reset-password'; 
  }

  get isChangePasswordRoute(): boolean {
    return this.router.url === '/change-password';  
  }

  get isCodeVerificationRoute(): boolean {
    return this.router.url === '/code-verification';  
  }

  openSidebar() {
    this.sidebar.openSidebar();
  }
}
