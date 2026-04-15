import { Rocket } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "../components/common/layout/Container";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-brand-600" />
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-800">Kiddle Challenge Base</p>
          </div>
          <p className="text-xs text-slate-500">React + TypeScript + Tailwind</p>
        </Container>
      </header>
      <main>
        <Container>{children}</Container>
      </main>
    </div>
  );
}
