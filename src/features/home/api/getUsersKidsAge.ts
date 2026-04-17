import { apiClient } from "../../../lib/api/client";
import type { UsersKidsAgeDistribution, UsersKidsAgeResponse } from "../../../types/api";

export async function getUsersKidsAge(): Promise<UsersKidsAgeDistribution> {
  const { data } = await apiClient.get<UsersKidsAgeResponse>("/demo/dashboard/users-kids-age");
  return data.age;
}
