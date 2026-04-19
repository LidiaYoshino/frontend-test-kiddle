import type { ReactNode } from "react";
import { Card } from "./Card";

interface ScreenTitleCardProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ScreenTitleCard({ title, description, icon, actions, className = "" }: ScreenTitleCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-3">
        {icon ? <div className="shrink-0">{icon}</div> : null}
        <div className="min-w-0 flex-1">
          <h1 className="mb-1 text-xl font-semibold text-brand-orange-500 sm:text-2xl">{title}</h1>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </Card>
  );
}
