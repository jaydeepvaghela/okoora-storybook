import { CostListModel } from "./CostListModel";

export interface UpdateCostListResponseModel {
  requestId:string;
  status: boolean;
  message: string;
  costType: CostListModel;
}
