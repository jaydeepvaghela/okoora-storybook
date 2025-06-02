import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WalletsService } from '../../services/wallets.service';
import { GetDefaultCurrencyData } from '../../dashboard-data/all-currency-data';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questionnaire-step3',
  templateUrl: './questionnaire-step3.component.html',
  styleUrls: ['./questionnaire-step3.component.scss'], 
  imports: [CommonModule]
})
export class QuestionnaireStep3Component {
  @Input('formStepper') formStepper?: any;
  @Input('defaultCurrency') defaultCurrency: any;
  @Input('defaultCurrencyValue') defaultCurrencyValue: any;
  @Input('addMoreCurrency') addMoreCurrency: any;
  showLoader: boolean = false;
  exposureList:any;

  constructor(
    private dashboardService:DashboardService,
    private fb: FormBuilder,
    private _walletService: WalletsService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    console.log("defaultCurrencyValue", this.defaultCurrencyValue);
    of(GetDefaultCurrencyData).subscribe((res:any) => {
      this.showLoader = false
      this.exposureList = res?.exposers
    },
      (err:any) => {
        this.showLoader = false
      })
  }

  previousStep() {
    this.formStepper.previous();
  }

  editQuestionary(currency:any){
    for (let index = 0; index <= this.addMoreCurrency.value.currencyPair.length; index++) {
      this.addMoreCurrency.get('currencyPair').removeAt(this.addMoreCurrency.value.currencyPair.length - 1);
    }
    this.getBalanceList(currency)
  }

  getCurrencyPair(): FormGroup {
    return this.fb.group({
      buy: [{value: '', disabled: false}],
      amount: ['',  Validators.required],
      sign: '',
      direction: ''
    });
  }

  getBalanceList(currency:any){
    this._walletService.getAllBalanceList().subscribe((result: any) => {
      this.showLoader = false
      if (this.addMoreCurrency.value.currencyPair.length == 0) {
        this.addMoreCurrency.get('currencyPair').push(this.getCurrencyPair());

      }
      let array = result?.find((x:any)=> x.wallet_Currency.code == currency)
      // this.addMoreCurrency.controls['currencyPair'].controls[0].controls.buy.disable();
      this.addMoreCurrency.patchValue({ currencyPair: [{buy: currency , amount: array.wallet_Hedging.exposureAmount,sign:array.wallet_Currency.sign,direction:Number(array.wallet_Hedging.buy_Sell) - 1}] });
      this.formStepper.previous();
    },
    (err)=>{
      this.showLoader = false
    })
  }

  closeAlldialog(){
    this._walletService.getAllBalanceList().subscribe();
    this.dialog.closeAll();

  }

}
