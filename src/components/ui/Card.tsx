import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <section className={`rounded-xl bg-brand-yellow-50 p-5 shadow-card sm:p-6 ${className}`}>{children}</section>;
}
