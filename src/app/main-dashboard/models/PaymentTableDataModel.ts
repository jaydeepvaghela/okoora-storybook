export interface PaymentTableDataModel {
  paymentRequestId: string;
  rate: number;
  beneficiary: string;
  createDate: string;
  targetDate: string;
  status: string;
  type: string;
  buy: string;
  sell: string;
  needToCompleteDetails: {
    needSign: boolean;
    needFile: boolean;
    needStamp: boolean;
  };
  exposureId: number;
}
