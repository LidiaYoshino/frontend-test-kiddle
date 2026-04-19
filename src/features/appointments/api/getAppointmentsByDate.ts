import { apiClient } from "../../../lib/api/client";
import type { AppointmentsByDateResponse } from "../../../types/api";

const inFlightRequestsByDate = new Map<string, Promise<AppointmentsByDateResponse>>();

export async function getAppointmentsByDate(date: string): Promise<AppointmentsByDateResponse> {
  const inFlightRequest = inFlightRequestsByDate.get(date);
  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = apiClient
    .get<AppointmentsByDateResponse>("/demo/appointments", {
      params: { date }
    })
    .then((response) => response.data)
    .finally(() => {
      inFlightRequestsByDate.delete(date);
    });

  inFlightRequestsByDate.set(date, request);
  return request;
}
