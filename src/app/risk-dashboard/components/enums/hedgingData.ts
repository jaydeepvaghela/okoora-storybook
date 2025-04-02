export enum HedgingType {
    Forward = 1,
    Vanilla = 2,
    Range = 3,
}
  
export const HedgingTypeDisplayNames: { [key in HedgingType]: string } = {
    [HedgingType.Forward]: "Forward",
    [HedgingType.Vanilla]: "Vanilla",
    [HedgingType.Range]: "Range",
};