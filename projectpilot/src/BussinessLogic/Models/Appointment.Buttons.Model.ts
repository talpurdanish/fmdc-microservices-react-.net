export interface AppointmentButtonsModel {
    startVisible: boolean;
    endVisible: boolean;
    receiptVisible: boolean;
    title: string;
    patientId: string;
    aId: string;
    prescriptionVisible: boolean;
    slipVisible: boolean;
}

export function createButtonsModel(raw: any): AppointmentButtonsModel {
    return {
        startVisible: raw.startVisible ?? true,
        endVisible: raw.endVisible ?? false,
        receiptVisible: raw.receiptVisible ?? false,
        title: raw.title ?? '',
        patientId: raw.patientId ?? 0,
        aId: raw.aId ?? -1,
        prescriptionVisible: raw.prescriptionVisible ?? false,
        slipVisible: raw.slipVisible ?? false
    };
}


export function toJson(buttons: AppointmentButtonsModel): any {
    return {
        'startVisible': buttons.startVisible,
        'endVisible': buttons.endVisible,
        'receiptVisible': buttons.receiptVisible,
        'title': buttons.title,
        'patientId': buttons.patientId,
        'aId': buttons.aId,
        'prescriptionVisible': buttons.prescriptionVisible,
        'slipVisible': buttons.slipVisible
    }
}