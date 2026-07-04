// api/TestParameterService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type TestParameterModel, toJson, createTestParameterModel } from "../Models/TestParameter.Model";
import createDefaultFilter, { convertFilter as convertFilter, type Filter } from "../Models/Generics/Filter";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/testParameters";

export class TestParameterService {
    constructor(private client: IApiClient) { }

    async GetTestParameters(pageless: boolean = false, filter?: Filter): Promise<PagedResults<TestParameterModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<TestParameterModel>(baseUri, convertFilter(filter), createTestParameterModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetTestParameter(id: number): Promise<TestParameterModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<TestParameterModel>(`${baseUri}/${id}`, null, createTestParameterModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(testParameter: TestParameterModel): Promise<boolean> {
        if (!testParameter) return false;
        const url = baseUri;
        const res = testParameter.id > 0 ?
            await this.client.put<boolean>(url, toJson(testParameter)) :
            await this.client.post<boolean>(url, toJson(testParameter));
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}