import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Observable, map, of, startWith, switchMap, timer } from 'rxjs';
// import { WalletBalanceListModal } from 'src/app/common/models/WalletBalanceListModal';
// import { AddContactsComponent } from 'src/app/contacts/components/add-contacts/add-contacts.component';
// import { BenificiaryModel } from 'src/app/contacts/models/BenificiaryModel';
// import { ContactsService } from 'src/app/contacts/services/contacts.service';
// import { WalletListDialogComponent } from 'src/app/shared/wallet-list-dialog/wallet-list-dialog.component';
// import { PaymentResponseModel } from 'src/app/wallets/models/PaymentResponseModel';
// import { RefreshQuoteResponseModel } from 'src/app/wallets/models/RefreshQuoteResponseModel';
// import { UpdateCostListResponseModel } from 'src/app/wallets/models/UpdateCostListResponseModel';
// import { WalletsService } from 'src/app/wallets/services/wallets.service';
// import { SinglePaymentSendComponent } from '../single-payment-send/single-payment-send.component';
// import { SendComponent } from 'src/app/wallets/components/send/components/send.component';
// import { MassPaymentComponent } from 'src/app/mass-payment/components/mass-payment/mass-payment.component';
import { addMonths } from 'date-fns';
import moment from 'moment';
import { BenificiaryModel, BenificiaryStatus } from '../../../models/BenificiaryModel';
import { WalletBalanceListModal } from '../../../../main-dashboard/models/WalletBalanceListModal';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import DateFormat from '../../../../shared/constants/DateFormat';
import { AccountTransactionsData } from '../../../payments-data/account-transactions-data';
import { SinglePaymentSendComponent } from '../single-payment-send/single-payment-send.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CountdownModule } from 'ngx-countdown';
import { MatInputModule } from '@angular/material/input';
import { getAllBeneficieryByAccount } from '../../../payments-data/all-beneficiaries-data';
import { WalletListDialogComponent } from '../../wallet-list-dialog/wallet-list-dialog.component';
import { MassPaymentComponent } from '../../mass-payment-components/mass-payment/mass-payment.component';

