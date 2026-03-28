import { apiClient } from "./apiClient";

export interface Ad {
  _id: string;
  title: string;
  content: string;
  image: string;
  ctaUrl?: string;
  duration: number;
  expiresAt: string;
  status: "Active" | "Paused";
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export const adApi = {
  getAllAds: async () => {
    return apiClient.get("/ads");
  },
  getRandomAd: async () => {
    return apiClient.get("/ads/random");
  },
  createAd: async (data: {
    title: string;
    content: string;
    duration: number;
    image: string;
    ctaUrl?: string;
  }) => {
    return apiClient.post("/ads", data);
  },
  updateAd: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      duration?: number;
      image?: string;
      ctaUrl?: string;
      status?: "Active" | "Paused";
    },
  ) => {
    return apiClient.put(`/ads/${id}`, data);
  },
  deleteAd: async (id: string) => {
    return apiClient.delete(`/ads/${id}`);
  },
  trackClick: async (id: string) => {
    return apiClient.post(`/ads/${id}/click`);
  },
};
