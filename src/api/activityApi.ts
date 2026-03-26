import { apiClient } from "./apiClient";

export interface ActivityLog {
  _id: string;
  action: string;
  message: string;
  user: string;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
}

export const activityApi = {
  getLogs: () => apiClient.get("/activities"),
};
