// api/PatientService.ts
import type { IApiClient } from "./Generics/IApiClient";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { toJson, type PatientModel, createPatientModel } from "../Models/Patient.Model";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/patients";

export class PatientService {
    constructor(private client: IApiClient) { }

    async GetPatients(pageless: boolean = false, filter?: Filter): Promise<PagedResults<PatientModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<PatientModel>(baseUri, convertFilter(filter), createPatientModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetPatient(id: number): Promise<PatientModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<PatientModel>(`${baseUri}/${id}`, null, createPatientModel);

        return res.result ?? null;
    }

    async CreateOrUpdate(patient: PatientModel): Promise<boolean> {
        if (!patient) return false;
        const url = patient.id > 0 ? `${baseUri}/${patient.id}` : baseUri;
        const res = await this.client.post<boolean>(url, toJson(patient));
        return res.result ?? false;
    }

    async DeletePatient(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }

    async CheckUnique(value: string, id: number = -1): Promise<boolean> {
        if (!value) return false;
        const url = `${baseUri}/CheckCNIC?value=${value}&id=${id}`;
        const res = await this.client.get<boolean>(url);
        return res.result ?? false;
    }

    async GenerateSlip(id: number): Promise<Blob | null> {
        if (id <= 0) return null;
        const url = `${baseUri}/GenerateSlip/${id}`;
        const res = await this.client.requestBlob(url, { method: "GET" });
        return res ?? null;
    }
}