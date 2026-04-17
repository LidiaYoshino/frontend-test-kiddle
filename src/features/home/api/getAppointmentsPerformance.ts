import { apiClient } from "../../../lib/api/client";
import type { AppointmentsPerformanceResponse } from "../../../types/api";

export async function getAppointmentsPerformance(): Promise<AppointmentsPerformanceResponse> {
  const { data } = await apiClient.get<AppointmentsPerformanceResponse>("/demo/dashboard/appointments-performance");
  return data;
}
