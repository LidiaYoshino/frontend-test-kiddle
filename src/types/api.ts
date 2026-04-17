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
  nascimento: string;
  observation: string;
  hasDeficiency: boolean;
  needsInterpreter: boolean;
}

export interface DayAppointment {
  id: string;
  atividade: string;
  parceiro: string;
  data: string;
  horario: string;
  link: string;
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

export interface SubscriberKid {
  id: string;
  name: string;
  birthDate: string;
}

export interface ActiveSubscriber {
  id: string;
  nome: string;
  email: string;
  celular: string;
  engagementStatus: string;
  kids: SubscriberKid[];
}

export interface ActiveSubscribersResponse {
  list: ActiveSubscriber[];
}

export interface SchedulableActivityGradeSlot {
  horarioInicio: string;
  horarioTermino: string;
  vagas: number;
}

export interface SchedulableActivityGradeDay {
  dia: string;
  horarios: SchedulableActivityGradeSlot[];
}

export interface SchedulableActivity {
  id: string;
  nome: string;
  minima: number;
  maxima: number;
  grade: SchedulableActivityGradeDay[];
}

export interface SchedulableActivitiesResponse {
  list: SchedulableActivity[];
}
