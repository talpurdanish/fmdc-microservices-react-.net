// api/ProvinceService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type ProvinceModel, toJson, createProvinceModel } from "../Models/Province.Model";
import createDefaultFilter, { convertFilter as convertFilter, type Filter } from "../Models/Generics/Filter";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/provinces";

export class ProvinceService {
    constructor(private client: IApiClient) { }

    async GetProvinces(pageless: boolean = false, filter?: Filter): Promise<PagedResults<ProvinceModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<ProvinceModel>(baseUri, convertFilter(filter), createProvinceModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetProvince(id: number): Promise<ProvinceModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<ProvinceModel>(`${baseUri}/${id}`, null, createProvinceModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(province: ProvinceModel): Promise<boolean> {
        if (!province) return false;
        const url = province.id > 0 ? `${baseUri}/${province.id}` : baseUri;
        const res = await this.client.post<boolean>(url, toJson(province));
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}