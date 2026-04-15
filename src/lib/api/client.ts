import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://kiddle-code-challenge-0b5750a3aba2.herokuapp.com/",
  timeout: 10_000
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error while requesting data.";
}
