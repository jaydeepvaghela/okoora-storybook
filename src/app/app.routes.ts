import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './risk-dashboard/components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { HedgingProposalComponent } from './risk-dashboard/components/hedging-proposal/hedging-proposal.component';
import { CashflowExposureSteppersComponent } from './risk-dashboard/components/cashflow-exposure/cashflow-exposure-steppers/cashflow-exposure-steppers.component';
import { AdvancedPolicyComponent } from './risk-dashboard/components/advanced-policy/advanced-policy.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' as 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'hedging', component: HedgingProposalComponent },
  { path: 'cashflow', component: CashflowExposureSteppersComponent },
  { path: 'advanced-policy', component: AdvancedPolicyComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }