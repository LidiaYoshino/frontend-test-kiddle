import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Button({ asChild = false, className = "", ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand1-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand1-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand1-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}
