import { apiClient } from "../../../lib/api/client";
import type { ActiveSubscribersResponse } from "../../../types/api";

export async function getActiveSubscribers(): Promise<ActiveSubscribersResponse> {
  const { data } = await apiClient.get<ActiveSubscribersResponse>("/demo/subscribers/active");
  return data;
}
