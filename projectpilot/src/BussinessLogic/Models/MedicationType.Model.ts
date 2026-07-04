// MedicationType Model
export interface MedicationTypeModel {
    id: number;
    name: string;
}

// Factory function
export function createMedicationTypeModel(raw: any): MedicationTypeModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? "",
    };
}

// ToJson function
export function toJson(data: MedicationTypeModel): any {
    return {
        id: data.id,
        name: data.name,
    };
}