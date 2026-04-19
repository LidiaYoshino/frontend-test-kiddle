import { Menu, X } from "lucide-react";
import { Container } from "../layout/Container";
import { AppBrand } from "./AppBrand";

interface AppMobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function AppMobileHeader({ isMenuOpen, onMenuToggle }: AppMobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-brand-yellow-200 bg-brand-yellow-200 md:hidden">
      <Container className="flex items-center justify-between py-4">
        <AppBrand />
        <button
          type="button"
          onClick={onMenuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-orange-500 p-2 text-sm font-medium text-slate-700"
        >
          <Menu className="h-4 w-4 text-brand-orange-500" aria-hidden />
        </button>
      </Container>
    </header>
  );
}
