import { formatRole, formatGender } from "../../Helpers/Constants";

export interface UserModel {
    id: number;
    name: string;
    username: string;
    dateofBirth: Date;
    gender: number;
    genderString: string;
    cnic: string;
    address?: string;
    picture: string;
    pmdcNo?: string;
    created: Date;
    cityId: number;
    city?: string;
    role: number;
    roleName: string;
    isActive?: boolean;
    provinceId: number;
    province?: string;
    phoneNo?: string;
    phoneType: number;
    password?: string;
    status: boolean;
}

/**
 * Factory function to build UserViewModel from raw API/DB data
 */
export function createUserModel(raw: any): UserModel {
    return {
        id: Number(raw.id),
        name: String(raw.name ?? ""),
        username: String(raw.username ?? ""),
        dateofBirth: raw.dateOfBirth ? new Date(raw.dateOfBirth) : new Date(),
        gender: Number(raw.gender ?? 1),
        genderString: formatGender(Number(raw.gender ?? 1)),
        cnic: String(raw.cnic ?? ""),
        address: raw.address ?? undefined,
        picture: raw.picture ?? "",
        pmdcNo: raw.pmdcNo ?? undefined,
        created: raw.created ? new Date(raw.created) : new Date(),
        cityId: Number(raw.cityId ?? 0),
        city: raw.city ?? undefined,
        role: raw.role ?? "",
        roleName: formatRole(Number(raw.role ?? 0)),
        isActive: raw.isActive ?? undefined,
        provinceId: Number(raw.provinceId ?? 0),
        province: raw.province ?? undefined,
        phoneNo: raw.phoneNo ?? undefined,
        phoneType: Number(raw.phoneType ?? 0),
        password: raw.password ?? undefined,
        status: Boolean(raw.status),
    };
}

/**
 * Convert UserViewModel back into plain JSON for API calls
 */
export function toJson(user: UserModel): any {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        dateOfBirth: user.dateofBirth.toISOString(),
        gender: user.gender,
        cnic: user.cnic,
        address: user.address,
        picture: user.picture,
        pmdcNo: user.pmdcNo,
        created: user.created.toISOString(),
        cityId: user.cityId,
        city: user.city,
        role: user.role,
        isActive: user.isActive,
        provinceId: user.provinceId,
        province: user.province,
        phoneNo: user.phoneNo,
        phoneType: user.phoneType,
        password: user.password,
        status: user.status,
    };
}

export function toMissingDetailJson(user: UserModel): any {
    return {
        id: user.id,
        dateOfBirth: user.dateofBirth.toISOString(),
        gender: user.gender,
        cnic: user.cnic,
        address: user.address,
        picture: user.picture,
        pmdcNo: user.pmdcNo,
        cityId: user.cityId,
        city: user.city,
        role: user.role,
        phoneNo: user.phoneNo,
        phoneType: user.phoneType,
    };
}

