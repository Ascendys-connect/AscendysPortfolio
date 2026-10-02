/**
 * Users Service
 * Handles user management (Super Admin only)
 */

import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api';
import type {
  UserListItem,
  UserDetail,
  CreateUserData,
  UpdateUserRoleData,
  UserStats,
} from '@/types/user.types';
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/types/api.types';

class UsersService {
  /**
   * Get list of users with pagination
   */
  async getUsers(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<UserListItem>>> {
    return apiService.get<PaginatedResponse<UserListItem>>(
      API_ENDPOINTS.USERS.LIST,
      params
    );
  }

  /**
   * Get user details by ID
   */
  async getUserById(id: string): Promise<ApiResponse<UserDetail>> {
    return apiService.get<UserDetail>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<ApiResponse<UserDetail>> {
    return apiService.post<UserDetail>(API_ENDPOINTS.USERS.CREATE, data);
  }

  /**
   * Update user role
   */
  async updateUserRole(id: string, data: UpdateUserRoleData): Promise<ApiResponse<UserDetail>> {
    return apiService.patch<UserDetail>(API_ENDPOINTS.USERS.UPDATE(id), data);
  }

  /**
   * Toggle user active status (suspend/activate)
   */
  async toggleUserStatus(id: string): Promise<ApiResponse<UserDetail>> {
    return apiService.post<UserDetail>(API_ENDPOINTS.USERS.TOGGLE_STATUS(id));
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<ApiResponse> {
    return apiService.delete(API_ENDPOINTS.USERS.DELETE(id));
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiService.get<UserStats>(API_ENDPOINTS.USERS.STATS);
  }
}

// Export singleton instance
export const usersService = new UsersService();
export default usersService;
