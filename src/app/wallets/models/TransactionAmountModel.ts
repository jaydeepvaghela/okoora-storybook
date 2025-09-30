import { WalletCurrencyModel } from "src/app/common/models/WalletCurrencyModel";

export interface TransactionAmountModel {
  amount: number;
  currency: WalletCurrencyModel;
}
