// models/ProcedureModel.ts

export interface ProcedureModel {
    id: number;
    name: string;
    cost: number;
    type: string;
    typeID: number;
}

export function createProcedureModel(raw: any): ProcedureModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? "",
        cost: Number(raw.cost ?? "0"),
        type: raw.type ?? "",
        typeID: Number(raw.typeId ?? "0"),
    };
}

export function toJson(procedure: ProcedureModel): any {
    return {
        id: procedure.id,
        name: procedure.name,
        cost: procedure.cost,
        type: procedure.type,
        typeID: procedure.typeID,
    };
}