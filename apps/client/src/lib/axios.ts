import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as RetryConfig | undefined;

    if (!originalConfig || error.response?.status !== 401 || originalConfig._retry) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post<{ success: boolean; data?: { accessToken: string } }>("/auth/refresh")
        .then((res) => {
          const token = res.data.data?.accessToken ?? null;
          useAuthStore.getState().setToken(token);
          return token;
        })
        .catch(() => {
          useAuthStore.getState().logout();
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;

    if (!newToken) {
      return Promise.reject(error);
    }

    originalConfig.headers.Authorization = `Bearer ${newToken}`;
    return api.request(originalConfig);
  }
);

export { api };
