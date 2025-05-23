export enum RiskProfitloss {
    'High Opportunity' = 1,
    'Moderate Opportunity' = 2,
    'Low Opportunity' = 3,
    'Moderate' = 4,
    'Low Risk' = 5,
    'Moderate Risk' = 6,
    'High Risk' = 7
}

export enum tradingSource {
    'EURGBP' = "FX:EURGBP",
    'USDZAR' = "FX:USDZAR",
    'GBPILS' = "SAXO:GBPILS",
    'USDSEK' = "FX:USDSEK",
    'USDJPY' = "FX:USDJPY",
    'CHFILS' = "FX_IDC:CHFILS",
    'GBPUSD' = "FX:GBPUSD",
    'EURJPY' = "FX:EURJPY",
    'USDILS' = "SAXO:USDILS",
    'AUDUSD' = "FX:AUDUSD",
    'EURUSD' = "FX:EURUSD",
    'CADILS' = "FX_IDC:CADILS",
    'GBPJPY' = "FX:GBPJPY",
    'EURILS' = "SAXO:EURILS",
    'AUDILS' = "FX_IDC:AUDILS",
    'USDCAD' = "FX:USDCAD",
    'JPYILS' = "FX_IDC:JPYILS",
    'USDEUR' = "FX_IDC:USDEUR"
}

export const DateFormat = {
  dateFormat: 'dd mmm yyyy',
  dateInput: 'DD/MM/YYYY',
  dateTimeInput: 'DD/MM/YYYY hh:mm',
  exportCSVFormat: 'DD/MM/YYYY hh:mm:ss a',
  orderFormate:"YYYY-MM-DD hh:mm:ss",
  paymentDateFormat: "YYYY-MM-DD",
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    monthLabel: 'MMM',
    yearLabel: 'YYYY'
  },
};

export default DateFormat;

export enum Direction {
    Down = 1,
    Up = 2
}

export enum BuySell {
    buy = 1,
    sell = 2
} 