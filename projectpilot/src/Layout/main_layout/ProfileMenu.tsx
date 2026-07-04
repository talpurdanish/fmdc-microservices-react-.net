
import { useEffect, useState } from "react";
import FullscreenToggle from './FullscreenToggle';
import { ThemeToggle } from '../../Theme/Theme.Button';
import { PowerOffIcon, User2Icon } from "lucide-react";
import { AddMissingUserDetails } from "../../pages/Users/AddMissingUserDetails";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";

const ProfileMenu = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [hasMissingDetails, setHasMissingDetails] = useState<boolean>(false);
    const [showMissingDetails, setShowMissingDetails] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const { logout, state, getUser } = useAuth();


    const navigate = useNavigate();

    useEffect(() => {
        const authUser = state.user ?? getUser();
        setName(authUser?.firstName!);
        let imgSrc = authUser?.picture || null;
        if (imgSrc && !imgSrc.startsWith("data:image")) {
            imgSrc = "data:image/png;base64," + imgSrc;
        }
        setImage(imgSrc);

        setHasMissingDetails(authUser?.hasMissingDetails!);
    }, [state, getUser]);


    const handleLogout = async () => {
        const success = await logout();

        if (success) {
            navigate(RouterPaths.login);
        }
    }
    return (
        <>
            <div
                className="relative inline-block text-left w-fit"
                onMouseLeave={() => setOpen(false)}
                onMouseOver={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3 content-center">
                    <img
                        src={image!}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border dark:border-gray-400 dark:bg-white border-gray-900 bg-black p-0" />
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {name}
                        </span>
                    </div>
                </div>
                <div
                    className={`absolute right-0 mt-2 w-fit min-w-40 bg-white dark:bg-gray-800 border border-gray-700 
                            rounded-md shadow-lg transform transition-all duration-300 origin-top z-50
                            ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}>
                    <ul className="max-h-[70vh] overflow-y-auto w-full">
                        {hasMissingDetails && <li className="p-2 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer 
                                border-b dark:border-gray-700 border-gray-950">
                            <a onClick={() => setShowMissingDetails(true)} className="flex gap-2 content-center align-middle">
                                <User2Icon className="w-5" /><span className="flex-1">Complete Profile</span>
                            </a>
                        </li>}
                        <li className="p-2 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer 
                                border-b dark:border-gray-700 border-gray-950">
                            <FullscreenToggle />
                        </li>
                        <li className="cursor-pointer border-b dark:border-gray-700 border-gray-950">
                            <ThemeToggle />
                        </li>
                        <li className="p-2 dark:hover:bg-gray-600 hover:bg-gray-300 cursor-pointer">
                            <a onClick={() => handleLogout()} className="flex gap-2 content-center align-middle">
                                <PowerOffIcon className="w-5" /><span className="flex-1">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {showMissingDetails && <AddMissingUserDetails
                visible={showMissingDetails}
                hide={() => setShowMissingDetails(false)}
            />}
        </>
    );
};

export default ProfileMenu;



