// api/ReceiptService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type ReceiptModel, toJson, createReceiptModel } from "../Models/Receipt.Model";
import createDefaultFilter, { convertFilter as convertFilter, type Filter } from "../Models/Generics/Filter";
import { createRecieptDetailModel, type RecieptDetailModel } from "../Models/RecieptDetail.Model";
import { createIncomeStats, type IncomeStats } from "../Models/Income.Stats.Model";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/receipts";

export class ReceiptService {
    constructor(private client: IApiClient) { }

    async GetUnpaidReceipts(filter?: Filter): Promise<PagedResults<ReceiptModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<ReceiptModel>(`${baseUri}/GetUnpaidReceipts`, convertFilter(filter), createReceiptModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async PaywithPaypal(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.get<boolean>(`${baseUri}/PaymentWithPaypal/${id}`);
        return res.result ?? false;
    }

    async GetReceipts(filter?: Filter): Promise<PagedResults<ReceiptModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<ReceiptModel>(baseUri, convertFilter(filter), createReceiptModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetReceipt(id: number): Promise<ReceiptModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<ReceiptModel>(`${baseUri}/${id}`, null, createReceiptModel);
        return res.result ?? null;
    }

    async DeleteReceipt(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/Delete/${id}`);
        return res.result ?? false;
    }

    async CreateReceipt(data: ReceiptModel): Promise<boolean> {
        if (!data) return false;
        const res = await this.client.post<boolean>(baseUri, toJson(data));
        return res.result ?? false;
    }

    async UpdateStatus(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.put<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }

    async GetIncomeStats(): Promise<IncomeStats> {
        const res = await this.client.get<any>(`${baseUri}/GetStats`, null, createIncomeStats);
        return res.result ?? null;
    }

    async GetReceiptProcedures(id: number): Promise<RecieptDetailModel[]> {

        const res = await this.client.get<RecieptDetailModel>(`${baseUri}/Details/${id}`, null, createRecieptDetailModel);
        return res.results ?? [];
    }

    async GenerateReceipt(id: number): Promise<Blob | null> {
        if (id <= 0) return null;
        const res = await this.client.requestBlob(`${baseUri}/GenerateReciept/${id}`);
        return res ?? null;
    }

    async GetPatientReceipts(filter?: Filter): Promise<PagedResults<ReceiptModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        if (filter.id <= 0) return createDefaultPagedResults();
        const res = await this.client.get<ReceiptModel>(`${baseUri}/GetPatientReceipts`, convertFilter(filter), createReceiptModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }
}