import apiClient from '../api/createApi';
import type {AxiosResponse} from "axios";

interface auth {
  email: string;
  password: string;
}

export interface IUser {
  ID: number,
  Email: string,
  CreatedAt: string
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user_data: IUser;
}

export const login = (auth: auth) => {
  return apiClient.post('/api/v1/auth/login', auth);
}

export const register = (auth: auth) => {
  return apiClient.post('/api/v1/auth/register', auth);
}

export const logout = () => {
  return apiClient.post('/api/v1/auth/logout');
}

export const refresh = async (refresh: string): Promise<AxiosResponse<AuthResponse>> => {
  return await apiClient.post(`/api/v1/auth/refresh`, {refresh_token: refresh})
}

export const changePassword = () => {
  return apiClient.post('/api/v1/auth/change-password');
}