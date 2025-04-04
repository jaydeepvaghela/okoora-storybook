import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HedgingDataService } from '../../hedging-data.service';
import { MatDialog } from '@angular/material/dialog';
import { HedgeTandcDetailsComponent } from '../hedge-tandc-details/hedge-tandc-details.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quick-hedge-drawer',
  imports: [MatCheckboxModule, NgbTooltipModule],
  templateUrl: './quick-hedge-drawer.component.html',
  styleUrl: './quick-hedge-drawer.component.scss'
})
export class QuickHedgeDrawerComponent {
  @Output() closeDrawer = new EventEmitter<void>();
  tandcConfirmed: boolean = false;
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

  constructor(private hedgeService: HedgingDataService, private dialog: MatDialog) { }

  ngOnInit() {
  }

  closeHedgeDrawer() {
    this.hedgeService?.closeQuickHedgeDrawer();
  }

  openConditionsDisclosure() {
    const dialogRef = this.dialog.open(HedgeTandcDetailsComponent, {
      width: '627px',
      disableClose: true,
      panelClass: 'terms-disclosure-hedging',
      data: { someData: 'pass any data if needed' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.tandcConfirmed = true; // Set the confirmation flag to true
      }
    });
  }
}
