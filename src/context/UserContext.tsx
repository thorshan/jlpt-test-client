import React, { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "../api/userApi"; // Ensure this matches your path

interface UserData {
  _id?: string;
  name: string;
  token: string;
  level?: string;
}

interface UserContextType {
  user: UserData | null;
  isVerifying: boolean; // New: prevents UI flicker
  login: (data: UserData) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. Instant Synchronous Hydration
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem("jlpt_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isVerifying, setIsVerifying] = useState(true);

  // 2. Definitive Logout function (defined before useEffect)
  const logout = async () => {
    // 1. Capture the ID first so we don't lose it
    const userId = user?._id;

    // 2. Immediate UI response (Optimistic UI)
    // This makes the app feel "snappy" on mobile
    setUser(null);
    localStorage.removeItem("jlpt_user");

    // 3. Backend cleanup
    if (userId) {
      try {
        await userApi.clearUser(userId);
      } catch (error) {
        console.error("Failed to clear session on server:", error);
      }
    }
  };

  useEffect(() => {
    const verifyUserWithServer = async () => {
      // Get the most current data from localStorage for verification
      const saved = localStorage.getItem("jlpt_user");
      const localUser = saved ? JSON.parse(saved) : null;

      if (localUser?._id) {
        try {
          await userApi.getUser(localUser._id);
          // Sync state just in case localStorage was changed in another tab
          setUser(localUser);
        } catch (err: any) {
          // If 404, MongoDB TTL deleted them
          if (err.response?.status === 404) {
            logout();
          }
        }
      } else {
        // No user found in storage at all
        setUser(null);
      }

      setIsVerifying(false);
    };

    verifyUserWithServer();
    // Empty dependency is fine here because we want this only on "App Mount/Refresh"
  }, []);

  const login = (data: UserData) => {
    setUser(data);
    localStorage.setItem("jlpt_user", JSON.stringify(data));
  };

  const updateUser = (updates: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newData = { ...prev, ...updates };
      localStorage.setItem("jlpt_user", JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <UserContext.Provider
      value={{ user, isVerifying, login, logout, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
