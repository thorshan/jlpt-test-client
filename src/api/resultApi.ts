import { apiClient } from "./apiClient";

// --- INTERFACES ---
export interface SectionDetail {
  sectionTitle: string;
  earnedPoints: number;
  totalPoints: number;
  gradeJLPT: "A" | "B" | "C";
  passed: boolean;
}

export interface Result {
  _id: string;
  user: string | { _id: string; name: string };
  exam: string | { _id: string; title: string };
  level: "N1" | "N2" | "N3" | "N4" | "N5";

  // Detailed Sectional Performance
  sectionDetails: SectionDetail[];

  // Overall Performance
  totalEarnedPoints: number;
  totalPossiblePoints: number;

  status: boolean;

  // Overall Grades
  gradeJLPT: "A" | "B" | "C";
  grade: "A1" | "A2" | "B1" | "B2" | "C1";

  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Data shape for creating a new result (POST)
export type ResultFormData = Omit<Result, "_id" | "createdAt" | "updatedAt">;

// --- API CLIENT ---
export const resultApi = {
  getAllResults: () => apiClient.get<ApiResponse<Result[]>>("/results"),

  getResultsByUser: (userId: string) =>
    apiClient.get<ApiResponse<Result[]>>(`/results/${userId}`),

  createResult: (data: ResultFormData) =>
    apiClient.post<ApiResponse<Result>>("/results", data),
};
