import { Component } from '@angular/core';
import { FxDashboardService } from '../../services/fx-dashboard.service';

@Component({
  selector: 'app-fx-notifications',
  templateUrl: './fx-notifications.component.html',
  styleUrls: ['./fx-notifications.component.scss']
})
export class FxNotificationsComponent {
  dragEnabledIndex: number | null = null;
  activeIndex: number = 0;
  constructor(private _fxDashboardService: FxDashboardService) { }
  notifications = [
    {
      id: 1,
      title: 'Smart Cash Alert',
      desc: 'EUR up 2%. <strong>Protect your invoice before the market shifts again ›</strong>',
      origIndex: 0
    },
    {
      id: 2,
      title: 'New idea',
      desc: 'EUR up 2%. <strong>Protect your invoice before the market shifts again ›</strong>',
      origIndex: 1
    },
    {
      id: 3,
      title: 'Opportunity',
      desc: 'EUR up 2%. <strong>Protect your invoice before the market shifts again ›</strong>',
      origIndex: 2
    },
    // Add more notification objects as needed
  ];
  activeId: number = this.notifications[0].id;
  getAllNotifications() {
    this._fxDashboardService.openFxNotificationDrawer(true);
  }
  switchToTop(index: number) {
    if (index === 0) {
      this.activeId = this.notifications[0].id;
      return;
    }
    const item = this.notifications.splice(index, 1)[0];
    this.notifications.unshift(item);
    this.activeId = item.id;
  }

}
