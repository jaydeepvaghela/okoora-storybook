import { ChangeDetectorRef, Component, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import moment from 'moment';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { Direction } from '../../../shared/constants/alertWallet.enum';
import { WalletsService } from '../../services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-alert-exchange-rate-form',
  templateUrl: './alert-exchange-rate-form.component.html',
  styleUrls: ['./alert-exchange-rate-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, MatSelectModule, MatDatepickerModule,MatDialogModule]
})
export class AlertExchangeRateFormComponent {
  buy_sell_code!: any | null;
  @Input() drawer!: MatDrawer;
  @Input() selectedCalendarDate!: string;
  @Input() isMenu!: boolean;
  alertExchangeRateForm!: FormGroup;
  maxDate: any
  activeCurrencyList: any;
  highestTargetRate: any
  lowestTargetRate: any;
  validForm: boolean = false;
  spotRate: any;
  submitted = false;
  successMessage = false;
  targateRateRange!: string;
  currencyPair:any
  minDate = new Date();
  showLoader = false;
  alertForm = true
  note = false;
  activeCurrency:any;


  DateFormat = {
  dateFormat: 'dd mmm yyyy',
  dateInput: 'DD/MM/YYYY',
  dateTimeInput: 'DD/MM/YYYY hh:mm',
  exportCSVFormat: 'DD/MM/YYYY hh:mm:ss a',
  orderFormate:"YYYY-MM-DD hh:mm:ss",
  paymentDateFormat: "YYYY-MM-DD",
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    monthLabel: 'MMM',
    yearLabel: 'YYYY'
  },
};
  buy_currency_code: any;
  sell_currency_code: any;
  

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
    private dashboardService: DashboardService,

  ) {}

  ngOnInit() {
     let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.buy_currency_code = currency.wallet_Currency.code;
    this.sell_currency_code = currency.wallet_Hedging.exposureBaseCurrency;
    this.getData();
    this._walletService.AlertExposure.subscribe((res:any)=>{
      if(res?.form){
        this.alertForm = true;
      }
      this.cd?.detectChanges();
    })
    if (this.selectedCalendarDate) {
      this.alertExchangeRateForm?.get('dueDate')?.setValue(this.selectedCalendarDate);
    }
   
    
  }

  ngAfterViewInit() { 
    this.getData();
  }

  ngOnChanges(changes: any) {
    if (this.selectedCalendarDate) {
      this.alertExchangeRateForm?.get('dueDate')?.setValue(this.selectedCalendarDate);
    }
  }

  getData(){
    this._walletService.activeCurrentWallet?.subscribe((wallet) => {
      this.activeCurrency = wallet;
      this.getForm();
    })
    this.maxDate = moment().add(3, 'months');
  }

  get alertExchangeRateFormControl() {
    return this.alertExchangeRateForm.controls;
  }

  getForm(){
    let activeWallet: any = localStorage.getItem('activeWallet');
    console.log('activeWallet', activeWallet);
    this.alertExchangeRateForm = this.fb.group({
      buy: new FormControl(this.buy_currency_code, [Validators.required]),
      sell: new FormControl(this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency ? this.activeCurrency?.wallet_Hedging?.exposureBaseCurrency :'ILS', [Validators.required]),
      targetRate: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern('^[0-9]{0,4}(?:.[0-9]{0,4}$)')]),
      dueDate: new FormControl('', [Validators.required]),
      note: new FormControl(''),
    });
    this.AlertSpotAndRate()
  }

  AlertSpotAndRate() {
    if (this.alertExchangeRateForm.value.buy && this.alertExchangeRateForm.value.sell) {
    }
  }

  TargetRateRange(arg: any) {
    this.dialog.closeAll();
     this.spotRate = this.spotRate.toString()
    if(this.spotRate.includes(arg.target.value)){
      this.validForm = true
    }
    else if (arg.target.value > this.highestTargetRate || arg.target.value < this.lowestTargetRate) {
      this.validForm = true
    } else {
      this.validForm = false
    }
  }

  onSubmit(arg: any) {
    this.submitted = true;
    this.showLoader = true
    var direction;
    if (this.alertExchangeRateForm.value.targetRate && this.spotRate) {
      if (this.alertExchangeRateForm.value.targetRate > this.spotRate) {
        direction = Direction.Up

      } else {
        direction = Direction.Down
      }
    }
    if (arg.valid) {
      let data = {
        'buy': arg?.value?.buy,
        'sell': arg?.value?.sell,
        'targetRate': arg?.value?.targetRate,
        'expiry': arg?.value?.dueDate ? moment(arg?.value?.dueDate).format(this.DateFormat.orderFormate) : '',
        'action': 1,
        'pair': this.currencyPair,
        'amount': '',
        "boardID": '',
        "exposureID": '',
        "remarks": "",
        "direction": direction,
        "creationSpot": this.spotRate
      }
    }
  }

  AddNote(){
    this.note = true
  }

  closeDrawer(){
    document.querySelector('body')!.style.overflowY = 'auto';
}
  

  backToDashboard(){
    this.dashboardService.setDashboardDrawerType(true)
  }

  closePopup(){
    this.drawer.close();
  }
}
