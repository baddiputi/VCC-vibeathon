import { LucideIcon, LayoutDashboard, CalendarDays, MapPin, Box, FileText } from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
}

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        variant: "default",
    },
    {
        title: "Event Requests",
        href: "/events",
        icon: CalendarDays,
        variant: "ghost",
    },
    {
        title: "Venue Master",
        href: "/venues",
        icon: MapPin,
        variant: "ghost",
    },
    {
        title: "Resource Inventory",
        href: "/resources",
        icon: Box,
        variant: "ghost",
    },
    {
        title: "Audit Logs",
        href: "/audit",
        icon: FileText,
        variant: "ghost",
    },
];
