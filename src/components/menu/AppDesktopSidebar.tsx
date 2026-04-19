import type { AppNavItem } from "../../app/navigation";
import { AppBrand } from "./AppBrand";
import { AppNavLinks } from "./AppNavLinks";

interface AppDesktopSidebarProps {
  items: AppNavItem[];
}

export function AppDesktopSidebar({ items }: AppDesktopSidebarProps) {
  return (
    <aside className="hidden md:block">
      <nav aria-label="Sidebar navigation" className="rounded-xl border border-brand-yellow-200 bg-brand-yellow-200 p-2">
        <AppBrand className="px-3 py-4"/>
        <AppNavLinks items={items} variant="sidebar" listClassName="space-y-1" />
      </nav>
    </aside>
  );
}
