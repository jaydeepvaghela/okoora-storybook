import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FxRuleFrequency, FxRuleOperator } from '../../enums/enums';
import moment from 'moment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FxErpStepperComponent } from '../../../fx-erp-stepper/fx-erp-stepper.component';
import { FxDashboardService } from '../../../../../fx-dashboard/services/fx-dashboard.service';
import { ConnectorService } from '../../../../../connector/connector.service';
import DateFormat from '../../../../../shared/constants/DateFormat';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-fx-conversion-step6',
  templateUrl: './fx-conversion-step6.component.html',
  styleUrls: ['./fx-conversion-step6.component.scss'],
  imports: [CommonModule, MatCheckboxModule, FormsModule]
})
export class FxConversionStep6Component {
  @Input() stepper!: MatStepper;
  @Input() currencyPair: string = ''; // currency pair string
  @Input() currentRate: string = ''; // current rate for the currency pair
  @Input() fxConversionForm!: FormGroup;

  emailNotifications: boolean = false;
  summaryData: any;
  private readonly destroy$ = new Subject<void>();
  isTandCChecked = false;
  isSubmitted = false;
  isLoading: boolean = false;
  currencySign$: any;
  errorMessage: any;
  termsOfUseUrl: string = 'https://okoora.com/terms-of-service/';
  
  constructor(private readonly _connectorService: ConnectorService,
    private readonly _fxDashboardService: FxDashboardService, private readonly route: Router,
    private readonly matDialog: MatDialog, private dialogRef: MatDialogRef<FxErpStepperComponent>)
   { }


  ngOnInit(): void {
    // subscribe to the role summary data observable to get the form values
    // this will patch the form with the data from the observable
    this.currencySign$ = this._fxDashboardService.currencySignForBuySell$;
    this._connectorService.roleSummaryData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.summaryData = res;
      })
  }

  // redirect to the previous step in the stepper form
  onBack() {
    this.stepper.previous();
  }

  // get the frequency name from the enum
  getFrequencyName(value: number): string {
    return value == FxRuleFrequency.OneTime ? FxRuleFrequency.OneTimeLabel : FxRuleFrequency[value];  // Returns 'Daily', 'Weekly', etc.
  }

  // format date to DD-MM-YYYY
  formatDateToDDMMYYYY(date: Date | string | null | undefined): string {
    if (!date) {
      return '-';  // Return dash for null, undefined, or empty
    }
    const m = moment(date);
    return m.isValid() ? m.format('DD-MM-YYYY') : '-';
  }
  // call the API to create the conversion rule API
  onStartAutomation() {
    this.isSubmitted = true;
    if(this.isTandCChecked){
    const data = this.fxConversionForm.value;
    const obj: {
      ruleName: string;
      buyCurrency: string;
      sellCurrency: string;
      BuyAmount?: number;
      SellAmount?: number;
      executionFrequency: number;
      hasCondition: boolean;
      Operator: number;
      targetRate: number;
      Expiry?: string;
      StartDate: string;
    } = {
      ruleName: data?.ruleName,
      buyCurrency: data?.buyCurrency,
      sellCurrency: data?.sellCurrency,
      BuyAmount: this.parseCurrency(data?.BuyAmount),
      SellAmount: this.parseCurrency(data?.SellAmount),
      executionFrequency: Number(data?.executionFrequency),
      hasCondition: data?.hasCondition !== 0,
      Operator: data?.hasCondition === 1 ? FxRuleOperator.GreaterThan : FxRuleOperator.LowerThan,
      targetRate: Number(data?.targetRate),
      Expiry: data?.Expiry ? moment(data?.Expiry).format(DateFormat.paymentDateFormat) : '',
      StartDate: data?.StartDate ? moment(data?.StartDate).format(DateFormat.paymentDateFormat) : '',
    }
    if (data?.BuyAmount) {
      delete obj.SellAmount;
    } else if (data?.SellAmount) {
      delete obj.BuyAmount;
    }
    if(!obj.Expiry) {
      delete obj.Expiry;
    }
    this.isLoading = true;
    const mockResponse = of('cb4306fb-ee55-4c7b-9a5d-541b065b2a07');
    // validate the form before proceeding and the API call to create the conversion rule
    of(mockResponse)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // this.dialogRef.close();
          this._connectorService.selectedTabIndexSubject.next(1);
            if(this.route.url.includes('dashboard')) {
              this.dialogRef.close('fromConversion');
            }else {
              this.matDialog.closeAll();
               this.route.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + '/dashboard' : '/dashboard']);

            }

        },

        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.apiErrorMessage?.[0];
        }
      });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // convert date to YYYY-MM-DD format
  parseCurrency(val: any): number {
    if (val == null) return 0;
    const strVal = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(strVal) || 0;
  }
}
