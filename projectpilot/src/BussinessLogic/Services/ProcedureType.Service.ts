// api/ProcedureTypeService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type ProcedureTypeModel, toJson, createProcedureTypeModel } from "../Models/ProcedureType.Model";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";

import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/procedureTypes";

export class ProcedureTypeService {
    constructor(private client: IApiClient) { }

    async GetProcedureTypes(pageless: boolean, filter?: Filter): Promise<PagedResults<ProcedureTypeModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<ProcedureTypeModel>(baseUri, convertFilter(filter), createProcedureTypeModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetProcedureType(id: number): Promise<ProcedureTypeModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<ProcedureTypeModel>(`${baseUri}/${id}`, null, createProcedureTypeModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(procedureType: ProcedureTypeModel): Promise<boolean> {
        if (!procedureType) return false;
        const url = procedureType.id > 0 ? `${baseUri}/${procedureType.id}` : baseUri;
        const res = await this.client.post<boolean>(url, toJson(procedureType));
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}