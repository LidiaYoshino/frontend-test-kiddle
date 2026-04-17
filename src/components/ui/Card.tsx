import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <section className={`rounded-xl bg-white p-5 shadow-card sm:p-6 ${className}`}>{children}</section>;
}
