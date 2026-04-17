import { getAppointmentsRanking } from "../api/getAppointmentsRanking";
import { RankingCard } from "./RankingCard";

export function AppointmentsRanking() {
  return (
    <RankingCard
      title="Ranking de atividades"
      description="Top 5 atividades mais agendadas nos ultimos 3 meses"
      loadErrorMessage="Erro ao buscar ranking de atividades"
      emptyMessage="Ranking de atividades não encontrado"
      fetchRanking={getAppointmentsRanking}
    />
  );
}
