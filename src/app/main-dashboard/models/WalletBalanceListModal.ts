import { WalletCurrencyModel } from "./WalletCurrencyModel";

export interface WalletBalanceListModal {
  wallet_Id: number;
  wallet_Currency: WalletCurrencyModel;
  wallet_Amount: number;
  wallet_Available:number;
  wallet_Flag: string;
  wallet_Hedging: any;
}
