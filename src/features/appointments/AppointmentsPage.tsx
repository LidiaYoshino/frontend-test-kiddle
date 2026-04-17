import { Section } from "../../components/layout/Section";
import { Stack } from "../../components/layout/Stack";
import { Card } from "../../components/ui/Card";
import { AppointmentsByDateCard } from "./components/AppointmentsByDateCard";

export function AppointmentsPage() {
  return (
    <Section>
      <Stack className="gap-6">
        <Card>
          <h1 className="mb-1 text-xl font-semibold sm:text-2xl">Appointments</h1>
          <p className="text-sm text-slate-600">Visão dos agendamentos por atividade e horario na data de referência.</p>
        </Card>
        <AppointmentsByDateCard />
      </Stack>
    </Section>
  );
}
