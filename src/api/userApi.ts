import { apiClient } from "./apiClient";

export interface User {
  _id: string;
  name: string;
  dob: Date;
  level?: string;
  role?: string;
  token?: string;
  email?: string;
  password?: string;
  association?: string | { _id: string; name: string };
}

export interface UserForm {
  name?: string;
  level?: string;
  role?: string;
  dob?: string | Date;
  token?: string;
  email?: string;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  token: string;
  data: T;
}

export interface UpdateForm {
  name: string;
  lastNameChanged: string | Date;
}

export interface UpdateLvlForm {
  level: string;
  lastLevelChanged?: string | Date;
}

export type UserFormData = Omit<User, "_id">;

export const userApi = {
  createGuest: (data: UserForm) =>
    apiClient.post<ApiResponse<UserForm>>("/users/guest", data),

  createUser: (data: UserForm) =>
    apiClient.post<ApiResponse<UserForm>>("/users", data),

  updateUser: (id: string, data: UpdateLvlForm) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

  updateRole: (id: string) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}/role`),

  updateName: (id: string, data: UpdateForm) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}/update-name`, data),

  getUser: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),

  getAllUsers: () => apiClient.get<ApiResponse<User[]>>("/users"),

  clearUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/users/${id}`),

  login: (data: UserForm) =>
    apiClient.post<ApiResponse<User>>("/users/auth", data),

  loginCollab: (data: UserForm) =>
    apiClient.post<ApiResponse<User>>("/users/auth/collabs", data),
};
