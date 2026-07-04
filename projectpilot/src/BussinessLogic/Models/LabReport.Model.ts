

// import { type ReportValueModel, createReportValueModel, toJson as reportValueToJson } from "./ReportValue.Model";
// import { type TestParameterModel, createTestParameterModel, toJson as testParameterToJson } from "./TestParameter.Model";

import { type ReportValueModel } from "./ReportValue.Model";
import { type TestParameterModel } from "./TestParameter.Model";


export interface LabReportModel {
    id: number;
    ReportDate: string;
    ReportTime: string;
    ReportDeliveryDate: string;
    ReportDeliveryTime: string;
    TestName: string;
    TestId: number;
    PatientId: number;
    PatientName: string;
    Doctor: string;
    DoctorId: number;
    ReportNumber: number;
    ReportNoString: string;
    Status: string;
    PatientGender: number;
    PatientAge: string;
    DoctorPmdcNo: string;
    Note: string;
    ReportValues: ReportValueModel[];
    TestParameters: TestParameterModel[];
}

// Factory: map raw API data into typed model
export function createLabReportModel(data: any): LabReportModel {

    return {
        id: data?.id ?? 0,
        ReportDate: data?.reportDate ?? "",
        ReportTime: data?.reportTime ?? "",
        ReportDeliveryDate: data?.reportDeliveryDate ?? "",
        ReportDeliveryTime: data?.reportDeliveryTime ?? "",
        TestName: data?.testName ?? "",
        TestId: data?.testId ?? 0,
        PatientId: data?.patientId ?? 0,
        PatientName: data?.patientName ?? "",
        Doctor: data?.doctor ?? "",
        DoctorId: data?.doctorId ?? 0,
        ReportNumber: data?.reportNumber ?? 0,
        ReportNoString: data?.reportNoString ?? "",
        Status: data?.status ?? "",
        PatientGender: data?.patientGender ?? "",
        PatientAge: data?.patientAge ?? "",
        DoctorPmdcNo: data?.doctorPmdcNo ?? "",
        Note: data?.note ?? "",
        ReportValues: [],
        // Array.isArray(data?.reportValues)
        //     ? data.ReportValues.map((rv: any) => createReportValueModel(rv))
        //     : [],
        TestParameters: [],
        // Array.isArray(data?.testParameters)
        //     ? data.TestParameters.map((tp: any) => createTestParameterModel(tp))
        //     : []
    };
}

// Serializer: convert model back to plain JSON
export function toJson(labReport: LabReportModel): any {
    return {
        id: labReport.id,
        ReportDate: labReport.ReportDate,
        ReportTime: labReport.ReportTime,
        ReportDeliveryDate: labReport.ReportDeliveryDate,
        ReportDeliveryTime: labReport.ReportDeliveryTime,
        TestName: labReport.TestName,
        TestId: labReport.TestId,
        PatientId: labReport.PatientId,
        PatientName: labReport.PatientName,
        Doctor: labReport.Doctor,
        DoctorId: labReport.DoctorId,
        ReportNumber: labReport.ReportNumber,
        ReportNoString: labReport.ReportNoString,
        Status: labReport.Status,
        PatientGender: labReport.PatientGender,
        PatientAge: labReport.PatientAge,
        DoctorPmdcNo: labReport.DoctorPmdcNo,
        Note: labReport.Note,
        ReportValues: [],
        TestParameters: []
        // ReportValues: labReport.ReportValues.map(rv => reportValueToJson(rv)),
        // TestParameters: labReport.TestParameters.map(tp => testParameterToJson(tp))
    };
}


