import React, { createContext, useContext } from "react";
import { GlobalStorageService, UserScopedStorageService, type IStorageService } from "./Storage.Service";

const GlobalStorageContext = createContext<IStorageService>(new GlobalStorageService());
const UserStorageContext = createContext<IStorageService>(new UserScopedStorageService(-1));

export const StorageProvider: React.FC<{ userId: number; children: React.ReactNode }> = ({ userId, children }) => {
    const globalStorage = new GlobalStorageService();
    const userStorage = new UserScopedStorageService(userId);

    return (
        <GlobalStorageContext.Provider value={globalStorage}>
            <UserStorageContext.Provider value={userStorage}>
                {children}
            </UserStorageContext.Provider>
        </GlobalStorageContext.Provider>
    );
};

export function useGlobalStorage(): IStorageService {
    return useContext(GlobalStorageContext);
}

export function useStorage(): IStorageService {
    return useContext(UserStorageContext);
}