import { Component, Input } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(
    private dashboardService: DashboardService,
    private translateService: TranslateService) {
  }
  ngOnInit() {
    this.showLoader = true
    // this.dashboardService.GetDefaultCurrency().subscribe(res => {
    //   this.showLoader = false
    //   this.defaultCurrencyValue = res?.baseCurency;
    //   this.defaultCurrency?.patchValue({ 'currency': this.defaultCurrencyValue });
    // }, (err) => {
    //   this.showLoader = false
    // })
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

  translateIfExists(trancurrency: string, currency: string): string {
    return this.translateService.instant(trancurrency) !== trancurrency ? this.translateService.instant(trancurrency) : currency;
  }

  nextStep() {
    this.showLoader = true;
    let params = {
      currency: this.defaultCurrencyValue,
    };
    // this.dataService.getRequest<{ result: any }>(ApiMap.updateMainCurrency.url, params)
    //   .subscribe({
    //     next: (response) => {
    //       this.updateMainCurrencyError = ''
    //       this.showLoader = false;
          this.formStepper.next();
    //     },
    //     error: (err) => {
    //       this.showLoader = false;
    //       this.updateMainCurrencyError = err?.error?.apiErrorMessage || err?.error?.message;
    //     }
    //   });
  }
}
