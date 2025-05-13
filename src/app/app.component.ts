import { Component, Input, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./risk-dashboard/components/header/header.component";
import { SidebarComponent } from "./risk-dashboard/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  templateUrl:'app.component.html',
  styleUrl:'app.component.scss',
})
export class AppComponent {
  @ViewChild(SidebarComponent) private sidebar!: SidebarComponent;
  @Input() ShowDashboard: boolean = false;
  @Input() Showhedging: boolean = false;
  @Input() showCashflowExposure: boolean = false;
  constructor(private router: Router) {}
  ngOnInit(): void {
    // Only navigate if it's the initial load (empty path)
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard']);
    }
    const isLoggedInUser = localStorage.getItem('isLoggedInUser') === 'false'
    if (isLoggedInUser) {
      this.router.navigate(['/sign-up']);
    }
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

  openSidebar() {
    this.sidebar.openSidebar();
  }
}
