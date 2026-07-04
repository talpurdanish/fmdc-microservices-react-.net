import { ChevronRightIcon, HomeIcon } from "lucide-react";

interface NavItem {
    name: string;
    link?: string;
}

export default function Breadcrumbs({ nav, title }: { nav: NavItem[], title: string }) {
    return (
        <div className="bg-gray-200 dark:bg-[#2a323d] w-full p-2 mb-3">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="w-[80%] flex-auto items-center space-x md:space-x-[3px] ">
                    {nav.map((item, index) => (
                        <li key={index} className="inline-flex items-center
                        p-1 cursor-pointer text-gray-900 dark:text-gray-400 hover:text-blue-300 breadCrumb
                        ">
                            {index == 0 && (
                                <HomeIcon className="w-4 h-4  mx-1" />
                            )}
                            {index > 0 && (
                                <ChevronRightIcon className="w-4 h-4  mx-1" />
                            )}
                            {item.link ? (
                                <a
                                    href={item.link}
                                    className="inline-flex items-center text-sm font-medium  underline"
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <span
                                    className="inline-flex items-center text-sm font-medium "
                                    aria-current="page"
                                >
                                    {item.name}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
                <h1 className="w-[40%] flex-auto text-xl font-bold text-right pr-5">{title}</h1>
            </nav>
        </div>
    );
}