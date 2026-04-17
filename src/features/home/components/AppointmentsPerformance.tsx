import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { getErrorMessage } from "../../../lib/api/client";
import type { AppointmentsPerformanceResponse } from "../../../types/api";
import { getAppointmentsPerformance } from "../api/getAppointmentsPerformance";
import { AppointmentsPerformanceChart } from "./AppointmentsPerformanceChart";

export function AppointmentsPerformance() {
  const [payload, setPayload] = useState<AppointmentsPerformanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedOnMount = useRef(false);

  const fetchAppointmentsPerformance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAppointmentsPerformance();
      setPayload(data);
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
    void fetchAppointmentsPerformance();
  }, [fetchAppointmentsPerformance]);

  return (<Card>
    <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">Agendamentos do período</h2>
    <p className="mb-6 text-sm text-slate-600">Agendamenos ao longo dos meses (agendamentos x mês/ano)</p>
    {isLoading ? (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loading message="Loading initial response..." size="lg" />
      </div>
    ) : error ? (
      <ErrorMessage message={'Erro ao buscar agendamentos'} />
    ) : !payload || Object.keys(payload).length === 0 ? (
      <ErrorMessage message={'Agendamentos não encontrados'} />
    ) : (
      <AppointmentsPerformanceChart data={payload} />
    )}
  </Card>);
}
