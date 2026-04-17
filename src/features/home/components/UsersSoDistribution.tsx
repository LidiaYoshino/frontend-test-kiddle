import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Card } from "../../../components/ui/Card";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { getErrorMessage } from "../../../lib/api/client";
import type { UsersSoDistribution } from "../../../types/api";
import { getUsersSo } from "../api/getUsersSo";

ChartJS.register(ArcElement, Tooltip, Legend);

type UsersSoItem = {
  osName: string;
  percentage: number;
};

type UsersSoViewMode = "list" | "chart";

function UsersSoDistributionList({ items }: { items: UsersSoItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.osName} className="space-y-1">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>{item.osName}</span>
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

function UsersSoDistributionChart({ items }: { items: UsersSoItem[] }) {
  const chartData = {
    labels: items.map((item) => item.osName),
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
          "rgba(239, 68, 68, 0.8)"
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

function toSortedUsersSoItems(payload: UsersSoDistribution): UsersSoItem[] {
  return Object.entries(payload)
    .map(([osName, percentage]) => ({ osName, percentage }))
    .filter((item) => Number.isFinite(item.percentage))
    .sort((a, b) => b.percentage - a.percentage);
}

export function UsersSoDistribution() {
  const [payload, setPayload] = useState<UsersSoDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<UsersSoViewMode>("list");
  const hasFetchedOnMount = useRef(false);

  const fetchUsersSo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUsersSo();
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
    void fetchUsersSo();
  }, [fetchUsersSo]);

  const usersSoItems = payload ? toSortedUsersSoItems(payload) : [];

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500">Sistemas operacionais</h2>
          <p className="text-sm text-slate-600">Distribuição percentual dos sistemas operacionais dos usuários</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              viewMode === "chart" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gráfico
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex min-h-[210px] items-center justify-center">
          <Loading message="Loading initial response..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Erro ao buscar distribuição de sistemas operacionais" />
      ) : usersSoItems.length === 0 ? (
        <ErrorMessage message="Distribuição de sistemas operacionais não encontrada" />
      ) : (
        viewMode === "list" ? <UsersSoDistributionList items={usersSoItems} /> : <UsersSoDistributionChart items={usersSoItems} />
      )}
    </Card>
  );
}
