import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { getErrorMessage } from "../../../lib/api/client";
import type { AppointmentsRankingResponse } from "../../../types/api";
import { getAppointmentsRanking } from "../api/getAppointmentsRanking";

function AppointmentsRankingList({ items }: { items: AppointmentsRankingResponse }) {
  return (
    <ol className="space-y-2">
      {items.map((activity, index) => (
        <li key={`${activity}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
          <span className="mt-0.5 inline-flex min-w-6 justify-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">
            {index + 1}
          </span>
          <span>{activity}</span>
        </li>
      ))}
    </ol>
  );
}

export function AppointmentsRanking() {
  const [payload, setPayload] = useState<AppointmentsRankingResponse>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedOnMount = useRef(false);

  const fetchAppointmentsRanking = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAppointmentsRanking();
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
    void fetchAppointmentsRanking();
  }, [fetchAppointmentsRanking]);

  return (
    <Card>
      <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">Ranking de atividades</h2>
      <p className="mb-6 text-sm text-slate-600">Top 5 atividades mais agendadas nos ultimos 3 meses</p>
      {isLoading ? (
        <div className="flex min-h-[170px] items-center justify-center">
          <Loading message="Loading initial response..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Erro ao buscar ranking de atividades" />
      ) : payload.length === 0 ? (
        <ErrorMessage message="Ranking de atividades não encontrado" />
      ) : (
        <AppointmentsRankingList items={payload} />
      )}
    </Card>
  );
}
