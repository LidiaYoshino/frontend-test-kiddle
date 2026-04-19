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
      className="w-full flex flex-row justify-between rounded-lg border border-slate-200 p-4 pt-3 text-left transition hover:border-brand-yellow-500 hover:bg-brand-yellow-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-500"
    >
      <div className="flex flex-col justify-between gap-2">
        <p className="text-md font-semibold text-slate-800">{appointment.atividade}</p>
        <p className="mt-1 text-xs text-slate-500">Parceiro: {appointment.parceiro}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded bg-brand-orange-100/80 px-2 py-1 font-medium text-brand-orange-500">
            {appointment.criancas.length} agendamento(s)
          </span>
          <span className="rounded bg-brand-teal-100/80 px-2 py-1 font-medium text-brand-teal-500">{spotsLeftLabel}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-1.5">
        <span className="text-sm font-semibold text-slate-800">{appointment.horario}</span>
        <div className="flex flex-row gap-1.5 justify-end">
          {hasBirthday ? (
            <WarningDot tone="amber" label="Há aniversariante(s)">
              <Cake className="h-4 w-4" aria-hidden="true" />
            </WarningDot>
          ) : null}
          {hasDeficiency ? (
            <WarningDot tone="violet" label="Há criança(s) com deficiência">
              <Accessibility className="h-4 w-4" aria-hidden="true" />
            </WarningDot>
          ) : null}
          {hasInterpreter ? (
            <WarningDot tone="sky" label="Precisa(m) de intérprete">
              <Languages className="h-4 w-4" aria-hidden="true" />
            </WarningDot>
          ) : null}
        </div>
      </div>
    </button>
  );
}

const WARNING_DOT_CLASSES = {
  amber: "bg-amber-50 text-amber-700 border-amber-500",
  violet: "bg-violet-50 text-violet-700 border-violet-500",
  sky: "bg-sky-50 text-sky-700 border-sky-500"
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
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 ${WARNING_DOT_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
