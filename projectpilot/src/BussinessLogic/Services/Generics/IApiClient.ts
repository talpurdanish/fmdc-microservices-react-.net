// api/IApiClient.ts
import { ApiResponse } from "../../Models/Generics/ApiResponse";

export interface IApiClient {
    get<T>(url: string, params?: any, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>>;
    post<T>(url: string, body?: any, modelFactory?: (raw: any) => T): Promise<ApiResponse<T>>;
    put<T>(url: string, body?: any): Promise<ApiResponse<T>>;
    delete<T>(url: string): Promise<ApiResponse<T>>;
    requestBlob(url: string, options?: any): Promise<Blob>;
}