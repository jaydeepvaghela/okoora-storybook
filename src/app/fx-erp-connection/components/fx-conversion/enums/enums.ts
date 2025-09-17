export enum FxRuleFrequency
{
    OneTime = 1,
    Daily = 2,
    Weekly = 3,
    Monthly = 4,
    OneTimeLabel = 'One Time',
}

export enum FxRuleOperator
{
    GreaterThan = 1,
    LowerThan = 2,
}

export enum RateConditionValue {
  NoRateCondition = 0,
  AboveTargetRate = 1,
  BelowTargetRate = 2
}

export enum RateConditionLabel {
  NoRateCondition = 'No rate condition',
  AboveTargetRate = 'Above target rate',
  BelowTargetRate = 'Below target rate'
}
export enum FxRuleStatus
{
    Active = 1,
    Disabled = 2,
    Expired = 3,
    Deleted = 4,
    PendingActivation = 5,
}