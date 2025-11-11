export enum hedgingStatus {
  "Hedged" = 6,
  "Completed" = 12,
  "Missing collateral" = 1,
  "Closed" = 11
}

export enum HedgeState
{
    'Pending' = 0,
    'Hedged' = 1,
    'Completed' = 2,
    'Missing Collateral' = 3,
    'Missing Collateral For Active Deal' = 4,
    'Closed' = 5
}

export enum recordType {
  'Invoice'= 1,
  'Bill'= 2,
  'Interest'= 3,
  'FX Gain'= 4,
  'Rent'= 5,
  'Dividends'= 6,
  'Grants'= 7,
  'Commissions'= 8,
  'Refund'= 9,
  'Asset Sale'= 10,
  'Salaries'= 11,
  'Taxes'= 12,
  'Bank Fees'= 13,
  'FX Loss'= 14,
  'Loans'= 15,
  'Marketing'= 16,
  'Travel'= 17,
  'Software'= 18,
  'Services'= 19,
  'Equipment'= 20
}

export enum InvoiceSteps {
  IndexZero = 0,
  IndexOne = 1,
  IndexTwo = 2,
  IndexThree = 3,
  IndexFour = 4,
  IndexFive =  5, 
  IndexSix = 6,
  IndexSeven = 7,
  IndexEight = 8,
  IndexNine = 9,
  IndexTen = 10,
  IndexEleven = 11,
}

export enum ConversionSteps {
  IndexZero = 0,
  IndexOne = 1,
  IndexTwo = 2,
  IndexThree = 3,
  IndexFour = 4,
  IndexFive =  5, 
}

export enum ERPType {
  Invoice = "Invoice",
  CashFlow = 'CashFlow',
  Conversion = 'Conversion'
}

export enum DirectionType {
  IncomingInvoice = 1,
  Bill = 2,
  Both = 3
}