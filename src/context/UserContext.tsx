import { createContext } from "react";

interface UserData {
  _id?: string;
  name: string;
  token: string;
  level?: string;
}

interface UserContextType {
  user: UserData | null;
  isVerifying: boolean;
  login: (data: UserData) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
