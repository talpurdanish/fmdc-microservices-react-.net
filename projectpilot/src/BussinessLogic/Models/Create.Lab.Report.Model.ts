import { formatDate } from "../../Helpers/Constants";

export interface LabReportModelDTO {
    id: number;
    ReportDeliveryDate: Date;
    ReportDeliveryTime: string;
    TestId: number;
    PatientId: number;
    DoctorId: number;
    Note: string;
}

// Factory: map raw API data into typed model
export function createLabReportModelDTO(data: any): LabReportModelDTO {

    return {
        id: data?.id ?? 0,
        ReportDeliveryDate: data?.reportDeliveryDate ?? new Date(),
        ReportDeliveryTime: data?.reportDeliveryTime ?? "",
        TestId: data?.testId ?? 0,
        PatientId: data?.patientId ?? 0,
        DoctorId: data?.doctorId ?? 0,
        Note: data?.note ?? "",
    };
}

// Serializer: convert model back to plain JSON
export function toJson(labReport: LabReportModelDTO): any {
    return {
        id: labReport.id,
        ReportDeliveryDate: formatDate(labReport.ReportDeliveryDate, "dd/MM/yyyy"),
        ReportDeliveryTime: labReport.ReportDeliveryTime,
        TestId: labReport.TestId,
        PatientId: labReport.PatientId,
        DoctorId: labReport.DoctorId,
        Note: labReport.Note,

    };
}

export function toCreateJson(labReport: LabReportModelDTO): any {
    return {
        ReportDeliveryDate: formatDate(labReport.ReportDeliveryDate, "dd/MM/yyyy"),
        ReportDeliveryTime: labReport.ReportDeliveryTime,
        TestId: labReport.TestId,
        PatientId: labReport.PatientId,
        DoctorId: labReport.DoctorId,
        Note: labReport.Note,
    };
}