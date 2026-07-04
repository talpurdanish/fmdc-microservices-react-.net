export interface AppointmentModel {
    id: number;
    Date: Date;
    StartTime: string;
    EndDate?: Date;
    EndTime?: string;
    UserId: number;
    PatientId: number;
    PatientName: string;
    DoctorName: string;
}

export function createAppointmentModel(raw: any): AppointmentModel {

    return {
        id: raw.id ?? -1,
        Date: raw.date ?? new Date(),
        StartTime: raw.startTime ?? "",
        EndDate: raw.endDate,
        EndTime: raw.endTime,
        UserId: raw.userId ?? -1,
        PatientId: raw.patientId ?? -1,
        PatientName: raw.patientName ?? "",
        DoctorName: raw.doctorName ?? "",
    };
}


export function toJson(data?: AppointmentModel) {
    return data != null ? JSON.stringify(data) : null;

    // {
    //     "id": data.id ?? -1,
    //     "AppointmentDate": data.AppointmentDate ?? new Date(),
    //     "StartTime": data.StartTime ?? "",
    //     "AppointmentEndDate": data.AppointmentEndDate ?? new Date(),
    //     "EndTime": data.EndTime ?? "",
    //     "UserId": data.UserId ?? -1,
    //     "PatientId": data.PatientId ?? -1,
    //     "PatientName": data.PatientName ?? "",
    //     "DoctorName": data.DoctorName ?? "",
    // };
}