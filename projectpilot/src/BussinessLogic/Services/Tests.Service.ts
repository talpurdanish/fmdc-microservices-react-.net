// api/TestService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type TestModel, toJson, createTestModel } from "../Models/Test.Model";
import createDefaultFilter, { convertFilter as convertFilter, type Filter } from "../Models/Generics/Filter";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/tests";

export class TestService {
    constructor(private client: IApiClient) { }

    async GetTests(pageless: boolean = false, filter?: Filter): Promise<PagedResults<TestModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<TestModel>(baseUri, convertFilter(filter), createTestModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetTest(id: number): Promise<TestModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<TestModel>(`${baseUri}/${id}`, null, createTestModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(test: TestModel): Promise<boolean> {
        if (!test) return false;
        const url = baseUri;
        const res = test.id > 0 ?
            await this.client.put<boolean>(url, toJson(test)) :
            await this.client.post<boolean>(url, toJson(test));
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}