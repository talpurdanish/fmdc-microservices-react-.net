// api/MedicationService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type MedicationModel, toJson, createMedicationModel } from "../Models/Medication.Model";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/medications";

export class MedicationService {
    constructor(private client: IApiClient) { }

    async GetMedications(pageLess: boolean = false, filter?: Filter): Promise<PagedResults<MedicationModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageLess;
        const res = await this.client.get<MedicationModel>(baseUri, convertFilter(filter), createMedicationModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetMedication(code: number): Promise<MedicationModel | null> {
        if (code <= 0) return null;
        const res = await this.client.get<MedicationModel>(`${baseUri}/${code}`, null, createMedicationModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(medication: MedicationModel): Promise<boolean> {
        if (!medication) return false;
        const url = baseUri;
        const res = medication.code > 0 ?
            await this.client.put<boolean>(url, toJson(medication)) :
            await this.client.post<boolean>(url, toJson(medication));
        return res.result ?? false;
    }

    async Delete(code: number): Promise<boolean> {
        if (code <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${code}`);
        return res.result ?? false;
    }
}