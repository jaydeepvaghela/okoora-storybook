interface WalletCurrencyModel {
  code: string;
  sign: string;
}

export interface CreateHedgeResponseModel {
  youBuy: number;
  strategyId: number;
  strike: number;
  collateral: number;
  collateralCur: WalletCurrencyModel;
  youSell: string;
  sellCurrency: WalletCurrencyModel;
  paymentDate: string;
  buyCurrency: WalletCurrencyModel;
  premiumAmount: number;
}
