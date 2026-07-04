import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect } from "react";
import { showSuccess, showError, showInfo, showWarning } from "./Toast.Helper";
import type { LoginModel } from "../BussinessLogic/Models/Login.Model";
import { Constants, NotificationSeverity, NotificationType } from "./Constants";
import { type IStorageService, GlobalStorageService } from "../BussinessLogic/Storage/Storage.Service";

import { useRefreshContext } from "../BussinessLogic/Hooks/UseRefreshContext";

interface Props {
    onStatusChange?: (status: HubConnectionState) => void;
}

export default function NotificationListener({ onStatusChange }: Props) {
    const storage: IStorageService = new GlobalStorageService();
    const { trigger } = useRefreshContext();

    useEffect(() => {
        const token = storage.get<LoginModel>(Constants.USER_STORAGE_KEY)?.token;

        const connection = new HubConnectionBuilder()
            .withUrl(`${Constants.BASE_URI_U}/notificationHub`, {
                accessTokenFactory: () => token ?? ""
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .build();

        let isMounted = true;

        const startConnection = async (retryCount = 0) => {
            try {
                await connection.start();
                if (isMounted && onStatusChange) onStatusChange(HubConnectionState.Connected);
            } catch (err: any) {

                if (isMounted && onStatusChange) onStatusChange(HubConnectionState.Disconnected);
                if (retryCount < 5 && isMounted) {
                    const delay = Math.min(5000 * (retryCount + 1), 20000);
                    setTimeout(() => startConnection(retryCount + 1), delay);
                }
            }
        };

        connection.onclose(() => {
            if (isMounted && onStatusChange) onStatusChange(HubConnectionState.Disconnected);
        });

        const showMessage = (severity: number, message: string) => {

            switch (severity) {
                case NotificationSeverity.Success:
                    showSuccess(message);
                    break;
                case NotificationSeverity.Warning:
                    showWarning(message);
                    break;
                case NotificationSeverity.Info:
                    showInfo(message);
                    break;
                case NotificationSeverity.Error:
                    showError(message);
                    break;
                default:
                    showInfo(message);
            }
        }

        connection.on("ReceiveNotification", (notification: any) => {
            try {

                switch (notification.type) {
                    case NotificationType.paymentSucceeded:
                        trigger(Constants.RECEIPT_TRIGGER);
                        trigger(Constants.INCOME_TRIGGER);
                        break;
                    case NotificationType.paymentFailed:
                        trigger(Constants.RECEIPT_TRIGGER);
                        break;
                    case NotificationType.appointmentCreated:
                        trigger(Constants.APPOINTMENT_TRIGGER)
                        break;
                    case NotificationType.appointmentEnded:
                        trigger(Constants.APPOINTMENT_TRIGGER);
                        break;
                }
                trigger(Constants.NOTIFICATION_TRIGGER);
                if (notification.showMessage) {
                    showMessage(notification.severity, notification.message);
                }

            } catch (err) {
                console.error("Error handling notification:", err);
            }
        });
        startConnection();

        return () => {
            isMounted = false;
            connection.stop();
        };
    }, [storage, trigger, onStatusChange]);

    return null;
}