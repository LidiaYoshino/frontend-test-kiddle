import { apiClient } from "../../../lib/api/client";
import type { SchedulableActivitiesResponse } from "../../../types/api";

export async function getSchedulableActivities(): Promise<SchedulableActivitiesResponse> {
  const { data } = await apiClient.get<SchedulableActivitiesResponse>("/demo/activities/schedulable");
  return data;
}
