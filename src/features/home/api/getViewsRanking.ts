import { apiClient } from "../../../lib/api/client";
import type { ViewsRankingResponse } from "../../../types/api";

export async function getViewsRanking(): Promise<ViewsRankingResponse> {
  const { data } = await apiClient.get<ViewsRankingResponse>("/demo/dashboard/views-ranking");
  return data;
}
