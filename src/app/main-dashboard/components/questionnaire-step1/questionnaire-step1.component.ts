import { Component, Input } from '@angular/core';
import { getAllCurrencies } from '../../dashboard-data/all-currency-data';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questionnaire-step1',
  templateUrl: './questionnaire-step1.component.html',
  styleUrls: ['./questionnaire-step1.component.scss'], 
  imports: [MatSelectModule, CommonModule]
})
export class QuestionnaireStep1Component {
  @Input('formStepper') formStepper?: any;
  @Input('defaultCurrency') defaultCurrency: any;
  @Input('currencyList') currencyList: any;
  defaultCurrencyValue: any;
  showLoader: boolean = false;
  activeHedgeCurrencyList: any = [];
  updateMainCurrencyError!: string;

  constructor() {
  }
  ngOnInit() {
    this.showLoader = true
    this.getAllCurrencies();

  }
  getAllCurrencies() {
    this.showLoader = true;
    of(getAllCurrencies).subscribe((res:any) => {
      this.activeHedgeCurrencyList = res?.filter((data: any) => data.active == 1);
      this.showLoader = false;
    },
    (err) => {
      this.showLoader = false;
    })
  }

  changeCurrency(event: any) {
    this.defaultCurrencyValue = event?.value;
    this.defaultCurrency?.patchValue({ 'currency': event?.value });
  }

  nextStep() {
    this.showLoader = true;
    this.formStepper.next();
  }
}
