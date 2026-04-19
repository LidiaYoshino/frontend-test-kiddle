import type { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className = "" }: ResponsiveGridProps) {
  return <div className={`grid gap-4 sm:grid-cols-1 lg:grid-cols-2 ${className}`}>{children}</div>;
}
