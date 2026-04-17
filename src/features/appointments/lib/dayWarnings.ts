import type { AppointmentChild, DayAppointment } from "../../../types/api";
import { isBirthdayOn } from "./children";

export type DayWarningKind = "birthday" | "deficiency" | "interpreter";

export interface DayWarningEntry {
  kind: DayWarningKind;
  appointment: DayAppointment;
  child: AppointmentChild;
}

export function collectDayWarnings(appointments: DayAppointment[]): DayWarningEntry[] {
  const entries: DayWarningEntry[] = [];

  for (const appointment of appointments) {
    for (const child of appointment.criancas) {
      if (isBirthdayOn(child.nascimento, appointment.data)) {
        entries.push({ kind: "birthday", appointment, child });
      }
      if (child.hasDeficiency) {
        entries.push({ kind: "deficiency", appointment, child });
      }
      if (child.needsInterpreter) {
        entries.push({ kind: "interpreter", appointment, child });
      }
    }
  }

  return entries;
}
