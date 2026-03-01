import { apiClient } from "./apiClient";

export const userApi = {
  createUser: (name: string, token: string) =>
    apiClient.post("/users", { name, token }),

  updateUser: (id: string, level: string) =>
    apiClient.put(`/users/${id}`, { level }),

  getAllUsers: () => apiClient.get("/users"),

  clearUser: (id: string) => apiClient.delete(`/users/${id}`),
};
