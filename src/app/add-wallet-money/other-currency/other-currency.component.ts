import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, startWith, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FundingAccountModel, GlobalAccountDto, IncomingGlobalAccount } from '../models/FundingAccountModel';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { BankAccountConfirmationComponent } from '../bank-account-confirmation/bank-account-confirmation.component';
import { getAllActiveCurrencies } from '../../main-dashboard/dashboard-data/balanceList-data';
import { ActiveCurrencyModel } from '../../main-dashboard/models/ActiveCurrencyModel';
import { getCcBankAccount } from '../add-money-data/getCcBankAccount';
import { getCcBankAccountCost } from '../add-money-data/getCcBankAccountCost';
import { WalletsService } from '../../main-dashboard/services/wallets.service';
import AppPages from '../../common/constants/AppPages';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { FooterComponent } from '../../main-dashboard/components/footer/footer.component';
@Component({
  selector: 'app-other-currency',
  templateUrl: './other-currency.component.html',
  styleUrls: ['./other-currency.component.scss'],
  imports:[CommonModule,MatMenuModule,MatSelectModule,ReactiveFormsModule,MatListModule,BankAccountConfirmationComponent,FooterComponent]
})
export class OtherCurrencyComponent {
  @ViewChild(MatMenuTrigger) currencyMenu!: MatMenuTrigger;
  @ViewChild('hiddenContent') hiddenContent!: ElementRef;
  @ViewChild(BankAccountConfirmationComponent) AccountConfirmation!: BankAccountConfirmationComponent;
  @Output() onCloseClick = new EventEmitter<any>();
  isViewable: boolean = true;
  isSnackbarVisible: boolean = false;
  panelOpenState: boolean = false;
  activeCurrencies!: ActiveCurrencyModel[];
  filteredCurrencies$!: Observable<ActiveCurrencyModel[]>;
  selectedCurrency!: ActiveCurrencyModel;
  switchedCurrency!: ActiveCurrencyModel;
  filterControl = new FormControl('');
  ccBankAccountDetails!: GlobalAccountDto[] | null;
  fundingAccounts!: FundingAccountModel | null;
  coppiedItem!: string;
  accountDetailsToCopy!: string;
  internationalTransferDetailsToCopy!: string;
  hasFreeBankAccount: boolean = false;
  showLoader = true;
  ccBankAccountCostDetails: any;
  apiErrorMessage = '';
  isAffiliateEu!: boolean;
  showWalletType = false;
  hasErrorGlobalBankAccountError: boolean = false;
  isBuyWalletSuccess = false;
  transferFeeType = new FormControl();
  subSite!: string | null;
  isNonIsraeliUser: any;
  incomingGlobalAccount!: IncomingGlobalAccount
  isOpenAccountActive!: string;

  constructor(
    private _walletService: WalletsService,
    public dialog: MatDialog,
    private router: Router,
    private matDrawer: MatDrawer
  ) { }

  ngOnInit() {
    // this.isNonIsraeliUser = this._authService.isNonIsraelUser();
    this.subSite = localStorage.getItem('subSite')
    // this._authService.currentUserProfile.subscribe((clientProfileData: any) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.isAffiliateEu = user?.afiiliate?.currency === 'EUR';
    // });

    of(getAllActiveCurrencies).subscribe((result => {
      this.activeCurrencies = result;
      this.selectedCurrency = result[0];
      this.switchedCurrency = this.selectedCurrency;
      this.getCCBankAccount(this.switchedCurrency?.currency?.code);
      this.changeSearch();
    }));
  }

  generatePDF() {
    const globalAccountId = this.ccBankAccountDetails?.[0]?.id;
    if (this.isNonIsraeliUser) {
      // if(this.isOpenAccountActive.toLocaleLowerCase() == 'active'){ // currently we are not receiving the status
      this.showLoader = true;
      this.downloadGlobalAccountStatement(globalAccountId, this.switchedCurrency?.currency?.code);
      // }else{
      this.showLoader = false;
      //   this.apiErrorMessage = 'Inactive global account. Please contact support';
      // }
    } else {
      this.AccountConfirmation.downloadPdf();
    }
  }
  downloadGlobalAccountStatement(globalAccountId: any, currency: string) {
    const body = {};
    const options = {
      responseType: 'blob' as 'json'
    };
    this.apiErrorMessage = '';
    // this.dataService.downloadPdfPost<Blob>(ApiMap.GenerateGlobalAccountStatement.url + `?globalAccountId=${globalAccountId}`, body, options).subscribe((blob: Blob) => {
    //   const file = new Blob([blob], { type: 'application/pdf' });
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(file);
    //   link.download = `${currency}GlobalAccountConfirmation`;
    //   link.click();
    //   window.URL.revokeObjectURL(link.href);
    //   this.showLoader = false;
    // }, error => {
    //   this.showLoader = false;
    //   this.apiErrorMessage = 'Statement not found or could not be generated.';
    // });
  }

