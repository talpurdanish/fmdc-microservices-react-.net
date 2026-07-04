import { formatGender, parseIsoDateString } from "../../Helpers/Constants";

// Patient model interface
export interface PatientModel {
    id: number;
    name: string;
    fatherName?: string;
    address?: string;
    picture?: string;
    dateOfBirth: Date;
    gender: number;
    genderString: string;
    phoneNo?: string;
    phoneType?: number;
    bloodGroup: string;
    cnic: string;
    patientNumber: string;
    mrNo: number;
    created: Date;
    cityId?: number;
    city?: string;
    province?: string;
    provinceId: number;

}

// Factory function to create a patient model
export function createPatientModel(data: any): PatientModel {
    const model: PatientModel = {
        id: data.id ?? 0,
        name: data.name ?? "",
        fatherName: data.fatherName,
        address: data.address,
        picture: data.picture,
        dateOfBirth: parseIsoDateString(data.dateofBirth),
        gender: data.gender ?? 1,
        genderString: formatGender(data.gender ?? 1),
        phoneNo: data.phoneNo,
        phoneType: data.phoneType,
        bloodGroup: data.bloodGroup ?? "",
        cnic: data.cnic ?? "",
        patientNumber: data.patientNumber ?? "",
        mrNo: data.mrNo ?? 0,
        created: data.created ?? new Date(),
        cityId: data.cityId,
        city: data.city,
        province: data.province,
        provinceId: data.provinceId
    };

    return model;
}

export function toJson(data: PatientModel) {
    return {
        id: data.id,
        name: data.name,
        fatherName: data.fatherName,
        address: data.address,
        picture: data.picture,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender.toString(),
        phoneNo: data.phoneNo,
        phoneType: data.phoneType,
        bloodGroup: data.bloodGroup,
        cnic: data.cnic,
        cityId: data.cityId,
    };
}