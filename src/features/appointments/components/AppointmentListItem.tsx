import { Accessibility, Cake, Languages } from "lucide-react";
import type { ReactNode } from "react";
import type { DayAppointment } from "../../../types/api";
import { getSpotsLeft } from "../lib/appointments";
import { isBirthdayOn } from "../lib/children";

interface AppointmentListItemProps {
  appointment: DayAppointment;
  onSelect: (appointment: DayAppointment) => void;
}

export function AppointmentListItem({ appointment, onSelect }: AppointmentListItemProps) {
  const spotsLeft = getSpotsLeft(appointment);
  const spotsLeftLabel = spotsLeft === null ? "Vagas restantes: --" : `Vagas restantes: ${spotsLeft}`;

  const hasBirthday = appointment.criancas.some((child) => isBirthdayOn(child.nascimento, appointment.data));
  const hasDeficiency = appointment.criancas.some((child) => child.hasDeficiency);
  const hasInterpreter = appointment.criancas.some((child) => child.needsInterpreter);

  return (
    <button
      type="button"
      onClick={() => onSelect(appointment)}
      className="w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">{appointment.atividade}</p>
        <div className="flex items-center gap-1.5">
          {hasBirthday ? (
            <WarningDot tone="amber" label="Há aniversariante(s)">
              <Cake className="h-3 w-3" aria-hidden="true" />
            </WarningDot>
          ) : null}
          {hasDeficiency ? (
            <WarningDot tone="violet" label="Há criança(s) com deficiência">
              <Accessibility className="h-3 w-3" aria-hidden="true" />
            </WarningDot>
          ) : null}
          {hasInterpreter ? (
            <WarningDot tone="sky" label="Precisa(m) de intérprete">
              <Languages className="h-3 w-3" aria-hidden="true" />
            </WarningDot>
          ) : null}
          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{appointment.horario}</span>
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">Parceiro: {appointment.parceiro}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-700">
          {appointment.criancas.length} agendamento(s)
        </span>
        <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">{spotsLeftLabel}</span>
      </div>
    </button>
  );
}

const WARNING_DOT_CLASSES = {
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  sky: "bg-sky-50 text-sky-700"
} as const;

function WarningDot({
  tone,
  label,
  children
}: {
  tone: keyof typeof WARNING_DOT_CLASSES;
  label: string;
  children: ReactNode;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${WARNING_DOT_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
