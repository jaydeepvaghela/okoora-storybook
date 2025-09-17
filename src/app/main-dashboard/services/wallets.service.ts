

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, Subject, tap } from 'rxjs';
import { WalletBalanceListModal } from '../models/WalletBalanceListModal';
import { balanceList } from '../dashboard-data/balanceList-data';

const pairMatrix = [
  'USDJPY',
  'EURJPY',
  'GBPJPY',
  'AUDJPY',
  'CHFJPY',
  'CADJPY',
  'NZDJPY',
  'JPYZAR',
  'JPYINR',
  'JPYTRY',
  'JPYRUB',
  'JPYMXN',
  'JPYBRL',
  'JPYNOK',
  'JPYSEK',
  'EURUSD',
  'GBPUSD',
  'AUDUSD',
  'USDCHF',
  'USDCAD',
  'NZDUSD',
  'USDZAR',
  'USDINR',
  'USDTRY',
  'USDRUB',
  'USDMXN',
  'USDBRL',
  'USDNOK',
  'USDSEK',
  'EURGBP',
  'EURAUD',
  'EURCHF',
  'EURCAD',
  'EURNZD',
  'EURZAR',
  'EURINR',
  'EURTRY',
  'EURRUB',
  'EURMXN',
  'EURBRL',
  'EURNOK',
  'EURSEK',
  'GBPAUD',
  'GBPCHF',
  'GBPCAD',
  'GBPNZD',
  'GBPZAR',
  'GBPINR',
  'GBPTRY',
  'GBPRUB',
  'GBPMXN',
  'GBPBRL',
  'GBPNOK',
  'GBPSEK',
  'AUDCHF',
  'AUDCAD',
  'AUDNZD',
  'AUDZAR',
  'AUDINR',
  'AUDTRY',
  'AUDRUB',
  'AUDMXN',
  'AUDBRL',
  'AUDNOK',
  'AUDSEK',
  'CADCHF',
  'NZDCHF',
  'CHFZAR',
  'CHFINR',
  'CHFTRY',
  'CHFRUB',
  'CHFMXN',
  'CHFBRL',
  'CHFNOK',
  'CHFSEK',
  'NZDCAD',
  'CADZAR',
  'CADINR',
  'CADTRY',
  'CADRUB',
  'CADMXN',
  'CADBRL',
  'CADNOK',
  'CADSEK',
  'NZDZAR',
  'NZDINR',
  'NZDTRY',
  'NZDRUB',
  'NZDMXN',
  'NZDBRL',
  'NZDNOK',
  'NZDSEK',
  'ZARINR',
  'TRYZAR',
  'ZARRUB',
  'ZARMXN',
  'BRLZAR',
  'NOKZAR',
  'ZARSEK',
  'TRYINR',
  'RUBINR',
  'MXNINR',
  'BRLINR',
  'NOKINR',
  'SEKINR',
  'TRYRUB',
  'TRYMXN',
  'TRYBRL',
  'TRYNOK',
  'TRYSEK',
  'MXNRUB',
  'BRLRUB',
  'NOKRUB',
  'SEKRUB',
  'BRLMXN',
  'NOKMXN',
  'SEKMXN',
  'BRLNOK',
  'BRLSEK',
  'NOKSEK',
  'HRKILS',
  'RUBILS',
  'INRILS',
  'JPYILS',
  'GBPILS',
  'BGNILS',
  'ZARILS',
  'TWDILS',
  'RONILS',
  'CHFILS',
  'SEKILS',
  'TRYILS',
  'USDILS',
  'THBILS',
  'CADILS',
  'KRWILS',
  'CZKILS',
  'CNYILS',
  'EURILS',
  'NOKILS',
  'AUDILS',
  'ILSUAH',
  'ILSHUF',
  'BRLILS',
  'ILSPLN',
  'NZDILS',
  'USDHUF',
  'XAGUSD',
  'SGDUSD',
  'DKKUSD',
  'USDBGN',
  'USDTHB',
  'USDPLN',
  'EURSGD',
  'USDRON',
];
@Injectable({
  providedIn: 'root',
})
export class WalletsService {

