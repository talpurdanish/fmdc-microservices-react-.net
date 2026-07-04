
import { useEffect, useState, type ReactNode } from "react";
import Nav from "./Nav";
import Header from "./Header";
import Footer from "./Footer";
import { useStorage } from "../../BussinessLogic/Storage/Storage.Provider";
import { Constants } from "../../Helpers/Constants";

interface LayoutProps {
    children: ReactNode;
    sidebar?: { show: boolean };
    header?: { show: boolean };
    footer?: { show: boolean };
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    sidebar = { show: true },
    header = { show: true },
    footer = { show: true },
}) => {

    const storage = useStorage();

    const barIconClick = () => {
        var c = !collapsed;
        setCollapsed(c)
        storage.set(Constants.MENU_COLLAPSE_SETTINGS_KEY, c);
    };

    useEffect(() => {
        var c = storage.get<boolean>(Constants.MENU_COLLAPSE_SETTINGS_KEY);
        setCollapsed(c!)
    }, [storage]);


    const [collapsed, setCollapsed] = useState<boolean>(false);
    return (
        <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            {
                sidebar.show && (
                    <aside className={`transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"
                        } bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
                    >
                        <Nav collapsed={collapsed} />
                    </aside>
                )
            }

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                {header.show && (
                    <header className="h-16 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700  flex items-center px-4">
                        <Header barIconCallBack={() => barIconClick()} />
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>

                {/* Footer */}
                {footer.show && (
                    <footer className="h-12 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm">
                        <Footer />
                    </footer>
                )}
            </div>
        </div >
    );
};