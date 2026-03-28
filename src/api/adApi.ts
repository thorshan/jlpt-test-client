import { apiClient } from "./apiClient";

export interface Ad {
  _id: string;
  title: string;
  content: string;
  image: string;
  duration: number;
  expiresAt: string;
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
  }) => {
    return apiClient.post("/ads", data);
  },
  deleteAd: async (id: string) => {
    return apiClient.delete(`/ads/${id}`);
  },
};
