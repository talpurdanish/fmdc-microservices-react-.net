import { BellIcon, BellRing, FileExclamationPointIcon, HandCoinsIcon } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import { useGetApi } from '../../BussinessLogic/Hooks/UseGetApi';
import { notificationsService } from '../../BussinessLogic/Index.Service';

import { useMutationApi } from '../../BussinessLogic/Hooks/UseMutationsApi';

import { type NotificationModel } from '../../BussinessLogic/Models/Notification.Model';
import { Constants } from '../../Helpers/Constants';
import { useRefreshContext } from "../../BussinessLogic/Hooks/UseRefreshContext";



const NotificationMenu = () => {
    const hasRunRef = useRef(false);
    const [open, setOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState<NotificationModel[]>([]);
    const { register, unregister } = useRefreshContext();


    const { data: notifications, refetch } = useGetApi<NotificationModel[]>(
        () => notificationsService.GetNotifications(),
        { immediate: true }
    );

    const { mutate: markAllAsReadCall } = useMutationApi(() => notificationsService.MarkAllAsRead())

    useEffect(() => {
        register(Constants.NOTIFICATION_TRIGGER, refetch);
        return () => unregister(Constants.NOTIFICATION_TRIGGER);
    }, [register, unregister, refetch]);

    // Sync API data into local state
    useEffect(() => {
        if (notifications) {
            setLocalNotifications(notifications);
        }
    }, [notifications]);

    // Mark all notifications as read when menu opens
    useEffect(() => {
        // Track whether we've already scheduled a timer for this open cycle

        let timer: number | undefined;


        if (open && localNotifications.some(n => !n.isRead) && !hasRunRef.current) {
            hasRunRef.current = true;
        }

        if (hasRunRef.current) {
            timer = window.setTimeout(() => {
                setLocalNotifications(prev =>
                    prev.map(n => ({ ...n, isRead: true }))
                );

                markAllAsReadCall();
                refetch();
            }, 2000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
            if (!open) {
                hasRunRef.current = false;
            }
        };
    }, [open, localNotifications, markAllAsReadCall, refetch]);



    const getIconByType = (type: number) => {
        switch (type) {
            case 0:
                return <HandCoinsIcon className='w-5 mr-2' color='yellow' />
            case 1:
                return <FileExclamationPointIcon className='w-5 mr-2' color='red' />
            default:
                return <BellIcon className='w-5 mr-2' color='blue' />
        }
    };


    return (
        <div
            className="relative inline-block text-left"
            onMouseLeave={() => setOpen(false)}
            onMouseOver={() => setOpen(true)}
        >
            <div className="relative inline-block text-left">
                <button className="btn btn-gray btn-rounded btn-padding-sm relative">
                    <BellRing className="w-5 text-yellow-700 dark:text-yellow-300" />
                </button>

            </div>
            <div
                className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-700 
                            rounded-md shadow-lg transform transition-all duration-300 origin-top z-50
                            ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
            >
                <ul className="max-h-[70vh] overflow-y-auto">
                    {localNotifications.length === 0 ? (
                        <li className="px-4 py-2 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer">
                            No Notifications Found
                        </li>
                    ) : (
                        localNotifications.map((notification, index) => (
                            <li
                                key={notification.id}
                                className={`flex px-4 py-4 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer 
                                ${index !== localNotifications.length - 1 ? "border-b dark:border-gray-700 border-gray-950" : ""}`}
                            >
                                {!notification.isRead && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-600"></span>}
                                {getIconByType(notification.type)}
                                <span
                                    className={`flex-1 ${!notification.isRead
                                        ? "font-bold text-black dark:text-white"
                                        : "text-gray-500 dark:text-gray-300"
                                        }`}
                                >
                                    {notification.message}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationMenu;



