export interface DepositRegularRequestModel {
  Currency: string;
  Amount: number;
  OkooraBankId: number;
  BeneficiaryId: string;
  TransferType: number;
  TransferAt: string;
}
