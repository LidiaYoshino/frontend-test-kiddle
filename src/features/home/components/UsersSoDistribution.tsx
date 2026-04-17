import { getUsersSo } from "../api/getUsersSo";
import { DistributionCard } from "../../../components/DistributionCard";

export function UsersSoDistribution() {
  return (
    <DistributionCard
      title="Sistemas operacionais"
      description="Distribuição percentual dos sistemas operacionais dos usuários"
      loadErrorMessage="Erro ao buscar distribuição de sistemas operacionais"
      emptyMessage="Distribuição de sistemas operacionais não encontrada"
      fetchDistribution={getUsersSo}
    />
  );
}
