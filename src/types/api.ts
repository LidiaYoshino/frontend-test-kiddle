export interface ApiStatusResponse {
  [key: string]: unknown;
}

export interface AppointmentsPerformanceResponse {
  [monthsAgo: string]: number;
}

export type AppointmentsRankingResponse = string[];

export type ViewsRankingResponse = string[];

export interface UsersSoResponse {
  operatingSystems: {
    [osName: string]: number;
  };
}

export interface UsersSoDistribution {
  [osName: string]: number;
}

export interface UsersKidsAgeDistribution {
  [ageRange: string]: number;
}

export interface UsersKidsAgeResponse {
  age: UsersKidsAgeDistribution;
}
