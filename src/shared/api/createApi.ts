import axios from 'axios';
import {refresh} from "../config/authApi.ts";

const apiClient = axios.create({
  // baseURL: "https://api.7ty2ryz3.ru", // PROD
  baseURL: "http://localhost:8888", // DEV
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken: string | null = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use((config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await refresh(refreshToken);

        localStorage.setItem('access_token', response.data.access_token);

        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

        return apiClient.request(originalRequest);

      } catch (e: unknown) {
        console.error('Refresh token failed. Logging out.', e);
        throw error;
      }
    }
    throw error;
  });

export default apiClient;
