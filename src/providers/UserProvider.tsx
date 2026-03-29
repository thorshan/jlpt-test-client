import { useEffect, useState, useCallback } from "react";
import { userApi, type User, type UserForm } from "../api/userApi";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("jlpt_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isVerifying, setIsVerifying] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jlpt_user");
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    const handleAuthError = () => logout();
    window.addEventListener("auth_error", handleAuthError);
    return () => window.removeEventListener("auth_error", handleAuthError);
  }, [logout]);

  useEffect(() => {
    const verifyUser = async () => {
      const sessionJwt = localStorage.getItem("token");

      if (user?._id && sessionJwt) {
        try {
          const res = await userApi.getUser(user._id);
          const freshUser = res.data.data;

          setUser(freshUser);
          localStorage.setItem("jlpt_user", JSON.stringify(freshUser));
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 404)
          ) {
            logout();
          }
        }
      } else if (!sessionJwt) {
        setUser(null);
      }
      setIsVerifying(false);
    };

    verifyUser();
  }, [logout, user?._id]);

  const login = async (formData: UserForm) => {
    try {
      const res = await userApi.login(formData);
      const userData = res.data.data;
      const sessionJwt = res.data.token;

      setUser(userData);
      localStorage.setItem("jlpt_user", JSON.stringify(userData));
      localStorage.setItem("token", sessionJwt);

      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const updateUser = (updates: Partial<User>) => {
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
