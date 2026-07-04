// api/CityService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type CityModel, toJson, createCityModel } from "../Models/City.Model";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/cities";

export class CityService {
    constructor(private client: IApiClient) { }

    async GetCities(pageLess: boolean = false, filter?: Filter): Promise<PagedResults<CityModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageLess;
        const res = await this.client.get<CityModel>(baseUri, convertFilter(filter), createCityModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetCity(id: number): Promise<CityModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<CityModel>(`${baseUri}/GetCity/${id}`, null, createCityModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(city?: CityModel): Promise<boolean> {
        if (!city) return false;
        const isUpdate = city.id > 0;
        const url = isUpdate ? `${baseUri}/${city.id}` : baseUri;
        const body = toJson(city);
        const res = !isUpdate ? await this.client.post<boolean>(url, body) : await this.client.put<boolean>(url, body);
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}