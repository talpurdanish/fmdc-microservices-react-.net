// api/UserService.ts
import type { IApiClient } from "./Generics/IApiClient";
import createDefaultFilter, { convertFilter as convertFilter, type Filter } from "../Models/Generics/Filter";
import { createNameIdPair, type NameIdPair } from "../Models/Generics/NameIdPair";
import { createUserModel, toJson, toMissingDetailJson, type UserModel } from "../Models/User.Model";
import { createLoginModel, type LoginModel } from "../Models/Login.Model";
import { createDefaultPagedResults, type PagedResults } from "../Models/Generics/PagedResults";

const baseUri = "/users";

export enum CheckUniqueType {
    cnic = "checkCnic",
    username = "checkUsername",
    pmdcno = "checkPmdcNo",
}

export class UserService {
    constructor(private client: IApiClient) { }

    async GetUsers(pageless: boolean, filter?: Filter): Promise<PagedResults<UserModel>> {
        filter = !filter ? createDefaultFilter() : filter;
        filter.pageLess = pageless;
        const res = await this.client.get<UserModel>(baseUri, convertFilter(filter), createUserModel);
        return res.pagedResults ?? createDefaultPagedResults();
    }

    async GetDoctors(): Promise<NameIdPair[]> {
        const res = await this.client.get<NameIdPair>(`${baseUri}/getdoctors`, null, createNameIdPair);
        return res.results ?? [];
    }

    async GetUser(id: number): Promise<UserModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<UserModel>(`${baseUri}/${id}`, null, createUserModel);
        return res.result ?? null;
    }

    async GetCurrentUser(): Promise<LoginModel | null> {
        const res = await this.client.get<LoginModel>(`${baseUri}/GetCurrentUser`, null, createLoginModel);
        return res.result ?? null;
    }

    async CreateUser(user: UserModel): Promise<boolean> {
        if (!user) return false;
        const url = `${baseUri}/CreateUser`;
        const res = await this.client.post<boolean>(url, toJson(user));
        return res.result ?? false;
    }

    async UpdateUser(user: UserModel): Promise<boolean> {
        if (!user || user.id <= 0) return false;
        const url = `${baseUri}/${user.id}`;
        const res = await this.client.put<boolean>(url, toJson(user));
        return res.result ?? false;
    }

    async AddMissingDetails(user: UserModel): Promise<boolean> {
        if (!user) return false;
        const url = `${baseUri}/AddMissingDetails`;
        const res = await this.client.post<boolean>(url, toMissingDetailJson(user));
        return res.result ?? false;
    }

    async ChangeStatus(id: number): Promise<boolean> {
        const res = await this.client.post<boolean>(`${baseUri}/ChangeStatus/${id}`);
        return res.result ?? false;
    }

    async ResetPassword(id: number): Promise<boolean> {
        const res = await this.client.post<boolean>(`${baseUri}/ResetPassword/${id}`);
        return res.result ?? false;
    }

    async ChangeRole(id: number, role: number): Promise<boolean> {
        if (id <= 0 || role <= 0 || role > 3) return false;
        const res = await this.client.post<boolean>(`${baseUri}/ChangeRole/${id}?value=${role}`);
        return res.result ?? false;
    }

    async AddFees(id: number, fees: number): Promise<boolean> {
        if (id <= 0 || fees <= 0) return false;
        const res = await this.client.post<boolean>(`${baseUri}/AddFees/${id}?fees=${fees}`);
        return res.result ?? false;
    }


    async CheckUnique(type: CheckUniqueType, value: string, id: number = -1): Promise<boolean> {
        if (!value) return false;
        const res = await this.client.get<boolean>(`${baseUri}/${type.trim()}?value=${value}&id=${id}`);
        return res.result ?? false;
    }
}