export interface BenificiaryModel {

  id: string,
  status: number,
  bankAccountHolderEmail: string,
  bankAccountHolderName: string,
  bankAccountHolderNickname: string,
  beneficiaryIdNumber: Number,
  beneficiaryCountry: string,
  beneficiaryCity: string,
  beneficiaryStreet: string,
  beneficiaryHouseNumber: string,
  beneficiaryZipCode: string,
  currency: string,
  paymentReason: number,
  bankCountry: string,
  bankName: string,
  bankAddress: string,
  bankNumber: Number,
  bankBranch: string,
  iban: string,
  swiftCode: string,
  accountNumber: string,
  bankAccountType: Number,
  beneficiaryAccountType: Number,
  paymentType: string,
  paymentTerms: string,
  ownAccount: number,
  beneficiaryFiles: [],
  updatedAt: Date,
  companyName: string,
  createdAt: Date,
  currencyISO: currency,
  bankFlag: string,
  erpService: string,
  firstName: string,
  lastName: string
}

export interface currency {
  flag: string,
  code: string,
  sign: string
}
