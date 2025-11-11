export enum DealType {
  Vanilla = 1,
  ExoticForm = 2,
  Forward = 3,
  Spot = 4,
  InternalTransaction = 5
}

export enum CallPutType {
  Put = 0,
  Call = 1,
  PUT = 'Put',
  CALL = 'Call'
}

export enum DealStatusType {
  Expired = 1,
  Open = 2,
  EarlyTermination = 3,
  Deliver = 4,
  Settle = 5,
  Delete = 6,
  Close = 7
}

export enum OnLineOffline{
  Online = 'Online deal',
  Offline = 'Offline deal'
}

export enum HeadgingHeaderEnum {
  ID = 'ID',
  TRADE_DATE = 'Trade date',
  DEAL_TYPE = 'Deal type',
  PUT_CALL = 'Put/Call',
  CURRENCIES = 'Currencies',
  STRIKE = 'Strike',
  AMOUNT = 'Amount',
  ONLINE_OFFLINE = 'Online/Offline',
  EXPIRY_DATE = 'Expiry date',
  HEDGE_STATUS = 'Hedge status',
  PL = 'P/L',
}