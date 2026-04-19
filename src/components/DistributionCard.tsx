import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getErrorMessage } from "../lib/api/client";
import { Card } from "./ui/Card";
import { ErrorMessage } from "./ui/ErrorMessage";
import { Loading } from "./ui/Loading";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DistributionCardProps {
  title: string;
  description: string;
  loadErrorMessage: string;
  emptyMessage: string;
  fetchDistribution: () => Promise<Record<string, number>>;
  sortEntries?: (a: [string, number], b: [string, number]) => number;
}

type DistributionItem = {
  label: string;
  percentage: number;
};

type DistributionViewMode = "list" | "chart";

function DistributionList({ items }: { items: DistributionItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>{item.label}</span>
            <span className="font-medium">{item.percentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded bg-slate-100">
            <div
              className="h-full rounded bg-blue-500 transition-[width] duration-300"
              style={{ width: `${Math.min(Math.max(item.percentage, 0), 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DistributionChart({ items }: { items: DistributionItem[] }) {
  const chartData = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        label: "Distribuição",
        data: items.map((item) => item.percentage),
        backgroundColor: [
          "rgba(37, 99, 235, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)"
        ],
        borderColor: "#ffffff",
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed: number }) => `${context.label ?? ""}: ${context.parsed.toFixed(1)}%`
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}

function toDistributionItems(
  payload: Record<string, number>,
  sortEntries?: (a: [string, number], b: [string, number]) => number
): DistributionItem[] {
  return Object.entries(payload)
    .sort(sortEntries ?? ((a, b) => b[1] - a[1]))
    .map(([label, percentage]) => ({ label, percentage }))
    .filter((item) => Number.isFinite(item.percentage));
}

export function DistributionCard({
  title,
  description,
  loadErrorMessage,
  emptyMessage,
  fetchDistribution,
  sortEntries
}: DistributionCardProps) {
  const [payload, setPayload] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<DistributionViewMode>("list");
  const hasFetchedOnMount = useRef(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDistribution();
      setPayload(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [fetchDistribution]);

  useEffect(() => {
    if (hasFetchedOnMount.current) {
      return;
    }

    hasFetchedOnMount.current = true;
    void fetchData();
  }, [fetchData]);

  const items = payload ? toDistributionItems(payload, sortEntries) : [];

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              viewMode === "list" ? "bg-brand-yellow-50 text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              viewMode === "chart" ? "bg-brand-yellow-50 text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gráfico
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex min-h-[210px] items-center justify-center">
          <Loading message="Carregando..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={loadErrorMessage} />
      ) : items.length === 0 ? (
        <ErrorMessage message={emptyMessage} />
      ) : viewMode === "list" ? (
        <DistributionList items={items} />
      ) : (
        <DistributionChart items={items} />
      )}
    </Card>
  );
}
