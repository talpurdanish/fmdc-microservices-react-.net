// RefreshContext.tsx
import React, { createContext, useContext, useRef } from "react";

type RefreshFn = () => void;

interface RefreshContextType {
    register: (key: string, fn: RefreshFn) => void;
    unregister: (key: string) => void;
    trigger: (key: string) => void;
    triggerAll: () => void;
}

const RefreshContext = createContext<RefreshContextType | null>(null);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const registry = useRef<Map<string, RefreshFn>>(new Map());

    const value: RefreshContextType = {
        register: (key, fn) => {
            registry.current.set(key, fn);
        },
        unregister: (key) => {
            registry.current.delete(key);
        },
        trigger: (key) => {
            const fn = registry.current.get(key);
            if (fn) fn();
        },
        triggerAll: () => {
            registry.current.forEach(fn => fn());
        }
    };

    return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>;
};

export function useRefreshContext() {
    const ctx = useContext(RefreshContext);
    if (!ctx) throw new Error("useRefreshContext must be used inside RefreshProvider");
    return ctx;
}