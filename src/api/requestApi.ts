import { apiClient } from "./apiClient";

export interface RequestData {
  _id: string;
  resultId: string;
  email: string;
  status: string;
  createdAt: string;
}

export const requestApi = {
  createRequest: (data: { resultId: string; email: string }) => apiClient.post("/requests", data),
  getRequests: () => apiClient.get("/requests"),
  updateRequest: (id: string, data: { status: string }) => apiClient.put(`/requests/${id}`, data),
  deleteRequest: (id: string) => apiClient.delete(`/requests/${id}`),
};
