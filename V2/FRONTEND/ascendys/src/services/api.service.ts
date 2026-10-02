/**
 * Base API Service
 * Handles HTTP requests with authentication
 */

import { API_BASE_URL, API_CONFIG, HTTP_STATUS } from '@/config/api';
import type { ApiResponse, ApiError, QueryParams } from '@/types/api.types';

class ApiService {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

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
   * Get request headers with authentication
   */
  private getHeaders(customHeaders: HeadersInit = {}, isFormData: boolean = false): HeadersInit {
    const token = this.getAuthToken();
    
    // Don't include Content-Type for FormData - let browser set it with boundary
    const headers: HeadersInit = isFormData
      ? { ...customHeaders }
      : { ...this.defaultHeaders, ...customHeaders };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        // Clear auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to login (only if not already on signin page)
        if (!window.location.pathname.includes('/signin')) {
          window.location.href = '/signin';
        }
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
  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    try {
      const url = this.buildURL(endpoint, params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
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
  async post<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const isFormData = data instanceof FormData;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(customHeaders, isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
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
  async put<T>(endpoint: string, data: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const isFormData = data instanceof FormData;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(customHeaders, isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
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
  async patch<T>(endpoint: string, data: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const isFormData = data instanceof FormData;
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(customHeaders, isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
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
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
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
    const token = this.getAuthToken();

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
