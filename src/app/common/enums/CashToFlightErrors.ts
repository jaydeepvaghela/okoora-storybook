export enum CashToFlightErrors {
  NotEnoughBalance = "Don't have enough money in Balance",
  FullNameInHebrew = "FullNameInHebrew Must Be In Hebrew",
  FullNameLength = "FullNameInHebrew Must Be bigger then 4 characters",
  FirstNameInEnglish = "FirstNameInEng Must Be In English",
  LastNameInEnglish = "LastNameInEng Must Be In English",
  InvalidEmail = "Email Is Not Valid",
  InvalidMobile = "MobileNumber Is Not Valid",
  InvalidIdNumber = "IdNumber Is Not Valid",
  InvalidDate = "Date Flight Not Valid",
  FutureDate = "Date Flight Must be Future Date",
  Timeout = "The time for request passed please refresh your request and try again (use RefreshConvertToTransfer(id))"
}
