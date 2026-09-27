import type { InternalAxiosRequestConfig } from "axios";
import { api, publicApi } from "./client";
import { toApiError } from "./errors";
import { useAuthStore } from "@/store/auth";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export function registerApiInterceptors() {
  publicApi.interceptors.response.use(
    (r) => r,
    (error) => Promise.reject(toApiError(error)),
  );

  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      if (status === 401 && original && !original._retry) {
        original._retry = true;
        try {
          const token = await useAuthStore.getState().refreshSession();
          useAuthStore.getState().applyToken(token);
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        } catch {
          useAuthStore.getState().clearSession();
        }
      }
      return Promise.reject(toApiError(error));
    },
  );
}
