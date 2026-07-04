import type { IApiClient } from "./Generics/IApiClient";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { createPrescriptionModel, type PrescriptionModel } from "../Models/Prescription.Model";
import { type CreatePrescriptionModel, toJson } from "../Models/Create.Prescription.Model";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/prescriptions";

export class PrescriptionsService {
    constructor(private client: IApiClient) { }

    async CreatePrescription(prescription: CreatePrescriptionModel): Promise<boolean> {
        if (prescription.Appointmentid <= 0 || prescription.PatientId <= 0 || prescription.DoctorId <= 0) return false;
        const url = baseUri;
        const res = await this.client.post<boolean>(url, toJson(prescription));
        return res.result ?? false;
    }

    async GetPrescriptions(filter?: Filter): Promise<PagedResults<PrescriptionModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<PrescriptionModel>(baseUri, convertFilter(filter), createPrescriptionModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetPatientPrescriptions(filter: Filter): Promise<PagedResults<PrescriptionModel>> {
        if (filter.id <= 0) return createDefaultPagedResults();
        filter = !filter ? createDefaultFilter() : filter;
        const url = `${baseUri}/GetPatientPrescriptions`;
        const res = await this.client.get<PrescriptionModel>(url, convertFilter(filter), createPrescriptionModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetPrescription(id: number, create: boolean = false): Promise<PrescriptionModel | null> {
        if (id <= 0) return null;
        const url = `${baseUri}/GetPatientPrescriptions/${id}${create ? "?type=1" : ""}`;
        const res = await this.client.get<PrescriptionModel>(url, null, createPrescriptionModel);
        return res.result ?? null;
    }

    async DeletePrescription(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const url = `${baseUri}/${id}`;
        const res = await this.client.delete<boolean>(url);
        return res.result ?? false;
    }

    async GeneratePrescription(id: number): Promise<Blob | null> {
        if (!id || id <= 0) return null;
        const url = `${baseUri}/GeneratePrescription/${id}`;
        const res = await this.client.requestBlob(url, { method: "GET" });
        return res ?? null;
    }
}