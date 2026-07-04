import { createTestParameterModel, type TestParameterModel, toJson as testParameterToJson } from "./TestParameter.Model";

export interface ReportValueModel {
    id: number;
    Value: number;
    TestParameterId: number;
    TestParameter: TestParameterModel;
    LabReportId: number;
}

// Factory: map raw API data into typed model
export function createReportValueModel(data: any): ReportValueModel {
    return {
        id: data?.id ?? 0,
        Value: data?.Value ?? 0,
        TestParameterId: data?.TestParameterId ?? 0,
        TestParameter: data?.TestParameter ? createTestParameterModel(data.TestParameter) : {} as any,
        LabReportId: data?.LabReportId ?? 0
    };
}

// Serializer: convert model back to plain JSON
export function toJson(reportValue: ReportValueModel): any {
    return {
        id: reportValue.id,
        Value: reportValue.Value,
        TestParameterId: reportValue.TestParameterId,
        TestParameter: reportValue.TestParameter ? testParameterToJson(reportValue.TestParameter) : null,
        LabReportId: reportValue.LabReportId
    };
}
