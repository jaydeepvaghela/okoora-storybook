import { WalletCurrencyModel } from "./WalletCurrencyModel";

export interface BalanceByCurrencyResposeModel{

    wallet_Id: 1;
    wallet_Currency: WalletCurrencyModel;
    wallet_Amount: number;
    wallet_Available:number;
    wallet_Flag: string;
    wallet_Hedging:any;
}
