import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConnectingTraderoomComponent } from "../connecting-traderoom/connecting-traderoom.component";
import { ConnectedTraderoomComponent } from '../connected-traderoom/connected-traderoom.component';
import { CancelledTraderoomComponent } from "../cancelled-traderoom/cancelled-traderoom.component";
import { AgentsBusyTraderoomComponent } from '../agents-busy-traderoom/agents-busy-traderoom.component';

@Component({
  selector: 'app-active-protection-traderoom',
  imports: [CommonModule, ConnectingTraderoomComponent, ConnectedTraderoomComponent, CancelledTraderoomComponent, AgentsBusyTraderoomComponent],
  templateUrl: './active-protection-traderoom.component.html',
  styleUrl: './active-protection-traderoom.component.scss'
})
export class ActiveProtectionTraderoomComponent {
  @Input() hedgeStatus: number = 6; 
  // 2: Connecting, 
  // 3: Connected, 
  // 4: Cancelled, 
  // 6: Active Protection, 
  // 7: Agents Busy
  wantToPurchaseDeal: any;
}
