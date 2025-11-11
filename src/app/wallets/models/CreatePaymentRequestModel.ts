export interface CreatePaymentRequestModel{
  amount: number;
  currency: string;
  beneficiaryId: string;
  isWithdrawal?: boolean;
}
