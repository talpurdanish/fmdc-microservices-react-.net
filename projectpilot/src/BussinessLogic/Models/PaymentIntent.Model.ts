// Models/PaymentIntent.Model.ts
export interface PaymentIntentModel {
    clientSecret: string;
}

export function createPaymentIntentModel(raw: any): PaymentIntentModel {
    return {
        clientSecret: raw.clientSecret ?? "",
    };
}