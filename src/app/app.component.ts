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
  }
  openSidebar() {
    this.sidebar.openSidebar();
  }
}