  private _filter(value: string): any[] {
    return this.activeCurrencies.filter((currency) =>
      currency.currency.code.toLowerCase().includes(value.toLowerCase())
    );
  }

  changeSearch() {
    this.filteredCurrencies$ = this.filterControl.valueChanges.pipe(
      startWith(''),
      map((val) => {
        return this._filter(val || '');
      })
    );
  }

  contentCopied(coppiedItem: string) {
    this.coppiedItem = coppiedItem;
    this.isSnackbarVisible = true;
    setTimeout(() => {
      this.isSnackbarVisible = false;
    }, 3000);
  }

  switchCurrency() {
    this.switchedCurrency = this.selectedCurrency;
    this.getCCBankAccount(this.switchedCurrency?.currency?.code);
    this.apiErrorMessage = '';
    this.currencyMenu.closeMenu();
  }

  closeDrawer() {
    this.onCloseClick.emit();
  }

  getCCBankAccount(currency: string) {
    this.showLoader = true;
    this.hasErrorGlobalBankAccountError = false;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAfiiliate = user.afiiliate.country !== 'il';
    if (isAfiiliate) {
      // this._walletService.getGlobalAccount(currency).subscribe({
      //   next: (result: any) => {
      //     // this.isOpenAccountActive = result['status']; // currently we are not receiving the status
      //     this.showLoader = false;
      //     if (result as IncomingGlobalAccount) {
      //       this.isBuyWalletSuccess = false;
      //       this.showWalletType = false;
      //       this.ccBankAccountDetails = [];
      //       let items = Array.isArray(result) ? result : [result];
      //       this.ccBankAccountDetails = items;
      //       this.getAccountDetailsToCopy();
      //     }
      //   },
      //   error: (err: any) => {
      //     this.showLoader = false;
      //     this.ccBankAccountDetails = null;
      //     this.showWalletType = false;
      //     if (err?.error?.apiErrorCode == 1504) {
      //       //this.openGlobalAccount(currency);
      //       this.getCCBankAccountCost();
      //     }
      //   }
      // });
    } else {
      of(getCcBankAccount).subscribe((result: any) => {
        this.showLoader = false;
        if (result) {
          this.isBuyWalletSuccess = false;
          this.showWalletType = false;
          this.ccBankAccountDetails = result;
          this.getAccountDetailsToCopy();
        }
      });
    }

  }

  mapToGlobalAccountDto(incoming: IncomingGlobalAccount[]): GlobalAccountDto[] {
    return incoming.map((item) => ({
      id: item.id,
      accountName: item.account_name,
      accountNumber: item.account_number,
      institutionName: item.institution?.name ?? '',
      country: item.country_code,
      institutionAddress: item.institution?.address ?? '',
      institutionCity: item.institution?.city ?? '',
      paymentType: item.iban ? 'IBAN' : '',
      accountRoutingType: (item.routing_codes ?? []).map(code => code.type),
      accountRoutingValue: (item.routing_codes ?? []).map(code => code.value),
    }));
  }

  openGlobalAccount(currency: string, transferFeeType: number) {
    this.hasErrorGlobalBankAccountError = false;
    // this._walletService.openGlobalAccount(currency, transferFeeType).subscribe({
    //   next: (result: any) => {
    //     this.showLoader = false;
    //     this.showWalletType = false;
    //     this.isBuyWalletSuccess = false;
    //     this.apiErrorMessage = '';
    //     this.getCCBankAccount(currency);
    //   },
    //   error: (err: any) => {
    //     this.showLoader = false;
    //     this.showWalletType = false;
    //     this.hasErrorGlobalBankAccountError = true;
    //     this.apiErrorMessage = `Global account for ${currency} is currently not available.`;
    //   }
    // });
  }


  openCCBanksAccount(transferFeeType: number) {
    this.showLoader = true;
    let currency = this.switchedCurrency.currency?.code;
    // this._walletService.openCcBankAccount(currency, transferFeeType).subscribe({
    //   next: (result: any) => {
    //     this.showLoader = false;
    //     this.showWalletType = false;
    //     this.isBuyWalletSuccess = true;
    //     this.apiErrorMessage = '';
    //     if (result && transferFeeType == 0) {
    //       this.getCCBankAccount(this.switchedCurrency.currency?.code);
    //     }
    //   },
    //   error: (err: any) => {
    //     this.showLoader = false;
    //     this.apiErrorMessage = err?.error?.apiErrorMessage[0];
    //   }
    // })
  }

  // hasFreeCCBankAccount() {
  //   this.showLoader = true;
  //   this._walletService.hasFreeCcBankAccount().subscribe({
  //     next: (result: any) => {
  //       this.showLoader = false;
  //       if (result === true) {
  //         this.hasFreeBankAccount = result;
  //       }
  //     },
  //     error: (err: any) => {
  //       this.showLoader = false;
  //       this.hasFreeBankAccount = false;
  //
  //     }
  //   })
  // }

