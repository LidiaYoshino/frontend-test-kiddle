import type { DayAppointment } from "../../../types/api";
import { getSpotsLeft } from "../lib/appointments";

interface AppointmentListItemProps {
  appointment: DayAppointment;
}

export function AppointmentListItem({ appointment }: AppointmentListItemProps) {
  const spotsLeft = getSpotsLeft(appointment);
  const spotsLeftLabel = spotsLeft === null ? "Vagas restantes: --" : `Vagas restantes: ${spotsLeft}`;

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">{appointment.atividade}</p>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{appointment.horario}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Parceiro: {appointment.parceiro}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-700">
          {appointment.criancas.length} agendamento(s)
        </span>
        <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">{spotsLeftLabel}</span>
      </div>
    </div>
  );
}
