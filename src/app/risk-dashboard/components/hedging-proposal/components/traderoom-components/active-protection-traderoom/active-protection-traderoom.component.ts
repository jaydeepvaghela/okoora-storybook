import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-active-protection-traderoom',
  imports: [CommonModule],
  templateUrl: './active-protection-traderoom.component.html',
  styleUrl: './active-protection-traderoom.component.scss'
})
export class ActiveProtectionTraderoomComponent {
  hedgeStatus: number = 6;
  wantToPurchaseDeal: any;
}
