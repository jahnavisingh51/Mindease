import { User, LoginCredentials, SignupCredentials, AuthResponse } from '../types';
import { api } from '../lib/api';

const CURRENT_USER_KEY = 'mh_current_user';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return { user, token: accessToken };
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', credentials);
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return { user, token: accessToken };
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
};