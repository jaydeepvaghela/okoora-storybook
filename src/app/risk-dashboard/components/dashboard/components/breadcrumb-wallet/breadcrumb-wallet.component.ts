import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-wallet',
  imports: [],
  templateUrl: './breadcrumb-wallet.component.html',
  styleUrl: './breadcrumb-wallet.component.scss'
})
export class BreadcrumbWalletComponent {
  @Input() baseCurrency: string = 'images/ils-flag.svg';
  @Input() fromCurrency: string = 'flags/us.svg';
  @Input() cashFlowName: string = 'S.L ROBOTICS';
  @Input() monthRange: string = 'Jan 24 - Dec 24';
}
