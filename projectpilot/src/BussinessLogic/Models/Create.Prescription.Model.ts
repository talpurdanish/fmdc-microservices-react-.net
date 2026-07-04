// models/PrescriptionModel.ts

export interface CreatePrescriptionModel {
    Appointmentid: number,
    PatientId: number,
    DoctorId: number,
    Medications: string[],
    Tests: number[],
    Bp: string,
    Pulse: number,
    Bsr: number,
    Temp: number,
    Wt: number,
    Ht: number,
    Diagnosis: string,
    Remarks: string
}

export function createPrescriptionDTO(raw: any): CreatePrescriptionModel {
    return {
        Appointmentid: raw?.appointmentid ?? 0,
        PatientId: raw?.patientId ?? 0,
        DoctorId: raw?.doctorId ?? 0,
        Bp: raw?.bp ?? '',
        Pulse: raw?.pulse ?? 0,
        Bsr: raw?.bsr ?? 0,
        Temp: raw?.temp ?? 0,
        Wt: raw?.wt ?? 0,
        Ht: raw?.ht ?? 0,
        Diagnosis: raw?.diagnosis ?? '',
        Remarks: raw?.remarks ?? '',
        Medications: raw.medications ?? [],
        Tests: Array.isArray(raw.tests) ? raw.tests : [],
    }
}

export function toJson(raw: CreatePrescriptionModel): any {
    return {
        Appointmentid: raw?.Appointmentid ?? 0,
        PatientId: raw?.PatientId ?? 0,
        DoctorId: raw?.DoctorId ?? 0,
        Bp: raw?.Bp ?? '',
        Pulse: raw?.Pulse ?? 0,
        Bsr: raw?.Bsr ?? 0,
        Temp: raw?.Temp ?? 0,
        Wt: raw?.Wt ?? 0,
        Ht: raw?.Ht ?? 0,
        Diagnosis: raw?.Diagnosis ?? '',
        Remarks: raw?.Remarks ?? '',
        Medications: raw.Medications ?? [],
        Tests: raw.Tests ?? [],
    };
}