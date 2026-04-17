import { apiClient } from "../../../lib/api/client";

export interface CreateAppointmentBody {
  atividade_id: string;
  kidId: string;
  data: string;
  horario: string;
}

export async function createAppointment(userId: string, body: CreateAppointmentBody): Promise<void> {
  await apiClient.post("/demo/appointments", body, { params: { userId } });
}
