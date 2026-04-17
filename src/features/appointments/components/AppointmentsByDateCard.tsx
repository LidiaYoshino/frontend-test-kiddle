import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { useAppointmentsByDate } from "../hooks/useAppointmentsByDate";
import { sortAppointmentsByTime, sortedUnique } from "../lib/appointments";
import { REFERENCE_TODAY, formatDateForApi, getDateByPreset, type DateMode, type DatePreset } from "../lib/dates";
import { AppointmentListItem } from "./AppointmentListItem";
import { AppointmentsFilters } from "./AppointmentsFilters";

export function AppointmentsByDateCard() {
  const [dateMode, setDateMode] = useState<DateMode>("today");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [activityFilter, setActivityFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const requestedDate = useMemo(() => {
    if (dateMode === "custom") {
      return customDate ?? REFERENCE_TODAY;
    }

    return getDateByPreset(dateMode);
  }, [customDate, dateMode]);

  const requestedDateLabel = useMemo(() => formatDateForApi(requestedDate), [requestedDate]);

  const { data, isLoading, error } = useAppointmentsByDate(requestedDateLabel);
  const appointments = useMemo(() => sortAppointmentsByTime(data), [data]);

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
      <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">Agendamentos do dia</h2>
      <p className="mb-6 text-sm text-slate-600">Lista de atividades e horarios para {requestedDateLabel}, com filtros.</p>

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
          <Loading message="Loading initial response..." size="lg" />
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
            <AppointmentListItem key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </Card>
  );
}
