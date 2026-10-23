/**
 * Base API Service
 * Handles HTTP requests with authentication
 */

import { API_BASE_URL, API_CONFIG, HTTP_STATUS, isPublicApiEndpoint } from '@/config/api';
import type { ApiResponse, QueryParams } from '@/types/api.types';

export interface RequestOptions {
  /**
   * Force skipping the Authorization header for this request.
   * Public endpoints are already called anonymously for non-staff visitors;
   * this lets a caller opt out explicitly.
   */
  skipAuth?: boolean;
}

// Roles that need an authenticated session to read admin-only data (draft /
// inactive items) from otherwise public endpoints.
const STAFF_ROLES = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'];

class ApiService {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token from localStorage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Whether the current visitor has a staff session (admin/editor).
   * Staff sessions still send their token to public endpoints because the
   * backend returns extra data (draft/inactive items) to authenticated staff.
   */
  private hasStaffSession(): boolean {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return false;
      const user = JSON.parse(raw);
      return STAFF_ROLES.includes(user?.role);
    } catch {
      return false;
    }
  }

  /**
   * Refresh the access token, deduplicating concurrent calls so that token
   * rotation (ROTATE_REFRESH_TOKENS) cannot invalidate an in-flight refresh.
   */
  private refreshAccessToken(): Promise<string | null> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.requestNewAccessToken().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  private async requestNewAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.access || data.data?.access;
      const newRefreshToken = data.refresh || data.data?.refresh;

      if (newAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        return newAccessToken;
      }

      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Clear the session and send the visitor to the sign-in page.
   * Called once a 401 is definitive (refresh failed, or the retried request
   * was rejected again).
   */
  private handleAuthFailure(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    if (!window.location.pathname.includes('/signin')) {
      window.location.href = '/signin';
    }
  }

  /**
   * Get request headers with authentication.
   *
   * The Authorization header is omitted:
   * - when the caller explicitly sets `skipAuth`, or
   * - on public endpoints for non-staff visitors.
   *
   * This prevents a stale/invalid token from breaking public pages.
   */
  private getHeaders(
    endpoint: string,
    customHeaders: HeadersInit = {},
    isFormData: boolean = false,
    options: RequestOptions = {}
  ): HeadersInit {
    const token = this.getAuthToken();

    // Don't include Content-Type for FormData - let browser set it with boundary
    const headers: HeadersInit = isFormData
      ? { ...customHeaders }
      : { ...this.defaultHeaders, ...customHeaders };

    const skipAuth =
      options.skipAuth === true ||
      (isPublicApiEndpoint(endpoint) && !this.hasStaffSession());

    if (token && !skipAuth) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: QueryParams): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Handle API response
   *
   * A 401 triggers at most ONE refresh + retry. Any further 401 (or a failed
   * refresh) clears the session instead of looping forever.
   */
  private async handleResponse<T>(
    response: Response,
    originalRequest?: () => Promise<Response>,
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const isRefreshRequest = response.url.includes('/auth/refresh/');

      // Handle authentication errors - try to refresh the token exactly once
      if (
        response.status === HTTP_STATUS.UNAUTHORIZED &&
        originalRequest &&
        !isRetry &&
        !isRefreshRequest
      ) {
        const newToken = await this.refreshAccessToken();

        if (newToken) {
          // Retry the request once with the fresh token. No further refresh:
          // a second 401 is a definitive auth failure.
          const retryResponse = await originalRequest();
          return this.handleResponse<T>(retryResponse, originalRequest, true);
        }
      }

      // Refresh failed or the retried request was rejected again -> logout
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        this.handleAuthFailure();
      }

      // Create a detailed error object with response information
      const error: any = new Error(data.message || data.detail || 'An error occurred');
      error.response = {
        status: response.status,
        data: data,
      };
      error.status = response.status;
      error.code = data.code;
      
      throw error;
    }

    return data;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: QueryParams, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const url = this.buildURL(endpoint, params);
      
      const makeRequest = async () => {
        return fetch(url, {
          method: 'GET',
          headers: this.getHeaders(endpoint, undefined, false, options),
        });
      };

      const response = await makeRequest();
      return this.handleResponse<T>(response, makeRequest);
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: any = new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        networkError.response = {
          status: 0,
          data: { message: networkError.message },
        };
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, customHeaders?: HeadersInit, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const isFormData = data instanceof FormData;
      
      const makeRequest = async () => {
        return fetch(url, {
          method: 'POST',
          headers: this.getHeaders(endpoint, customHeaders, isFormData, options),
          body: isFormData ? data : JSON.stringify(data),
        });
      };

      const response = await makeRequest();
      return this.handleResponse<T>(response, makeRequest);
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: any = new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        networkError.response = {
          status: 0,
          data: { message: networkError.message },
        };
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any, customHeaders?: HeadersInit, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const isFormData = data instanceof FormData;
      
      const makeRequest = async () => {
        return fetch(url, {
          method: 'PUT',
          headers: this.getHeaders(endpoint, customHeaders, isFormData, options),
          body: isFormData ? data : JSON.stringify(data),
        });
      };

      const response = await makeRequest();
      return this.handleResponse<T>(response, makeRequest);
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: any = new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        networkError.response = {
          status: 0,
          data: { message: networkError.message },
        };
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: any, customHeaders?: HeadersInit, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const isFormData = data instanceof FormData;
      
      const makeRequest = async () => {
        return fetch(url, {
          method: 'PATCH',
          headers: this.getHeaders(endpoint, customHeaders, isFormData, options),
          body: isFormData ? data : JSON.stringify(data),
        });
      };

      const response = await makeRequest();
      return this.handleResponse<T>(response, makeRequest);
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: any = new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        networkError.response = {
          status: 0,
          data: { message: networkError.message },
        };
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const makeRequest = async () => {
        return fetch(url, {
          method: 'DELETE',
          headers: this.getHeaders(endpoint, undefined, false, options),
        });
      };

      const response = await makeRequest();
      return this.handleResponse<T>(response, makeRequest);
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: any = new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        networkError.response = {
          status: 0,
          data: { message: networkError.message },
        };
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * Upload file with progress
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const skipAuth = isPublicApiEndpoint(endpoint) && !this.hasStaffSession();
    const token = skipAuth ? null : this.getAuthToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      // Load complete
      xhr.addEventListener('load', async () => {
        try {
          const response = new Response(xhr.responseText, {
            status: xhr.status,
            headers: new Headers({
              'content-type': xhr.getResponseHeader('content-type') || '',
            }),
          });
          const data = await this.handleResponse<T>(response);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      // Error
      xhr.addEventListener('error', () => {
        reject({
          success: false,
          message: 'Upload failed',
          status: xhr.status,
        });
      });

      // Open and send
      xhr.open('POST', url);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
