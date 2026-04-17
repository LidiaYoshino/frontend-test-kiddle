import { apiClient } from "../../../lib/api/client";
import type { ApiStatusResponse } from "../../../types/api";

export async function getApiStatus(): Promise<ApiStatusResponse> {
  const { data } = await apiClient.get<ApiStatusResponse>("/");
  return data;
}