  private requestId = new BehaviorSubject<any>({});
  requestIdchange = this.requestId.asObservable();

  public getCurrentWallet = new BehaviorSubject<any>({});
  activeCurrentWallet = this.getCurrentWallet.asObservable();

  public getAlertData = new BehaviorSubject<any>({});
  AlertExposure = this.getAlertData.asObservable();

  private walletList$ = new BehaviorSubject<WalletBalanceListModal[]>([]);
  availableWallets = this.walletList$.asObservable();
  private transactionList$ = new BehaviorSubject<any[]>([]);
  walletTransactions = this.transactionList$.asObservable();
  private walletObs$: BehaviorSubject<any> = new BehaviorSubject(null);
  private ActivityObs$: BehaviorSubject<any> = new BehaviorSubject(null);
  private walletData = new BehaviorSubject<WalletBalanceListModal[]>([]);
  availableWalletsData = this.walletData.asObservable();
  private profileObs$: BehaviorSubject<any> = new BehaviorSubject(null);
  private beneficiaryList = new BehaviorSubject(<any>{});
  availableBeneficiary = this.beneficiaryList.asObservable();


  walletDataForLock = new BehaviorSubject<WalletBalanceListModal[]>([]);
  availableWalletsDataForLock = this.walletDataForLock.asObservable();

  public getRefreshValuePayment = new BehaviorSubject<any>({});
  currentRefreshValuPayment = this.getRefreshValuePayment.asObservable();


  public getCreatedPaymentData = new BehaviorSubject<any>({});
  currentCreatedPayment = this.getCreatedPaymentData.asObservable();

  public getCreatedPaymentDataSummery = new BehaviorSubject<any>({});
  currentCreatedPaymentSummery = this.getCreatedPaymentDataSummery.asObservable();

  public getImportMassPaymentFile = new BehaviorSubject<any>({});
  currentImportMassPaymentFile = this.getImportMassPaymentFile.asObservable();

  private currentCurrencyValue: any;
  private isCompleteSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public alertListRefresh$: BehaviorSubject<any> = new BehaviorSubject(false);

  private activeWalletSubject = new BehaviorSubject<WalletBalanceListModal | null>(
    JSON.parse(localStorage.getItem('activeWallet') || 'null')
  );

  activeWallet$ = this.activeWalletSubject.asObservable();

  private lengthValueSubject = new Subject<boolean>();
  lengthValue$ = this.lengthValueSubject.asObservable();
  allowedHedgeCurrencies$ = new BehaviorSubject<Set<string>>(new Set());
  private balanceRefreshTrigger$ = new BehaviorSubject<boolean>(false);
  balanceRefresh$ = this.balanceRefreshTrigger$.asObservable();
  constructor(public router: Router) { }

  setActiveWallet(wallet: WalletBalanceListModal) {
    localStorage.setItem('activeWallet', JSON.stringify(wallet));
    this.activeWalletSubject.next(wallet);
  }

  getActiveWallet(): WalletBalanceListModal | null {
    return this.activeWalletSubject.value;
  }

  SetRefreshValuePayment(alert: any) {
    this.getRefreshValuePayment.next(alert);
  }
  SetCreatedPayment(alert: any) {
    this.getCreatedPaymentData.next(alert);
  }

  SetCreatedPaymentSummery(alert: any) {
    this.getCreatedPaymentDataSummery.next(alert);
  }

  SetImportMassPAymentFile(alert: any) {
    this.getImportMassPaymentFile.next(alert);
  }

  setCurrentCurrencyData(currency: any) {
    this.getCurrentWallet?.next(currency);
  }

  setAlertData(alert: any) {
    this.getAlertData.next(alert);
  }

  getwalletObs(): Observable<any> {
    return this.walletObs$.asObservable();
  }

  setwalletObs(profile: any) {
    this.walletObs$.next(profile);
  }

  getFutureActivityObs(): Observable<any> {
    return this.ActivityObs$.asObservable();
  }

