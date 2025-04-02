import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./risk-dashboard/components/header/header.component";
import { SidebarComponent } from "./risk-dashboard/components/sidebar/sidebar.component";
import { DashboardComponent } from "./risk-dashboard/components/dashboard/dashboard.component";
import { CommonModule } from '@angular/common';
import { HedgingProposalComponent } from './risk-dashboard/components/hedging-proposal/hedging-proposal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, DashboardComponent,CommonModule,HedgingProposalComponent],
  templateUrl:'app.component.html',
  styleUrl:'app.component.scss',
})
export class AppComponent {
  @ViewChild(SidebarComponent) private sidebar!: SidebarComponent;
  @Input() ShowDashboard: boolean = false;
  @Input() Showhedging: boolean = false;
  title = 'angular-latest';
  openSidebar() {
    this.sidebar.openSidebar();
  }
  onToggleView(showHedging: boolean) {
    this.Showhedging = showHedging;
    this.ShowDashboard = !showHedging;
  }
}
