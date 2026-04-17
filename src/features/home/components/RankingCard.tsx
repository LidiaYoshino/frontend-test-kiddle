import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { getErrorMessage } from "../../../lib/api/client";

interface RankingCardProps {
  title: string;
  description: string;
  loadErrorMessage: string;
  emptyMessage: string;
  fetchRanking: () => Promise<string[]>;
}

function RankingList({ items }: { items: string[] }) {
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

export function RankingCard({ title, description, loadErrorMessage, emptyMessage, fetchRanking }: RankingCardProps) {
  const [payload, setPayload] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedOnMount = useRef(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRanking();
      setPayload(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [fetchRanking]);

  useEffect(() => {
    if (hasFetchedOnMount.current) {
      return;
    }

    hasFetchedOnMount.current = true;
    void fetchData();
  }, [fetchData]);

  return (
    <Card>
      <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">{title}</h2>
      <p className="mb-6 text-sm text-slate-600">{description}</p>
      {isLoading ? (
        <div className="flex min-h-[170px] items-center justify-center">
          <Loading message="Loading initial response..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={loadErrorMessage} />
      ) : payload.length === 0 ? (
        <ErrorMessage message={emptyMessage} />
      ) : (
        <RankingList items={payload} />
      )}
    </Card>
  );
}
