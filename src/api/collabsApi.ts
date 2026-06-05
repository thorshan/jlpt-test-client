import { apiClient } from "./apiClient";

export interface ApiResponse<T> {
  success: boolean;
  token: string;
  data: T;
}

interface Incharge {
  _id: string;
  name: string;
  email: string;
}

interface Students {
  _id: string;
  name: string;
  email: string;
  role: string;
  level: string;
}

export interface Collabs {
  _id: string;
  name: string;
  category: string;
  email: string;
  password?: string;
  status?: string;
  students?: Students[];
  incharge?: Incharge;
}

export interface CollabsForm {
  name: string;
  category: string;
  email: string;
  password?: string;
  status?: string;
  incharge?: string;
}

export type CollabsFormData = Omit<Collabs, "_id">;

export const collabsApi = {
  getAllCollabs: () => apiClient.get<ApiResponse<Collabs[]>>("/collabs"),
  createCollabs: (data: CollabsForm) =>
    apiClient.post<ApiResponse<Collabs[]>>("/collabs", data),
  addUserToCollab: (collabId: string, id: string) =>
    apiClient.put(`/collabs/${collabId}/${id}`),
  updateCollabStauts: (id: string, status: string) =>
    apiClient.patch(`/collabs/${id}`, { status }),
};
