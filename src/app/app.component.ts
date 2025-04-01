import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./risk-dashboard/components/header/header.component";
import { SidebarComponent } from "./risk-dashboard/components/sidebar/sidebar.component";
import { DashboardComponent } from "./risk-dashboard/components/dashboard/dashboard.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, DashboardComponent,CommonModule],
  templateUrl:'app.component.html',
  styleUrl:'app.component.scss',
})
export class AppComponent {
  @ViewChild(SidebarComponent) private sidebar!: SidebarComponent;
  @Input() ShowDashboard: boolean = false;
  title = 'angular-latest';
  openSidebar() {
    this.sidebar.openSidebar();
  }
}
