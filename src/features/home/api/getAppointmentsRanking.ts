import { apiClient } from "../../../lib/api/client";
import type { AppointmentsRankingResponse } from "../../../types/api";

export async function getAppointmentsRanking(): Promise<AppointmentsRankingResponse> {
  const { data } = await apiClient.get<AppointmentsRankingResponse>("/demo/dashboard/appointments-ranking");
  return data;
}
