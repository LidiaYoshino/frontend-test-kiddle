import { useEffect, useState, type ReactNode } from "react";
import { Container } from "../components/layout/Container";
import { AppDesktopSidebar } from "../components/menu/AppDesktopSidebar";
import { AppMobileHeader } from "../components/menu/AppMobileHeader";
import { AppMobileNavSheet } from "../components/menu/AppMobileNavSheet";
import { useBreakpointUp } from "../hooks/useMediaQuery";
import { APP_NAV_ITEMS } from "./navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMd = useBreakpointUp("md");

  useEffect(() => {
    // Close the mobile menu if the screen becames larger than the medium breakpoint (Portal ignores md:hidden)
    if (isMd) {
      setIsMobileMenuOpen(false);
    }
  }, [isMd]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppMobileHeader
        isMenuOpen={isMobileMenuOpen}
        onMenuToggle={() => setIsMobileMenuOpen((previous) => !previous)}
      />
      <AppMobileNavSheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} items={APP_NAV_ITEMS} />
      <Container className="pb-4 pt-16 sm:pb-6 md:py-6">
        <div className="grid gap-4 md:grid-cols-[220px_1fr] md:gap-6">
          <AppDesktopSidebar items={APP_NAV_ITEMS} />
          <main>{children}</main>
        </div>
      </Container>
    </div>
  );
}
