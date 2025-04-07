import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HedgingDataService } from '../../hedging-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HedgeTandcDetailsComponent } from '../hedge-tandc-details/hedge-tandc-details.component';
import { hedgeAllRows } from '../../hedging-static-data';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ActiveProtectionTraderoomComponent } from '../traderoom-components/active-protection-traderoom/active-protection-traderoom.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-hedge-all-drawer',
  imports: [MatCheckboxModule, CommonModule, NgbTooltipModule, MatProgressSpinnerModule],
  templateUrl: './hedge-all-drawer.component.html',
  styleUrl: './hedge-all-drawer.component.scss'
})
export class HedgeAllDrawerComponent {
  @Output() closeDrawer = new EventEmitter<void>();
  showHedgeAllDetails: boolean = false;
  showCompleteHedgeDetails: boolean = false;
  multipleHedgeData = hedgeAllRows;
  showProgressbar = false;
  mode = 'indeterminate'; // or 'determinate'
  intervalId: any;

  initialHedgeInfo = {
    "price": 0,
    "requiredCollateral": 48.832,
    "totalHedgeAmount": 100.35,
    "totalHedgePercent": 23.5625,
    "avgHedgeRate": 4.4971,
    "liabilityRate": 4.4971
  }
  formattedDateRange: string = '';
  specificSelectedRow: any;
  hedgeAllbtnClicked: boolean = false;
  tandcConfirmed: boolean = false;

  constructor(private hedgeService: HedgingDataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.setFormattedDateRange()
    console.log('(this.multipleHedgeData)', this.multipleHedgeData);
    this.intervalId = setInterval(() => {
      this.showProgressbar = true;
      setTimeout(() => {
        this.showProgressbar = false;
      }, 3000)
    }, 30000);
  }

  formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-GB', {
      month: 'long', // full month name like January
      year: 'numeric'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount);
  }

  setFormattedDateRange(): void {
    if (!this.multipleHedgeData.length) return;

    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const formatDate = (date: Date): string =>
      `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    const sortedDates = this.multipleHedgeData
      .map(item => parseDate(item.expiryDate))
      .sort((a, b) => a.getTime() - b.getTime());

    const startDate = formatDate(sortedDates[0]);
    const endDate = formatDate(sortedDates[sortedDates.length - 1]);

    this.formattedDateRange = `${startDate} - ${endDate}`;
  }

  onRowClick(row: any) {
    console.log('row',row)
    this.specificSelectedRow = row;
  }

  formatMonthYear(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(+year, +month - 1, +day); // month is 0-indexed
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

  onHedgeAllBtnClick() {
    this.hedgeAllbtnClicked = true;
    // const dialogRef = this.dialog.open(ActiveProtectionTraderoomComponent, {
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   disableClose: true,
    //   panelClass: 'hedging-active-protection',  
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('Dialog closed', result);
    // });

  }

  onCheckboxChange(event:any) {
    this.hedgeAllbtnClicked = false
    if (!event.checked) {
      this.tandcConfirmed = false;
    } else {
      this.tandcConfirmed = true;
    }
  }

  closeHedgeDrawer() {
    this.tandcConfirmed  = false;
    this.hedgeAllbtnClicked = false;
    this.hedgeService.closeHedgeAllDrawer();
  }
}
