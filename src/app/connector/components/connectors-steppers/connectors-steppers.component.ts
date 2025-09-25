import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { WalletsService } from 'src/app/wallets/services/wallets.service';
import { ConnectorService } from '../../connector.service';
import { DataService } from 'src/app/core/services/data.service';
import { ApiMap } from 'src/app/common/api.map';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { ERPType, InvoiceSteps } from '../../enums/status';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-connectors-steppers',
  templateUrl: './connectors-steppers.component.html',
  styleUrls: ['./connectors-steppers.component.scss']
})
export class ConnectorsSteppersComponent implements OnInit {
  connectorForm: FormGroup;
  walletList: any = [];
  erpCustomerSuppliersList: any = [];
  _onDestroy = new Subject<void>();
  fromAutoPilotCashflowComplete: boolean;
  @ViewChild('formStepper') formStepper!: MatStepper;
  unsubscribe$: Observable<any>;

  constructor(private fb: FormBuilder,
    private _walletService: WalletsService,
    private connectorService: ConnectorService,
    private dataService: DataService,
    private _authService: AuthenticationService) {
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
    this.connectorService.GetActiveHedgingCurrency().pipe(takeUntil(this._onDestroy)).subscribe({
      next: (res: any) => {
        this.walletList = res?.supportedHedge;
      },
      error: (err) => { },
    })
  }

  GetErpCustomerSupplierList() {
    this.connectorService
      .GetErpCustomerSupplier()
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
