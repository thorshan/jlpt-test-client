import { createContext } from "react";
import type { ApiResponse, User, UserForm } from "../api/userApi";

interface UserContextType {
  user: User | null;
  isVerifying: boolean;
  login: (data: UserForm) => Promise<ApiResponse<User>>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
