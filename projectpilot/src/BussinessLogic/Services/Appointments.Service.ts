// api/AppointmentsService.ts
import type { IApiClient } from "./Generics/IApiClient";
import createDefaultFilter, { convertFilter, type Filter } from "../Models/Generics/Filter";
import { type AppointmentModel, createAppointmentModel } from "../Models/Appointment.Model";
import { createAppointmentStats, type AppointmentStats } from "../Models/Appointment.Stats.Modle";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/appointments";

export class AppointmentsService {
    constructor(private client: IApiClient) { }

    async AddAppointment(userId: number, patientId: number): Promise<boolean> {
        if (userId <= 0 || patientId <= 0) return false;
        const res = await this.client.post<boolean>(baseUri, { userId, patientId });
        return res.result ?? false;
    }

    async GetAppointments(filter?: Filter): Promise<PagedResults<AppointmentModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<AppointmentModel>(`${baseUri}/get`, convertFilter(filter), createAppointmentModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetPatientAppointments(filter?: Filter): Promise<PagedResults<AppointmentModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        if (filter.id <= 0) return createDefaultPagedResults();
        const res = await this.client.get<AppointmentModel>(`${baseUri}/GetPatientAppointments`, convertFilter(filter), createAppointmentModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetAppointment(id: number): Promise<AppointmentModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<AppointmentModel>(`${baseUri}/${id}`, null, createAppointmentModel);
        return res.result ?? null;
    }

    async GetPendingAppointments(filter?: Filter): Promise<PagedResults<AppointmentModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<AppointmentModel>(`${baseUri}/getPending`, convertFilter(filter), createAppointmentModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async DeleteAppointment(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }

    async GetAppointmentStats(): Promise<AppointmentStats> {
        // Replace `any` with a proper StatsModel if you define one
        const res = await this.client.get<any>(`${baseUri}/getstats`, null, createAppointmentStats);
        return res.result ?? null;
    }

    async AddEndDate(patientId: number, type: string): Promise<boolean> {
        if (patientId <= 0 || !type) return false;
        const res = await this.client.put<boolean>(`${baseUri}/addenddate`, { id: patientId, value: type });
        return res.result ?? false;
    }
    async GetAppointmentButtons(id: number): Promise<any> {
        if (id <= 0) return null;
        const url = `${baseUri}/GetButtons/${id}`;
        const res = await this.client.get<any>(url);
        return res.result ?? null;
    }
}