import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import AppPages from '../../../common/constants/AppPages';

@Component({
  selector: 'app-fx-erp-invoice-step12',
  templateUrl: './fx-erp-invoice-step12.component.html',
  styleUrls: ['./fx-erp-invoice-step12.component.scss'],
})
export class FxErpInvoiceStep12Component {
  constructor(private readonly dialog: MatDialog, private router:Router) {}

  redirectToFxDashboard() {
    this.dialog.closeAll();
    const subSite = localStorage.getItem('subSite');
    this.router.navigate([subSite ?  `${AppPages.Automations}` : `${AppPages.Automations}`]);
  }
}
