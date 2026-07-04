// Report.Model.ts

export interface ReportModel {
    id: number;
    ReportDate: string;
    ReportTime: string;
    ReportDeliveryDate: string;
    ReportDeliveryTime: string;
    TestName: string;
    TestId: number;
    PatientId: number;
    PatientName: string;
    PatientNumber: string;
    Doctor: string;
    DoctorId: number;
    ReportNumber: number;
    ReportNoString: string;
    Status: string;
    Gender: string;
    PatientAge: string;
    PatientGender: string;
    DoctorPMDCNo: string;
    Note: string;
}

// ✅ Factory: safely map raw API data into a typed model
export function createReportModel(data: any): ReportModel {
    return {
        id: data?.id ?? 0,
        ReportDate: data?.ReportDate ?? "",
        ReportTime: data?.ReportTime ?? "",
        ReportDeliveryDate: data?.ReportDeliveryDate ?? "",
        ReportDeliveryTime: data?.ReportDeliveryTime ?? "",
        TestName: data?.TestName ?? "",
        TestId: data?.TestId ?? 0,
        PatientId: data?.PatientId ?? 0,
        PatientName: data?.PatientName ?? "",
        PatientNumber: data?.PatientNumber ?? "",
        Doctor: data?.Doctor ?? "",
        DoctorId: data?.DoctorId ?? 0,
        ReportNumber: data?.ReportNumber ?? 0,
        ReportNoString: data?.ReportNoString ?? "",
        Status: data?.Status ?? "",
        Gender: data?.Gender ?? "",
        PatientAge: data?.PatientAge ?? "",
        PatientGender: data?.PatientGender ?? "",
        DoctorPMDCNo: data?.DoctorPMDCNo ?? "",
        Note: data?.Note ?? "",
    };
}

// ✅ Serializer: convert model back to plain JSON for API calls
export function toJson(report: ReportModel): any {
    return {
        id: report.id,
        ReportDate: report.ReportDate,
        ReportTime: report.ReportTime,
        ReportDeliveryDate: report.ReportDeliveryDate,
        ReportDeliveryTime: report.ReportDeliveryTime,
        TestName: report.TestName,
        TestId: report.TestId,
        PatientId: report.PatientId,
        PatientName: report.PatientName,
        PatientNumber: report.PatientNumber,
        Doctor: report.Doctor,
        DoctorId: report.DoctorId,
        ReportNumber: report.ReportNumber,
        ReportNoString: report.ReportNoString,
        Status: report.Status,
        Gender: report.Gender,
        PatientAge: report.PatientAge,
        PatientGender: report.PatientGender,
        DoctorPMDCNo: report.DoctorPMDCNo,
        Note: report.Note
    };
}