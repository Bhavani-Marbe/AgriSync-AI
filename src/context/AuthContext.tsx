import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, any>) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agrisync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('agrisync_access_token');
      if (token) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          localStorage.setItem('agrisync_user', JSON.stringify(profile));
        } catch {
          setUser(null);
          localStorage.removeItem('agrisync_access_token');
          localStorage.removeItem('agrisync_refresh_token');
          localStorage.removeItem('agrisync_user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: Record<string, any>) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('agrisync_access_token', data.access);
      localStorage.setItem('agrisync_refresh_token', data.refresh);
      localStorage.setItem('agrisync_user', JSON.stringify(data.user));
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const data = await authService.register(formData);
      localStorage.setItem('agrisync_access_token', data.access);
      localStorage.setItem('agrisync_refresh_token', data.refresh);
      localStorage.setItem('agrisync_user', JSON.stringify(data.user));
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    const profile = await authService.getCurrentUser();
    setUser(profile);
    localStorage.setItem('agrisync_user', JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
