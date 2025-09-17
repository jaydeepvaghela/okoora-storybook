export enum EPusherChannels {
    livePurchase = 'live-purchase',
    paymeUpdateSubscription = 'payme-update-subscription',
    ocrPayment = 'Ocr-payment',
    shuftiProValidationRsponseChannel = 'shufti-pro',
    sumSubCall = 'sumsub-call',
    parsioInvoice = "ParsioInvoice",
    productUpdate = 'ProductUpdates',
    dodoSuccessfulSubscription = 'DodoSuccessfulSubscription',
    dodoFailedSubscription = 'DodoFailedSubscription'
}

export enum EPusherEvents {
    callStatus = 'call-status',
    subscriptionUpdate = 'subscription-update',
    ocrPaymentResponse = 'Ocr-response',
    shuftiProValidationResponseEvent = 'verify-id',
    shuftiProPendingRequest = 'pending-request',
    sumSubRequest = 'sumsub-request',
    productUpdated = 'ProductUpdated_'
}

