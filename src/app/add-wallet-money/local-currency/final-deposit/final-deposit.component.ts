import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ConnectorService } from '../../../connector/connector.service';
import AppPages from '../../../common/constants/AppPages';
@Component({
  selector: 'app-final-deposit',
  templateUrl: './final-deposit.component.html',
  styleUrls: ['./final-deposit.component.scss']
})
export class FinalDepositComponent {
  @Output() onCloseClick = new EventEmitter<any>();

  options: AnimationOptions = {
    renderer: 'svg',
    path: '/assets/animations/well-done-animation.json',
  };
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '330px',
    maxHeight: '250px',
    width: '100%',
    height: '100%',
    margin: '0 auto 50px auto',
  };
  
  fromConnector!: boolean;

  constructor(private _connectorService: ConnectorService, private router: Router) {}

  closeDrawer() {
    // this.onCloseClick.emit();
    // const fromConnector = this._connectorService.consumeFromConnector();
    // const fromAutoPilot = this._connectorService.consumeFromAutoPilot();
    // if (fromConnector) {
    //   this.router.navigate([`${AppPages.PayablesProtect}`]);
    // }
    // if (fromAutoPilot) {
    //   this.router.navigate([`${AppPages.Dashboard}`]);
    // }

    this.onCloseClick.emit();

    const routes = [
      { condition: this._connectorService.consumeFromConnector(), path: AppPages.Automations },
      { condition: this._connectorService.consumeFromAutoPilot(), path: AppPages.Dashboard }
    ];

    const route = routes.find(r => r.condition);
    if (route) {
      this.router.navigate([route.path]);
    }
  }
}
