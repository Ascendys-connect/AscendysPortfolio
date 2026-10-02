/**
 * User Management Types
 */

import { UserRole } from './auth.types';

export interface UserListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string; // Added phone field
  is_active: boolean;
  date_joined: string; // Changed from created_at to match backend
}

export interface UserDetail {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  date_joined: string; // Changed from created_at
  updated_at?: string;
  last_login?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string; // Now required
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  phone?: string;
}

export interface UpdateUserRoleData {
  role: UserRole;
}

export interface UserStats {
  total: number;
  admins: number;
  super_admins: number;
  active: number;
  inactive: number;
}
