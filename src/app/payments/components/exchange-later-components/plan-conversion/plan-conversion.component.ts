import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { ExchangeMainComponent } from '../../exchange-now-components/exchange-main/exchange-main.component';
import { MatMenuModule } from '@angular/material/menu';
import { PlanConversionStep1Component } from '../plan-conversion-step1/plan-conversion-step1.component';
import { CommonModule } from '@angular/common';
import { ConvertStep3Component } from '../convert-step3/convert-step3.component';
import { PlanConversionDoneComponent } from '../plan-conversion-done/plan-conversion-done.component';

@Component({
  selector: 'app-plan-conversion',
  templateUrl: './plan-conversion.component.html',
  styleUrls: ['./plan-conversion.component.scss'],
  imports: [CommonModule, MatMenuModule, MatDialogModule, MatStepperModule, PlanConversionDoneComponent, PlanConversionStep1Component, ConvertStep3Component]
})
export class PlanConversionComponent {
  @ViewChild('formStepperProgress') formStepperProgress!: MatProgressBar;
  @ViewChild('formStepper') formStepper!: MatStepper;
  isLastStep = false;
  planConversionForm: FormGroup | any;
  activeWallet:any;
  walletData:any;
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _walletService:WalletsService
  ) {

  }

  ngOnInit(): void {
    this._walletService.activeCurrentWallet.subscribe((wallet) => {
      this.walletData = {
        selectedwalletInfo: wallet,
      }
    });
    this.planConversionForm = this.fb.group({
      convertMoneyOption: this.fb.group({
        dueDate: ['', Validators.required]
      }),
      yourOwnRate: this.fb.group({
        buyAmount: [''],
        sellAmount: [''],
        fromCurrency: ['', Validators.required],
        toCurrency: ['', Validators.required],
        toSign: [''],
        spotRate: ['', Validators.required],
        dueDate: [''],
        transferOnly: [''],
        termsCondition: ['']
      }),
    })
    if(this.data?.selectedCalendarDate){
      this.planConversionForm.get('convertMoneyOption')?.patchValue({ 'dueDate': this.data?.selectedCalendarDate });
    }
  }

  stepChange(stepper: any) {
    this.isLastStep = stepper.selectedIndex == stepper.steps.length - 1;
  }

  exchangeNow() {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    this.dialog
      .open(ExchangeMainComponent, {
        width: '100vw',
        maxWidth: '100vw',
        data: {
          selectedwalletInfo: currency
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data: any) => {
        // console.log('Exchange now dialog closed!');
      });
  }

  exchangePlanConvert() {
    if (this.formStepper?.selectedIndex == 0) {
      this.planConversionForm.get("convertMoneyOption").patchValue({ 'dueDate': '' });
    } else if (this.formStepper?.selectedIndex == 1) {
      this.planConversionForm.get("convertMoneyOption").patchValue({ 'dueDate': '' });
      this.formStepper.previous()
    } else if (this.formStepper?.selectedIndex == 2) {
      this.planConversionForm.get("convertMoneyOption").patchValue({ 'dueDate': '' });
      this.formStepper.selectedIndex = 0;
    }
  }

  previousStep(){
    if (this.formStepper?.selectedIndex == 0) {
      this.dialog.closeAll()
    } else{
      this.formStepper.previous()
    }
  }

}
