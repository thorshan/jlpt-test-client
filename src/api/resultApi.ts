import { apiClient } from "./apiClient";

// --- INTERFACES ---
export interface Result {
  _id: string;
  user: string | { _id: string; name: string };
  level: "N1" | "N2" | "N3" | "N4" | "N5";
  sectionTotalScore: number;
  overAllScore: number;
  sectionScore: number;
  status: boolean;
  gradeJLPT: "A" | "B" | "C";
  grade: "A1" | "A2" | "B1" | "B2" | "C1";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Data shape for creating a new result (POST)
export type ResultFormData = Omit<Result, "_id" | "createdAt" | "updatedAt">;

// --- API CLIENT ---
export const resultApi = {
  getResultsByUser: (userId: string) =>
    apiClient.get<ApiResponse<Result[]>>(`/results/${userId}`),

  createResult: (data: ResultFormData) =>
    apiClient.post<ApiResponse<Result>>("/results", data),
};
