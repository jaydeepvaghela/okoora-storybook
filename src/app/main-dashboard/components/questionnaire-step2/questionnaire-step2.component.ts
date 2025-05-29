import { ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WalletsService } from '../../services/wallets.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { GetActiveHedgingCurrency } from '../../dashboard-data/all-currency-data';
import { of } from 'rxjs';
import { HtmlTooltipDirective } from '../../../directives/html-tooltip.directive';

@Component({
  selector: 'app-questionnaire-step2',
  templateUrl: './questionnaire-step2.component.html',
  styleUrls: ['./questionnaire-step2.component.scss'],
  imports: [MatTabsModule, MatSelectModule, ReactiveFormsModule, CommonModule, HtmlTooltipDirective]
})
export class QuestionnaireStep2Component implements DoCheck  {
  @Input('formStepper') formStepper?: any;
  @Input('defaultCurrency') defaultCurrency: any;
  @Input('addMoreCurrency') addMoreCurrency: any;
  @Input('currencyList') currencyList: any;
  @Input('data') data: any;
  supportedHedge:any;
  currencyPair: any[] = [];
  currencyPairSell!: any[];
  initialPairIndex: number = 0;
  initialPairIndexForSell: number = 0
  tab: any = 0;
  errorMessage = false;
  apiError:any;
  hasValuetab1: any = false
  hasValuetab2: any = false
  activeCurrency:any;
  balanceList:any = true;
  comingFromStep2 = true;
  @Output() step2BackClicked = new EventEmitter<boolean>();
  firsttimePopup: any;
  constructor(private fb: FormBuilder,
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef,
    private _walletService: WalletsService,
    private dialog: MatDialog) {
  }

  ngDoCheck(){
    const mapped = Object.values(this.addMoreCurrency.value.currencyPair[0]).map(value => !!value);
    mapped.splice(0, 1)
    const hasValues = mapped.some(value => value);
    if(hasValues){
     if(this.tab == 0){
      this.hasValuetab1 = false
      this.hasValuetab2 = true
     }else if(this.tab == 1){
      this.hasValuetab2 = false
      this.hasValuetab1 = true
     }
  }else{
    this.hasValuetab1 = false
    this.hasValuetab2 = false
  }
}

  ngOnInit() {
    this._walletService.getAllBalanceList().subscribe((res) => {
      this.firsttimePopup = res?.find((x:any)=> x.wallet_Hedging != null && x.wallet_SupportBaseHedging === true) 
      // const userPlan = JSON.parse(localStorage.getItem('user') || '');
      if (this.firsttimePopup) {
        this.balanceList = true
      } else if (!this.firsttimePopup) {
        this.balanceList = false
        this.addMoreCurrency.patchValue({ currencyPair: [{buy: '', amount: '', sign: '', direction: null}] });
      }
    },err=>{
    });
    of(GetActiveHedgingCurrency).subscribe((res)=>{
      this.supportedHedge = res?.supportedHedge
    })
    this.getCurrencyPair();
    this.addCurrencyPair()
    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      this.activeCurrency = wallet;
      this.addMoreCurrency.patchValue({ currencyPair: [{buy: this.data ? this.data?.selectedCurrency?.wallet_Currency?.code :this.activeCurrency?.wallet_Currency?.code, amount: '', sign: '', direction: null}] });
    })
  }

  currencyPairs(): FormArray{
      return this.addMoreCurrency.get('currencyPair') as FormArray;
  }

  getCurrencyPair(): FormGroup {
    return this.fb.group({
      buy: [{value: '', disabled: false},  Validators.required],
      amount: ['',  Validators.required],
      sign: '',
      direction: null
    });
  }

  validationButton(){
    let data = true;
   for (let index = 0; index < this.currencyPair.length; index++) {
    if(this.currencyPair.length == 1){
      if(this.currencyPair[index]?.buy == ''){
        return true;
      }else if(this.currencyPair[index]?.amount == ''){
        return true;
      }else{
        return false;
      }   
    }else if(this.currencyPair.length > 1){
      if(index != 0){
        if(this.currencyPair[index]?.buy && this.currencyPair[index]?.amount){
          data = false;
        }else{
          data = true;
        }   
      }
    }
    }
    return data;
  }

  addCurrencyPair() {
    if(this.addMoreCurrency.valid){
      this.errorMessage = false;
      this.currencyPairs().push(this.getCurrencyPair());
    }else{
      this.errorMessage = true
    }
  }

  removeCurrencyPair(index: number) {
    if (index !== this.initialPairIndex) {
      this.currencyPairs().removeAt(index);
      // this.currencyPair.splice(index, 1);
    }
  }

  nextStep() {
    for (let index = 0; index < this.addMoreCurrency.value.currencyPair.length; index++) {
      let data = {
        ExposureBalanceCurrency: this.addMoreCurrency.value.currencyPair[index].buy,
        BuySell: Number(this.tab) + 1,
        ExposureAmount: this.addMoreCurrency.value.currencyPair[index].amount
      }
      // this.dashboardService.SetBalanceExposures(data).subscribe((res:any) => {
        this.formStepper.next();
      // },
      // (err)=>{
      //   if(err?.error?.apiErrorMessage[0]){
      //     this.apiError = err?.error?.apiErrorMessage[0]
      //   }
      // })
    }
  }

  previousStep() {
    // var previous = true;
    // for (let index = 0; index < this.currencyPair.length; index++) {
    //   if((this.currencyPair[index].buy != ''  || this.currencyPair[index].amount != '') && (this.currencyPair[index].buy != undefined || this.currencyPair[index].amount != undefined)){
    //     previous = false;
    //   }    
    // }
    // if(previous){
    //   this.getCurrencyPair()
    // }
    // if(this.firsttimePopup) {
    //   this.dialog.closeAll();
    // }
    this.formStepper.previous();
  }

  getSign(currency: any, index: any) {
    var sign = this.supportedHedge.find((x: any) => x.currency?.code == currency)?.currency?.sign
    this.addMoreCurrency.value.currencyPair[index].sign = sign;
    this.addMoreCurrency.patchValue({ currencyPair: this.addMoreCurrency.value.currencyPair });

  }

  onTabChange(event: MatTabChangeEvent) {
    this.errorMessage = false
    this.apiError = false
    this.tab = event.index;
  }


}
