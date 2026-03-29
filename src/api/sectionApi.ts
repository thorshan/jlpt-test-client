import { apiClient } from "./apiClient";

export interface Section {
  _id: string;
  title: string;
  desc: string;
  duration: number;
  questions: string[];
  minPassedMark: number;
  tag?: string;
}

export const sectionApi = {
  getSections: (admin?: boolean) =>
    apiClient.get<{ data: Section[] }>(
      `/sections${admin ? "?admin=true" : ""}`,
    ),
  createSection: (data: Omit<Section, "_id">) =>
    apiClient.post<{ data: Section }>("/sections", data),
  updateSection: (id: string, data: Partial<Section>) =>
    apiClient.put<{ data: Section }>(`/sections/${id}`, data),
  deleteSection: (id: string) => apiClient.delete(`/sections/${id}`),
};
