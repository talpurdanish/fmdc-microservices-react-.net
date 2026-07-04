import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import { authService } from "../Index.Service";

import { Constants } from "../../Helpers/Constants";
import { type LoginModel } from "../Models/Login.Model";
import { useGlobalStorage, useStorage } from "../Storage/Storage.Provider";

type AuthState = {
    user: LoginModel | null;
    isAuthenticated: boolean;
    error: string | null;
};

type AuthAction =
    | { type: "LOGIN_SUCCESS"; payload: LoginModel | null }
    | { type: "GET_USER"; payload: LoginModel | null }
    | { type: "SET_USER"; payload: LoginModel | null }
    | { type: "LOGIN_FAILURE"; payload?: string }
    | { type: "LOGOUT" }
    | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return { user: action.payload, isAuthenticated: true, error: null };
        case "LOGIN_FAILURE":
            return { user: null, isAuthenticated: false, error: "Invalid Username/Password" };
        case "LOGOUT":
            return { user: null, isAuthenticated: false, error: null };
        case "GET_USER":
            return { user: action.payload, isAuthenticated: !!action.payload, error: null };
        case "SET_USER":
            return { user: action.payload, isAuthenticated: !!action.payload, error: null };
        case "CLEAR_ERROR":
            return { ...state, error: null };
        default:
            return state;
    }
}

type AuthContextType = {
    state: AuthState;
    loginWithGoogle: (googleToken: string) => Promise<boolean>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    clearError: () => void;
    getUser: () => LoginModel | null;
    setUser: (user: LoginModel) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const globalStorage = useGlobalStorage();
    const userStorage = useStorage();

    const [state, dispatch] = useReducer(authReducer, initialState);

    const getUser = (): LoginModel | null => {
        return globalStorage.get<LoginModel>(Constants.USER_STORAGE_KEY);
    };

    const setUser = (user: LoginModel | null) => {
        globalStorage.set(Constants.USER_STORAGE_KEY, user);
        dispatch({ type: "SET_USER", payload: user });
    };

    const loginWithGoogle = async (googleToken: string): Promise<boolean> => {
        const user = await authService.LoginWithGoogle(googleToken);
        if (user) {
            globalStorage.set(Constants.USER_STORAGE_KEY, user);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            return true;
        } else {
            dispatch({ type: "LOGIN_FAILURE", payload: "Invalid Username/Password" });
            return false;
        }
    }

    const login = async (username: string, password: string): Promise<boolean> => {
        const user = await authService.Login(username, password);
        if (user) {
            globalStorage.set(Constants.USER_STORAGE_KEY, user);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });

            return true;
        } else {
            dispatch({ type: "LOGIN_FAILURE", payload: "Invalid Username/Password" });
            return false;
        }
    };

    const logout = async (): Promise<boolean> => {
        const success = await authService.Logout();
        if (success) {
            userStorage.remove(Constants.PRESCRIPTION_STORAGE_KEY);
            userStorage.remove(Constants.RECEIPT_STORAGE_KEY);
            globalStorage.remove(Constants.USER_STORAGE_KEY);
            dispatch({ type: "LOGOUT" });
        }
        return success;
    };

    const clearError = () => {
        dispatch({ type: "CLEAR_ERROR" });
    };

    useEffect(() => {
        const storedUser = getUser();
        if (storedUser) {
            dispatch({ type: "GET_USER", payload: storedUser });
        }

    }, []);

    return (
        <AuthContext.Provider value={{ state, login, loginWithGoogle, logout, clearError, getUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;