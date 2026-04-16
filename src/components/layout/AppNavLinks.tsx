import { NavLink } from "react-router-dom";
import type { AppNavItem } from "../../app/navigation";
import { navLinkClassName } from "./navClasses";

interface AppNavLinksProps {
  items: AppNavItem[];
  variant: "drawer" | "sidebar";
  listClassName?: string;
  listId?: string;
  onItemSelect?: () => void;
}

export function AppNavLinks({ items, variant, listClassName = "", listId, onItemSelect }: AppNavLinksProps) {
  return (
    <ul id={listId} className={listClassName}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.to} onClick={onItemSelect}>
            <NavLink to={item.to} end={item.end} className={({ isActive }) => navLinkClassName({ variant, active: isActive })}>
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
