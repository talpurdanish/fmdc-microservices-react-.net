import type { PagedResults } from "./PagedResults";

// models/ApiResponse.ts
export class ApiResponse<T> {
    error: boolean;
    messages: string[];
    code: number;
    result?: T;
    results?: T[];
    pagedResults?: PagedResults<T>;


    constructor(data: any, modelFactory?: (raw: any) => T) {

        if (!data) {
            this.error = true;
            this.messages = ["No response data received"];
            this.code = 500;
            return;
        }

        this.error = Boolean(data.error);
        this.code = data.code ?? 500;

        // Normalize messages
        if (Array.isArray(data.message)) {
            this.messages = data.message;
        } else if (typeof data.message === "string") {
            this.messages = [data.message];
        } else if (Array.isArray(data.messages)) {
            this.messages = data.messages;
        } else if (Array.isArray(data.errors)) {
            this.messages = data.errors;
        } else {
            this.messages = [];
        }

        if (!this.error && (data.results == undefined || data.results == null)) {
            this.error = false;
            this.messages = ["Response data received"];
            this.code = 200;
            this.result = data as unknown as T;
            return;

        }

        // Handle PagedResults
        if (data.results.data && data.results.totalRecords !== undefined && data.results.totalPages !== undefined) {
            const items = modelFactory ? data.results.data.map((x: any) => modelFactory(x)) : data.results.data;
            this.pagedResults = {
                data: items,
                currentPage: data.results.currentPage,
                totalRecords: data.results.totalRecords,
                totalPages: data.results.totalPages,
                pageSize: data.results.pageSize,
                nextPage: data.results.nextPage,
                prevPage: data.results.prevPage
            };
            return;
        }

        if (!this.error && data.results && modelFactory) {
            if (Array.isArray(data.results)) {
                this.results = data.results.map((item: any) => modelFactory(item));
            } else {
                this.result = modelFactory(data.results);
            }
        } else {
            if (Array.isArray(data.results)) {
                this.results = data.results;
            } else {
                this.result = data.results;
            }
        }
    }

    static success<T>(results: T | T[], code = 200, modelFactory?: (raw: any) => T): ApiResponse<T> {
        try {
            const resp = modelFactory ? new ApiResponse<T>(results, modelFactory) : new ApiResponse<T>({ error: false, results, code: code });
            resp.error = false;
            resp.code = code;

            if (Array.isArray(results)) resp.results = results;
            else resp.result = results;
            return resp;

        } catch (err) {
            console.error("API RESPONSE SUCCESS: ", err)
            return new ApiResponse<T>({ error: true, code, messages: [""] });
        }

    }

    static failure<T>(messages: string[], code = 500): ApiResponse<T> {
        const res = new ApiResponse<T>({ error: true, code, messages });
        return res;
    }

    isSuccess(): boolean {
        return !this.error && this.code >= 200 && this.code < 300;
    }

    isFailure(): boolean {
        return this.error || this.code >= 400;
    }

    getMessageString(separator = "; "): string {
        return this.messages.join(separator);
    }
}