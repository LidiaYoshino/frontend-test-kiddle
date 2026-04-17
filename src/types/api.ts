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

export interface AppointmentChild {
  id: string;
  nome: string;
  responsavel: string;
}

export interface DayAppointment {
  id: string;
  atividade: string;
  horario: string;
  criancas: AppointmentChild[];
  grade: {
    dia: string;
    horarios: {
      horarioInicio: string;
      horarioTermino: string;
      vagas: number;
    }[];
  }[];
}

export interface AppointmentsByDateResponse {
  appointments: DayAppointment[];
}
