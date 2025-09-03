import { Component, Input } from '@angular/core';
import moment from 'moment';
import DateFormat from '../../../../shared/constants/DateFormat';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-plan-conversion-step1',
  templateUrl: './plan-conversion-step1.component.html',
  styleUrls: ['./plan-conversion-step1.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule]
})
export class PlanConversionStep1Component {
  @Input('convertMoneyOption') convertMoneyOption?: any;
  @Input('yourOwnRate') yourOwnRate?: any;
  @Input('activeWalletCurrency') activeWalletCurrency: any;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  minDate = new Date();
  holidayDates!: Date[];

  constructor() {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  }

  ngOnInit() {
    this.getNotradeList();
  }

  dateChanged(ev: any) {
    this.yourOwnRate.patchValue({ 'dueDate': this.convertMoneyOption?.value?.dueDate });
  }

  holidayFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const time = new Date(date).getTime();
    const day = new Date(date).getDay();
    const today = new Date();
    const isWeekend = day === 0 || day === 6;
    today.setDate(today.getDate() + 1);
    return !this.holidayDates.find((x: any) => x.getTime() == time) && !isWeekend;
  }

  getNotradeList() {
    this.holidayDates = [];
    let FromDate = moment(new Date()).format(DateFormat?.dateInput);
    let ToDate = moment().add(1, 'year').format(DateFormat?.dateInput);
    let currency = this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code;
    // this._commonService.noTradeList(FromDate, ToDate, currency).subscribe((data: any) => {
    //   for (var i = 0; i < data.length; i++) {
    //     this.holidayDates.push(new Date(moment(data[i]?.date).format(DateFormat.parse?.dateInput)));
    //   }
    // })
  }

  nextSteps(stepper: any, progress: any) {
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    if (progress) {
      progress.value = (currentStep * 100) / totalSteps;
    }
    this.formStepper.next();
  }

}
