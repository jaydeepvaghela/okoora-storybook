export interface CommomAlertModel {
  title?: string;
  message: string;
  value?:string;
  confirmText: string;
  changeText?:string;
  cancelText?: string;
  canClose? :boolean;
  modalClass?: string;
  fromPayment?:any;
  from?: any;
}
export interface NoTradeAirPortModel {
  title: string;
  message: string;
  cancelText: string;
}

export interface deletePaymentModel {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  contactInfo: any
}


