import { CostListModel } from "./CostListModel";
import { PaymentRequestModel } from "./PaymentRequestModel";
import { SignAndFilesModel } from "./SignAndFilesModel";

export interface PaymentResponseModel{
  requestId: string;
  status: string;
  message: string;
  paymentRequst: PaymentRequestModel;
  costList: CostListModel[];
  signAndFiles:SignAndFilesModel;
}
