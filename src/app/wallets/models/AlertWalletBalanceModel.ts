export interface AlertWalletBalance {
    BalanceId: string
    AlertMethod: string;
    WalletType: string;
    ConditionAmount: number;
    AmountType: string;
    Profiles: profile;
    RuleId: string;
  }

  export interface profile{
    ProfileId: string
  }