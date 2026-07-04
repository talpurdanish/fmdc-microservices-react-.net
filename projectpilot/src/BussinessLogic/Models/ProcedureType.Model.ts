// ProcedureType Model
export interface ProcedureTypeModel {
    id: number;
    name: string;
}

// Factory function
export function createProcedureTypeModel(raw: any): ProcedureTypeModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? "",
    };
}

// ToJson function
export function toJson(data: ProcedureTypeModel): any {
    return {
        id: data.id,
        name: data.name,
    };
}