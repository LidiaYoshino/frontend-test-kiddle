import { addDays, format, parse, parseISO } from "date-fns";

export const REFERENCE_TODAY = parseISO("2026-03-09");

export const DATE_PRESET_OPTIONS = [
  { value: "today", label: "Hoje (9/3/2026)" },
  { value: "tomorrow", label: "Amanhã" },
  { value: "dayAfterTomorrow", label: "Depois de amanhã" }
] as const;

export type DatePreset = (typeof DATE_PRESET_OPTIONS)[number]["value"];
export type DateMode = DatePreset | "custom";

const PRESET_OFFSETS: Record<DatePreset, number> = {
  today: 0,
  tomorrow: 1,
  dayAfterTomorrow: 2
};

export function getDateByPreset(preset: DatePreset): Date {
  return addDays(REFERENCE_TODAY, PRESET_OFFSETS[preset]);
}

export function formatDateForApi(date: Date): string {
  return format(date, "d/M/yyyy");
}

export function parseApiDateString(label: string): Date {
  const parsed = parse(label, "d/M/yyyy", new Date());
  return Number.isNaN(parsed.getTime()) ? REFERENCE_TODAY : parsed;
}
