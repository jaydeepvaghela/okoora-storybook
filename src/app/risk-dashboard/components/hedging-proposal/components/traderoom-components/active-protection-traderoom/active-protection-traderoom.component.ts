import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConnectingTraderoomComponent } from "../connecting-traderoom/connecting-traderoom.component";
import { ConnectedTraderoomComponent } from '../connected-traderoom/connected-traderoom.component';
import { CancelledTraderoomComponent } from "../cancelled-traderoom/cancelled-traderoom.component";
import { AgentsBusyTraderoomComponent } from '../agents-busy-traderoom/agents-busy-traderoom.component';
import { MatDialogRef } from '@angular/material/dialog';
import { HedgingDataService } from '../../../hedging-data.service';

@Component({
  selector: 'app-active-protection-traderoom',
  imports: [CommonModule, ConnectingTraderoomComponent, ConnectedTraderoomComponent, CancelledTraderoomComponent, AgentsBusyTraderoomComponent],
  templateUrl: './active-protection-traderoom.component.html',
  styleUrl: './active-protection-traderoom.component.scss'
})
export class ActiveProtectionTraderoomComponent {
  @Input() hedgeStatus: number = 2; 
  // 2: Connecting, 
  // 3: Connected, 
  // 4: Cancelled, 
  // 6: Active Protection, 
  // 7: Agents Busy
  wantToPurchaseDeal: any;

  constructor(private dialogRef: MatDialogRef<ActiveProtectionTraderoomComponent>, private hedgeService: HedgingDataService) { 

  }

  closeDialog() {
    this.dialogRef.close();
  }

  backToDashboard() {
    this.dialogRef.close();
    this.hedgeService.closeHedgeAllDrawer();
    this.hedgeService.closeQuickHedgeDrawer();
  }

  continueHedging() { 
    this.dialogRef.close();
  }

}
