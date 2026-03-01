import { apiClient } from "./apiClient";

export interface Section {
  _id: string;
  title: string;
  desc: string;
  duration: number;
  questions: string[];
}

export interface Exam {
  _id: string;
  title: string;
  desc: string;
  passingScore: number;
  sections: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// We define a separate type for the data being sent to the server
export type ExamFormData = Omit<Exam, "_id">;

export const examApi = {
  getExams: () => apiClient.get<ApiResponse<Exam[]>>("/exams"),

  createExam: (data: ExamFormData) =>
    apiClient.post<ApiResponse<Exam>>("/exams", data),

  updateExam: (id: string, data: Partial<ExamFormData>) =>
    apiClient.put<ApiResponse<Exam>>(`/exams/${id}`, data),

  deleteExam: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/exams/${id}`),
};
