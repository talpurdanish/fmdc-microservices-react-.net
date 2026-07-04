import type { ProcedureModel } from "./Procedure.Model";
import type { TestModel } from "./Test.Model";

export interface ReceiptModel {

    Id: number;
    ReceiptNumber: string;
    PatientId: number;
    DoctorId: number;
    AppointmentId: string;
    PatientName: string;
    PatientNumber: string;
    Doctor: string;
    Date: string;
    Time: string;
    AuthorizedBy: string;
    AuthorizedById: number;
    Discount: number;
    Total: number;
    GrandTotal: number;
    Appointment: string;
    Paid: boolean;
    Procedures: ProcedureModel[];
    ProcedureIds: number[];
    Tests: TestModel[];
    TestIds: number[];

}


export function createReceiptModel(
    raw: any
): ReceiptModel {

    return {
        Id: raw.id ?? 0,
        ReceiptNumber: raw.recieptNumber ?? "",
        PatientId: raw.patientId ?? 0,
        DoctorId: raw.doctorId ?? 0,
        AppointmentId: raw.appointmentId ?? "",
        PatientName: raw.patientName ?? "",
        PatientNumber: raw.patientNumber ?? "",
        Doctor: raw.doctor ?? "",
        Date: raw.date ?? new Date().toDateString(),
        Time: raw.time ?? new Date().toLocaleTimeString(),
        AuthorizedBy: raw.authorizedBy ?? "",
        AuthorizedById: raw.authorizedById ?? -1,
        Discount: raw.discount ?? 0,
        Total: raw.total ?? 0,
        GrandTotal: raw.grandTotal ?? 0,
        Appointment: raw.appointment ?? "",
        Paid: raw.paid ?? false,
        Procedures: raw.procedures ?? [],
        ProcedureIds: raw.procedureIds ?? [],
        Tests: raw.tests ?? [],
        TestIds: raw.testIds ?? []

    };

}


export function toJson(data: ReceiptModel) {

    return JSON.parse(JSON.stringify(data));
}





