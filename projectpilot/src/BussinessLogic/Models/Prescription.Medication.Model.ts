export interface PrescriptionMedicationModel {
    id: number;
    Quantity: number;
    Units: string;
    Times: number;
    Code: number;
    PrescriptionId: number;
    Medicine: string;
    sno?: number;
    Days: number;
}
export function createPrescriptionMedicationModel(raw: any): PrescriptionMedicationModel {
    return {
        id: raw?.id ?? 0,
        Quantity: raw?.quantity ?? 0,
        Units: raw?.units ?? '',
        Code: raw?.code ?? 0,
        PrescriptionId: raw?.prescriptionId ?? 0,
        Times: raw?.times ?? 0,
        Medicine: raw?.medicine ?? '',
        Days: raw?.days ?? 0
    };
}

export function toJson(raw: PrescriptionMedicationModel): any {
    return {
        id: raw?.id ?? 0,
        quantity: raw?.Quantity ?? 0,
        units: raw?.Units ?? '',
        code: raw?.Code ?? 0,
        prescriptionId: raw?.PrescriptionId ?? 0,
        times: raw?.Times ?? 0,
        medicine: raw?.Medicine ?? '',
        days: raw.Days ?? 0
    };
}



export function ToString(data: PrescriptionMedicationModel): string {
    return (
        `${data.Medicine} ............................... ${data.Quantity} ${data.Units}${data.Quantity > 1 ? "s" : ""} ${getTimesPerDay(data.Times)} for ${data.Days} days`
    );
}

function getTimesPerDay(times: number): string {

    if (times == 1)
        return "OD";
    else if (times == 2)
        return "BD";
    else if (times == 3)
        return "TD"
    else
        return `${times} per day`;


}

export function ToOutput(data: PrescriptionMedicationModel) {
    return (
        `${data.Code}:${data.Quantity}:${data.Units}:${data.Times}:${data.Days}`
    );
}

