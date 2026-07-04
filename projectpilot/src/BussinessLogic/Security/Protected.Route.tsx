import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth.Context";
import { RouterPaths } from "../Routes/RouterPaths";
import type { Role } from "../../Helpers/Constants";
import type { ReactElement } from "react";
import { Layout } from "../../Layout/main_layout/Layout";

interface RouteProps {
    allowedRoles: Role[], children: ReactElement
}


export const ProtectedRoute = ({ allowedRoles, children }: RouteProps) => {
    const { state, getUser } = useAuth();
    const user = getUser();
    const authState = user != null && user?.token != "";

    if (!state.isAuthenticated && !authState) {
        return <Navigate to={RouterPaths.login} replace />;
    }

    const notAllowed = !allowedRoles.some(r => r.id == user!.role!);

    if (notAllowed) {
        return <Navigate to={RouterPaths.unAuthorized} replace />;
    }
    return <Layout>{children}</Layout>;

};