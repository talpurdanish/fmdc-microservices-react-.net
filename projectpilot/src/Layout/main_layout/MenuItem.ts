import type { Role } from "../../Helpers/Constants";

// Menu item interface
export interface MenuItem {
    icon: React.ReactNode;
    title: string;
    link?: string; // optional because parent items may not have direct links
    tooltip?: string;
    roles: Role[];
    items?: MenuItem[]; // nested submenu items
}