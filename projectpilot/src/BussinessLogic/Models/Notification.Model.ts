export interface NotificationModel {
    id: number;
    message: string;
    isRead: boolean;
    type: number;
    createdAt: Date;
}


export function createNotificationModel(raw: any): NotificationModel {


    return {
        id: raw.id ?? -1,
        message: raw.message ?? "",
        isRead: raw.isRead ?? false,
        type: raw.type ?? -1,
        createdAt: raw.createdAt ?? new Date()
    }



}