  setFutureActivityObs(profile: any) {
    this.ActivityObs$.next(profile);
  }

  setwalletwalletData(walletData: any) {
    this.walletData.next(walletData);
  }

  setwalletwalletDataForLock(walletData: any) {
    this.walletDataForLock.next(walletData);
  }

  getApiObs(): Observable<any> {
    return this.profileObs$.asObservable();
  }

  setApiObs(profile: any) {
    this.profileObs$.next(profile);
  }

  setLengthValue(value: any) {
    this.lengthValueSubject.next(value);
  }

  triggerBalanceRefresh() {
    this.balanceRefreshTrigger$.next(true);
  }

  // Import your static balance list

  getAllBalanceList() {
    return of(balanceList as unknown as WalletBalanceListModal[]).pipe(
      map((data) => {
        data.sort((a, b) => b.wallet_Amount - a.wallet_Amount);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.afiiliate?.currency === 'EUR') {
          const index = data.findIndex(i => i?.wallet_Currency?.code === 'ILS');
          if (index > -1) {
            data.splice(index, 1);
          }
        }

        return data;
      }),
      tap((result) => {
        if (result) {
          this.setwalletwalletData(result);
        }
      })
    );

  }


  // getWalletTransactionsWithFilter(data: any) {
  //   let params = {
  //     currency: data.activeWallet,
  //     FromDate: data.fromDate,
  //     ToDate: data.toDate,
  //   };
  //   return this._dataService.getRequest<any>(ApiMap.getWalletTransactions.url, params)
  //   .pipe(
  //     tap((result: WalletTransactionModel[]) => {
  //       if (result) {
  //         this.transactionList$.next(result);
  //       }
  //     })
  //   );
  // }


  setRequestId(message: any) {
    this.requestId.next(message);
  }

  setConventionalPair(currA: string, currB: string) {
    const funcIsMajor = pairMatrix.find((p) => p == (currA + currB).toUpperCase());
    const funcIsMinor = pairMatrix.find((p) => p == (currB + currA).toUpperCase());

    if (funcIsMajor) {
      return funcIsMajor;
    } else if (funcIsMinor) {
      return funcIsMinor;
    }
    return '';
  }


  getCurrentCurrencyExposureValue(): any {
    return this.currentCurrencyValue;
  }

  setCurrentCurrencyExposureValue(value: any): void {
    this.currentCurrencyValue = value;
  }

  setIsCompleteMassPayment(isComplete: boolean): void {
    this.isCompleteSubject.next(isComplete);
  }

  getIsCompleteMassPayment(): Observable<boolean> {
    return this.isCompleteSubject.asObservable();
  }

  mockCreatePaymentRequest(body: { amount: number, beneficiaryId: string, currency: string, isMass?: boolean }) {
    const response = {
      requestId: body.beneficiaryId,
      status: true,
      message: "Create Payment Request Successfully",
      paymentRequst: {
        quoteId: body.beneficiaryId,
        spot: 0.4817,
        exchangeRate: {
          major: {
            rate: 1.0,
            currency: {
              code: body.currency,
              sign: this.getCurrencySign(body.currency),
              flag: null,
              currencyName: null
            }
          },
          minor: {
            rate: 0.4817,
            currency: {
              code: "ILS",
              sign: "₪",
              flag: null,
              currencyName: null
            }
          }
        },
        charge: Number((body.amount * 2.075).toFixed(2)), // example charge logic
        chargeCurrency: body.currency,
        send: body.amount,
        sendCurrency: "ILS",
        paymentType: 1,
        costType: {
          key: null,
          value: 0.0
        }
      },
      costList: [
        {
          key: "1 - regular",
          value: 0.0
        },
        {
          key: "2 - our",
          value: Number((body.amount * 1.02).toFixed(2)) // sample "our" cost
        }
      ],
      signAndFiles: {
        needSign: false,
        needFile: false,
        needStamp: false
      }
    };

    return of(response);
  }

  private getCurrencySign(code: string): string {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CNH: '¥',
      ILS: '₪'
      // Add more as needed
    };
    return symbols[code] || code;
  }

}


