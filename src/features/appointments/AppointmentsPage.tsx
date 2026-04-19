import { Section } from "../../components/layout/Section";
import { Stack } from "../../components/layout/Stack";
import { ScreenTitleCard } from "../../components/ui/ScreenTitleCard";
import { AppointmentsByDateCard } from "./components/AppointmentsByDateCard";

export function AppointmentsPage() {
  return (
    <Section>
      <Stack className="gap-6">
        <ScreenTitleCard
          title="Agendamentos"
          description="Visão dos agendamentos por atividade e horario na data de referência."
        />
        <AppointmentsByDateCard />
      </Stack>
    </Section>
  );
}
