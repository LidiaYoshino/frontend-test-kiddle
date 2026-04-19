import { ResponsiveGrid } from "../../components/layout/ResponsiveGrid";
import { Section } from "../../components/layout/Section";
import { Stack } from "../../components/layout/Stack";
import { Card } from "../../components/ui/Card";
import { ScreenTitleCard } from "../../components/ui/ScreenTitleCard";
import { AppointmentsPerformance } from "./components/AppointmentsPerformance";
import { AppointmentsRanking } from "./components/AppointmentsRanking";
import { UsersKidsAgeDistribution } from "./components/UsersKidsAgeDistribution";
import { UsersSoDistribution } from "./components/UsersSoDistribution";
import { ViewsRanking } from "./components/ViewsRanking";

export function Dashboard() {
  return (
    <Section>
      <Stack className="gap-6">
        <ScreenTitleCard
          title="Dashboard"
          description="Kiddle Pass em números. Dados gerais de uso da plataforma."
        />
        <AppointmentsPerformance />
        <ResponsiveGrid>
          <UsersKidsAgeDistribution />
          <AppointmentsRanking />
          <ViewsRanking />
          <UsersSoDistribution />
        </ResponsiveGrid>
      </Stack>
    </Section>
  );
}