@Component({
  selector: 'app-single-payment-send-step1',
  templateUrl: './single-payment-send-step1.component.html',
  styleUrls: ['./single-payment-send-step1.component.scss'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatMenuModule, FormsModule, ReactiveFormsModule, CountdownModule]
})
export class SinglePaymentSendStep1Component {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('walletList') walletList: any;
  @Input('benificiaryFromContacts') benificiaryFromContacts: any;
  @Input('openBeneficiaryList') openBeneficiaryList = true;
  @Output() timerSubscriptionForComplete = new EventEmitter<any>();
  @Output() createdPaymentDataFortransfer = new EventEmitter<any>()
  @Output() signObjectForSummeryForTransfer = new EventEmitter<any>()
  filteredBeneficiary$!: Observable<BenificiaryModel[]>;
  filterControl = new FormControl();
  beneficiaryData1!: string;
  beneficiaryData!: string;
  selectedWallet!: WalletBalanceListModal;
  WalletCurrency!: WalletBalanceListModal;
  transactionListData: any
  beneficiaryName: any;
  clickBeneficiary!: boolean;
  beneficiaryDetails: any;
  sendAmount: any
  createPaymentAPIError: any;
  requestID: any;
  costList: any;
  costTypeAPIError: any;
  timerSubscription: any;
  refreshAPIError: any;
  config = { leftTime: 15, format: 'mm:ss' };
  createdPaymentData: any;
  chargedAmount: any;
  sendValidAmountError: any;
  afterExchangeRate: any;
  createdSpotRate: any;
  regularcostValue: any;
  showLoader!: boolean;
  transactionListData1: any;
  blurCreatedFlag!: boolean;
  walletListOfAvailableData: any;
  amount_error: boolean = false;
  changeBeneficiary!: boolean;
  changebeneficiaryDetails: any;
  createdMajorRate: any;
  fetchPaymentError: boolean = false;
  validBeneficiarySelected = false;

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletsService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SinglePaymentSendStep1Component>,
  ) { }


  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  // Disable copy on the input field
  @HostListener('document:copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  // Disable cut on the input field
  @HostListener('document:cut', ['$event'])
  onCut(event: ClipboardEvent) {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.showLoader = true
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletListOfAvailableData = data;
      for (let index = 0; index < this.walletListOfAvailableData?.length; index++) {
        let selectedWalletI: any = localStorage.getItem('selectedForRefresh')
        if (selectedWalletI) {
          this.selectedWallet = this.walletListOfAvailableData[selectedWalletI]
        }
        else {
          this.selectedWallet = this.walletListOfAvailableData[0]

        }
      }
    })

    this._walletService.activeCurrentWallet.subscribe(res => {
      this.selectedWallet = res;
      this.WalletCurrency = res;

    });

    const currentDate = new Date();
    const endDate = addMonths(currentDate, -6);
    let ToDate = moment(new Date()).format(DateFormat?.dateInput)
    let FromDate = moment(endDate).format(DateFormat?.dateInput)

    // console.log("FromDate", FromDate);
    // console.log("ToDate", ToDate);
    let payloadData = {
      currency: "",
      FromDate: FromDate,
      ToDate: ToDate
    }

    this.showLoader = true;

    of(AccountTransactionsData).subscribe({
      next: (data) => {
        const transactionList = data;
        this.transactionListData1 = transactionList.filter((transaction) => transaction?.mainType == 1);
        this.transactionListData = this.transactionListData1.slice(0, 4);
        this.showLoader = false;
        this.getWalletData();
      },
      error: (err) => {
        this.fetchPaymentError = true;
        this.showLoader = false;
      }
    });
    
    this.filteredBeneficiary$ = this.filterControl.valueChanges.pipe(
      startWith(''),
      switchMap((val) => {
        return this._filter(val || '');
      })
    );
   
    if (this.benificiaryFromContacts) {
      this.beneficiaryName = this.benificiaryFromContacts?.bankAccountHolderName
      this.filteredBeneficiary$.subscribe(data => {
        if (data) {
          if(this.benificiaryFromContacts?.bankAccountHolderName) {
            this.beneficiaryDetails = data?.find(f => f.bankAccountHolderName == this.benificiaryFromContacts.bankAccountHolderName)
          }else {
            this.beneficiaryDetails = data?.find(f => f.bankAccountHolderName == this.benificiaryFromContacts.account_name)
          }   
        }
      });
      // this.openBeneficiaryList = false
      this.cd.detectChanges()

    }
  }

  handleEvent(e: any) {
    if (e.action == 'done') {
        this.forRefreshData();
    }
  }

  isBeneficiaryPresent(beneficiaryList: any) {
    if (!beneficiaryList || !this.beneficiaryDetails) {
        return false;
    }
    return beneficiaryList.some((beneficiary: any) => {
        const isMatch =
          beneficiary.id === this.beneficiaryDetails.id &&
          beneficiary.accountNumber === this.beneficiaryDetails.accountNumber &&
          beneficiary.bankAccountHolderName === this.beneficiaryDetails.bankAccountHolderName
          && (this.beneficiaryDetails.currency === undefined || beneficiary.currency === this.beneficiaryDetails.currency);
        return isMatch;
    });
  }

  restrictZero(event: any) {
    if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
      event?.preventDefault();
    }
    else {
      if (event?.key == "." && this.sendAmount.includes(".")) {
        event?.preventDefault();
      }
      if (event.ctrlKey && event.key === 'a' || event.ctrlKey && event.key === 'c') {
        return;
      }
      const allowedKeys = /^[0-9.]$/;
      if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }
    }
  }


  ngAfterViewInit() {
    document.addEventListener('click', function (event: any) {
       if (event.target.closest('.recent-list-dropdown')?.classList?.contains('recent-list-dropdown')) {
        var element: any = document.getElementById("beneficiaryDropdownId");
        element?.classList.remove('d-none');
      } else {
        if (event.target.closest('.forHideShow')?.classList?.contains('forHideShow')) {
          var element: any = document.getElementById("beneficiaryDropdownId");
          element?.classList.remove('d-none');
        } else {
          if (event.target.closest('.pay-dropdown-icon')?.classList?.contains('pay-dropdown-icon')) {
            var element: any = document.getElementById("beneficiaryDropdownId");
            element?.classList?.remove('d-none');
          }
          else {
            var element: any = document?.getElementById("beneficiaryDropdownId");
            element?.classList?.add('d-none');

          }

        }

      }
      if (event.target.closest('.change-beneficiary-list')?.classList?.contains('change-beneficiary-list')) {
        var element: any = document.getElementById("changeBeneficiaryId");
        element?.classList.remove('d-none');
      } else {
        var element: any = document?.getElementById("changeBeneficiaryId");
        element?.classList?.add('d-none');
      }
    })
  }

  getWalletData() {
    this.showLoader = true;
    this._walletService.getAllBalanceList().subscribe((res) => {
      res.sort(function (a: any, b: any) { return b.wallet_Amount - a.wallet_Amount });
      this.walletList = res;
      this.showLoader = false;
    })
  }

  closeButton() {
    this.dialogRef.close(this.timerSubscription);
    this.dialog.closeAll()
    this.timerSubscription?.unsubscribe()
  }



  backClose() {
    if (!this.openBeneficiaryList) {
      this.openBeneficiaryList = true;
      this.beneficiaryName = ""
      this.blurCreatedFlag = false;

    }
    else {
      this.dialogRef.close(this.timerSubscription);
      this.dialog.closeAll()
    }
    if (this.benificiaryFromContacts) {
      this.dialogRef.close(this.timerSubscription);
      this.dialog.closeAll()
    }
    this.validBeneficiarySelected = false;
  }
  openBeneficiaryContainer() {
    document.getElementById("beneficiaryDropdownId")?.classList?.remove('d-none')
    this.openBeneficiaryList = true
    this.clickBeneficiary = true
  }
  open() {
    document.getElementById("beneficiaryDropdownId")?.classList?.remove('d-none')
    this.openBeneficiaryList = true
    this.clickBeneficiary = true
  }
  createBenificiaryDialog() {
  }

  getBeneficiary(beneficiary: any) {
    this.beneficiaryDetails = beneficiary
  }
  openBeneficiary() {
    this.changeBeneficiary = true;
  }
  changeBeneficiaryDetails(beneficiary: any) {
    this.changebeneficiaryDetails = beneficiary
  }
  getTransaction(transaction: any) {
    this.beneficiaryName = transaction?.to?.name
    this.beneficiaryDetails = {
      id: transaction?.to?.id,
      currencyISO: transaction?.moneyReceived ? transaction?.moneyReceived?.currency : transaction?.moneyTransferred?.currency,
      bankAccountHolderName: transaction?.to?.name,
      accountNumber: transaction?.to?.accountNumber,
      currency: transaction?.moneyReceived?.currency?.code
    }
    this.openBeneficiaryList = false
    this.cd.detectChanges()
  }
  selectedBeneficiary() {
    this.openBeneficiaryList = false
  }

  selectedBeneficiaryChange(beneficiary:any) {
    this.beneficiaryDetails = beneficiary;
    this.validBeneficiarySelected = true;
    this.changeBeneficiary = false;
    this.refreshAPIError = '';
    this.createPaymentRequest();
  }

  private _filter(value: string): Observable<any[]> {
    return of(getAllBeneficieryByAccount).pipe(
      map((response) =>
        response.filter((option) => {
          return option.status == BenificiaryStatus.Approved
            ? option.bankAccountHolderName
              ?.toLowerCase()
              ?.indexOf(value.toLowerCase()) === 0
            : false;
        })
      )
    );
  }

  getBeneficiaryInfo1(beneficiary1: any) {
    this.beneficiaryData1 = ''
    if (beneficiary1?.currencyISO) {
      this.beneficiaryData1 += beneficiary1?.currencyISO?.code
    }
    if (beneficiary1?.accountNumber) {
      this.beneficiaryData1 += ' | ' + beneficiary1?.accountNumber
    }

    return this.beneficiaryData1
  }

  getChangeBeneficiaryInfo1(beneficiary1: any) {
    this.beneficiaryData1 = ''
    if (beneficiary1?.currencyISO) {
      this.beneficiaryData1 += beneficiary1?.currencyISO?.code
    }
    return this.beneficiaryData1
  }
  getChangeBeneficiaryInfo2(beneficiary1: any) {
    this.beneficiaryData1 = ''
    if (beneficiary1?.accountNumber) {
      this.beneficiaryData1 += beneficiary1?.accountNumber
    }
    return this.beneficiaryData1
  }
  getBeneficiaryInfo(beneficiary: any) {
    this.beneficiaryData = ''
    if (beneficiary?.bankAccountHolderName) {
      this.beneficiaryData += beneficiary?.bankAccountHolderName
    }

    return this.beneficiaryData
  }

  GetbeneficiarySymbol(arg: any) {
    let beneficiaryName = arg.split(" ")
    let fName = beneficiaryName && beneficiaryName[0] ? beneficiaryName[0].substring(0, 1).toUpperCase() : '';
    let lName = beneficiaryName && beneficiaryName[1] ? beneficiaryName[1].substring(0, 1).toUpperCase() : '';
    return fName + lName;

  }

  openWalletListDialog() {
    const dialogRef = this.dialog.open(WalletListDialogComponent, {
      width: '562px',
      height: '544px',
      panelClass: 'wallet-list-dialog',
      disableClose: true,
      data: {
        walletList: this.walletList,
        selectedWallet: this.selectedWallet?.wallet_Currency?.code
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedWallet = result.wallet
        this.cd.detectChanges();
        if (this.sendAmount) {
          this.createPaymentRequest()
        }
      }
    });
  }

  createPaymentRequest() {
    if (this.sendAmount) {
      this.showLoader = true
      let body = {
        amount: this.sendAmount,
        beneficiaryId: this.beneficiaryDetails?.id,
        currency: this.selectedWallet?.wallet_Currency?.code
      };
      this._walletService.mockCreatePaymentRequest(body).subscribe(
        (data: any) => {
          this.showLoader = false;
          this.blurCreatedFlag = true;
          delete this.sendValidAmountError;
          delete this.createPaymentAPIError;
          this.createdPaymentData = data;
          this.createdPaymentDataFortransfer.emit(this.createdPaymentData)
          this._walletService?.SetCreatedPayment(this.createdPaymentData)
          this.chargedAmount = this.createdPaymentData?.paymentRequst?.charge?.toFixed(2)
          this.requestID = data?.requestId;
          this.costList = data?.costList
          this.regularcostValue = this.costList[0]?.value
          this.createdSpotRate = this.createdPaymentData?.paymentRequst?.exchangeRate?.minor?.rate
          this.createdMajorRate = this.createdPaymentData?.paymentRequst?.exchangeRate?.major?.rate
          this.afterExchangeRate = this.createdPaymentData?.paymentRequst?.send * this.createdSpotRate
            const signObjectForSummery = {
              selectedWalletSign: this.selectedWallet?.wallet_Currency?.sign,
              beneficiarySign: this.beneficiaryDetails?.currencyISO?.sign,
              bankAccountHolderName: this.beneficiaryDetails?.bankAccountHolderName
            }
          if (this.timerSubscription) {
            this.timerSubscription?.unsubscribe()
          }
          delete this.refreshAPIError
             this.signObjectForSummeryForTransfer.emit(signObjectForSummery)
          this._walletService?.SetCreatedPaymentSummery(signObjectForSummery)
          this.forRefreshData();
        },
        (err) => {
          this.showLoader = false;
          if (err?.error?.apiErrorCode == 604 || err?.error?.apiErrorCode == 828) {
            this.sendValidAmountError = err?.error?.apiErrorMessage[0];
          }
          else {
            if (document.querySelector('.error-beneficiary-updated-or-deleted') && err?.error?.apiErrorCode == 802) {
              this.createPaymentAPIError = '';
            } else {
              this.createPaymentAPIError = err?.error?.apiErrorMessage[0] ?? '';
              delete this.sendValidAmountError;
            }
          }

          if (this.timerSubscription) {
            this.timerSubscription?.unsubscribe()
          }
          delete this.refreshAPIError

          delete this.createdPaymentData;
          delete this.chargedAmount;
          delete this.requestID;
          delete this.costList;
          delete this.regularcostValue;
          delete this.createdSpotRate;
          delete this.afterExchangeRate;
      })
    }
  }

  forRefreshData() {
    if (this.selectedWallet?.wallet_Currency?.sign != this.beneficiaryDetails?.currencyISO?.sign) {
    }
    else {
      this.timerSubscription?.unsubscribe()
    }
  }


  changeCostType(costList: any, requestID: any) {
    this.showLoader = true
    const ev = costList[0]?.key.substring(0, 1);
  }

  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }
  closeMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }
  nextStep(stepper: any, progress: any) {
    if (!this.sendAmount) {
      this.amount_error = true
    } else {
      this.amount_error = false
      if (!this.blurCreatedFlag) {
        this.createPaymentRequest()
      }
      if (this.formStepper) {
        stepper.next()
        let totalSteps = stepper.steps.length;
        let currentStep = stepper.selectedIndex + 1;
        progress.value = (currentStep * 100) / totalSteps;
        const scrollToTopNext = document.querySelector<HTMLElement>('mat-dialog-content');
        if (scrollToTopNext) {
          scrollToTopNext.scrollTop = 0;
        }
      }
    }
  }

  commaseprate(e: any, fraction: any) {
    if (e) {
      const actualNumber = +e.toString()?.replace(/,/g, '')
      const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: fraction })
      return formatted
    } else {
      return false;
    }
  }

  sendAnotherPayment() {
    let activeWallet: any = localStorage.getItem("activeWallet");
    let currency = JSON.parse(activeWallet)
    this.dialog.open(SinglePaymentSendComponent, {
      width: '100vw',
      maxWidth: '100vw',
      data: {
        selectedwalletInfo: currency,
        payment: true
      },
      disableClose: true,
    }).afterClosed()
      .subscribe((shouldReload: any) => {
        // console.log("shouldReload", shouldReload);
        if (shouldReload) {
          this.timerSubscription = shouldReload
          this.timerSubscription.unsubscribe()
        }
      });
  }

  createMassPayment() {
    this.dialog.open(MassPaymentComponent, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      data: {
        walletList: this.walletList,
      },
    });
  }

}
