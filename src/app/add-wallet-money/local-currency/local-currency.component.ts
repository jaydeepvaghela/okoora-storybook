import { Component, ViewChild, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { Observable, of, switchMap, tap } from 'rxjs';
import SwiperCore, { Swiper } from 'swiper';
// import { SwiperComponent } from 'swiper/angular';
import { DashboardService } from '../../main-dashboard/services/dashboard.service';
import { PaymentCalendarHeaderComponent } from '../../shared/components/payment-calendar-header/payment-calendar-header.component';
import { BenificiaryModel } from '../../payments/models/BenificiaryModel';
import { GetDepositLocalBankRequestModel } from '../../wallets/models/GetDepositLocalBankRequestModel';
import { AddContactsComponent } from '../../contacts-dashboard/components/add-contacts/add-contacts.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-local-currency',
  templateUrl: './local-currency.component.html',
  styleUrls: ['./local-currency.component.scss'],
  imports:[FormsModule,ReactiveFormsModule,MatDatepickerModule,CommonModule,NgbTooltipModule]
})
export class LocalCurrencyComponent {
  // @ViewChild(SwiperComponent) swiperComponent?: SwiperComponent;
  @Input() addMoneyScreenIndex!: number;
  @Input() localCurrencyForm: any;
  @Output() onScreenIndexChange = new EventEmitter<number>();
  mySwiper!: Swiper;
  isFirstSlide!: boolean;
  isLastSlide!: boolean;
  customCalendarHeader = PaymentCalendarHeaderComponent;
  fromLocalCurrencyMenu: boolean = true;
  selectedOption!: string;
  isAmountEditable = false;
  ownAccBeneficiary$!: Observable<BenificiaryModel[]>;
  minDate = moment().subtract(1, 'month');
  showLoader = false;
  errorMessage = '';
  showValidationError = false;

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private cd : ChangeDetectorRef
  ) { 

   
  }

  ngOnInit() {
    this.dashboardService.getSlidePosition().subscribe((position: number) => {
      this.isFirstSlide = position === 0;
      this.isLastSlide = position === 2;
      // this.ownAccBeneficiary$ = this._contactsService.getOwnAccountBeneficieries({ bankCountry: 'IL' }).pipe(tap(result => {
      //   if (result.length) {
      //     setTimeout(() => {
      //     }, 200);
      //   }
      // }));
      this.loadBankAccountSlider();
    });

    //  this.connectorService.getCollateralAmountFromMissingFunds$.subscribe((collateralAmount: number | null) => {
    //   if (collateralAmount !== null) {
    //     this.localCurrencyForm?.get('amount')?.patchValue(collateralAmount);
    //     // this.cd.detectChanges();
    //   }
    // });
  }

  loadBankAccountSlider() {
    this.mySwiper = new Swiper('.bank-swiper-container', {
      slidesPerView: 1,
      spaceBetween: 14,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }

  restrictZero(event: any) {
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    }
    else {
      if (event?.key == "." && this.localCurrencyForm.value?.amount.includes(".")) {
        event?.preventDefault();
      }
    }
  }

  onRadioChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedOption = target.value;
  }

  goToPreviousSlide() {
    this.mySwiper.slidePrev();
  }

  goToNextSlide() {
    this.mySwiper.slideNext();
  }

  dateClicked() {
    const nodes = document.getElementsByClassName(".deposit-datepicker");
    for (let i = 0; i < nodes.length; i++) {
      const close = document.createElement('button');
      close.addEventListener('click', () => {
        // this.closeCalendar();
      });
      close.classList.add("close-calendar-btn")
      const node = document.createElement("div");
      node.appendChild(close);
      nodes[i].appendChild(node);
    }
  }

  onAmountChange(ev: any) {
    this.localCurrencyForm?.get('amount')?.patchValue(ev?.target?.value);
  }

  onKeyPress(event: any) {
    const inputValue: string = event.target.value;
    const dotIndex: number = inputValue.indexOf('.');

    if (dotIndex !== -1 && inputValue.length - dotIndex > 2) {
      // Prevent adding more than 2 digits after the decimal point
      event.preventDefault();
    }
  }

  selectBankAccount(bank: any) {
    this.localCurrencyForm?.get('bankAccount')?.patchValue(bank);
  }

  validAmount() {
    if (this.localCurrencyForm?.get('amount')?.value == '-') {
      return false;
    }
    let amount = Number(this.localCurrencyForm?.get('amount')?.value.replace(/,/g, ''));
    return amount >= 1;
  }

  onNextClick() {
    if (!this.localCurrencyForm?.get('amount')?.value || !this.localCurrencyForm?.get('depositMethod')?.value || !this.validAmount()) {
      this.showValidationError = true;
      return;
    }
    this.showValidationError = false;
    this.addMoneyScreenIndex++;
    this.onScreenIndexChange.emit(this.addMoneyScreenIndex);
  }

  getDeposit() {
    if (!this.localCurrencyForm?.get('amount')?.value || !this.localCurrencyForm?.get('depositMethod')?.value || !this.validAmount() || !this.localCurrencyForm?.get('bankAccount')?.value || (this.localCurrencyForm?.get('depositMethod')?.value == '2' && !this.localCurrencyForm?.get('depositDate')?.value)) {
      this.showValidationError = true;
      return;
    }
    this.showLoader = true;
    let params: GetDepositLocalBankRequestModel = {
      beneficiayId: this.localCurrencyForm?.get('bankAccount').value?.id,
      currency: this.localCurrencyForm?.get('currency').value,
      TransferType: parseInt(this.localCurrencyForm?.get('depositMethod').value),
      TransferAt: moment(this.localCurrencyForm?.get('depositDate').value).format('DD-MM-YYYY')
    }

    if (this.localCurrencyForm?.get('depositMethod').value == 3) {
      params.TransferAt = '';
    }
    // this._walletService.getDepositFromLocalBank(params).subscribe({
    //   next: (result: any) => {
    //     this.showLoader = false;
    //     this.localCurrencyForm?.get('accountDetails').patchValue(result);
    //     this.addMoneyScreenIndex++;
    //     this.onScreenIndexChange.emit(this.addMoneyScreenIndex);
    //   },
    //   error: (err: any) => {
    //     this.showLoader = false;
    //     this.errorMessage = err.error.apiErrorMessage[0];
    //   }
    // });
  }

  backToPreviousScreen() {
    this.addMoneyScreenIndex--;
    this.onScreenIndexChange.emit(this.addMoneyScreenIndex);
  }

  addAccount() {
    const dialogRef = this.dialog.open(AddContactsComponent, {
      width: '100vw',
      maxWidth: '100vw',
      disableClose: true
    });
    // dialogRef.afterClosed().pipe(
    //   switchMap(() => this._contactsService.getOwnAccountBeneficieries({ bankCountry: 'IL' })),
    //   tap(result => {
    //     if (result.length) {
    //     }
    //   })
    // ).subscribe(updatedBeneficiaries => {
    //   this.ownAccBeneficiary$ = of(updatedBeneficiaries);
    // });
    setTimeout(() => {
      this.loadBankAccountSlider();
    }, 200);
  }

  getCleanAmount(amount: string) {
    let pureNumber = Number(amount?.replace(/,/g, ''));
    return pureNumber;
  }

  onInputFocus(ev: any) {
    if (ev?.target?.id == 'beneficiaryAmount-field') {
      document.getElementById('amountFocus')?.classList.add('focused');
    }
  }

  onInputBlur() {
    document.getElementById('amountFocus')?.classList.remove('focused');
  }

  ngOnDestroy() {
    if (this.mySwiper) {
      this.mySwiper.destroy();
    }
  }

  // getData(num:any){
  //   var data;
  //   if((num.indexOf('.')) == -1){
  //    data = parseFloat(num.replaceAll(',', '')).toLocaleString('en-US')
  //    }else if((num.indexOf('.')) != '' && (num.indexOf('.')) && num.toLocaleString().charAt(num.indexOf('.') + 2) != ''){
  //     data = num.substring(0, num.length-1)
  //    }
  //    console.log(data)
  // //  var dataaa = num.substr(num.indexOf('.')+1) !== '' ? (parseFloat((num.replaceAll(',', '').substring(0, num.length-1)))) : num
  //  this.localCurrencyForm.patchValue({'amount' : data })
  // }
}
