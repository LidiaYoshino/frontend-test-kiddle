import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { getErrorMessage } from "../../../lib/api/client";
import type { AppointmentsPerformanceResponse } from "../../../types/api";
import { getAppointmentsPerformance } from "../api/getAppointmentsPerformance";

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
    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">Appointments Performance Response</h2>
    {error ? (
      <ErrorMessage message={error} />
    ) : isLoading ? (
      <Loading message="Loading initial response..." />
    ) : (
      <p className="break-all rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{JSON.stringify(payload)}</p>
    )}
  </Card>);
}
