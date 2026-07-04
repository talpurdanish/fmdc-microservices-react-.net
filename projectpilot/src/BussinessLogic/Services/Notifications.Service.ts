// api/NotificationService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type NotificationModel, createNotificationModel } from "../Models/Notification.Model";

const baseUri = "/notifications";

export class NotificationService {
    constructor(private client: IApiClient) { }

    async GetNotifications(): Promise<NotificationModel[]> {
        const res = await this.client.get<NotificationModel>(baseUri, null, createNotificationModel);
        return res.results ?? [];
    }

    async MarkAllAsRead(): Promise<boolean> {
        const res = await this.client.post<boolean>(baseUri);
        return res.result ?? false;
    }
}