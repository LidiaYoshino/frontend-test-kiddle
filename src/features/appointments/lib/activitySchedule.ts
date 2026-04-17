import { addDays, startOfDay } from "date-fns";
import type { SchedulableActivity, SchedulableActivityGradeSlot } from "../../../types/api";

const DIA_TO_WEEKDAY: Record<string, number> = {
  dom: 0,
  seg: 1,
  ter: 2,
  qua: 3,
  qui: 4,
  sex: 5,
  sab: 6
};

const WEEKDAY_TO_DIA = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const;

export function getDiaForDate(date: Date): string {
  return WEEKDAY_TO_DIA[date.getDay()] ?? "dom";
}

export function getAvailableSlotsForActivityOnDate(
  activity: SchedulableActivity,
  date: Date
): SchedulableActivityGradeSlot[] {
  const dia = getDiaForDate(date);
  const dayGrade = activity.grade.find((entry) => entry.dia.trim().toLowerCase() === dia);
  if (!dayGrade?.horarios?.length) {
    return [];
  }

  return dayGrade.horarios.filter((slot) => slot.vagas > 0);
}

export function getSchedulableWeekdays(activity: SchedulableActivity): Set<number> {
  const weekdays = new Set<number>();
  for (const day of activity.grade) {
    const hasOpenSlot = day.horarios?.some((slot) => slot.vagas > 0);
    if (!hasOpenSlot) {
      continue;
    }
    const weekday = DIA_TO_WEEKDAY[day.dia.trim().toLowerCase()];
    if (weekday !== undefined) {
      weekdays.add(weekday);
    }
  }
  return weekdays;
}

export function isDateOnSchedulableWeekday(date: Date, weekdays: Set<number>): boolean {
  if (weekdays.size === 0) {
    return false;
  }
  return weekdays.has(date.getDay());
}

export function getFirstSchedulableDate(weekdays: Set<number>, from: Date): Date | null {
  if (weekdays.size === 0) {
    return null;
  }

  const start = startOfDay(from);
  for (let offset = 0; offset < 400; offset++) {
    const candidate = addDays(start, offset);
    if (weekdays.has(candidate.getDay())) {
      return candidate;
    }
  }

  return null;
}
