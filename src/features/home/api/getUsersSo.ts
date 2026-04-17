import { apiClient } from "../../../lib/api/client";
import type { UsersSoDistribution, UsersSoResponse } from "../../../types/api";

export async function getUsersSo(): Promise<UsersSoDistribution> {
  const { data } = await apiClient.get<UsersSoResponse>("/demo/dashboard/users-so");
  return data.operatingSystems ?? {};
}
