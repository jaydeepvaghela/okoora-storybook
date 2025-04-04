import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HedgingDataService } from '../../hedging-data.service';

@Component({
  selector: 'app-quick-hedge-drawer',
  imports: [MatCheckboxModule],
  templateUrl: './quick-hedge-drawer.component.html',
  styleUrl: './quick-hedge-drawer.component.scss'
})
export class QuickHedgeDrawerComponent {
  @Output() closeDrawer = new EventEmitter<void>();
  selectedQuickHedgeData =
    {
      "expiryDate": "17/11/2025",
      "hedgeRate": 4.4532,
      "protectAmount": 84345.43,
      "recommendedHedgeAmount": 8,
      "maxHedge_amount": 25,
      "collateral": 3.472,
      "totalExposureAmount": 25,
      "openEditForSelling": false,
      "status": {
        "type": 1,
        "descriprion": "Created"
      },
      "maxHedgeAmount": 25,
      "recomendedHedgeAmount": 8,
      "hedge": {
        "strategyId": 132772,
        "hedgeRate": 4.4532,
        "expiryDate": "17/11/2025",
        "price": 0,
        "collateral": 3.472,
        "productName": "LOCK & UP",
        "productType": 1,
        "notionalCurrency": "CHF",
        "notionalCurrencySign": "CHF",
        "secondCurrency": "ILS",
        "secondCurrencySign": "₪",
        "collateralCurrency": "ILS",
        "liabilityRate": 4.4532,
        "protectAmount": 8
      },
      "totalExposure": 25,
      "alreadyHedge": 0,
      "date": "17/11/2025",
      "saveActivate": false
    }

  constructor(private hedgeService: HedgingDataService) { }

  ngOnInit() {
  }

  closeHedgeDrawer() {
    this.hedgeService?.closeQuickHedgeDrawer();
  }
}
