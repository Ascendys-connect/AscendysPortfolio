/**
 * Authentication Service
 * Handles user authentication and token management
 */

import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api';
import type {
  LoginCredentials,
  LoginResponse,
  User,
  ChangePasswordData,
  ResetPasswordData,
  ResetPasswordConfirmData,
} from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse['data']>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Django JWT backend returns the data directly, not wrapped in {success, data}
      // Check if we have the expected token structure
      if (response && (response.access || response.data?.access)) {
        const loginData = response.data || response;
        
        // Store tokens and user data
        this.setTokens(loginData.access, loginData.refresh);
        this.setUser(loginData.user);
        
        return {
          success: true,
          message: 'Login successful',
          data: loginData
        };
      } else {
        throw new Error('Réponse du serveur invalide');
      }
    } catch (error: any) {
      // Check if this is an OTP or password change requirement (not a real error)
      if (error.response?.data?.requires_otp || error.response?.data?.requires_password_change) {
        // Preserve the original error with response data
        throw error;
      }
      
      // Provide explicit error messages based on status code
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          const err = new Error('Email ou mot de passe incorrect. Veuillez réessayer.') as any;
          err.response = error.response;
          throw err;
        } else if (status === 400) {
          const err = new Error('Les informations de connexion sont invalides. Vérifiez votre email et mot de passe.') as any;
          err.response = error.response;
          throw err;
        } else if (status === 403) {
          const err = new Error('Votre compte est désactivé. Contactez l\'administrateur.') as any;
          err.response = error.response;
          throw err;
        } else if (status === 429) {
          const err = new Error('Trop de tentatives de connexion. Veuillez patienter quelques minutes.') as any;
          err.response = error.response;
          throw err;
        } else if (status >= 500) {
          const err = new Error('Erreur du serveur. Veuillez réessayer dans quelques instants.') as any;
          err.response = error.response;
          throw err;
        }
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      }
      
      // Generic error message - preserve response data
      const err = new Error(error.message || 'Une erreur est survenue lors de la connexion.') as any;
      if (error.response) {
        err.response = error.response;
      }
      throw err;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  /**
   * Update current user profile (first_name, last_name, phone, avatar)
   */
  async updateProfile(data: Partial<Pick<User, 'first_name' | 'last_name' | 'phone'>>): Promise<ApiResponse<User>> {
    return apiService.patch<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ access: string }> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ access: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh: refreshToken }
    );

    if (response.success && response.data) {
      this.setAccessToken(response.data.access);
      return response.data;
    }

    throw new Error('Failed to refresh token');
  }

  /**
   * Store access and refresh tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Store access token only
   */
  setAccessToken(accessToken: string): void {
    localStorage.setItem('access_token', accessToken);
  }

  /**
   * Store user data
   */
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Check if user is Super Admin
   */
  isSuperAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'SUPER_ADMIN';
  }

  /**
   * Check if user is Admin or Super Admin
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, code: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/verify-otp/', { email, code });
  }

  /**
   * Resend OTP code
   */
  async resendOTP(email: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/resend-otp/', { email });
  }

  /**
   * Change password on first login
   */
  async firstLoginPasswordChange(
    email: string,
    new_password: string,
    new_password_confirm: string
  ): Promise<ApiResponse<any>> {
    return apiService.post('/auth/first-login-password-change/', {
      email,
      new_password,
      new_password_confirm,
    });
  }

  /**
   * Request password reset code (forgot password)
   */
  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/forgot-password/', { email });
  }

  /**
   * Verify password reset code
   */
  async verifyResetCode(email: string, code: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/verify-reset-code/', { email, code });
  }

  /**
   * Reset password with code
   */
  async resetPassword(email: string, code: string, new_password: string, new_password_confirm: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/reset-password/', { email, code, new_password, new_password_confirm });
  }

  /**
   * Resend password reset code
   */
  async resendResetCode(email: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/resend-reset-code/', { email });
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
