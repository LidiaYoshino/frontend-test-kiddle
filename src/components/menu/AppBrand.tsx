import { Rocket } from "lucide-react";

interface AppBrandProps {
  className?: string;
}

export function AppBrand({ className = "" }: AppBrandProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Rocket className="h-5 w-5 shrink-0 text-brand1-600" aria-hidden />
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-800">Kiddle Pass</p>
    </div>
  );
}
