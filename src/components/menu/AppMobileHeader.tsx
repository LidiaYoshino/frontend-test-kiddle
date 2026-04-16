import { Menu, X } from "lucide-react";
import { Container } from "../layout/Container";
import { AppBrand } from "./AppBrand";

interface AppMobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function AppMobileHeader({ isMenuOpen, onMenuToggle }: AppMobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-slate-200 bg-white md:hidden">
      <Container className="flex items-center justify-between py-4">
        <AppBrand />
        <button
          type="button"
          onClick={onMenuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
        >
          {isMenuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
        </button>
      </Container>
    </header>
  );
}
