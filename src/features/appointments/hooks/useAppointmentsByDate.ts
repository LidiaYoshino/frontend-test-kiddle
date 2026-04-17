import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../../lib/api/client";
import type { DayAppointment } from "../../../types/api";
import { getAppointmentsByDate } from "../api/getAppointmentsByDate";

interface UseAppointmentsByDateResult {
  data: DayAppointment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAppointmentsByDate(date: string): UseAppointmentsByDateResult {
  const [data, setData] = useState<DayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAppointmentsByDate(date);
      setData(response.appointments ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
