/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import type { User, LoginCredentials, AuthState } from '@/types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = authService.getAccessToken();
        const refreshToken = authService.getRefreshToken();
        const user = authService.getUser();

        if (token && user) {
          setState({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    // Don't set isLoading here - the login button has its own spinner
    setState(prev => ({ ...prev, error: null }));

    try {
      const response = await authService.login(credentials);

      // Check if we have the required data
      if (response.data && response.data.user && response.data.access) {
        setState({
          user: response.data.user,
          token: response.data.access,
          refreshToken: response.data.refresh,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || 'Les données de connexion sont incomplètes');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  /**
   * Update user in state
   */
  const updateUser = (user: User) => {
    authService.setUser(user);
    setState(prev => ({ ...prev, user }));
  };

  /**
   * Refresh user data from API
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        updateUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
