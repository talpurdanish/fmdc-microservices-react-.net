// models/PrescriptionModel.ts

import { createPrescriptionMedicationModel, type PrescriptionMedicationModel, toJson as medicationToJson } from "./Prescription.Medication.Model";

export interface PrescriptionModel {
    id: number;

    Appointmentid: number;
    StartTime: string;

    PatientId: number;
    PatientName: string;
    PatientNumber: string;
    FatherName: string;
    DateOfBirth: Date,
    Gender: string,

    DoctorId: number;
    Doctor: string;

    Date: string;
    Medicines: PrescriptionMedicationModel[];
    Tests: number[];
    MedicineStrings: string[];
    TestNames: string[];
    Bp: string;
    Pulse: number;
    Bsr: number;
    Temp: number;
    Wt: number;
    Ht: number;
    Diagnosis: string;
    Remarks: string;
}

export function createPrescriptionModel(raw: any): PrescriptionModel {
    return {
        id: raw?.id ?? 0,
        Appointmentid: raw?.appointmentid ?? 0,
        StartTime: raw?.startTime ?? '',

        PatientId: raw?.patientId ?? 0,
        PatientName: raw?.patientName ?? '',
        PatientNumber: raw?.patientNumber ?? 0,
        FatherName: raw?.fatherName ?? "",
        DateOfBirth: new Date(raw.dateOfBirth ?? new Date()),
        Gender: raw.gender ?? "",

        DoctorId: raw?.doctorId ?? 0,
        Doctor: raw?.doctor ?? '',

        Date: raw?.date ?? new Date(),
        Bp: raw?.bp ?? '',
        Pulse: raw?.pulse ?? 0,
        Bsr: raw?.bsr ?? 0,
        Temp: raw?.temp ?? 0,
        Wt: raw?.wt ?? 0,
        Ht: raw?.ht ?? 0,
        Diagnosis: raw?.diagnosis ?? '',
        Remarks: raw?.remarks ?? '',
        Medicines: parseMedicines(raw.medicines),
        MedicineStrings: raw.medicineStrings ?? [],
        Tests: Array.isArray(raw.tests) ? raw.tests : [],
        TestNames: Array.isArray(raw.testNames) ? raw.testNames : [],
    }
}


function parseMedicines(medicines?: any[]): PrescriptionMedicationModel[] {
    if (!Array.isArray(medicines)) {
        return [];
    }

    return medicines.map((raw) => {
        return createPrescriptionMedicationModel(raw);
    });
}


export function toJson(raw: PrescriptionModel): any {
    return {
        id: raw?.id ?? 0,
        appointmentid: raw?.Appointmentid ?? 0,
        startTime: raw?.StartTime ?? '',

        patientId: raw?.PatientId ?? 0,
        patientName: raw?.PatientName ?? '',
        patientNumber: raw?.PatientNumber ?? 0,
        fatherName: raw?.FatherName ?? "",
        dateOfBirth: new Date(raw.DateOfBirth ?? new Date()),
        gender: raw.Gender ?? "",

        doctor: raw?.Doctor ?? '',
        doctorId: raw?.DoctorId ?? 0,

        date: raw?.Date ?? new Date(),
        bp: raw?.Bp ?? '',
        pulse: raw?.Pulse ?? 0,
        bsr: raw?.Bsr ?? 0,
        temp: raw?.Temp ?? 0,
        wt: raw?.Wt ?? 0,
        ht: raw?.Ht ?? 0,
        diagnosis: raw?.Diagnosis ?? '',
        remarks: raw?.Remarks ?? '',
        medicines: Array.isArray(raw.Medicines)
            ? raw.Medicines.map(m => medicationToJson(m))
            : [],
        medicineStrings: raw.MedicineStrings ?? [],
        tests: raw.Tests ?? [],
        testNames: raw.TestNames ?? [],
    };
}