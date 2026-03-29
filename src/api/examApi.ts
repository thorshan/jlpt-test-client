import { apiClient } from "./apiClient";
import type { Question } from "./questionApi";

export interface Section<Q = string> {
  _id: string;
  title: string;
  desc: string;
  duration: number;
  minPassedMark: number;
  questions: Q[];
  tag?: string;
}

export interface Exam<Q = string> {
  _id: string;
  level: "N1" | "N2" | "N3" | "N4" | "N5";
  title: string;
  desc: string;
  category: string;
  passingScore: number;
  sections: Section<Q>[];
}

export interface ExamForm {
  level: string;
  title: string;
  desc: string;
  category: string;
  passingScore: number;
  sections: Section[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// We define a separate type for the data being sent to the server
export type ExamFormData = Omit<Exam, "_id">;

export const examApi = {
  getExams: <Q = string>(admin?: boolean) =>
    apiClient.get<ApiResponse<Exam<Q>[]>>(`/exams${admin ? "?admin=true" : ""}`),

  getExam: <Q = Question>(id: string) => 
    apiClient.get<ApiResponse<Exam<Q>>>(`/exams/${id}`),

  createExam: <Q = string>(data: ExamFormData) =>
    apiClient.post<ApiResponse<Exam<Q>>>("/exams", data),

  updateExam: <Q = string>(id: string, data: Partial<ExamFormData>) =>
    apiClient.put<ApiResponse<Exam<Q>>>(`/exams/${id}`, data),

  deleteExam: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/exams/${id}`),
};
