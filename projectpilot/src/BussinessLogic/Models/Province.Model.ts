export interface ProvinceModel {

    id: number;
    name: string;
}

export function createProvinceModel(raw: any): ProvinceModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? ""
    }
}


export function toJson(city: ProvinceModel): any {
    return {
        'id': city.id,
        'name': city.name
    }
}