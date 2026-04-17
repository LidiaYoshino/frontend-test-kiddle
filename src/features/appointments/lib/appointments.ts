import type { DayAppointment } from "../../../types/api";

export function sortAppointmentsByTime(appointments: DayAppointment[]): DayAppointment[] {
  return [...appointments]
    .filter((appointment) => appointment.atividade && appointment.horario)
    .sort((left, right) => {
      const byHour = left.horario.localeCompare(right.horario, "pt-BR");
      if (byHour !== 0) {
        return byHour;
      }

      return left.atividade.localeCompare(right.atividade, "pt-BR");
    });
}

function getTotalSpots(appointment: DayAppointment): number | null {
  const [start, end] = appointment.horario.split("-");
  if (!start || !end) {
    return null;
  }

  for (const daySchedule of appointment.grade) {
    const slot = daySchedule.horarios.find(
      (horario) => horario.horarioInicio === start.trim() && horario.horarioTermino === end.trim()
    );
    if (slot) {
      return slot.vagas;
    }
  }

  return null;
}

export function getSpotsLeft(appointment: DayAppointment): number | null {
  const totalSpots = getTotalSpots(appointment);
  if (totalSpots === null) {
    return null;
  }

  return Math.max(totalSpots - appointment.criancas.length, 0);
}

export function sortedUnique(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0))).sort((left, right) =>
    left.localeCompare(right, "pt-BR")
  );
}
