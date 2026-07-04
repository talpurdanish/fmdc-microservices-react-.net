import { useLocation, useNavigate } from "react-router-dom";
import Logo from '../../asset/fmdclogo.png'
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";
import {
    HomeIcon, UsersIcon, PlusIcon, Building2Icon, EarthIcon, ZoomInIcon,
    ShieldUserIcon, ChevronRight, PillIcon, MicroscopeIcon, HospitalIcon, Globe2Icon, TestTubesIcon, TestTubeDiagonalIcon,
    PipetteIcon,
    BandageIcon,
    AmbulanceIcon,
    PillBottleIcon,
    CalendarHeartIcon,
    CalendarClockIcon,
    FlaskConicalIcon,
    HandCoinsIcon,
    BanknoteIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Tooltip } from 'primereact/tooltip';
import { Roles, type Role } from "../../Helpers/Constants";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import type { MenuItem } from "./MenuItem";


export default function Nav({ collapsed }: { collapsed?: boolean }) {
    const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
    const [activeItem, setActiveItem] = useState<string>(RouterPaths.dashboard);
    const [iconSize, setIconSize] = useState<number>(24);
    const { state, getUser } = useAuth();

    const toggleAccordion = (index: number) => {
        setOpenIndices((prev) => {
            const newSet = new Set(prev);
            newSet.has(index) ? newSet.delete(index) : newSet.add(index);
            return newSet;
        });
    };

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems: MenuItem[] = [
        {
            icon: <HomeIcon size={iconSize} />,
            title: "Dashboard",
            link: RouterPaths.dashboard,
            tooltip: 'Dashboard',
            roles: [Roles.admin, Roles.doctor, Roles.staff]
        },
        {
            icon: <UsersIcon size={iconSize} />,
            title: "Users",
            roles: [Roles.admin, Roles.doctor],
            items: [
                {
                    icon: <ZoomInIcon size={iconSize} />,
                    title: "View",
                    link: RouterPaths.viewUsers,
                    tooltip: 'View Users',
                    roles: [Roles.admin, Roles.doctor]
                },
                {
                    icon: <PlusIcon size={iconSize} />,
                    title: "Create",
                    link: RouterPaths.createUsers,
                    tooltip: 'Create Users',
                    roles: [Roles.admin]
                }

            ]
        },
        {
            icon: <ShieldUserIcon size={iconSize} />,
            title: "Patients",
            roles: [Roles.admin, Roles.doctor],
            items: [
                {
                    icon: <ZoomInIcon size={iconSize} />,
                    title: "View",
                    link: RouterPaths.viewPatients,
                    tooltip: 'View Patients',
                    roles: [Roles.admin, Roles.doctor]
                },
                {
                    icon: <PlusIcon size={iconSize} />,
                    title: "Create",
                    link: RouterPaths.createPatients,
                    tooltip: 'Create Patients',
                    roles: [Roles.admin]
                }

            ]
        },
        {
            icon: <CalendarHeartIcon size={iconSize} />,
            title: "Appointments",
            roles: [Roles.admin, Roles.doctor, Roles.staff],
            items: [
                {
                    icon: <CalendarClockIcon size={iconSize} />,
                    title: "View",
                    link: RouterPaths.viewAppointments,
                    tooltip: 'View Appointments',
                    roles: [Roles.admin, Roles.doctor, Roles.staff]
                },
            ]
        },
        {
            icon: <Globe2Icon size={iconSize} />,
            title: "Regions",
            roles: [Roles.admin, Roles.staff],
            items: [
                {
                    icon: <Building2Icon size={iconSize} />,
                    title: "Cities",
                    link: RouterPaths.manageCities,
                    tooltip: 'Manage Cities',
                    roles: [Roles.admin, Roles.staff]
                },
                {
                    icon: <EarthIcon size={iconSize} />,
                    title: "Provinces",
                    link: RouterPaths.manageProvinces,
                    tooltip: 'Manage Provinces',
                    roles: [Roles.admin, Roles.staff]
                }
            ]
        },
        {
            icon: <HospitalIcon size={iconSize} />,
            title: "Medications",
            roles: [Roles.admin, Roles.staff],
            items: [
                {
                    icon: <PillIcon size={iconSize} />,
                    title: "Medications",
                    link: RouterPaths.manageMedications,
                    tooltip: 'Manage Medications',
                    roles: [Roles.admin, Roles.staff]
                },
                {
                    icon: <MicroscopeIcon size={iconSize} />,
                    title: "Medication Types",
                    link: RouterPaths.manageMedicationTypes,
                    tooltip: 'Manage Medication Types',
                    roles: [Roles.admin, Roles.staff]
                },
            ]
        },
        {
            icon: <TestTubesIcon size={iconSize} />,
            title: "Lab Reports",
            roles: [Roles.admin, Roles.staff],
            items: [
                {
                    icon: <TestTubeDiagonalIcon size={iconSize} />,
                    title: "Tests",
                    link: RouterPaths.manageTests,
                    tooltip: 'Manage Tests',
                    roles: [Roles.admin, Roles.staff]
                },
                {
                    icon: <PipetteIcon size={iconSize} />,
                    title: "Tests Params",
                    link: RouterPaths.manageTestParameters,
                    tooltip: 'Manage Tests Parameters',
                    roles: [Roles.admin, Roles.staff]
                },
                {
                    icon: <FlaskConicalIcon size={iconSize} />,
                    title: "Lab Reports",
                    link: RouterPaths.manageLabReports,
                    tooltip: 'Manage Lab Reports',
                    roles: [Roles.admin, Roles.staff, Roles.doctor]
                },
            ]
        },
        {
            icon: <AmbulanceIcon size={iconSize} />,
            title: "Clinical Procedure",
            roles: [Roles.admin, Roles.staff, Roles.doctor],
            items: [

                {
                    icon: <PillBottleIcon size={iconSize} />,
                    title: "Procedure Types",
                    link: RouterPaths.manageProcedureTypes,
                    tooltip: 'Manage Procedure Types',
                    roles: [Roles.admin, Roles.staff, Roles.doctor]
                },
                {
                    icon: <BandageIcon size={iconSize} />,
                    title: "Procedures",
                    link: RouterPaths.manageProcedures,
                    tooltip: 'Manage Procedures',
                    roles: [Roles.admin, Roles.staff, Roles.doctor]
                },

            ]
        },
        {
            icon: <HandCoinsIcon size={iconSize} />,
            title: "Receipts",
            roles: [Roles.admin, Roles.staff, Roles.doctor],
            items: [
                {
                    icon: <BanknoteIcon size={iconSize} />,
                    title: "View Receipts",
                    link: RouterPaths.viewReceipts,
                    tooltip: 'View Receipts',
                    roles: [Roles.admin, Roles.staff, Roles.doctor]
                }
            ]
        },


    ];

    useEffect(() => {

        const size = collapsed ? 24 : 16;
        setIconSize(size);

    }, [collapsed]);

    function findActiveSubmenuIndex(activeLink: string) {
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            if (item.items && Array.isArray(item.items)) {
                const found = item.items.some(subItem => subItem.link == activeLink);
                if (found) {
                    return i;
                }
            }
        }
        return -1;
    }

    const updateActiveItem = (pathname: string) => {
        let path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

        const segments = path.split("/");
        const lastSegment = segments[segments.length - 1];
        if (/^\d+$/.test(lastSegment)) {
            segments.pop();
        }

        const basePath = segments.join("/");
        const inSubMenuIndex = findActiveSubmenuIndex(basePath);
        if (inSubMenuIndex > -1 && !openIndices.has(inSubMenuIndex)) {
            toggleAccordion(inSubMenuIndex);
        }
        setActiveItem(basePath);
    }

    useEffect(() => {
        let path = location.pathname;
        updateActiveItem(path);
    }, [location])

    const navigateToHref = (link: any) => {
        setActiveItem(link);
        navigate(link);
    };

    const isAllowed = (roles?: Role[]): boolean => {
        if (roles && roles.length === 0) return true;
        const user = state?.user ?? getUser();
        if (!user) return false;
        return (roles != null && roles.some(r => r.id == user.role));
    };

    function findParentIndex(activeLink: string) {
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            if (item.items && item.items.some(subItem => subItem.link === activeLink)) {
                return i;
            }
        }
        return -1;
    }

    return (
        <>
            {collapsed && <Tooltip target=".tooltip-icon" />}

            <div className="menu-container">
                <div className={`w-full text-center align-middle ${collapsed ? "h-[80PX]" : "h-[200px]"}`}>
                    <img
                        src={Logo}
                        alt="Federal Medical and Dental Clinic"
                        className=" ml-auto mr-auto mt-2 object-fit h-full"
                    />
                </div>
                <div className={`${collapsed ? "" : "max-h-130 overflow-y-auto  scrollbar-hide"}`}>
                    <ul className="menu">
                        {!collapsed && menuItems.map((item, i) => (
                            isAllowed(item.roles) &&
                            <li key={i} className={openIndices.has(i) ? "toggle" : ""}>
                                {item.items ? (
                                    <>
                                        <a
                                            onClick={() => toggleAccordion(i)}
                                            className={`flex items-center justify-between ${activeItem === item.link ? "active" : ""}`}
                                        >
                                            <span className="flex items-center gap-1">
                                                {item.icon}
                                                {item.title}
                                            </span>
                                            <span
                                                className={`transition-transform duration-300 ease-in-out ${openIndices.has(i) ? "rotate-90" : "rotate-0"}`}
                                            >
                                                <ChevronRight className="w-[15px]" />
                                            </span>
                                        </a>
                                        <ul
                                            className={`submenu transition-all duration-300 ease-in-out overflow-hidden ${openIndices.has(i) ? "max-h-full" : "max-h-0"}`}
                                        >
                                            {item.items.map((subItem, j) => (
                                                isAllowed(subItem.roles) && (
                                                    <li key={j}>
                                                        <a
                                                            onClick={() => navigateToHref(subItem.link)}
                                                            className={activeItem === subItem.link ? "active" : ""}
                                                        >
                                                            {subItem.icon}
                                                            {subItem.title}
                                                        </a>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <a
                                        onClick={() => navigateToHref(item.link!)}
                                        className={`${activeItem === item.link ? "active " : ""} tooltip-icon`}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </a>
                                )}
                            </li>
                        ))}
                        {collapsed && menuItems.map((item, i) => {
                            const parentIndex = findParentIndex(activeItem);
                            const isParentActive = parentIndex === i;

                            return (
                                isAllowed(item.roles) &&
                                <li key={i} className="relative group"


                                >
                                    <a
                                        onClick={() => !item.items && navigateToHref(item.link!)}
                                        className={`flex items-center justify-center p-3  tooltip-icon 
                                                transition-colors duration-200 
                                                ${(activeItem === item.link || isParentActive) ? "active"
                                                : ""}`}
                                        data-pr-tooltip={item.title}
                                        data-pr-autohide={true}
                                        data-pr-position="top"
                                        data-pr-hidedelay={0}
                                    >
                                        {item.icon}
                                        {item.items && <ChevronRight className="w-3 h-3 ml-1 absolute right-0" />}
                                    </a>

                                    {item.items && (
                                        <ul className="submenu-collapsed absolute left-full top-0 ml-2 w-56 z-50 shadow-lg rounded-tr rounded-br
                                                    opacity-0 translate-y-2 pointer-events-none 
                                                    transition-all duration-300 ease-in-out 
                                                    group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                                        >
                                            {item.items.map((subItem, j) => (
                                                isAllowed(subItem.roles) && (
                                                    <li key={j}>
                                                        <a
                                                            onClick={() => navigateToHref(subItem.link)}
                                                            className={`flex items-center gap-2 px-4 py-2 
                                                                    transition-colors duration-200 
                                                                    ${activeItem === subItem.link ? "active" : ""}`}
                                                        >
                                                            {subItem.icon}
                                                            {subItem.title}
                                                        </a>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div >
        </>
    )
}