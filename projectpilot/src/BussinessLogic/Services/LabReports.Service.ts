// api/LabReportsService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type LabReportModelDTO, toCreateJson, toJson } from "../Models/Create.Lab.Report.Model";


import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { createLabReportModel, type LabReportModel } from "../Models/LabReport.Model";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";
import { createPatientModel, type PatientModel } from "../Models/Patient.Model";
import { type CityModel, createCityModel } from "../Models/City.Model";
import { type UserModel, createUserModel } from "../Models/User.Model";

const baseUri = "/Reports";

export class LabReportsService {
    constructor(private client: IApiClient) { }

    async CreateOrUpdate(data: LabReportModelDTO): Promise<boolean> {
        if (!data) return false;
        const url = baseUri;
        const res = data.id <= 0
            ? await this.client.post<boolean>(url, toCreateJson(data))
            : await this.client.put<boolean>(url, toJson(data));
        return res.result ?? false;
    }

    async UpdateValues(paramvalues: string, labReportId: number): Promise<boolean> {
        if (!paramvalues || labReportId <= 0) return false;
        const url = `${baseUri}/updatevalues/`;
        const res = await this.client.put<boolean>(url, { paramvalues, labReportId });
        return res.result ?? false;
    }

    async GetPendingParameters(id: number): Promise<any[]> {
        if (id <= 0) return [];
        const url = `${baseUri}/GetPendingParameters/${id}`;
        const res = await this.client.get<any>(url);
        return res.results ?? [];
    }

    async GetLabReports(pageLess: boolean = false, filter?: Filter): Promise<PagedResults<LabReportModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageLess;
        const res = await this.client.get<LabReportModel>(baseUri, convertFilter(filter), createLabReportModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetLabReport(id: number): Promise<LabReportModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<LabReportModel>(`${baseUri}/${id}`, null, createLabReportModel);
        return res.result ?? null;
    }

    async DeleteLabReport(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }

    async GetPatientReports(filter?: Filter): Promise<PagedResults<LabReportModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<LabReportModel>(`${baseUri}/GetPatientReports`, convertFilter(filter), createLabReportModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GenerateReport(id: number): Promise<Blob | null> {
        if (id <= 0) return null;
        const url = `${baseUri}/GenerateReport/${id}`;
        const res = await this.client.requestBlob(url);
        return res ?? null;
    }



    async GetPendingLabReports(filter?: Filter): Promise<PagedResults<LabReportModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const url = `${baseUri}/GetPending/`;
        const res = await this.client.get<LabReportModel>(url, convertFilter(filter), createLabReportModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetPatient(id: number): Promise<PatientModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<PatientModel>(`${baseUri}/GetPatient/${id}`, null, createPatientModel);
        return res.result ?? null;
    }

    async GetUser(id: number): Promise<UserModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<UserModel>(`${baseUri}/GetUser/${id}`, null, createUserModel);
        return res.result ?? null;
    }

    async GetCity(id: number): Promise<CityModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<CityModel>(`${baseUri}/GetCity/${id}`, null, createCityModel);
        return res.result ?? null;
    }
}