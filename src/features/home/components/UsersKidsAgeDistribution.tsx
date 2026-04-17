import { getUsersKidsAge } from "../api/getUsersKidsAge";
import { DistributionCard } from "../../../components/DistributionCard";

function getAgeRangeStart(ageRange: string): number {
  const [start] = ageRange.split("-");
  const parsedStart = Number(start);
  return Number.isFinite(parsedStart) ? parsedStart : Number.MAX_SAFE_INTEGER;
}

export function UsersKidsAgeDistribution() {
  return (
    <DistributionCard
      title="Faixas etárias das crianças"
      description="Distribuição percentual das faixas etárias das crianças"
      loadErrorMessage="Erro ao buscar distribuição de faixas etárias"
      emptyMessage="Distribuição de faixas etárias não encontrada"
      fetchDistribution={getUsersKidsAge}
      sortEntries={(a, b) => getAgeRangeStart(a[0]) - getAgeRangeStart(b[0])}
    />
  );
}
