import { getViewsRanking } from "../api/getViewsRanking";
import { RankingCard } from "../../../components/RankingCard";

export function ViewsRanking() {
  return (
    <RankingCard
      title="Ranking de visualizações"
      description="Top 10 atividades com mais visualizações de video nos ultimos 30 dias"
      loadErrorMessage="Erro ao buscar ranking de visualizações"
      emptyMessage="Ranking de visualizações não encontrado"
      fetchRanking={getViewsRanking}
    />
  );
}
