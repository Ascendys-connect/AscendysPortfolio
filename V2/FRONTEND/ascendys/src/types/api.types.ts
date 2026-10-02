/**
 * API Response Types
 */

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Paginated Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Error
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: any;
}

// Upload Progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Dashboard Statistics
export interface DashboardStats {
  users_count: number;
  trainings_count: number;
  blog_posts_count: number;
  events_count: number;
  media_files_count: number;
  contact_messages_count: number;
  testimonials_count: number;
  partners_count: number;
  newsletter_subscribers_count: number;
}
