import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swiper from 'swiper';
import { DashboardService } from '../../services/dashboard.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { WalletsService } from '../../services/wallets.service';
import { Direction } from '../../enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { SendComponent } from '../../../payments/components/send/send.component';
import { MatIconModule } from '@angular/material/icon';
import { LockPaymentAddAlertComponent } from '../lock-payment-add-alert/lock-payment-add-alert.component';

@Component({
  selector: 'app-lock-next-payment',
  imports: [CommonModule, MatDrawer, MatIconModule, LockPaymentAddAlertComponent],
  templateUrl: './lock-next-payment.component.html',
  styleUrls: ['./lock-next-payment.component.scss']
})
export class LockNextPaymentComponent {
  mySwiper!: Swiper;
  @ViewChild('eventDrawer')
  eventDrawer!: MatDrawer;
  @Input('lastPaymentRateData') lastPaymentRateData: any;
  Directions: any;
  isNonIsraeliUser: any;
  constructor(public dialog: MatDialog, private dashboardService: DashboardService,
    private walletService: WalletsService, private router: Router) {}

  ngOnInit(): void {
    this.Directions = Direction
    // this.dashboardService.currentdashboardDrawerType.subscribe(res=>{
    //   if(res){
    //     this.eventDrawerClose()
    //   }
    // })
  }

  eventDrawerOpen(){
    this.eventDrawer?.open();
    this.walletService.setAlertData({show: false,form:true});
    document.querySelector('body')!.style.overflowY = 'hidden';
  }

  eventDrawerClose(){
    this.eventDrawer?.close();
    document.querySelector('body')!.style.overflowY = 'auto';
  }

  CreateAlertDialog(){
    let activeWallet:any =  localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet);
    this.eventDrawerOpen();
    // this.dialog.open(AlertExchangeRateFormComponent,{
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   data: {
    //     selectedwalletInfo: currency,
    //   },
    //   disableClose: true,
    // }).afterClosed()
    // .subscribe((shouldReload: any) => {
    // });
  }

  CreateLockRateDialog(){
    let activeWallet:any =  localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(SendComponent,{
      width: '100vw',
      maxWidth: '100vw',
      data: {
        selectedwalletInfo: currency,
        type: true,
        payment: false,
        transaction: true
      },
      disableClose: true,
    }).afterClosed()
    .subscribe((shouldReload: any) => {
    });
  }

  ngAfterViewInit() {
    this.mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 1.5,
      spaceBetween: 20
    });

    if (this.mySwiper && this.mySwiper.on) {
      this.mySwiper.on('slideChange', () => {
        this.dashboardService.setSlidePosition(this.mySwiper?.activeIndex);
      });
    }
  }

  onPayNowClick() {
    this.router.navigate(['/payments']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
