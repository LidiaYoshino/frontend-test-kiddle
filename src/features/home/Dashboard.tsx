import { ResponsiveGrid } from "../../components/layout/ResponsiveGrid";
import { Section } from "../../components/layout/Section";
import { Stack } from "../../components/layout/Stack";
import { Card } from "../../components/ui/Card";
import { AppointmentsPerformance } from "./components/AppointmentsPerformance";
import { AppointmentsRanking } from "./components/AppointmentsRanking";
import { UsersSoDistribution } from "./components/UsersSoDistribution";
import { ViewsRanking } from "./components/ViewsRanking";

export function Dashboard() {
  return (
    <Section>
      <Stack className="gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="mb-1 text-xl font-semibold sm:text-2xl">Dashboard</h1>
              <p className="text-sm text-slate-600">Kiddle Pass em números. Dados gerais de uso da plataforma.</p>
            </div>
          </div>
        </Card>
        <AppointmentsPerformance />
        <AppointmentsRanking />
        <ViewsRanking />
        <UsersSoDistribution />
        <ResponsiveGrid>
          <Card>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Total Widgets</h2>
            <p className="text-2xl font-semibold text-slate-900">4</p>
            <p className="mt-1 text-sm text-slate-600">Placeholder KPI for quick dashboard composition.</p>
          </Card>
        </ResponsiveGrid>
        <Card>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">API Base URL</h2>
          <p className="break-all text-sm text-slate-700">https://kiddle-code-challenge-0b5750a3aba2.herokuapp.com/</p>
        </Card>
      </Stack>
    </Section>
  );
}
