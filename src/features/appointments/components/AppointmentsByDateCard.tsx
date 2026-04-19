import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import type { DayAppointment } from "../../../types/api";
import { useAppointmentsByDate } from "../hooks/useAppointmentsByDate";
import { sortAppointmentsByTime, sortedUnique } from "../lib/appointments";
import { collectDayWarnings } from "../lib/dayWarnings";
import { REFERENCE_TODAY, formatDateForApi, getDateByPreset, type DateMode, type DatePreset } from "../lib/dates";
import { AppointmentDetailsModal } from "./AppointmentDetailsModal";
import { AppointmentListItem } from "./AppointmentListItem";
import { AppointmentsFilters } from "./AppointmentsFilters";
import { CreateAppointmentModal } from "./CreateAppointmentModal";
import { DayWarningsModal } from "./DayWarningsModal";

export function AppointmentsByDateCard() {
  const [dateMode, setDateMode] = useState<DateMode>("today");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [activityFilter, setActivityFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<DayAppointment | null>(null);
  const [dayWarningsOpen, setDayWarningsOpen] = useState(false);
  const [createAppointmentOpen, setCreateAppointmentOpen] = useState(false);

  const requestedDate = useMemo(() => {
    if (dateMode === "custom") {
      return customDate ?? REFERENCE_TODAY;
    }

    return getDateByPreset(dateMode);
  }, [customDate, dateMode]);

  const requestedDateLabel = useMemo(() => formatDateForApi(requestedDate), [requestedDate]);

  const { data, isLoading, error, refetch } = useAppointmentsByDate(requestedDateLabel);
  const appointments = useMemo(() => sortAppointmentsByTime(data), [data]);
  const dayWarningCount = useMemo(() => collectDayWarnings(appointments).length, [appointments]);

  const activityOptions = useMemo(
    () => sortedUnique(appointments.map((appointment) => appointment.atividade)),
    [appointments]
  );
  const partnerOptions = useMemo(
    () => sortedUnique(appointments.map((appointment) => appointment.parceiro)),
    [appointments]
  );
  const userOptions = useMemo(
    () => sortedUnique(appointments.flatMap((appointment) => appointment.criancas.map((child) => child.responsavel))),
    [appointments]
  );

  useEffect(() => {
    if (activityFilter && !activityOptions.includes(activityFilter)) {
      setActivityFilter("");
    }
    if (partnerFilter && !partnerOptions.includes(partnerFilter)) {
      setPartnerFilter("");
    }
    if (userFilter && !userOptions.includes(userFilter)) {
      setUserFilter("");
    }
  }, [activityFilter, activityOptions, partnerFilter, partnerOptions, userFilter, userOptions]);

  const deferredActivity = useDeferredValue(activityFilter);
  const deferredPartner = useDeferredValue(partnerFilter);
  const deferredUser = useDeferredValue(userFilter);
  const isFiltering =
    deferredActivity !== activityFilter || deferredPartner !== partnerFilter || deferredUser !== userFilter;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (deferredActivity && appointment.atividade !== deferredActivity) {
        return false;
      }
      if (deferredPartner && appointment.parceiro !== deferredPartner) {
        return false;
      }
      if (deferredUser && !appointment.criancas.some((child) => child.responsavel === deferredUser)) {
        return false;
      }
      return true;
    });
  }, [appointments, deferredActivity, deferredPartner, deferredUser]);

  const handleCustomDateChange = (date: Date) => {
    setCustomDate(date);
    setDateMode("custom");
  };

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">Agendamentos do dia</h2>
          <p className="text-sm text-slate-600">Lista de atividades e horarios para {requestedDateLabel}, com filtros.</p>
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:ml-auto sm:w-auto sm:items-end">
          <button
            type="button"
            onClick={() => setDayWarningsOpen(true)}
            aria-expanded={dayWarningsOpen}
            aria-haspopup="dialog"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-brand-yellow-50 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-brand-yellow-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-500 focus-visible:ring-offset-2"
          >
            Avisos do dia
            <span className="inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-amber-100 px-2 py-0.5">
              {isLoading ? (
                <span
                  className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-amber-300 border-t-amber-800"
                  aria-label="Carregando contagem de avisos"
                />
              ) : (
                <span className="text-xs font-semibold tabular-nums text-amber-800">{dayWarningCount}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCreateAppointmentOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-600 focus-visible:ring-offset-2"
          >
            Novo agendamento
          </button>
        </div>
      </div>

      <AppointmentsFilters
        dateMode={dateMode}
        onPresetSelect={(preset: DatePreset) => setDateMode(preset)}
        customDate={customDate}
        onCustomDateChange={handleCustomDateChange}
        isFiltering={isFiltering}
        activity={{
          value: activityFilter,
          onChange: setActivityFilter,
          options: activityOptions,
          allLabel: "Todas as atividades"
        }}
        partner={{
          value: partnerFilter,
          onChange: setPartnerFilter,
          options: partnerOptions,
          allLabel: "Todos os parceiros"
        }}
        user={{
          value: userFilter,
          onChange: setUserFilter,
          options: userOptions,
          allLabel: "Todos os usuários"
        }}
      />

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loading message="Carregando agendamentos..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Erro ao buscar agendamentos da data" />
      ) : appointments.length === 0 ? (
        <ErrorMessage message="Nenhum agendamento encontrado para a data selecionada" />
      ) : filteredAppointments.length === 0 ? (
        <ErrorMessage message="Nenhum agendamento encontrado para os filtros aplicados" />
      ) : (
        <div className={`space-y-3 transition-opacity ${isFiltering ? "opacity-60" : "opacity-100"}`}>
          {filteredAppointments.map((appointment) => (
            <AppointmentListItem key={appointment.id} appointment={appointment} onSelect={setSelectedAppointment} />
          ))}
        </div>
      )}

      <AppointmentDetailsModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      <DayWarningsModal
        open={dayWarningsOpen}
        onClose={() => setDayWarningsOpen(false)}
        appointments={appointments}
        dateLabel={requestedDateLabel}
      />
      <CreateAppointmentModal
        open={createAppointmentOpen}
        onClose={() => setCreateAppointmentOpen(false)}
        dateLabel={requestedDateLabel}
        onCreated={() => void refetch()}
      />
    </Card>
  );
}
