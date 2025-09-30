import { TransactionAmountModel } from "./TransactionAmountModel";
import { feeTransactionModel } from "./TransactionFeeModel";
import { TransactionFromToModel } from "./TransactionFromToModel";

export interface WalletTransactionModel {
  mainId: string;
  mainType: number;
  traferStatus: number;
  from: TransactionFromToModel;
  to: TransactionFromToModel;
  transaction: TransactionAmountModel;
  moneyTransferred: TransactionAmountModel;
  moneyReceived: TransactionAmountModel;
  exeutedOn: string;
  submitedOn: string;
  fee: feeTransactionModel;
  commission: TransactionAmountModel;
  cost: number;
  savingInterst: number;
  readyToUse: TransactionAmountModel;
}
