import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, startWith, switchMap } from 'rxjs';
import moment from 'moment';

import { Router } from '@angular/router';
import { __values } from 'tslib';
import { BenificiaryModel, BenificiaryStatus } from '../../../../models/BenificiaryModel';
import { Direction } from '../../../../../main-dashboard/enums/riskProfitLoss.enum';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { getAllBeneficieryByAccount } from '../../../../payments-data/all-beneficiaries-data';
// import { SendStep3Component } from '../send-step3/send-step3.component';
import DateFormat from '../../../../../shared/constants/DateFormat';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SendStep3Component } from '../send-step3/send-step3.component';

@Component({
  selector: 'app-send-step2',
  templateUrl: './send-step2.component.html',
  styleUrls: ['./send-step2.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  providers: [SendStep3Component]
})
export class SendStep2Component implements OnInit {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('beneficiaryName') beneficiaryName?: any;
  @Input('futurePayment') futurePayment?: any;
  @Input('type') type?: any;
  @Input('OCR_payment_uploadFile') OCR_payment_uploadFile: any;
  @Input('activeWalletCurrency') activeWalletCurrency: any;
  @Input('createPayment') createPayment: any;

  files: File[] = [];
  showCustomInvoiceCreate = false;
  payerProfile!: string;
  isLastStep = false;
  selectedProduct: any;
  beneficiaryObjectData: any;
  loading!: boolean;
  errMsg: any;
  filteredBeneficiary$!: Observable<BenificiaryModel[]>;
  filterControl = new FormControl('');
  benificiryData$!: Observable<BenificiaryModel[]>;
  roles: any;
  selectedOption = 'option1';
  minDate = new Date();
  approvedBenificiary!: BenificiaryModel[];
  errorMessage: any;
  uploadFileButton = true;
  uplodFileSuccess = true;
  spinner!: boolean;
  uploadAPIError: any;
  allData: any;
  resultArray: any[] = [];
  maximumFileReach!: boolean;
  resultFileID: any[] = [];
  uploadPDFPreviewError = '';
  currentFileIndex = 0;
  paymentType!: string;
  fileName!: string;
  currencyPairs: any;
  strongCurrency: any;
  weakCurrency: any;
  FinalDirection: Direction | undefined;
  spotRate: any;
  showLoader = false;
  payerListWithActiveCurr: any = [];
  isReadOnly: boolean = false;
  selectedBeneficiary: any;
  beneficiaryData:any = '';
  beneficiaryData1:any = ''
  holidayDates!: Date[];
  openBeneficiaryList = true;
  clickBeneficiary!: boolean;
  beneficiaryDetails: any;
  beneficiaryList!: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private walletService: WalletsService,
    private sendstep3: SendStep3Component,
  ) { }

  ngOnInit() {
    this.beneficiaryName?.reset();
    this.showLoader = true;
    this.filteredBeneficiary$ = this.filterControl.valueChanges.pipe(
      startWith(''),
      switchMap((val) => {
        return this._filter(val || '');
      })
    );
    // this.roles = this.auth.getRoleOfUser();
    this.filteredBeneficiary$.subscribe(
      (data) => {
        this.showLoader = false;
        this.approvedBenificiary = data;
        for (var i = 0; i < this.approvedBenificiary.length; i++) {
          if (this.approvedBenificiary[i].currency != this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code) {
            this.payerListWithActiveCurr.push(this.approvedBenificiary[i])
          }
        }
      },
      (err) => {
        this.showLoader = false;
        this.errorMessage = err?.error?.apiErrorMessage[0] ?? '';
      }
    );
    this.paymentType = this.type.value.paymentType;
    if (this.paymentType == 'future_payment') {
      this.getNotradeList();
    }

    of(getAllBeneficieryByAccount).subscribe(result => {
      this.beneficiaryList = result;
    })
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
    });
    let contentContainer = document.querySelector('.mat-horizontal-content-container') as HTMLElement;
    if (contentContainer && this.paymentType === 'future_payment') {
      contentContainer.style.overflow = 'visible';
    }
  }


  isSalaryStepTwo(result: boolean) {
    // console.log({ result });
    this.isReadOnly = result;
  }
  benificiarySelect(ev: any) {
    this.beneficiaryName.value.currency = ev.currency;
    this.beneficiaryName.patchValue({
      currency: ev.currency
    })
    this.beneficiaryName.patchValue({
      bankDetails: ev
    })
  }

  private _filter(value: string): Observable<any[]> {
    // return this.contactService.getAllBeneficieryByAccount().pipe(
    //   map((response) =>
        return of(this.beneficiaryList.filter((option: { status: any; bankAccountHolderName: string; }) => {
          return option.status == BenificiaryStatus.Approved
            ? option.bankAccountHolderName
              ?.toLowerCase()
              ?.indexOf(value.toLowerCase()) === 0
            : false;
        }))
    //   )
    // );
  }

  // commonCodeForManually(stepper: any, progress: any) {
  //   this.createPayment.reset()
  //   this._commonService.getCurrentRate(this.beneficiaryName.value.currency, this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code).pipe(
  //     tap((res: any) => {
  //       let keyExist = Object.keys(res).some(key => key === this.beneficiaryName.value.currency);
  //       if (keyExist) {
  //         this.beneficiaryName.patchValue({
  //           firstAmount: res[this.beneficiaryName.value.currency],
  //           secondAmount: res[this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code],
  //         })
  //       }
  //       // this.currentExchangeRate = res?.rates;
  //     })
  //   ).subscribe();
  //   this.walletService
  //     .geBalanceByCurrency(this.beneficiaryName.value.currency)
  //     .subscribe((data) => {
  //       this.showLoader = false
  //       this.createPayment?.get('chargeCurrency')?.setValue(data?.wallet_Currency?.sign); // set currency sign
  //     }, (err) => {
  //       this.showLoader = false
  //     });
  //   stepper.next()
  //   let totalSteps = stepper.steps.length;
  //   let currentStep = stepper.selectedIndex + 1;
  //   progress.value = (currentStep * 100) / totalSteps;
  //   if (this.createPayment.value.amount) {
  //     this.walletService.setApiObs('amount')
  //   }
  //   this.sendstep3.ngOnInit();
  //   this.sendstep3.ngAfterViewInit();
  // }

  nextStep(stepper: any, progress: any) {
    this.createPayment.reset()
    // this._commonService.getCurrentRate(this.beneficiaryName.value.currency, this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code).pipe(
    //   tap((res: any) => {
    //     let keyExist = Object.keys(res).some(key => key === this.beneficiaryName.value.currency);
    //     if (keyExist) {
    //       this.beneficiaryName.patchValue({
    //         firstAmount: res[this.beneficiaryName.value.currency],
    //         secondAmount: res[this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code],
    //       })
    //     }
    //     // this.currentExchangeRate = res?.rates;
    //   })
    // ).subscribe();
    // this.walletService
    //   .geBalanceByCurrency(this.beneficiaryName.value.currency)
    //   .subscribe((data) => {
    //     this.showLoader = false
    //     this.createPayment?.get('chargeCurrency')?.setValue(data?.wallet_Currency?.sign); // set currency sign
    //   }, (err) => {
    //     this.showLoader = false
    //   });
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
    if (this.createPayment.value.amount) {
      this.walletService.setApiObs('amount')
    }
    this.sendstep3.ngOnInit();
    this.sendstep3.ngAfterViewInit();
  }

  nextStepForPlan(stepper: any, progress: any) {
    this.futurePayment.patchValue({amount: null});
    this.futurePayment.patchValue({currency: null});
    let beneficiaryCurrency = this.beneficiaryName?.value?.currency
    let selectedCurrency = this.activeWalletCurrency?.selectedwalletInfo?.wallet_Currency?.code
    this.getPairWithRate(beneficiaryCurrency, selectedCurrency)
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
    stepper.next();
    if (this.createPayment.value.amount) {
      this.walletService.setApiObs('amount');
    }
  }

  getPairWithRate(benificiaryCurrency: any, selectedCurrency: any) {
    this.showLoader = true;

    // Generate the currency pair locally
    const currencyPair = (selectedCurrency + benificiaryCurrency).toUpperCase();
    this.currencyPairs = currencyPair;

    if (currencyPair) {
      let direction;
      this.strongCurrency = currencyPair.slice(0, 3);
      this.weakCurrency = currencyPair.slice(3);

      // Determine direction based on which currency is the beneficiary
      if (this.strongCurrency === benificiaryCurrency.toUpperCase()) {
        direction = Direction.Up;
      } else if (this.weakCurrency === benificiaryCurrency.toUpperCase()) {
        direction = Direction.Down;
      }

      this.showLoader = false;
      this.spotRate = 2.29677600000?.toFixed(4);

      if (this.activeWalletCurrency?.payment) {
        this.createPayment.patchValue({
          currentRate: this.spotRate
        });
      }

    } else {
      this.showLoader = false;
    }
  }
  getBeneficiaryInfo1(beneficiary1:any){
    this.beneficiaryData1 = ''
    if(beneficiary1?.bankName){
      this.beneficiaryData1 += beneficiary1?.bankName
    }
    if(beneficiary1?.bankBranch){
      this.beneficiaryData1 += ' | '+beneficiary1?.bankBranch
    }
    if(beneficiary1?.bankNumber){
      this.beneficiaryData1 += ' | '+beneficiary1?.bankNumber
    }
    if(beneficiary1?.accountNumber){
      this.beneficiaryData1 += ' | '+beneficiary1?.accountNumber
    }
    return this.beneficiaryData1
  }

  getBeneficiaryInfo(beneficiary:any){
    this.beneficiaryData = ''
    if(beneficiary?.bankAccountHolderName){
      this.beneficiaryData += beneficiary?.bankAccountHolderName
    }
    if(beneficiary?.bankCountry){
      this.beneficiaryData += ' | '+beneficiary?.bankCountry + ' | '
    }
    return this.beneficiaryData
  }
  previousStep(stepper: any, progress: any) {
    if(this.activeWalletCurrency?.transaction){
      this.dialog.closeAll()
    }else{
      // this.type.value.paymentType = 'upload_file';
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
    }
  }

  createBenificiaryDialog() {
    // const dialogRef = this.dialog.open(AddContactsComponent, {
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   disableClose: true,
    // });
  }

  dateChanged(ev: any) {
    let date = moment(ev.value).format(DateFormat.dateInput);
    // this.createTransfer.value['orderDetailes.FlightDate'] = date;
  }
  futurePaymentDateChanged(ev: any) {
    this.futurePayment.patchValue({ 'expiryDate': ev.value });
  }
  movePayerPage() {
    // this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + `${AppPages.Contacts}` : `${AppPages.Contacts}`]);
  }

  async onFileSelect(event: any) {
    this.showLoader = true;
    this.uploadAPIError = '';
    this.files.push(...event.addedFiles);
    if (this.files?.length > 0) {
      this.uploadFileButton = false;
    } else {
      this.uploadFileButton = true;
    }

    if (this.files?.length > 10) {
      this.maximumFileReach = true;
      this.files = [];
      this.showLoader = false;
    } else {
      this.maximumFileReach = false;
    }

    // for (var i = 0; i < this.files.length; i++) {
    //   let formData = new FormData();
    //   formData.append('file', this.files[i]);
    //   let body = {
    //     file: formData.append('file', this.files[i]),
    //   };
    // }
  }

  onFileChange(event: any) {
    this.files.splice(this.files?.indexOf(event), 1);
  }

  sendManually() {
    // if(this.type.value.paymentType == 'upload_file'){

    // }
    // this.type.patchValue({
    //   paymentType: 'payment_manually'
    // })

    this.paymentType = 'payment_manually';

  }

  holidayFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const time = new Date(date).getTime();
    const day = new Date(date).getDay();
    const today = new Date();
    const isWeekend = day === 0 || day === 5;
    today.setDate(today.getDate() + 1);
    return !this.holidayDates.find((x: any) => x.getTime() == time) && (date >= today) && !isWeekend;
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

  openBeneficiaryContainer() {
    document.getElementById("beneficiaryDropdownId")?.classList?.remove('d-none')
    this.openBeneficiaryList = true;
    this.clickBeneficiary = true;
  }

  GetbeneficiarySymbol(arg: any) {
    let beneficiaryName = arg.split(" ")
    let fName = beneficiaryName && beneficiaryName[0] ? beneficiaryName[0].substring(0, 1).toUpperCase() : '';
    let lName = beneficiaryName && beneficiaryName[1] ? beneficiaryName[1].substring(0, 1).toUpperCase() : '';
    return fName + lName;
  }

  getBeneficiary(beneficiary: any) {
    this.beneficiaryDetails = beneficiary;
  }

  selectBeneficiary(beneficiary: any) {
    this.futurePayment.get('beneficiaryId').patchValue(beneficiary);
    this.beneficiaryName.value.currency = beneficiary.currency;
    this.beneficiaryName.patchValue({
      currency: beneficiary.currency
    })
    this.beneficiaryName.patchValue({
      bankDetails: beneficiary
    })
    this.openBeneficiaryList = false;
  }
}
