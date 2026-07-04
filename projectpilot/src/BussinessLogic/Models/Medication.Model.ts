export interface MedicationModel {
    code: number;
    name: string;
    brand: string;
    description: string;
    typeID: number;
    type: string;
}

export function createMedicationModel(raw: any): MedicationModel {
    return {
        code: Number(raw.code ?? "0"),
        name: raw.name ?? "",
        brand: raw.brand ?? "",
        description: raw.description ?? "",
        typeID: Number(raw.typeID ?? "0"),
        type: raw.type ?? ""
    };
}

export function toJson(medication: MedicationModel): any {
    return {
        code: medication.code,
        name: medication.name,
        brand: medication.brand,
        description: medication.description,
        typeID: medication.typeID
    };
}