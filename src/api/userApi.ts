import { apiClient } from "./apiClient";

export interface User {
  _id: string;
  name: string;
  level?: string;
  role: string;
  token: string;
}

export interface UserForm {
  name?: string;
  level?: string;
  role?: string;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  token: string;
  data: T;
}

export type UserFormData = Omit<User, "_id">;

export const userApi = {
  createUser: (name: string, token: string) =>
    apiClient.post<ApiResponse<User>>("/users", { name, token }),

  updateUser: (id: string, level: string) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, { level }),

  updateRole: (id: string) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}/role`),

  getUser: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),

  getAllUsers: () => apiClient.get<ApiResponse<User[]>>("/users"),

  clearUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/users/${id}`),

  login: (data: UserForm) =>
    apiClient.post<ApiResponse<User>>("/users/auth", data),
};
