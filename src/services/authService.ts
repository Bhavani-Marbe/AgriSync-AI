import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'FARMER' | 'AGRONOMIST' | 'ADMIN';
  phone_number?: string;
  organization_name?: string;
  is_email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  access: string;
  refresh: string;
  user: UserProfile;
}

export const authService = {
  async register(data: Record<string, any>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  async login(credentials: Record<string, any>): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    const refresh = localStorage.getItem('agrisync_refresh_token');
    try {
      if (refresh) {
        await api.post('/auth/logout/', { refresh });
      }
    } finally {
      localStorage.removeItem('agrisync_access_token');
      localStorage.removeItem('agrisync_refresh_token');
      localStorage.removeItem('agrisync_user');
    }
  },

  async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/auth/me/');
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ message: string; reset_token?: string }> {
    const response = await api.post('/auth/password/reset-request/', { email });
    return response.data;
  },

  async confirmPasswordReset(data: Record<string, any>): Promise<{ message: string }> {
    const response = await api.post('/auth/password/reset-confirm/', data);
    return response.data;
  },
};
