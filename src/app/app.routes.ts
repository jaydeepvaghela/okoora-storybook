import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './risk-dashboard/components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', redirectTo: 'layout', pathMatch: 'full' },
  { path: 'riskdashboard', component: DashboardComponent },
//   { path: 'hedging', component: AnotherStoryComponent },
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule {}