import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR (Identity Injection) ---
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from storage (matching your useUser logic)
    const token = localStorage.getItem("token");

    if (token) {
      // Inject Bearer token into headers
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- RESPONSE INTERCEPTOR (Protocol Guardian) ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 (Unauthorized), the session is invalid
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("auth_error"));
    }
    return Promise.reject(error);
  },
);
