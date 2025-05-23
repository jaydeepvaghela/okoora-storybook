export interface CalendarEventsModel {
  exposuresId?: number;
  targetRate?: number;
  createDate?: string;
  dueDate?: string;
  targetDate?: string;
  buyCurrency?: string;
  sellCurrency?: string;
  status?: string;
  paymentRequestId?: string;
  rate?: number;
  beneficiary?: string;
  type?: string;
  buy?: string;
  sell?: string;
  needToCompleteDetails?: {
    needSign?: boolean;
    needFile?: boolean;
    needStamp?: boolean;
  },
  exposureId?: number;
  currencyPair?: string;
  expiryDate?: string;
  hedgeAmount?: string;

  amount?: string;
}
