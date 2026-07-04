// api/MedicationTypeService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type MedicationTypeModel, toJson, createMedicationTypeModel } from "../Models/MedicationType.Model";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/medicationTypes";

export class MedicationTypeService {
    constructor(private client: IApiClient) { }

    async GetMedicationTypes(pageless: boolean = false, filter?: Filter): Promise<PagedResults<MedicationTypeModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<MedicationTypeModel>(baseUri, convertFilter(filter), createMedicationTypeModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetMedicationType(id: number): Promise<MedicationTypeModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<MedicationTypeModel>(`${baseUri}/${id}`, null, createMedicationTypeModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(medicationType: MedicationTypeModel): Promise<boolean> {
        if (!medicationType) return false;
        const url = baseUri;
        const res = medicationType.id > 0 ?
            await this.client.put<boolean>(url, toJson(medicationType)) :
            await this.client.post<boolean>(url, toJson(medicationType));
        return res.result ?? false;
    }

    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}