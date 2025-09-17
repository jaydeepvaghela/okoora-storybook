export interface MissingFundsData {
  collateralAmount: number;
  collateralCurrency: string | null;
  collateralCurrencySign: string | null;
  missingCollateralAmount: number;
  missingCollateralCurrency: string | null;
}