// models/TestModel.ts

export interface TestModel {
    id: number;
    name: string;
    description: string;
    cost: number;
}

export function createTestModel(raw: any): TestModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? "",
        description: raw.description ?? "",
        cost: raw.cost ?? 0
    };
}

export function toJson(test: TestModel): any {
    return {
        id: test.id,
        name: test.name,
        description: test.description,
        cost: test.cost
    };
}