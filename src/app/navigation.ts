import { CalendarDays, Home, type LucideIcon } from "lucide-react";

export type AppNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
  { to: "/appointments", label: "Agendamentos", icon: CalendarDays }
];
