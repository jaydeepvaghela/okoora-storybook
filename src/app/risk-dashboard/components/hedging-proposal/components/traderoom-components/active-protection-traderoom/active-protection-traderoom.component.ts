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
  @Input() protectedAmount: number = 10000.00;
  @Input() primaryFlag: string = '/flags/ils-flag.svg';
  @Input() secondaryFlag: string = '/flags/usd-flag.svg';
  @Input() primaryCurrencySign: string = '₪';
  @Input() secondaryCurrencySign: string = '$';
  @Input() collateralAmount: number = 1200.00;
  @Input() price: number = 300;
  @Input() expiryDate: string = 'Jan 15, 2025';
  // 2: Connecting, 
  // 3: Connected, 
  // 4: Cancelled, 
  // 6: Active Protection, 
  // 7: Agents Busy
  wantToPurchaseDeal: any;
  formatValue(value:any) {
    // Convert to float and fix to two decimal places
    const num = parseFloat(value).toFixed(2);
  
    // Split integer and decimal parts
    const [integerPart, decimalPart] = num.split(".");
  
    // Add comma after every two digits from the right (Indian style)
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  
    return formattedInt + "." + decimalPart;
  }
}
