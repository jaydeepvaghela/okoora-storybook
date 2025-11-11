import { Component } from '@angular/core';
import { FxDashboardService } from '../../services/fx-dashboard.service';

@Component({
  selector: 'app-fx-notification-drawer',
  templateUrl: './fx-notification-drawer.component.html',
  styleUrls: ['./fx-notification-drawer.component.scss']
})
export class FxNotificationDrawerComponent {

  notifications: any[] = [
    {
      type: 'Fx alert',
      text: 'EUR up 2% Protect your invoice before market shifts again ›',
      time: 'Wednesday at 9:42 AM'
    },
    {
      type: 'Opportunity',
      text: 'EUR up 2% Protect your invoice before market shifts again ›',
      time: 'Wednesday at 9:42 AM'
    },
    {
      type: 'New idea',
      text: 'EUR up 2% Protect your invoice before market shifts again ›',
      time: 'Wednesday at 9:42 AM'
    },
    {
      type: 'Fx alert',
      text: 'EUR up 2% Protect your invoice before market shifts again ›',
      time: 'Wednesday at 9:42 AM'
    }
  ];

  constructor(private _fxDashboardService: FxDashboardService) {}

  closeNotificationDrawer() {
    this._fxDashboardService.openFxNotificationDrawer(false);
  }
}
