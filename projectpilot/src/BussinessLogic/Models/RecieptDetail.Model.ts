export interface RecieptDetailModel {
    id: number;
    recieptId: number;
    procedureId?: number | null;
    detail?: string | null;
    cost: number;
    type?: string | null;
    testId?: number | null;
}

export function createRecieptDetailModel(raw: any): RecieptDetailModel {
    return {
        id: Number(raw.id ?? "0"),
        recieptId: Number(raw.recieptId ?? "0"),
        procedureId: raw.procedureId != null ? Number(raw.procedureId) : null,
        detail: raw.detail ?? null,
        cost: Number(raw.cost ?? "0"),
        type: raw.type ?? null,
        testId: raw.testId != null ? Number(raw.testId) : null
    };
}

export function toJson(detail: RecieptDetailModel): any {
    return {
        id: detail.id,
        recieptId: detail.recieptId,
        procedureId: detail.procedureId,
        detail: detail.detail,
        cost: detail.cost,
        type: detail.type,
        testId: detail.testId
    };
}