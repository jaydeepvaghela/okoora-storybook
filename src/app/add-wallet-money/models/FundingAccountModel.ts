export interface FundingAccountModel {
  id: string;
  account_id: string;
  account_number: string;
  account_number_type: string;
  account_holder_name: string;
  bank_name: string;
  bank_address: string;
  bank_country: string;
  currency: string;
  payment_type: string;
  routing_code: string;
  routing_code_type: string;
  created_at: string;
  updated_at: string;
}
export interface GlobalAccountDto {
  id: string;
  accountName: string;
  accountNumber: string;
  institutionName: string;
  country: string;
  institutionAddress: string;
  paymentType: string;
  accountRoutingType: string[];
  accountRoutingValue: string[];
  iban?: string;
  swiftCode?: string;
  institutionCity: string;
}
export interface IncomingGlobalAccount {
  id: string;
  account_name: string;
  account_number: string;
  country_code: string;
  iban: string;  
  institution: Institution;
  routing_codes: RoutingCode[];
}
export interface RoutingCode {
  type: string;
  value: string;
}

export interface Institution {
  name: string | null;
  address: string | null;
  city: string | null;
  [key: string]: any;
}
