// api/ProcedureService.ts
import type { IApiClient } from "./Generics/IApiClient";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { type ProcedureModel, toJson, createProcedureModel } from "../Models/Procedure.Model";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/procedures";

export class ProcedureService {
    constructor(private client: IApiClient) { }

    async GetProcedures(pageless: boolean = false, filter?: Filter): Promise<PagedResults<ProcedureModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<ProcedureModel>(baseUri, convertFilter(filter), createProcedureModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetProcedure(id: number): Promise<ProcedureModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<ProcedureModel>(`${baseUri}/${id}`, null, createProcedureModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(procedure: ProcedureModel): Promise<boolean> {
        if (!procedure) return false;
        const url = procedure.id > 0 ? `${baseUri}/${procedure.id}` : baseUri;
        const res = await this.client.post<boolean>(url, toJson(procedure));
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}