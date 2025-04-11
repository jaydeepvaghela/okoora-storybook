import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './risk-dashboard/components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { HedgingProposalComponent } from './risk-dashboard/components/hedging-proposal/hedging-proposal.component';
import { CashflowExposureDetailsComponent } from './risk-dashboard/components/cashflow-exposure/components/cashflow-exposure-details/cashflow-exposure-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cashflow', pathMatch: 'full' as 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'hedging', component: HedgingProposalComponent },
      { path: 'cashflow', component: CashflowExposureDetailsComponent },
      { path: '**', redirectTo: 'cashflow' },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule {}