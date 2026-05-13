import api from '../api';
import type { LoginRequest, AuthResponse } from '../../types/auth';

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  refreshToken: async (tokenData: { accessToken: string; refreshToken: string }) => {
    const response = await api.post('/auth/refresh-token', tokenData);
    return response.data;
  }
};

export default authService;
