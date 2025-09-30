export interface OCRUploadFileModel {
  body: any;
  paymentRequestId: string;
  amount: number;
  currency: { code: string;
  sign: string
  };
  beneficiary: any;
  invoice: {
    invoicePayerName: string;
    invoiceDate: string;
    invoiceNo: string;
    paybaleAccountNumber: string;
  };
  errors: string;
  fileId:string;
}
