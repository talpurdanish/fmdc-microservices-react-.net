// models/TestParameter.ts

export interface TestParameterModel {
    id: number;
    name: string;
    maleMaxValue: number;
    maleMinValue: number;
    femaleMaxValue: number;
    femaleMinValue: number;
    unit: string;
    value: number;
    testId: number;
    testName: string;
    referenceRange: string;
    gender: boolean;
    status: boolean;
}

export function createTestParameterModel(raw: any): TestParameterModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? "",
        maleMaxValue: Number(raw.maleMaxValue ?? "0"),
        maleMinValue: Number(raw.maleMinValue ?? "0"),
        femaleMaxValue: Number(raw.femaleMaxValue ?? "0"),
        femaleMinValue: Number(raw.femaleMinValue ?? "0"),
        unit: raw.unit ?? "",
        value: Number(raw.value ?? "0"),
        testId: Number(raw.testId ?? "0"),
        testName: raw.testName ?? "",
        referenceRange: raw.referenceRange ?? "",
        gender: Boolean(raw.gender ?? false),
        status: Boolean(raw.status ?? false),
    };
}

export function toJson(testParameter: TestParameterModel): any {
    return {
        id: testParameter.id,
        name: testParameter.name,
        maleMaxValue: testParameter.maleMaxValue,
        maleMinValue: testParameter.maleMinValue,
        femaleMaxValue: testParameter.femaleMaxValue,
        femaleMinValue: testParameter.femaleMinValue,
        unit: testParameter.unit,
        value: testParameter.value,
        testId: testParameter.testId,
        testName: testParameter.testName,
        referenceRange: testParameter.referenceRange,
        gender: testParameter.gender,
        status: testParameter.status,
    };
}