import { differenceInYears, parse } from "date-fns";

function parseFlexibleDate(value: string, dateFormat: string): Date | null {
  const parsed = parse(value, dateFormat, new Date());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseBirthdate(nascimento: string): Date | null {
  return parseFlexibleDate(nascimento, "dd/MM/yyyy");
}

function parseAppointmentDate(data: string): Date | null {
  return parseFlexibleDate(data, "d/M/yyyy");
}

export function isBirthdayOn(nascimento: string, appointmentDate: string): boolean {
  const birth = parseBirthdate(nascimento);
  const date = parseAppointmentDate(appointmentDate);
  if (!birth || !date) {
    return false;
  }

  return birth.getDate() === date.getDate() && birth.getMonth() === date.getMonth();
}

export function getAgeAt(nascimento: string, appointmentDate: string): number | null {
  const birth = parseBirthdate(nascimento);
  const date = parseAppointmentDate(appointmentDate);
  if (!birth || !date) {
    return null;
  }

  return differenceInYears(date, birth);
}
