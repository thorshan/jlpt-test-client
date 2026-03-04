import { apiClient } from "./apiClient";

export interface Section {
  _id: string;
  title: string;
  desc: string;
  duration: number;
  minPassedMark: number;
  questions: string[];
}

export interface Exam {
  _id: string;
  level: string;
  title: string;
  desc: string;
  category: string;
  passingScore: number;
  sections: Section[];
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
  getExams: () => apiClient.get<ApiResponse<Exam[]>>("/exams"),

  getExam: (id: string) => apiClient.get<ApiResponse<Exam>>(`/exams/${id}`),

  createExam: (data: ExamFormData) =>
    apiClient.post<ApiResponse<Exam>>("/exams", data),

  updateExam: (id: string, data: Partial<ExamFormData>) =>
    apiClient.put<ApiResponse<Exam>>(`/exams/${id}`, data),

  deleteExam: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/exams/${id}`),
};
