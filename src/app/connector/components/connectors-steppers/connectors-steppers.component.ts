import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Observable, of, Subject, takeUntil } from 'rxjs';

import { ConnectorService } from '../../connector.service';
import { ERPType } from '../../enums/status';
import { WalletsService } from '../../../main-dashboard/services/wallets.service';
import { getActiveHedgingCurrency } from '../../../fx-dashboard/components/fx-dashboard-data/active-hedging-currency';
import { customerSupplierList } from '../../../fx-dashboard/components/fx-dashboard-data/customer-supplier-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectorsStep4Component } from '../connectors-step4/connectors-step4.component';
import { CfEndpointDocComponent } from '../cf-endpoint-doc/cf-endpoint-doc.component';
import { TranslateModule } from '@ngx-translate/core';
// import { AuthenticationService } from '../../../main-dashboard/services/authentication.service';
// import { DataService } from '../../../main-dashboard/services/data.service';


@Component({
  selector: 'app-connectors-steppers',
  templateUrl: './connectors-steppers.component.html',
  styleUrls: ['./connectors-steppers.component.scss'],
  imports: [CommonModule, MatStepperModule, ConnectorsStep4Component, CfEndpointDocComponent, TranslateModule]
})
export class ConnectorsSteppersComponent implements OnInit {
  connectorForm: FormGroup = {} as FormGroup;
  walletList: any = [];
  erpCustomerSuppliersList: any = [];
  _onDestroy = new Subject<void>();
  fromAutoPilotCashflowComplete: boolean = false;
  @ViewChild('formStepper') formStepper!: MatStepper;
  unsubscribe$: Observable<any> | undefined;

  constructor(private fb: FormBuilder,
    private _walletService: WalletsService,
    private connectorService: ConnectorService,
    ) {
  }

  ngOnInit(): void {
    // this.getUpdatedUserProfile();
    this.getAllCurrencies();
    this.GetErpCustomerSupplierList();
    this.createConnectorForm();

    // const fromConnector = this.connectorService.consumeFromConnector();
    // if (fromConnector && this.formStepper) {
    //   setTimeout(() => {
    //     this.formStepper.selectedIndex = 0;
    //   });
    // }
  }

  // getUpdatedUserProfile() {
  //   this._authService.getUserProfile().pipe(
  //     takeUntil(this._onDestroy),
  //     map((user: any) => {
  //       localStorage.setItem('user', JSON.stringify(user));
  //       return user;
  //     })
  //   ).subscribe();
  // }

  ngAfterViewInit(): void {
    this.connectorService.goToConnectorStep$.subscribe(index => {
      if (index) {
        this.fromAutoPilotCashflowComplete = true;
        this.formStepper.selectedIndex = index;
      } else {
        this.connectorService.fromConnector$.pipe(
          takeUntil(this._onDestroy)
        ).subscribe(fromConnector => {
          if (fromConnector && this.formStepper) {
            this.formStepper.selectedIndex = 3;
          }
        });
        this.checkIsAutomatedHedgingEnabled();
      }
    });
  }

  checkIsAutomatedHedgingEnabled() {
    const user = JSON.parse(localStorage.getItem('user')!);
    const isPayableProtectFilled = user['isPayableProtectFilled'];
    if (isPayableProtectFilled) {
      this.connectorService.selectedAutoPilot$.subscribe((res) => {
        if (res === ERPType.CashFlow.toLocaleLowerCase()) {
          this.formStepper.selectedIndex = 4;
        } else{
          this.formStepper.selectedIndex = 3;
        }
      });
    } else {
      this.formStepper.selectedIndex = 3;
    }
  }

  getAllCurrencies() {
   of(getActiveHedgingCurrency).pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.walletList = res?.supportedHedge;
      },
      error: (err: any) => {
      },
    })
   // this.walletList = [{ currency: 'USD' }, { currency: 'ILS' }] 
  }

  GetErpCustomerSupplierList() {
    this.connectorService
      of(customerSupplierList)
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (res: any) => {
          this.erpCustomerSuppliersList = res;
          this.connectorService.erpCustomerSuppliersListSubject.next(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  createConnectorForm() {
    this.connectorForm = this.fb.group({
      ImportExosureType: [''],
      InvoiceBillCurrencies: [[]],
      InvoiceBillMinExposureAmount: [''],
      InvoiceBillMaxExposureAmount: [''],
      InvoiceBillMaxDuePeriod: [''],
      InvoiceBillBlacklist: [[]],
      CashflowCurrencies: [[]],
      CashflowMinExposureAmount: [''],
      CashflowMaxExposureAmount: [''],
      CashflowMaxDuePeriod: [''],
      directionType: [null],
    });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
