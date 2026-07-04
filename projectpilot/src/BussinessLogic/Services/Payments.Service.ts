// api/PaymentsService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type PaymentIntentModel, createPaymentIntentModel } from "../Models/PaymentIntent.Model";

const baseUri = "/payments";

export class PaymentsService {
    constructor(private client: IApiClient) { }

    async CreatePaymentIntent(id: number): Promise<PaymentIntentModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<PaymentIntentModel>(
            `${baseUri}/CreatePaymentIntent/${id}`,
            null,
            createPaymentIntentModel
        );
        return res.result ?? null;
    }
}