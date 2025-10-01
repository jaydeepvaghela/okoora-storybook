export interface PaymentRequestModel {
  quoteId: string;
  spot: string;
  charge: number;
  chargeCurrency: string;
  send: number;
  sendCurrency: string;
  paymentType: number;
}
