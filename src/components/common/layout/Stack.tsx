import type { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  className?: string;
}

export function Stack({ children, className = "" }: StackProps) {
  return <div className={`flex flex-col gap-4 sm:gap-5 ${className}`}>{children}</div>;
}
