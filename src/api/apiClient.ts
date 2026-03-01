import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
