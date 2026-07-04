export interface CityModel {

    id: number;
    name: string;
    provinceName: string;
    provinceId: number;
}

export function createCityModel(raw: any): CityModel {
    return {
        id: Number(raw.id ?? "0"),
        name: raw.name ?? "",
        provinceName: raw.provinceName ?? "",
        provinceId: Number(raw.provinceId ?? "0"),
    }
}


export function toJson(city: CityModel): any {
    return {
        'id': city.id ?? -1,
        'name': city.name,
        'province': city.provinceName,
        'provinceId': city.provinceId
    }
}