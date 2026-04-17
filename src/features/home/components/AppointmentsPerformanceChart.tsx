import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  type Point,
  PointElement,
  type Plugin,
  Tooltip
} from "chart.js";
import { ptBR } from "date-fns/locale";
import { format, subMonths } from "date-fns";
import { Chart } from "react-chartjs-2";
import { useBreakpointBucket } from "../../../hooks/useMediaQuery";
import type { AppointmentsPerformanceResponse } from "../../../types/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

interface AppointmentsPerformanceChartProps {
  data: AppointmentsPerformanceResponse;
}

function getMonthLabel(monthsAgo: number): string {
  const monthDate = subMonths(new Date(), monthsAgo);
  return format(monthDate, "MMM", { locale: ptBR }).replace(".", "").toUpperCase();
}

export function AppointmentsPerformanceChart({ data }: AppointmentsPerformanceChartProps) {
  const breakpointBucket = useBreakpointBucket();

  const orderedEntries = Object.entries(data)
    .map(([key, value]) => ({
      monthsAgo: Number(key),
      appointments: value,
      monthDate: subMonths(new Date(), Number(key))
    }))
    .filter((entry) => Number.isFinite(entry.monthsAgo))
    .sort((a, b) => b.monthsAgo - a.monthsAgo);

  const appointmentValues = orderedEntries.map((entry) => entry.appointments);
  const yearTransitionIndex = orderedEntries.findIndex((entry, index, entries) => {
    if (index === 0) {
      return false;
    }

    const previousEntry = entries[index - 1];
    if (!previousEntry) {
      return false;
    }

    return entry.monthDate.getFullYear() !== previousEntry.monthDate.getFullYear();
  });

  const yearTransitionPlugin: Plugin<"bar"> = {
    id: "yearTransitionLine",
    afterDatasetsDraw: (chart) => {
      if (yearTransitionIndex <= 0) {
        return;
      }

      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      if (!xScale || !yScale) {
        return;
      }

      const barMeta = chart.getDatasetMeta(0);
      const previousPoint = barMeta.data[yearTransitionIndex - 1] as Point | undefined;
      const currentPoint = barMeta.data[yearTransitionIndex] as Point | undefined;
      if (!previousPoint || !currentPoint || previousPoint.x === null || currentPoint.x === null) {
        return;
      }

      const x = (previousPoint.x + currentPoint.x) / 2;
      const previousYear = orderedEntries[yearTransitionIndex - 1]?.monthDate.getFullYear();
      const transitionYear = orderedEntries[yearTransitionIndex]?.monthDate.getFullYear();
      if (!transitionYear || !previousYear) {
        return;
      }

      const context = chart.ctx;
      context.save();
      context.setLineDash([6, 4]);
      context.strokeStyle = "rgba(100, 116, 139, 0.85)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(x, yScale.top);
      context.lineTo(x, yScale.bottom);
      context.stroke();

      const previousYearText = String(previousYear);
      const nextYearText = String(transitionYear);
      const labelPaddingX = 6;
      const labelHeight = 20;
      const labelGap = 8;
      context.font = "600 11px Inter, sans-serif";
      const previousTextWidth = context.measureText(previousYearText).width;
      const nextTextWidth = context.measureText(nextYearText).width;
      const previousLabelWidth = previousTextWidth + labelPaddingX * 2;
      const nextLabelWidth = nextTextWidth + labelPaddingX * 2;
      const labelY = yScale.top + 6;
      const minX = xScale.left + 2;
      const maxX = xScale.right - 2;
      const hasRoomForBothLabels = maxX - minX > previousLabelWidth + nextLabelWidth + labelGap * 3;
      const previousLabelX = Math.max(minX, x - labelGap - previousLabelWidth);
      const nextLabelX = Math.min(maxX - nextLabelWidth, x + labelGap);

      context.setLineDash([]);
      context.fillStyle = "rgba(100, 116, 139, 0.16)";
      if (hasRoomForBothLabels) {
        context.fillRect(previousLabelX, labelY, previousLabelWidth, labelHeight);
      }
      context.fillRect(nextLabelX, labelY, nextLabelWidth, labelHeight);
      context.fillStyle = "rgba(71, 85, 105, 0.95)";
      context.textAlign = "left";
      context.textBaseline = "middle";
      if (hasRoomForBothLabels) {
        context.fillText(previousYearText, previousLabelX + labelPaddingX, labelY + labelHeight / 2);
      }
      context.fillText(nextYearText, nextLabelX + labelPaddingX, labelY + labelHeight / 2);
      context.restore();
    }
  };

  const chartData = {
    labels: orderedEntries.map((entry) => getMonthLabel(entry.monthsAgo)),
    datasets: [
      {
        type: "bar" as const,
        label: "Agendamentos",
        data: appointmentValues,
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        borderColor: "rgba(37, 99, 235, 0.5)",
        borderWidth: 1,
        borderRadius: 6,
        categoryPercentage: 0.72,
        barPercentage: 0.9
      },
      {
        type: "line" as const,
        label: "Agendamentos",
        data: appointmentValues,
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3.5,
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (items: { dataIndex: number }[]) => {
            const item = items[0];
            if (!item) {
              return "";
            }

            const monthDate = orderedEntries[item.dataIndex]?.monthDate;
            return monthDate ? format(monthDate, "MMM/yyyy", { locale: ptBR }) : "";
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        offset: true,
        grid: {
          display: false,
          offset: true
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="h-72">
      <Chart key={breakpointBucket} type="bar" data={chartData} options={chartOptions} plugins={[yearTransitionPlugin]} />
    </div>
  );
}
