export interface ApiStatusResponse {
  [key: string]: unknown;
}

export interface AppointmentsPerformanceResponse {
  [monthsAgo: string]: number;
}

export type AppointmentsRankingResponse = string[];
