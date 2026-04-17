import { apiClient } from "../../../lib/api/client";
import type { AppointmentsByDateResponse } from "../../../types/api";

export async function getAppointmentsByDate(date: string): Promise<AppointmentsByDateResponse> {
  const { data } = await apiClient.get<AppointmentsByDateResponse>("/demo/appointments", {
    params: { date }
  });

  return data;
}
