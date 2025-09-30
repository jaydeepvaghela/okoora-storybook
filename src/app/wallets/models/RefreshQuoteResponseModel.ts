export interface RefreshQuoteResponseModel {
    status: boolean;
    message: string;
    requestId: string;
    quoteId: string;
    spot: number;
    charge: number;
    chargeCurrency: string;
    send: string;
    sendCurrency: string;
}
