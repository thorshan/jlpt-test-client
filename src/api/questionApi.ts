import { apiClient } from "./apiClient";

export enum QuestionModule {
  M1 = "Module 1",
  M2 = "Module 2",
  M3 = "Module 3",
  M4 = "Module 4",
  M5 = "Module 5",
  M6 = "Module 6",
}

export enum QuestionCategory {
  Vocab = "Vocabulary",
  Grammar = "Grammar",
  Kanji = "Kanji",
  Reading = "Reading",
  Listening = "Listening",
}

export interface Question {
  _id: string;
  refText: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  module: QuestionModule;
  category: QuestionCategory;
  point: number;
  refImage?: string;
  refAudio?: string;
  tags: string[];
}

export const questionApi = {
  getQuestions: (admin?: boolean) =>
    apiClient.get<{ data: Question[] }>(
      `/questions${admin ? "?admin=true" : ""}`,
    ),
  getQuestionsBySection: (sectionId: string) =>
    apiClient.get<{ data: Question[] }>(`/questions/section/${sectionId}`),
  createQuestion: (data: Omit<Question, "_id">) =>
    apiClient.post<{ data: Question }>("/questions", data),
  updateQuestion: (id: string, data: Partial<Question>) =>
    apiClient.put<{ data: Question }>(`/questions/${id}`, data),
  deleteQuestion: (id: string) => apiClient.delete(`/questions/${id}`),
};
