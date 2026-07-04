import { MenuIcon } from "lucide-react";
import NotificationMenu from "./NotificationMenu";
import TodoMenu from "../../pages/Todo/Todo.Button";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
    barIconCallBack: () => void;
}


export default function Header({ barIconCallBack }: HeaderProps) {

    return (
        <>
            <header className="w-full">
                <div className="w-full flex justify-between items-center gap-4 py-3">

                    {/* Left: menu icon */}
                    <a onClick={() => { barIconCallBack() }}
                        className="text-gray-700 dark:text-gray-200 hover:text-primary cursor-pointer">
                        <MenuIcon className="w-5" />
                    </a>
                    {/* Right: notifications + user info */}
                    <div className="flex items-center gap-x-6">
                        <TodoMenu />
                        <NotificationMenu />
                        <ProfileMenu />
                    </div>
                </div>
            </header>

        </>
    );
}