import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HedgingDataService } from '../../hedging-data.service';
import { MatDialog } from '@angular/material/dialog';
import { HedgeTandcDetailsComponent } from '../hedge-tandc-details/hedge-tandc-details.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, formatDate } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActiveProtectionTraderoomComponent } from '../traderoom-components/active-protection-traderoom/active-protection-traderoom.component';

@Component({
  selector: 'app-quick-hedge-drawer',
  imports: [MatCheckboxModule, NgbTooltipModule, CommonModule, MatProgressSpinnerModule ],
  templateUrl: './quick-hedge-drawer.component.html',
  styleUrl: './quick-hedge-drawer.component.scss'
})
export class QuickHedgeDrawerComponent {
  @Output() closeDrawer = new EventEmitter<void>();
  tandcConfirmed: boolean = false;
  onHedgeNowClicked: boolean = false;
  showProgressbar = false;
  mode = 'indeterminate'; // or 'determinate'
  intervalId: any;
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

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.showProgressbar = true;
      setTimeout(() => {
        this.showProgressbar = false;
      }, 3000)
    }, 30000);
  }

  getFormattedDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return formatDate(dateObj, 'dd MMM yyyy', 'en-US');
  }

  closeHedgeDrawer() {
    this.tandcConfirmed  = false;
    this.onHedgeNowClicked = false;
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

  onCheckboxChange(event:any) {
    this.onHedgeNowClicked = false
    if (!event.checked) {
      this.tandcConfirmed = false;
    } else {
      this.tandcConfirmed = true;
    }
  }

  onHedgeNowBtnClick() {
    this.onHedgeNowClicked = true;
    if (this.tandcConfirmed) { 
      const dialogRef = this.dialog.open(ActiveProtectionTraderoomComponent, {
        width: '100vw',
        maxWidth: '100vw',
        disableClose: true,
        panelClass: 'hedging-active-protection',
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
