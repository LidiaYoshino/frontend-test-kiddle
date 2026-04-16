import { CalendarDays, Home, type LucideIcon } from "lucide-react";

export type AppNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Pass through to NavLink `end` for index routes */
  end?: boolean;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/appointments", label: "Appointments", icon: CalendarDays }
];
