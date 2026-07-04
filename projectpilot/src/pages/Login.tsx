import { LoginLayout } from "../Layout/login_layout/LoginLayout";
import logo from '../asset/logowhite.png';
import { KeyIcon } from 'lucide-react';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../BussinessLogic/Routes/RouterPaths";
import { useAuth } from "../BussinessLogic/Security/Auth.Context";

import { GoogleLogin } from "@react-oauth/google";
import { AddMissingUserDetails } from "./Users/AddMissingUserDetails";
import { useEffect, useState } from "react";

// Define schema with Zod
const loginSchema = z.object({
    username: z.string().nonempty("Invalid username"),
    password: z.string().min(5, "Password must be at least 5 characters"),
});

// Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {

    const navigate = useNavigate();
    const { state, login, clearError, loginWithGoogle } = useAuth();
    const [showMissingDetails, setShowMissingDetails] = useState<boolean>(false);
    const [isGoogleLogin, setIsGoogleLogin] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (state.isAuthenticated && state != undefined && state.user != undefined) {
            if (isGoogleLogin && !state.user?.hasMissingDetails) {
                setShowMissingDetails(true);
            }
            else {
                navigate(RouterPaths.dashboard);
            }
        }
    }, [state])

    const onSubmit = async (data: LoginFormData) => {
        clearError();
        setIsGoogleLogin(false);
        await login(data.username, data.password);

    };

    return (
        <>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[500px] rounded-lg backdrop-blur-xl text-gray-800 
                dark:text-gray-100 shadow-xl/20 shadow-white flex flex-col">
                    {/* Header */}
                    <div className="align-top w-full">
                        <img src={logo} alt="FMDC" className="w-50 h-50 ml-auto mr-auto" />
                        <h1 className="w-full text-black bg-white text-center font-bold p-2 text-2xl border-t-2 border-black">
                            Login
                        </h1>
                    </div>

                    {/* Form */}
                    <div className="flex items-center justify-center grow">
                        <form onSubmit={handleSubmit(onSubmit)} className="items-center">
                            <div className="w-full flex m-1">
                                <label className="w-25 flex-auto p-1.5 m-1 text-white" htmlFor="username">Username:</label>
                                <input
                                    className="w-65 border rounded-sm flex-auto p-1.5 m-1"
                                    type="text"
                                    {...register("username")}
                                />
                            </div>

                            <div className="w-full flex m-1">
                                <label className="w-25 flex-auto p-1.5 m-1 text-white" htmlFor="password">Password:</label>
                                <input
                                    className="w-65 border rounded-sm flex-auto p-1.5 m-1"
                                    type="password"
                                    {...register("password")}
                                />
                            </div>

                            {(errors.username || errors.password || state.error) && (
                                <p className="bg-yellow-50 rounded-sm m-2 p-2 text-red-600 text-center">
                                    Invalid Username/Password
                                </p>
                            )}

                            <div className="flex justify-center mt-4 ml-auto mr-auto gap-1">
                                <button
                                    type="submit"
                                    className="btn btn-info btn-rounded btn-padding-md">
                                    <KeyIcon className="w-[15%] flex-auto" />
                                    <span className="w-[85%] flex-auto">Sign In</span>
                                </button>
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        loginWithGoogle(credentialResponse.credential!);
                                        setIsGoogleLogin(true);
                                    }}
                                    useOneTap={true}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Footer pinned to bottom */}
                    <div className="bg-black text-white text-center p-2 rounded-bl-lg rounded-br-lg">
                        <p>In case of Registration contact Administrator</p>
                    </div>
                </div>
            </div>
            {showMissingDetails && <AddMissingUserDetails
                visible={showMissingDetails}
                hide={() => {
                    setShowMissingDetails(false);
                    navigate(RouterPaths.dashboard);
                }} fromLogin={true} />}
        </>
    )
}

// Login.getLayout = (page: any) => {
//     return (
//         <LoginLayout>{page}</LoginLayout>
//     )
// }
const Login = () => {
    return (
        <LoginLayout>{LoginPage()}</LoginLayout>
    )
}

export default Login;