  getCCBankAccountCost() {
    this.showLoader = true;
    of(getCcBankAccountCost).subscribe({
      next: (result: any) => {
        this.showLoader = false;
        this.isBuyWalletSuccess = false;
        if (!result?.noCost) {
          this.ccBankAccountCostDetails = result;
          this.transferFeeType.patchValue(this.ccBankAccountCostDetails?.depositFees[0]?.transferFeeType);
          this.hasFreeBankAccount = false;
        } else {
          this.hasFreeBankAccount = true;
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        this.hasFreeBankAccount = false;

      }
    })
  }

  payForBankAccount(noCost = false) {
    this.showLoader = true;
    let currency = this.switchedCurrency.currency?.code;
    let transferFeeType = noCost ? 0 : this.transferFeeType?.value;
    // this._walletService.payForBankAccount(currency, transferFeeType).subscribe({
    //   next: (result: any) => {
    //     this.showLoader = false;
    //     if (result) {
    //       if (this.isAffiliateEu) {
    //         this.openGlobalAccount(this.switchedCurrency.currency?.code, transferFeeType);
    //       } else {
    //         this.openCCBanksAccount(transferFeeType);
    //       }

    //       this._walletService.getAllBalanceList().subscribe();
    //     }
    //   },
    //   error: (err: any) => {
    //     this.showLoader = false;
    //     this.apiErrorMessage = err?.error?.apiErrorMessage[0];
    //   }
    // })
  }

  hasSwiftRoutingType(detail: any): boolean {
    return detail?.accountRoutingType?.some((type: string) =>
      type?.toLowerCase().includes('swift')
    );
  }

  getAccountDetailsToCopy() {
    this.accountDetailsToCopy = ``;
    this.ccBankAccountDetails?.forEach((detail) => {
      const paymentTypeLabel = this.isNonIsraeliUser
        ? (detail?.paymentType === 'SWIFT' ? 'Cross border (Swift)' : 'Local')
        : (detail?.paymentType === 'priority' ? 'Cross border (Swift)' : 'Local');

      this.accountDetailsToCopy += `\n\nPayment type: ${paymentTypeLabel || '-'}\nAccount name: ${detail?.accountName || '-'}\nAccount number: ${detail?.accountNumber || '-'}\nAccount location: ${detail?.country || '-'}\nBank name: ${detail?.institutionName || '-'}\nBank city: ${detail?.institutionCity || '-'}${detail?.iban ? `\nIban: ${detail.iban}` : ''}`;
      let hasSwiftRouting = false;

      detail?.accountRoutingType?.forEach((det, index) => {
        if (det?.toLowerCase().includes('swift')) {
          hasSwiftRouting = true;
        }
        this.accountDetailsToCopy += `\nRouting type: ${det || '-'}\nRouting value: ${detail?.accountRoutingValue[index] || '-'}`;
      });

      if (!hasSwiftRouting) {
        if (detail?.swiftCode) {
          this.accountDetailsToCopy += `\nbic swift: ${detail?.swiftCode}`;
        }
      }
    });
  }


  getInternationalTransferDetailsToCopy() {
    this.internationalTransferDetailsToCopy = `Account number: ${this.fundingAccounts?.account_number || '-'}\nAccount number type: ${this.fundingAccounts?.account_number_type || '-'}\nAccount holder name: ${this.fundingAccounts?.account_holder_name || '-'}\nBank name: ${this.fundingAccounts?.bank_name || '-'}\nBank address: ${this.fundingAccounts?.bank_address || '-'}\nBank country: ${this.fundingAccounts?.bank_country || '-'}\nCurrency: ${this.fundingAccounts?.currency || '-'}\nPayment type: ${this.fundingAccounts?.payment_type || '-'}\nRouting code: ${this.fundingAccounts?.routing_code || '-'}\nRouting code type: ${this.fundingAccounts?.routing_code_type || '-'}`;
  }

  upgradePlan() {
    // const dialogRef = this.dialog.open(MyPlanComponent, {
    //   width: '95vw',
    //   height: '90vh',
    //   maxWidth: '95vw',
    //   panelClass: 'plan-purchase-dialog',
    //   data: {
    //     hideClose: false
    //   }
    // }).afterClosed()
    // .subscribe((shouldReload: any) => {
    //    this.getCCBankAccountCost()
    // });
    this.matDrawer.close();
    document.querySelector('body')!.style.overflowY = 'auto';
    document.querySelector('.drawer-backdrop')?.remove();
    this.router.navigate([localStorage.getItem('subSite') ? localStorage.getItem('subSite') + `${AppPages.Plans}` : `${AppPages.Plans}`]);
  }
}
