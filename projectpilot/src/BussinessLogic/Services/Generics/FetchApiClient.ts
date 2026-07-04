// api/ApiClient.ts
import { Constants } from "../../../Helpers/Constants";
import { GlobalStorageService, type IStorageService } from "../../Storage/Storage.Service";
import type { IApiClient } from "./IApiClient";
import { ApiResponse } from "../../Models/Generics/ApiResponse";
import type { LoginModel } from "../../Models/Login.Model";
import { normalizePayload } from "./ApiUtils";

export class FetchApiClient implements IApiClient {
  private baseUrl: string = Constants.API_URL_U;
  private storage: IStorageService = new GlobalStorageService();
  constructor(baseUri: string) {
    this.baseUrl = baseUri;
  }

  private async request<T>(url: string, options: RequestInit = {}, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>> {
    try {
      const token = this.storage.get<LoginModel>(Constants.USER_STORAGE_KEY)?.token;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const uri = `${this.baseUrl}${url}`;
      const res = await fetch(uri, { ...options, headers });

      let data: any;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        return ApiResponse.failure<T>(
          [data?.message ?? `HTTP error! status: ${res.status}`],
          res.status
        );
      }

      return ApiResponse.success<T>(data, res.status, modelFactory);
    } catch (err: any) {
      return ApiResponse.failure<T>([err?.message ?? "Unexpected error"], 500);
    }
  }

  async get<T>(url: string, payload?: any, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>> {
    const { params, queryString } = normalizePayload(payload);
    let finalUrl = `${this.baseUrl}${url}`;

    if (params) {
      const qs = new URLSearchParams(params).toString();
      finalUrl += `?${qs}`;
    } else if (queryString) {
      finalUrl += `?${queryString}`;
    }

    const res = await fetch(finalUrl, { method: "GET" });
    return new ApiResponse<T>(await res.json(), modelFactory);
  }


  async post<T>(url: string, body: any = {}, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : "",
    }, modelFactory);
  }

  async put<T>(url: string, body: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : "",
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "DELETE" });
  }

  async requestBlob(url: string, options: RequestInit = {}): Promise<Blob> {
    const token = this.storage.get<LoginModel>(Constants.USER_STORAGE_KEY)?.token;
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const uri = `${this.baseUrl}${url}`;
    const res = await fetch(uri, { ...options, headers });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.blob();
  }
}