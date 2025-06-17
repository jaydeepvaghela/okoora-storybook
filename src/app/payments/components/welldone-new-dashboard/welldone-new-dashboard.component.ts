import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welldone-new-dashboard',
  templateUrl: './welldone-new-dashboard.component.html',
  styleUrls: ['./welldone-new-dashboard.component.scss'],
  imports: [CommonModule]
})
export class WelldoneNewDashboardComponent {
  paymentFromDashboard: boolean = false;
  showWelldone: boolean = false;
  showText: boolean = false;
  paymentFromPayments: boolean = false;
  constructor(public dialog: MatDialog, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit() {
    if(!this.data) {
      this.showText = true;
    }
    else if(this.data.message == true) {
      this.showWelldone = true;
    }
    this.checkActiveRoute();
  }
  
  checkActiveRoute() {
    const currentRoute = this.router.url;
    this.paymentFromDashboard = currentRoute === ('/main-dashboard');
    this.paymentFromPayments = currentRoute === ('/payments');
  }

  closeAlldialog(){
    this.navigateToPage() 
    this.dialog.closeAll();
  }

  navigateToPage() {
    if (this.paymentFromDashboard) {
      this.router.navigate(['/main-dashboard']);
    } else if (this.paymentFromPayments || this.data?.transaction) {
      this.router.navigate(['/payments']);
    }
  }
}
