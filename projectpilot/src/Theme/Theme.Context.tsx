import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStorage } from "../BussinessLogic/Storage/Storage.Provider";
import { Constants } from "../Helpers/Constants";

type Theme = "light" | "dark" | "system" | "";

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: (value: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("");
    const storage = useStorage();

    useEffect(() => {
        // Read per-user theme preference
        const savedTheme = storage.get<Theme>(Constants.THEME_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            storage.set(Constants.THEME_STORAGE_KEY, theme);
        }
    }, [storage]);


    const changeTheme = (value: Theme) => {
        if (value == "") return;
        var t = value;

        if (value == "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            t = prefersDark ? "dark" : "light";
        }

        document.documentElement.className = "";
        document.documentElement.classList.add(t);
        storage.set(Constants.THEME_STORAGE_KEY, value);
    }


    useEffect(() => {
        if (!theme) return;
        changeTheme(theme);
    }, [theme, storage]);

    const toggleTheme = (value: Theme) => {
        setTheme(value);
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextProps => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};