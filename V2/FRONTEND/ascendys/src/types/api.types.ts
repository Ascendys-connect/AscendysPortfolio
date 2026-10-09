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

export interface GrowthMetric {
  this_month: number;
  last_month: number;
  growth_rate: number;
  growth_formatted: string;
  growth_direction: 'up' | 'down' | 'neutral';
}

// Dashboard Statistics
export interface DashboardStats {
  // Flat counts for backwards compatibility
  users_count?: number;
  trainings_count?: number;
  blog_posts_count?: number;
  events_count?: number;
  media_files_count?: number;
  contact_messages_count?: number;
  testimonials_count?: number;
  partners_count?: number;
  newsletter_subscribers_count?: number;
  services_count?: number;
  offers_count?: number;

  trainings: GrowthMetric & {
    total: number;
    published: number;
    draft: number;
    archived?: number;
    monthly_growth?: number;
  };
  blog_posts: GrowthMetric & {
    total: number;
    published: number;
    draft: number;
    monthly_growth?: number;
  };
  events: GrowthMetric & {
    total: number;
    published?: number;
    draft?: number;
    upcoming: number;
    past: number;
    monthly_growth?: number;
  };
  media_files?: GrowthMetric & {
    total: number;
    images: number;
    documents: number;
    videos: number;
  };
  galleries?: GrowthMetric & {
    total: number;
    photos: number;
    videos: number;
    published: number;
  };
  galleries_count?: number;
  contact_messages: GrowthMetric & {
    total: number;
    new: number;
    in_progress?: number;
    resolved?: number;
    last_7_days?: number;
    monthly_growth?: number;
  };
  newsletter_subscribers: GrowthMetric & {
    total: number;
    active: number;
    monthly_growth?: number;
  };
  users: GrowthMetric & {
    total: number;
    admins: number;
    super_admins: number;
    editors?: number;
    active?: number;
    monthly_growth?: number;
  };
  testimonials: {
    total: number;
    published: number;
  };
  partners: {
    total: number;
    active: number;
  };
  services?: {
    total: number;
    active: number;
  };
  offers?: {
    total: number;
    active: number;
  };
  recent_activities?: {
    last_7_days: number;
    last_30_days: number;
  };
}
