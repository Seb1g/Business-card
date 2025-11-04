import apiClient from '../api/createApi';

interface auth {
  email: string;
  password: string;
}

export const login = (auth: auth) => {
  return apiClient.post('/api/v1/auth/login', auth);
}

export const register = (auth: auth) => {
  return apiClient.post('/api/v1/auth/register', auth);
}

export const logout = () => {
  return apiClient.post('/api/v1/auth/login');
}

export const changePassword = () => {
  return apiClient.post('/api/v1/auth/login');
}
