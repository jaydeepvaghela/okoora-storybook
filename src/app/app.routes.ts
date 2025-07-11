import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './risk-dashboard/components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { HedgingProposalComponent } from './risk-dashboard/components/hedging-proposal/hedging-proposal.component';
import { CashflowExposureSteppersComponent } from './risk-dashboard/components/cashflow-exposure/cashflow-exposure-steppers/cashflow-exposure-steppers.component';
import { AdvancedPolicyComponent } from './risk-dashboard/components/advanced-policy/advanced-policy.component';
import { KycMainComponent } from './sign-up/kyc-main/kyc-main.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { CodeVerificationComponent } from './login/code-verification/code-verification.component';
import { ChangePasswordComponent } from './login/change-password/change-password.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main-dashboard', pathMatch: 'full' as 'full' },
  { path: 'main-dashboard', component: MainDashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sign-up', component: KycMainComponent },
  { path: 'login', component: LoginComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'code-verification', component: CodeVerificationComponent},
  { path: 'hedging', component: HedgingProposalComponent },
  { path: 'cashflow', component: CashflowExposureSteppersComponent },
  { path: 'advanced-policy', component: AdvancedPolicyComponent },
  { path: '**', redirectTo: 'main-dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }