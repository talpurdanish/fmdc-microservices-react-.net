// api/AxiosApiClient.ts
import axios, { type AxiosInstance, AxiosError } from "axios";
import { Constants } from "../../../Helpers/Constants";
import { GlobalStorageService, type IStorageService } from "../../Storage/Storage.Service";
import type { IApiClient } from "./IApiClient";
import { ApiResponse } from "../../Models/Generics/ApiResponse";
import type { LoginModel } from "../../Models/Login.Model";
import { normalizePayload } from "./ApiUtils";

export class AxiosApiClient implements IApiClient {
    private client: AxiosInstance;
    private storage: IStorageService = new GlobalStorageService();

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: { "Content-Type": "application/json" },
        });

        this.client.interceptors.request.use(config => {
            const token = this.storage.get<LoginModel>(Constants.USER_STORAGE_KEY)?.token;
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }

    private handleError<T>(error: AxiosError): ApiResponse<T> {

        // if (error.response) {
        const status = error?.response?.status;
        const message = (error?.response?.data as any)?.message ?? `HTTP error ${status}`;

        return ApiResponse.failure<T>([message], status);
        // } else if (error.code === "ECONNABORTED") {
        //     return ApiResponse.failure<T>(["Request timed out"], 408);
        // } else if (error.request) {
        //     return ApiResponse.failure<T>(["No response from server"], 503);
        // } else {
        //     return ApiResponse.failure<T>([error.message ?? "Unexpected error"], 500);
        // }


    }

    async get<T>(url: string, payload?: any, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>> {
        try {
            const { params, queryString } = normalizePayload(payload);
            const finalUrl = queryString ? `${url}?${queryString}` : url;

            const res = await this.client.get(finalUrl, params ? { params } : {});
            return new ApiResponse<T>(res.data, modelFactory);
        } catch (err) {
            return this.handleError<T>(err as AxiosError);
        }
    }

    async post<T>(url: string, body: any = {}, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>> {
        try {
            const res = await this.client.post<T>(url, body);
            if (modelFactory)
                return new ApiResponse<T>(res.data, modelFactory);
            else
                return ApiResponse.success<T>(res.data, res.status);
        } catch (err) {

            return this.handleError<T>(err as AxiosError);
        }
    }

    async put<T>(url: string, body: any = {}): Promise<ApiResponse<T>> {
        try {
            const res = await this.client.put<T>(url, body);
            return ApiResponse.success<T>(res.data, res.status);
        } catch (err) {
            return this.handleError<T>(err as AxiosError);
        }
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const res = await this.client.delete<T>(url);
            return ApiResponse.success<T>(res.data, res.status);
        } catch (err) {
            return this.handleError<T>(err as AxiosError);
        }
    }

    async requestBlob(url: string, options: any = {}): Promise<Blob> {
        try {
            const res = await this.client.get(url, { ...options, responseType: "blob" });
            return res.data;
        } catch (err) {
            throw new Error(this.handleError(err as AxiosError).getMessageString());
        }
    }
}