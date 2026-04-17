import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { getErrorMessage } from "../../../lib/api/client";
import type { DayAppointment } from "../../../types/api";
import { getAppointmentsByDate } from "../api/getAppointmentsByDate";

const FIXED_APPOINTMENTS_DATE = "9/3/2026";

function normalizeAppointments(appointments: DayAppointment[]): DayAppointment[] {
  return appointments
    .filter((appointment) => appointment.atividade && appointment.horario)
    .sort((left, right) => {
      const byHour = left.horario.localeCompare(right.horario, "pt-BR");
      if (byHour !== 0) {
        return byHour;
      }

      return left.atividade.localeCompare(right.atividade, "pt-BR");
    });
}

function getTotalSpots(appointment: DayAppointment): number | null {
  const [start, end] = appointment.horario.split("-");
  if (!start || !end) {
    return null;
  }

  for (const daySchedule of appointment.grade) {
    const timeSlot = daySchedule.horarios.find(
      (slot) => slot.horarioInicio === start.trim() && slot.horarioTermino === end.trim()
    );
    if (timeSlot) {
      return timeSlot.vagas;
    }
  }

  return null;
}

function getSpotsLeftLabel(appointment: DayAppointment): string {
  const totalSpots = getTotalSpots(appointment);
  if (totalSpots === null) {
    return "Vagas restantes: --";
  }

  const spotsLeft = Math.max(totalSpots - appointment.criancas.length, 0);
  return `Vagas restantes: ${spotsLeft}`;
}

export function AppointmentsByDateCard() {
  const [payload, setPayload] = useState<DayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedOnMount = useRef(false);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAppointmentsByDate(FIXED_APPOINTMENTS_DATE);
      setPayload(data.appointments ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedOnMount.current) {
      return;
    }

    hasFetchedOnMount.current = true;
    void fetchAppointments();
  }, [fetchAppointments]);

  const normalizedAppointments = useMemo(() => normalizeAppointments(payload), [payload]);

  return (
    <Card>
      <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">Agendamentos do dia</h2>
      <p className="mb-6 text-sm text-slate-600">
        Lista de atividades e horarios para {FIXED_APPOINTMENTS_DATE}, incluindo turmas sem agendamento.
      </p>
      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loading message="Loading initial response..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Erro ao buscar agendamentos da data" />
      ) : normalizedAppointments.length === 0 ? (
        <ErrorMessage message="Nenhum agendamento encontrado para a data selecionada" />
      ) : (
        <div className="space-y-3">
          {normalizedAppointments.map((appointment) => (
            <div key={appointment.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">{appointment.atividade}</p>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{appointment.horario}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-700">
                  {appointment.criancas.length} agendamento(s)
                </span>
                <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                  {getSpotsLeftLabel(appointment)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
