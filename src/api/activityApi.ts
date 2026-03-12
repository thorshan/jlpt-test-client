import { apiClient } from "./apiClient";

export const activityApi = {
  getRecent: () => {
    return apiClient.get("/activities");
  },
};
